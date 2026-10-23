export interface Vec {
  x: number;
  y: number;
}
export interface Circle extends Vec {
  radius: number;
  id: number;
}
export interface Bounds {
  width: number;
  height: number;
  inset: number;
}
export interface Contact {
  distance: number;
  normal: Vec;
  id: number | null;
}
export const FIELD: Bounds = { width: 480, height: 620, inset: 18 };
export const BALL_RADIUS = 19;
const EPS = 0.0001;
export const length = (v: Vec) => Math.hypot(v.x, v.y);
export const unit = (v: Vec): Vec => {
  const n = length(v);
  return n ? { x: v.x / n, y: v.y / n } : { x: 0, y: 0 };
};
export const reflect = (v: Vec, n: Vec): Vec => {
  const dot = v.x * n.x + v.y * n.y;
  return { x: v.x - 2 * dot * n.x, y: v.y - 2 * dot * n.y };
};

/** Swept point against an expanded circle. Direction must be a unit vector. */
export function lineCircle(p: Vec, d: Vec, c: Circle, radius: number): Contact | null {
  const x = p.x - c.x,
    y = p.y - c.y;
  const r = c.radius + radius;
  const b = x * d.x + y * d.y;
  const discriminant = b * b - (x * x + y * y - r * r);
  if (b >= 0 || discriminant < 0) return null;
  const distance = -b - Math.sqrt(discriminant);
  if (distance < -EPS) return null;
  return {
    distance: Math.max(0, distance),
    normal: unit({ x: x + d.x * distance, y: y + d.y * distance }),
    id: c.id,
  };
}

export function firstContact(
  p: Vec,
  d: Vec,
  circles: Circle[],
  radius = BALL_RADIUS,
  field = FIELD,
): Contact {
  const lo = field.inset + radius;
  const right = field.width - lo,
    bottom = field.height - lo;
  const candidates: Contact[] = [];
  if (d.x < -EPS) candidates.push({ distance: (lo - p.x) / d.x, normal: { x: 1, y: 0 }, id: null });
  if (d.x > EPS)
    candidates.push({ distance: (right - p.x) / d.x, normal: { x: -1, y: 0 }, id: null });
  if (d.y < -EPS) candidates.push({ distance: (lo - p.y) / d.y, normal: { x: 0, y: 1 }, id: null });
  if (d.y > EPS)
    candidates.push({ distance: (bottom - p.y) / d.y, normal: { x: 0, y: -1 }, id: null });
  for (const c of circles) {
    const hit = lineCircle(p, d, c, radius);
    if (hit) candidates.push(hit);
  }
  candidates.sort((a, b) => a.distance - b.distance);
  return (
    candidates.find((c) => c.distance >= -EPS) ?? {
      distance: Infinity,
      normal: { x: 0, y: 0 },
      id: null,
    }
  );
}

/** Separate overlaps before sweeping; this does not award damage. */
export function pushOut(p: Vec, circles: Circle[], radius = BALL_RADIUS): Vec {
  const result = { ...p };
  const lo = FIELD.inset + radius;
  for (let pass = 0; pass < 8; pass++) {
    for (const c of circles) {
      const delta = { x: result.x - c.x, y: result.y - c.y };
      const dist = length(delta),
        minimum = c.radius + radius + EPS;
      if (dist < minimum) {
        const n = dist ? unit(delta) : { x: 0, y: 1 };
        result.x = c.x + n.x * minimum;
        result.y = c.y + n.y * minimum;
      }
    }
    result.x = Math.max(lo, Math.min(FIELD.width - lo, result.x));
    result.y = Math.max(lo, Math.min(FIELD.height - lo, result.y));
  }
  return result;
}

export interface Travel {
  position: Vec;
  direction: Vec;
  contacts: Contact[];
}
export function travel(
  p: Vec,
  direction: Vec,
  distance: number,
  circles: Circle[],
  onHit?: (hit: Contact) => void,
  onSegment?: (from: Vec, to: Vec) => void,
  isAlive?: (id: number) => boolean,
): Travel {
  let position = pushOut(p, circles),
    d = unit(direction),
    remaining = distance;
  const contacts: Contact[] = [];
  // Bound pathological contact chains, without ever advancing through geometry.
  for (let i = 0; i < 24 && remaining > EPS; i++) {
    const hit = firstContact(position, d, isAlive ? circles.filter((c) => isAlive(c.id)) : circles);
    const step = Math.min(remaining, hit.distance);
    const end = { x: position.x + d.x * step, y: position.y + d.y * step };
    onSegment?.(position, end);
    position = end;
    remaining -= step;
    if (hit.distance > step) break;
    if (hit.id !== null && isAlive && !isAlive(hit.id)) continue;
    contacts.push(hit);
    onHit?.(hit);
    d = reflect(d, hit.normal);
    position.x += hit.normal.x * EPS;
    position.y += hit.normal.y * EPS;
  }
  return { position, direction: d, contacts };
}

/** The preview uses the same contact query as the simulation. */
export function trajectory(p: Vec, direction: Vec, circles: Circle[], reflections: number): Vec[] {
  let position = pushOut(p, circles),
    d = unit(direction);
  const points = [{ ...position }];
  if (!length(d)) return points;
  for (let i = 0; i <= reflections; i++) {
    const hit = firstContact(position, d, circles);
    const distance = Math.min(hit.distance, i === reflections ? 160 : 1400);
    position = { x: position.x + d.x * distance, y: position.y + d.y * distance };
    points.push({ ...position });
    d = reflect(d, hit.normal);
    position.x += hit.normal.x * EPS;
    position.y += hit.normal.y * EPS;
  }
  return points;
}
