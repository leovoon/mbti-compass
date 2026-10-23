import { FN, type FnId } from "../data";
import { BALL_RADIUS, length, travel, unit, type Circle, type Vec } from "./physics";
import {
  COMBOS,
  comboRecord,
  contactEntry,
  inCombo,
  portToward,
  type ComboRecord,
  type ComboEffect,
} from "./combos";

import {
  newAttack,
  planAttack,
  resolveAttack,
  WINDUP,
  ATTACK_DURATION,
  type EnemyAttack,
  type EnemyPhase,
  type IncomingEffect,
  type ReceivedHit,
  type Protection,
} from "./enemies";

export interface Kit {
  speed: number;
  drag: number;
  damage: number;
  preview: number;
  bounces: number;
  strike: { damage: number; speed: number; splash: number; heal: number };
}
const base: Kit = {
  speed: 1,
  drag: 0.32,
  damage: 22,
  preview: 1,
  bounces: 18,
  strike: { damage: 2, speed: 1.1, splash: 0, heal: 0 },
};
export const KITS: Record<FnId, Kit> = {
  Ni: { ...base, preview: 3, strike: { damage: 2.8, speed: 1, splash: 0, heal: 0 } },
  Se: { ...base, speed: 1.3, bounces: 24, strike: { damage: 1.8, speed: 1.5, splash: 0, heal: 0 } },
  Ne: { ...base, strike: { damage: 1.8, speed: 1, splash: 0.7, heal: 0 } },
  Si: { ...base, drag: 0.23, strike: { damage: 1.8, speed: 1, splash: 0, heal: 20 } },
  Ti: { ...base, strike: { damage: 3, speed: 1, splash: 0, heal: 0 } },
  Fe: { ...base, strike: { damage: 1.6, speed: 1, splash: 0.35, heal: 24 } },
  Te: { ...base, damage: 25, strike: { damage: 2.2, speed: 1, splash: 0.4, heal: 0 } },
  Fi: { ...base, strike: { damage: 2.5, speed: 1, splash: 0, heal: 12 } },
};
export const STAGES: { axis: [FnId, FnId]; hp: number }[] = [
  { axis: ["Ni", "Se"], hp: 100 },
  { axis: ["Ne", "Si"], hp: 125 },
  { axis: ["Ti", "Fe"], hp: 145 },
  { axis: ["Te", "Fi"], hp: 180 },
];
export interface Enemy extends Circle {
  fn: FnId;
  hp: number;
  maxHp: number;
  boss: boolean;
  attack: EnemyAttack;
}
export type Phase = "aim" | "flight" | "enemy" | "choice" | "clear" | "won" | "lost";
export interface Pop extends Vec {
  value: number;
  life: number;
  incoming?: boolean;
}
export interface Shot {
  position: Vec;
  direction: Vec;
  speed: number;
  elapsed: number;
  bounces: number;
  hits: number;
  struck: Set<number>;
  strike: boolean;
  touching: Set<number>;
  combos: Record<string, ComboRecord>;
  comboCount: number;
  consulted: FnId[];
}
export interface Run {
  team: FnId[];
  positions: Vec[];
  used: Set<FnId>;
  active: number;
  stage: number;
  hp: number;
  phase: Phase;
  enemies: Enemy[];
  shot: Shot | null;
  pops: Pop[];
  turns: number;
  stageTurns: number;
  damage: number;
  answers: (0 | 1)[];
  pending: "aim" | "clear" | "won";
  lastHits: number;
  lastBounces: number;
  ports: Vec[];
  effects: ComboEffect[];
  lastComboCount: number;
  lastCombos: Record<string, ComboRecord>;
  lastConsulted: FnId[];
  comboHistory: { striker: FnId; combos: Record<string, ComboRecord> }[];
  enemyPhase: EnemyPhase | null;
  incoming: IncomingEffect[];
  received: ReceivedHit[];
  protections: Protection[];
  enemyHistory: { turn: number; received: ReceivedHit[]; protections: Protection[] }[];
  attackSerial: number;
}
export function enemiesFor(stage: number): Enemy[] {
  const config = STAGES[stage];
  const items: Omit<Enemy, "attack">[] = [
    {
      id: 0,
      fn: config.axis[1],
      x: 240,
      y: 180,
      radius: 48,
      hp: config.hp,
      maxHp: config.hp,
      boss: true,
    },
    { id: 1, fn: config.axis[0], x: 112, y: 335, radius: 29, hp: 36, maxHp: 36, boss: false },
    { id: 2, fn: config.axis[1], x: 368, y: 335, radius: 29, hp: 36, maxHp: 36, boss: false },
  ];
  if (stage === 3)
    items.push({ id: 3, fn: "Ni", x: 240, y: 370, radius: 26, hp: 40, maxHp: 40, boss: false });
  return items.map((enemy) => ({ ...enemy, attack: newAttack(enemy, stage, startingPositions()) }));
}
const startingPositions = (): Vec[] => [
  { x: 140, y: 535 },
  { x: 240, y: 545 },
  { x: 340, y: 535 },
];
export function createRun(team: FnId[]): Run {
  if (team.length !== 3 || new Set(team).size !== 3 || team.some((id) => !FN[id]))
    throw new Error("Choose three distinct functions");
  return {
    team: [...team],
    positions: startingPositions(),
    used: new Set(),
    active: 0,
    stage: 0,
    hp: 100,
    phase: "aim",
    enemies: enemiesFor(0),
    shot: null,
    pops: [],
    turns: 0,
    stageTurns: 0,
    damage: 0,
    answers: [],
    pending: "aim",
    lastHits: 0,
    lastBounces: 0,
    ports: startingPositions().map((p) => portToward(p, enemiesFor(0))),
    effects: [],
    lastComboCount: 0,
    lastCombos: {},
    lastConsulted: [],
    comboHistory: [],
    enemyPhase: null,
    incoming: [],
    received: [],
    protections: [],
    enemyHistory: [],
    attackSerial: 0,
  };
}
export function launch(run: Run, direction: Vec, power: number, strike = false): boolean {
  if (
    run.phase !== "aim" ||
    !Number.isFinite(length(direction)) ||
    !length(direction) ||
    !Number.isFinite(power)
  )
    return false;
  const fn = run.team[run.active],
    kit = KITS[fn];
  if (strike && run.used.has(fn)) return false;
  if (strike) {
    run.used.add(fn);
    run.hp = Math.min(100, run.hp + kit.strike.heal);
  }
  run.shot = {
    position: { ...run.positions[run.active] },
    direction: unit(direction),
    speed:
      (480 + Math.max(0, Math.min(1, power)) * 460) * kit.speed * (strike ? kit.strike.speed : 1),
    elapsed: 0,
    bounces: 0,
    hits: 0,
    struck: new Set(),
    strike,
    touching: new Set(),
    combos: {},
    comboCount: 0,
    consulted: [],
  };
  run.phase = "flight";
  run.pops = [];
  run.received = [];
  run.protections = [];
  return true;
}
function hurt(run: Run, enemy: Enemy, value: number) {
  if (enemy.hp <= 0) return;
  const damage = Math.min(enemy.hp, Math.round(value));
  enemy.hp -= damage;
  run.damage += damage;
  run.pops.push({ x: enemy.x, y: enemy.y - enemy.radius, value: damage, life: 0.9 });
}
export function hitEnemy(run: Run, enemy: Enemy) {
  const shot = run.shot;
  if (!shot || enemy.hp <= 0) return;
  const fn = run.team[run.active],
    kit = KITS[fn];
  const damage = kit.damage * (shot.strike ? kit.strike.damage : 1);
  hurt(run, enemy, damage);
  const splash = shot.strike ? kit.strike.splash : 0;
  if (splash)
    for (const other of run.enemies) if (other.id !== enemy.id) hurt(run, other, damage * splash);
  shot.hits++;
  shot.struck.add(enemy.id);
}
/** Teammates are sensors, never solid reflectors. Re-arm only after leaving their radius. */
export function bumpSegment(run: Run, from: Vec, to: Vec) {
  const shot = run.shot;
  if (!shot || run.phase !== "flight") return;
  const entries: { index: number; at: number }[] = [];
  run.positions.forEach((p, index) => {
    if (index === run.active) return;
    const inside = Math.hypot(from.x - p.x, from.y - p.y) <= BALL_RADIUS * 2 + 0.001;
    if (!inside) shot.touching.delete(index);
    const at = contactEntry(from, to, p);
    if (at !== null && !shot.touching.has(index)) entries.push({ index, at });
  });
  entries.sort((a, b) => a.at - b.at || a.index - b.index);
  for (const { index } of entries) {
    shot.touching.add(index);
    const fn = run.team[index],
      kit = COMBOS[fn];
    const record = shot.combos[fn] ?? (shot.combos[fn] = comboRecord());
    // Each re-entry fires, with geometrically decreasing output to bound farming.
    const scale = 2 ** -record.count;
    record.count++;
    shot.comboCount++;
    shot.consulted.push(fn);
    const before = run.damage,
      hp = run.hp;
    for (const enemy of run.enemies)
      if (enemy.hp > 0 && inCombo(fn, run.positions[index], run.ports[index], enemy))
        hurt(run, enemy, kit.damage * scale);
    run.hp = Math.min(100, run.hp + Math.floor(kit.heal * scale));
    record.damage += run.damage - before;
    record.healing += run.hp - hp;
    run.effects.push({
      fn,
      origin: { ...run.positions[index] },
      direction: { ...run.ports[index] },
      life: 0.45,
      scale,
    });
  }
  run.positions.forEach((p, index) => {
    if (Math.hypot(to.x - p.x, to.y - p.y) > BALL_RADIUS * 2 + 0.001) shot.touching.delete(index);
  });
}
export function aimPorts(run: Run) {
  run.ports = run.positions.map((p) =>
    portToward(
      p,
      run.enemies.filter((e) => e.hp > 0),
    ),
  );
}
export const STEP = 1 / 120;
export function tick(run: Run, dt = STEP) {
  for (const p of run.pops) {
    p.life -= dt;
    p.y -= dt * 28;
  }
  run.pops = run.pops.filter((p) => p.life > 0);
  for (const effect of run.effects) effect.life -= dt;
  run.effects = run.effects.filter((effect) => effect.life > 0);
  for (const effect of run.incoming) effect.life -= dt;
  run.incoming = run.incoming.filter((effect) => effect.life > 0);
  if (run.phase === "enemy") {
    tickEnemyPhase(run, dt);
    return;
  }
  if (run.phase !== "flight" || !run.shot) return;
  const shot = run.shot,
    fn = run.team[run.active],
    kit = KITS[fn];
  const result = travel(
    shot.position,
    shot.direction,
    shot.speed * dt,
    run.enemies.filter((e) => e.hp > 0),
    (hit) => {
      if (hit.id !== null) {
        const enemy = run.enemies.find((e) => e.id === hit.id);
        if (enemy) hitEnemy(run, enemy);
      }
      shot.bounces++;
    },
    (from, to) => bumpSegment(run, from, to),
    (id) => run.enemies.some((enemy) => enemy.id === id && enemy.hp > 0),
  );
  shot.position = result.position;
  shot.direction = result.direction;
  shot.speed *= Math.exp(-kit.drag * dt);
  shot.elapsed += dt;
  if (
    shot.elapsed >= 6 ||
    shot.speed < 95 ||
    shot.bounces >= kit.bounces ||
    run.enemies.every((e) => e.hp <= 0)
  )
    finishShot(run);
}
function finishShot(run: Run) {
  const shot = run.shot!;
  run.positions[run.active] = { ...shot.position };
  run.lastHits = shot.hits;
  run.lastBounces = shot.bounces;
  run.lastComboCount = shot.comboCount;
  run.lastCombos = shot.combos;
  run.lastConsulted = [...new Set(shot.consulted)];
  run.comboHistory.push({ striker: run.team[run.active], combos: shot.combos });
  run.turns++;
  run.stageTurns++;
  const cleared = run.enemies.every((e) => e.hp <= 0);
  run.shot = null;
  run.pending = cleared ? (run.stage === 3 ? "won" : "clear") : "aim";
  if (cleared) {
    completeTurn(run);
    return;
  }
  const queue = run.enemies
    .filter((e) => e.hp > 0)
    .flatMap((enemy) => {
      enemy.attack.countdown--;
      return enemy.attack.countdown <= 0 ? [enemy.attack.plan] : [];
    });
  run.enemyPhase = { queue, index: 0, elapsed: 0, fired: false };
  run.phase = "enemy";
}
function completeTurn(run: Run) {
  run.enemyPhase = null;
  run.enemyHistory.push({
    turn: run.turns,
    received: [...run.received],
    protections: [...run.protections],
  });
  run.active = (run.active + 1) % 3;
  aimPorts(run);
  if (run.hp <= 0) {
    run.phase = "lost";
    return;
  }
  run.phase = run.answers.length < QUESTIONS.length ? "choice" : run.pending;
}
function tickEnemyPhase(run: Run, dt: number) {
  const phase = run.enemyPhase;
  if (!phase) return;
  phase.elapsed += dt;
  if (!phase.queue.length) {
    if (phase.elapsed >= WINDUP) completeTurn(run);
    return;
  }
  const plan = phase.queue[phase.index];
  const enemy = run.enemies.find((e) => e.id === plan.enemyId);
  if (!phase.fired && phase.elapsed >= WINDUP) {
    phase.fired = true;
    if (enemy && enemy.hp > 0) {
      const result = resolveAttack(plan, run.positions);
      run.attackSerial++;
      run.incoming.push({ plan, end: result.end, life: ATTACK_DURATION - WINDUP });
      for (const ball of result.hit) {
        const damage = Math.min(run.hp, plan.damage);
        run.hp -= damage;
        run.received.push({ ball, enemyId: enemy.id, damage });
        run.pops.push({ ...run.positions[ball], value: damage, life: 0.9, incoming: true });
      }
      for (const ball of result.protected)
        run.protections.push({ blocker: result.hit[0], protected: ball, enemyId: enemy.id });
      enemy.attack.round++;
      enemy.attack.countdown = enemy.attack.interval;
      enemy.attack.plan = planAttack(enemy, run.stage, enemy.attack.round, run.positions);
    }
  }
  if (phase.elapsed >= ATTACK_DURATION) {
    if (run.hp <= 0 || phase.index + 1 >= phase.queue.length) {
      completeTurn(run);
      return;
    }
    phase.index++;
    phase.elapsed = 0;
    phase.fired = false;
  }
}
export function answer(run: Run, value: 0 | 1) {
  if (run.phase !== "choice") return;
  run.answers.push(value);
  run.phase = run.pending;
}
export function nextStage(run: Run) {
  if (run.phase !== "clear") return;
  run.stage++;
  run.stageTurns = 0;
  run.enemies = enemiesFor(run.stage);
  run.positions = startingPositions();
  aimPorts(run);
  run.effects = [];
  run.lastComboCount = 0;
  run.lastCombos = {};
  run.lastConsulted = [];
  run.enemyPhase = null;
  run.incoming = [];
  run.received = [];
  run.protections = [];
  run.hp = Math.min(100, run.hp + 18);
  run.phase = "aim";
  run.pops = [];
}
export const QUESTIONS = [
  { axis: 0, letters: ["I", "E"] },
  { axis: 1, letters: ["N", "S"] },
  { axis: 2, letters: ["T", "F"] },
  { axis: 3, letters: ["J", "P"] },
  { axis: 0, letters: ["I", "E"] },
  { axis: 1, letters: ["N", "S"] },
  { axis: 2, letters: ["T", "F"] },
  { axis: 3, letters: ["J", "P"] },
] as const;
export function profile(answers: (0 | 1)[]) {
  const votes = [0, 0, 0, 0],
    counts = [0, 0, 0, 0];
  answers.slice(0, QUESTIONS.length).forEach((value, i) => {
    votes[QUESTIONS[i].axis] += value === 0 ? 1 : -1;
    counts[QUESTIONS[i].axis]++;
  });
  const letters = [
    ["I", "E"],
    ["N", "S"],
    ["T", "F"],
    ["J", "P"],
  ];
  return {
    code: votes.map((v, i) => (v === 0 ? "?" : letters[i][v > 0 ? 0 : 1])).join(""),
    votes,
    counts,
  };
}
