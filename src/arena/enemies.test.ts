import { describe, expect, it } from "vite-plus/test";
import { createRun, launch, profile, tick, type Run } from "./engine";
import { resolveAttack, planAttack } from "./enemies";

/** Finish the current shot where it is, then run the enemy phase to completion. */
function endTurn(r: Run) {
  r.shot!.elapsed = 6;
  for (let i = 0; i < 3000 && (r.phase === "flight" || r.phase === "enemy"); i++) tick(r);
}
const beam = (origin = { x: 240, y: 100 }, target = { x: 240, y: 500 }) =>
  planAttack({ ...origin, id: 0, boss: true }, 0, 0, [target]);

describe("enemy telegraphs", () => {
  it("counts down once per player shot and resets after firing", () => {
    const r = createRun(["Ni", "Se", "Fe"]);
    const minion = r.enemies[2];
    expect(minion.attack.countdown).toBe(3);
    launch(r, { x: -1, y: 0 }, 0);
    endTurn(r);
    expect(minion.attack.countdown).toBe(2);
    expect(r.enemies[0].attack.countdown).toBe(r.enemies[0].attack.interval);
  });
  it("locks the target at telegraph time, so moving away dodges it", () => {
    const r = createRun(["Ni", "Se", "Fe"]);
    const target = r.enemies[0].attack.plan.target;
    r.positions = r.positions.map((p, i) => (i === 0 ? p : { x: 440 - i * 10, y: 60 }));
    launch(r, { x: -1, y: 0 }, 0);
    r.shot!.position = { x: 40, y: 60 };
    endTurn(r);
    expect(r.received).toEqual([]);
    expect(target).toEqual({ x: 140, y: 535 });
  });
  it("damages stationary teammates, not just the striker", () => {
    const r = createRun(["Ni", "Se", "Fe"]);
    const target = r.enemies[0].attack.plan.target;
    r.positions[1] = { ...target };
    launch(r, { x: -1, y: 0 }, 0);
    r.shot!.position = { x: 440, y: 60 };
    const before = r.hp;
    endTurn(r);
    expect(r.received.some((h) => h.ball === 1)).toBe(true);
    expect(r.hp).toBeLessThan(before);
  });
  it("skips attacks from shadows defeated before the enemy phase", () => {
    const r = createRun(["Ni", "Se", "Fe"]);
    r.enemies[0].hp = 0;
    launch(r, { x: -1, y: 0 }, 0);
    endTurn(r);
    expect(r.received.every((h) => h.enemyId !== 0)).toBe(true);
  });
  it("does not let enemy hits change personality letters", () => {
    const r = createRun(["Ni", "Se", "Fe"]);
    r.positions[1] = { ...r.enemies[0].attack.plan.target };
    launch(r, { x: -1, y: 0 }, 0);
    endTurn(r);
    expect(r.answers).toEqual([]);
    expect(profile(r.answers).code).toBe("????");
  });
});

describe("attack shapes", () => {
  it("stops a beam at the first ball and records who was shielded", () => {
    const result = resolveAttack(beam(), [
      { x: 240, y: 500 },
      { x: 240, y: 300 },
      { x: 60, y: 300 },
    ]);
    expect(result.hit).toEqual([1]);
    expect(result.protected).toEqual([0]);
    expect(result.end.y).toBeLessThan(300);
  });
  it("misses a beam that passes clear of every ball", () => {
    expect(resolveAttack(beam(), [{ x: 400, y: 300 }]).hit).toEqual([]);
  });
  it("hits every ball inside a blast and along a cross", () => {
    const blast = { ...beam(), kind: "blast" as const, target: { x: 240, y: 500 }, radius: 70 };
    expect(
      resolveAttack(blast, [
        { x: 240, y: 500 },
        { x: 300, y: 520 },
        { x: 60, y: 100 },
      ]).hit,
    ).toEqual([0, 1]);
    const cross = { ...blast, kind: "cross" as const, width: 17 };
    expect(
      resolveAttack(cross, [
        { x: 240, y: 100 },
        { x: 40, y: 500 },
        { x: 120, y: 300 },
      ]).hit,
    ).toEqual([0, 1]);
  });
});
