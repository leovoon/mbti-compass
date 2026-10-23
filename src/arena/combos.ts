import type { FnId } from "../data";
import { BALL_RADIUS, length, unit, type Vec } from "./physics";

export type ComboKind = "laser" | "wave" | "spread" | "heal";
export interface ComboKit {
  kind: ComboKind;
  damage: number;
  heal: number;
  range: number;
  width: number;
}
export const COMBOS: Record<FnId, ComboKit> = {
  Ni: { kind: "laser", damage: 32, heal: 0, range: 900, width: 12 },
  Se: { kind: "wave", damage: 30, heal: 0, range: 180, width: 0 },
  Ne: { kind: "spread", damage: 20, heal: 0, range: 900, width: 10 },
  Si: { kind: "heal", damage: 0, heal: 9, range: 90, width: 0 },
  Ti: { kind: "laser", damage: 42, heal: 0, range: 900, width: 6 },
  Fe: { kind: "heal", damage: 0, heal: 12, range: 110, width: 0 },
  Te: { kind: "spread", damage: 26, heal: 0, range: 900, width: 8 },
  Fi: { kind: "wave", damage: 24, heal: 4, range: 140, width: 0 },
};
export interface ComboRecord {
  count: number;
  damage: number;
  healing: number;
}
export interface ComboEffect {
  fn: FnId;
  origin: Vec;
  direction: Vec;
  life: number;
  scale: number;
}
export const comboRecord = (): ComboRecord => ({ count: 0, damage: 0, healing: 0 });

/** Entry along a closed segment, including a tangency and a spawn inside the sensor. */
export function contactEntry(
  from: Vec,
  to: Vec,
  center: Vec,
  radius = BALL_RADIUS * 2,
): number | null {
  const x = from.x - center.x,
    y = from.y - center.y;
  const dx = to.x - from.x,
    dy = to.y - from.y;
  const c = x * x + y * y - radius * radius;
  if (c <= 0) return 0;
  const a = dx * dx + dy * dy;
  if (!a) return null;
  const b = x * dx + y * dy,
    disc = b * b - a * c;
  if (b >= 0 || disc < 0) return null;
  const t = (-b - Math.sqrt(disc)) / a;
  return t >= 0 && t <= 1 ? t : null;
}
export function comboRays(fn: FnId, direction: Vec): Vec[] {
  const angles = COMBOS[fn].kind === "spread" ? [-0.42, 0, 0.42] : [0];
  return angles.map((a) => ({
    x: direction.x * Math.cos(a) - direction.y * Math.sin(a),
    y: direction.x * Math.sin(a) + direction.y * Math.cos(a),
  }));
}
export function inCombo(
  fn: FnId,
  origin: Vec,
  direction: Vec,
  target: Vec & { radius: number },
): boolean {
  const kit = COMBOS[fn],
    delta = { x: target.x - origin.x, y: target.y - origin.y };
  if (kit.kind === "heal") return false;
  if (kit.kind === "wave") return length(delta) <= kit.range + target.radius;
  return comboRays(fn, direction).some((d) => {
    const projection = delta.x * d.x + delta.y * d.y;
    const t = Math.max(0, Math.min(kit.range, projection));
    return Math.hypot(delta.x - d.x * t, delta.y - d.y * t) <= target.radius + kit.width;
  });
}
export function portToward(origin: Vec, targets: Vec[]): Vec {
  const target = [...targets].sort(
    (a, b) =>
      Math.hypot(a.x - origin.x, a.y - origin.y) - Math.hypot(b.x - origin.x, b.y - origin.y),
  )[0];
  return target ? unit({ x: target.x - origin.x, y: target.y - origin.y }) : { x: 0, y: -1 };
}
