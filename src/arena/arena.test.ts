import { describe, expect, it } from "vite-plus/test";
import { FN_KEYS } from "../data";
import { answer, createRun, hitEnemy, KITS, launch, nextStage, profile, tick } from "./engine";
import {
  firstContact,
  length,
  lineCircle,
  pushOut,
  reflect,
  trajectory,
  travel,
  unit,
} from "./physics";

describe("analytic reflection", () => {
  it("preserves speed and mirrors the normal component", () => {
    const result = reflect({ x: 3, y: -4 }, { x: 0, y: 1 });
    expect(result).toEqual({ x: 3, y: 4 });
    expect(length(result)).toBe(5);
  });
  it("sweeps the expanded circle, including tangent contact", () => {
    const c = { x: 100, y: 100, radius: 20, id: 4 };
    expect(lineCircle({ x: 0, y: 100 }, { x: 1, y: 0 }, c, 10)?.distance).toBe(70);
    expect(lineCircle({ x: 0, y: 130 }, { x: 1, y: 0 }, c, 10)?.distance).toBe(100);
    expect(lineCircle({ x: 0, y: 100 }, { x: -1, y: 0 }, c, 10)).toBeNull();
  });
  it("does not tunnel at high speeds", () => {
    const c = { x: 240, y: 200, radius: 40, id: 2 };
    const result = travel({ x: 240, y: 500 }, { x: 0, y: -1 }, 600, [c]);
    expect(result.contacts.some((h) => h.id === 2)).toBe(true);
    expect(result.position.y).toBeGreaterThan(259);
    expect(result.position.y).toBeLessThanOrEqual(583);
  });
  it("resolves both normals at a corner and stays finite", () => {
    const result = travel({ x: 100, y: 100 }, unit({ x: -1, y: -1 }), 200, []);
    expect(result.contacts.length).toBe(2);
    expect(result.direction.x).toBeGreaterThan(0);
    expect(result.direction.y).toBeGreaterThan(0);
  });
  it("pushes overlapping spawns out without counting a hit", () => {
    const c = { x: 240, y: 200, radius: 40, id: 2 };
    const p = pushOut(c, [c]);
    expect(length({ x: p.x - c.x, y: p.y - c.y })).toBeGreaterThan(59);
  });
  it("uses the same first contact for preview and movement", () => {
    const p = { x: 140, y: 535 },
      d = unit({ x: 1, y: -2 });
    const hit = firstContact(p, d, []),
      path = trajectory(p, d, [], 1);
    expect(path[1].x).toBeCloseTo(p.x + d.x * hit.distance);
    expect(path).toHaveLength(3);
    expect(trajectory(p, d, [], 3)).toHaveLength(5);
  });
  it("stays bounded across repeated long sweeps", () => {
    for (let angle = 0; angle < 360; angle += 7) {
      const a = (angle * Math.PI) / 180;
      const r = travel({ x: 240, y: 500 }, { x: Math.cos(a), y: Math.sin(a) }, 8000, [
        { x: 240, y: 200, radius: 48, id: 0 },
      ]);
      expect(r.position.x).toBeGreaterThanOrEqual(36.99);
      expect(r.position.x).toBeLessThanOrEqual(443.01);
      expect(r.position.y).toBeGreaterThanOrEqual(36.99);
      expect(r.position.y).toBeLessThanOrEqual(583.01);
    }
  });
});

describe("run lifecycle", () => {
  it("requires three unique teammates", () => {
    expect(() => createRun(["Ni", "Ni", "Se"])).toThrow();
  });
  it("rejects invalid shots and launches only once", () => {
    const r = createRun(["Ni", "Se", "Fe"]);
    expect(launch(r, { x: 0, y: 0 }, 1)).toBe(false);
    expect(launch(r, { x: NaN, y: 1 }, 1)).toBe(false);
    expect(launch(r, { x: 0, y: -1 }, 1)).toBe(true);
    expect(launch(r, { x: 0, y: -1 }, 1)).toBe(false);
  });
  it("finishes bounded flights, rotates, and waits for a reflection", () => {
    const r = createRun(["Ni", "Se", "Fe"]);
    launch(r, { x: 0, y: -1 }, 1);
    for (let i = 0; i < 2000 && (r.phase === "flight" || r.phase === "enemy"); i++) tick(r);
    expect(r.phase).toBe("choice");
    expect(r.active).toBe(1);
    expect(r.turns).toBe(1);
    answer(r, 0);
    expect(r.phase).toBe("aim");
    expect(profile(r.answers).code).toBe("I???");
    answer(r, 1);
    expect(r.answers).toHaveLength(1);
  });
  it("consumes one strike per function per run", () => {
    const r = createRun(["Ni", "Se", "Fe"]);
    launch(r, { x: 0, y: -1 }, 1, true);
    expect(r.used.has("Ni")).toBe(true);
    r.phase = "aim";
    expect(launch(r, { x: 0, y: -1 }, 1, true)).toBe(false);
    r.phase = "clear";
    nextStage(r);
    expect(r.used.has("Ni")).toBe(true);
  });
  it("has a working strike and damage kit for every mascot", () => {
    for (const id of FN_KEYS) {
      const others = FN_KEYS.filter((f) => f !== id).slice(0, 2);
      const r = createRun([id, ...others]);
      r.hp = 40;
      expect(launch(r, { x: 0, y: -1 }, 1, true)).toBe(true);
      hitEnemy(r, r.enemies[0]);
      expect(r.damage).toBeGreaterThan(0);
      expect(r.pops.length).toBeGreaterThan(0);
      expect(KITS[id].strike.damage).toBeGreaterThan(1);
    }
  });
  it("advances four stages, then wins without a fifth stage", () => {
    const r = createRun(["Ni", "Se", "Fe"]);
    for (let stage = 0; stage < 4; stage++) {
      expect(r.stage).toBe(stage);
      launch(r, { x: 0, y: -1 }, 1);
      r.enemies.forEach((e) => {
        e.hp = 0;
      });
      tick(r);
      answer(r, 0);
      expect(r.phase).toBe(stage === 3 ? "won" : "clear");
      nextStage(r);
    }
    expect(r.stage).toBe(3);
  });
  it("loses at zero resolve", () => {
    const r = createRun(["Ni", "Se", "Ti"]);
    r.hp = 1;
    launch(r, { x: -1, y: 0 }, 0);
    // Park the striker on the boss's locked target so its first attack lands.
    r.shot!.position = { ...r.enemies[0].attack.plan.target };
    r.shot!.elapsed = 6;
    for (let i = 0; i < 2000 && r.phase !== "lost"; i++) tick(r);
    expect(r.phase).toBe("lost");
    expect(r.hp).toBe(0);
  });
  it("reports ties and missing answers instead of inventing letters", () => {
    expect(profile([]).code).toBe("????");
    expect(profile([0, 0, 0, 0, 1, 1, 1, 1]).code).toBe("????");
    expect(profile([1, 1, 1, 1, 1, 1, 1, 1]).code).toBe("ESFP");
  });
});
