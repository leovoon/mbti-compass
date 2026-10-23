import { BALL_RADIUS, length, lineCircle, unit, type Vec } from "./physics";

export type AttackKind = "beam" | "blast" | "cross";
export interface AttackPlan {
  enemyId: number;
  kind: AttackKind;
  origin: Vec;
  target: Vec;
  direction: Vec;
  damage: number;
  radius: number;
  width: number;
  range: number;
}
export interface EnemyAttack {
  countdown: number;
  interval: number;
  round: number;
  plan: AttackPlan;
}
export interface AttackSource extends Vec {
  id: number;
  boss: boolean;
}
export interface AttackResult {
  hit: number[];
  protected: number[];
  end: Vec;
}
export interface EnemyPhase {
  queue: AttackPlan[];
  index: number;
  elapsed: number;
  fired: boolean;
}
export interface IncomingEffect {
  plan: AttackPlan;
  end: Vec;
  life: number;
}
export interface ReceivedHit {
  ball: number;
  enemyId: number;
  damage: number;
}
export interface Protection {
  blocker: number;
  protected: number;
  enemyId: number;
}
export const WINDUP = 0.35;
export const ATTACK_DURATION = 0.85;

/** Targets lock for the whole countdown, giving the player a chance to reposition. */
export function planAttack(
  enemy: AttackSource,
  stage: number,
  round: number,
  positions: Vec[],
): AttackPlan {
  const kinds: AttackKind[] = ["beam", "blast", "cross"];
  const kind = kinds[(stage + enemy.id) % kinds.length];
  const target = { ...positions[(enemy.id + round) % positions.length] };
  const direction = unit({ x: target.x - enemy.x, y: target.y - enemy.y });
  return {
    enemyId: enemy.id,
    kind,
    origin: { x: enemy.x, y: enemy.y },
    target,
    direction: length(direction) ? direction : { x: 0, y: 1 },
    damage: (enemy.boss ? 9 : 5) + stage * 2,
    radius: enemy.boss ? 85 : 65,
    width: kind === "beam" ? 9 : 17,
    range: 900,
  };
}
export function newAttack(enemy: AttackSource, stage: number, positions: Vec[]): EnemyAttack {
  const interval = enemy.boss ? 2 : 3;
  return {
    countdown: enemy.boss ? 1 : enemy.id + 1,
    interval,
    round: 0,
    plan: planAttack(enemy, stage, 0, positions),
  };
}
/** Beams stop at the first ball. Area attacks hit each overlapping ball once. */
export function resolveAttack(plan: AttackPlan, positions: Vec[]): AttackResult {
  const end = {
    x: plan.origin.x + plan.direction.x * plan.range,
    y: plan.origin.y + plan.direction.y * plan.range,
  };
  if (plan.kind === "beam") {
    const contacts = positions
      .flatMap((p, index) => {
        const expanded = BALL_RADIUS + plan.width;
        if (Math.hypot(p.x - plan.origin.x, p.y - plan.origin.y) <= expanded)
          return [{ index, distance: 0 }];
        const hit = lineCircle(
          plan.origin,
          plan.direction,
          { ...p, id: index, radius: BALL_RADIUS },
          plan.width,
        );
        return hit && hit.distance <= plan.range ? [{ index, distance: hit.distance }] : [];
      })
      .sort((a, b) => a.distance - b.distance || a.index - b.index);
    if (!contacts.length) return { hit: [], protected: [], end };
    const first = contacts[0];
    return {
      hit: [first.index],
      protected: contacts.slice(1).map((c) => c.index),
      end: {
        x: plan.origin.x + plan.direction.x * first.distance,
        y: plan.origin.y + plan.direction.y * first.distance,
      },
    };
  }
  const hit = positions.flatMap((p, index) => {
    const dx = Math.abs(p.x - plan.target.x),
      dy = Math.abs(p.y - plan.target.y);
    const inside =
      plan.kind === "blast"
        ? Math.hypot(dx, dy) <= plan.radius + BALL_RADIUS
        : Math.min(dx, dy) <= plan.width + BALL_RADIUS;
    return inside ? [index] : [];
  });
  return { hit, protected: [], end };
}
