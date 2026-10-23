import { describe, expect, it } from "vite-plus/test";
import { FN_KEYS } from "../data";
import { COMBOS, contactEntry, inCombo } from "./combos";
import { aimPorts, bumpSegment, createRun, launch, profile, tick } from "./engine";
import { travel } from "./physics";

function setup() {
  const r = createRun(["Ni", "Fe", "Ti"]);
  r.positions = [
    { x: 60, y: 500 },
    { x: 240, y: 500 },
    { x: 360, y: 500 },
  ];
  r.hp = 30;
  aimPorts(r);
  launch(r, { x: 1, y: 0 }, 1);
  return r;
}
describe("friendship contacts", () => {
  it("triggers through the actual fixed-step simulation without changing teammate positions", () => {
    const r = setup();
    for (let i = 0; i < 45; i++) tick(r);
    expect(r.shot!.comboCount).toBeGreaterThanOrEqual(2);
    expect(r.positions[1]).toEqual({ x: 240, y: 500 });
    expect(r.shot!.combos.Ti.damage).toBeGreaterThan(0);
  });
  it("does not reflect off a target destroyed during a movement segment", () => {
    let alive = true;
    const result = travel(
      { x: 240, y: 500 },
      { x: 0, y: -1 },
      300,
      [{ x: 240, y: 200, radius: 40, id: 0 }],
      undefined,
      () => {
        alive = false;
      },
      () => alive,
    );
    expect(result.contacts).toHaveLength(0);
    expect(result.direction).toEqual({ x: 0, y: -1 });
    expect(result.position.y).toBeCloseTo(200);
  });
  it("detects fast crossings and tangencies, but not misses", () => {
    expect(contactEntry({ x: 0, y: 0 }, { x: 500, y: 0 }, { x: 200, y: 0 })).not.toBeNull();
    expect(contactEntry({ x: 0, y: 38 }, { x: 500, y: 38 }, { x: 200, y: 0 })).not.toBeNull();
    expect(contactEntry({ x: 0, y: 39 }, { x: 500, y: 39 }, { x: 200, y: 0 })).toBeNull();
  });
  it("fires once while overlapping, then again after exit and reentry", () => {
    const r = setup();
    bumpSegment(r, { x: 100, y: 500 }, { x: 240, y: 500 });
    bumpSegment(r, { x: 240, y: 500 }, { x: 250, y: 500 });
    expect(r.shot!.comboCount).toBe(1);
    expect(r.hp).toBe(42);
    bumpSegment(r, { x: 250, y: 500 }, { x: 290, y: 500 });
    bumpSegment(r, { x: 290, y: 500 }, { x: 240, y: 500 });
    expect(r.shot!.comboCount).toBe(2);
    expect(r.hp).toBe(48);
    expect(r.shot!.combos.Fe).toEqual({ count: 2, damage: 0, healing: 18 });
  });
  it("ignores self, processes teammates in travel order, consumes no action", () => {
    const r = setup();
    bumpSegment(r, { x: 40, y: 500 }, { x: 430, y: 500 });
    expect(r.shot!.consulted).toEqual(["Fe", "Ti"]);
    expect(r.used.size).toBe(0);
    expect(r.turns).toBe(0);
    expect(r.phase).toBe("flight");
    expect(r.positions[1]).toEqual({ x: 240, y: 500 });
  });
  it("follows reflected segments without reflecting off teammates", () => {
    const r = setup();
    const result = travel({ x: 100, y: 500 }, { x: 1, y: 0 }, 600, [], undefined, (a, b) =>
      bumpSegment(r, a, b),
    );
    expect(result.contacts).toHaveLength(1);
    expect(r.shot!.consulted).toEqual(["Fe", "Ti", "Ti", "Fe"]);
  });
  it("bounds healing even after many reentries and leaves quiz scoring unchanged", () => {
    const r = setup();
    for (let i = 0; i < 30; i++) bumpSegment(r, { x: 100, y: 500 }, { x: 300, y: 500 });
    expect(r.hp).toBeLessThanOrEqual(54);
    expect(r.shot!.comboCount).toBe(30);
    expect(profile(r.answers).code).toBe("????");
    expect(r.answers).toEqual([]);
  });
  it("records per-striker results and resets contacts for the next shot", () => {
    const r = setup();
    bumpSegment(r, { x: 100, y: 500 }, { x: 300, y: 500 });
    r.shot!.elapsed = 6;
    tick(r);
    expect(r.lastComboCount).toBe(1);
    expect(r.lastConsulted).toEqual(["Fe"]);
    expect(r.comboHistory[0].striker).toBe("Ni");
    r.phase = "aim";
    launch(r, { x: 0, y: -1 }, 1);
    expect(r.shot!.comboCount).toBe(0);
    expect(r.shot!.touching.size).toBe(0);
  });
});
describe("bump attack shapes", () => {
  it("respects port direction, width and wave range", () => {
    const origin = { x: 240, y: 500 },
      up = { x: 0, y: -1 };
    expect(inCombo("Ni", origin, up, { x: 240, y: 100, radius: 10 })).toBe(true);
    expect(inCombo("Ni", origin, up, { x: 240, y: 580, radius: 10 })).toBe(false);
    expect(inCombo("Ti", origin, up, { x: 300, y: 100, radius: 10 })).toBe(false);
    expect(inCombo("Se", origin, up, { x: 300, y: 500, radius: 10 })).toBe(true);
    expect(inCombo("Se", origin, up, { x: 240, y: 100, radius: 10 })).toBe(false);
  });
  it("gives every teammate a working damage or healing combo", () => {
    for (const fn of FN_KEYS) {
      const team = [
        FN_KEYS.find((f) => f !== fn)!,
        fn,
        FN_KEYS.find((f) => f !== fn && f !== FN_KEYS.find((g) => g !== fn))!,
      ];
      const r = createRun(team);
      r.hp = 20;
      r.positions[1] = { x: 240, y: 300 };
      r.positions[2] = { x: 400, y: 550 };
      r.enemies[0].x = 240;
      r.enemies[0].y = 200;
      aimPorts(r);
      launch(r, { x: 1, y: 0 }, 1);
      bumpSegment(r, { x: 150, y: 300 }, { x: 300, y: 300 });
      expect(r.shot!.combos[fn].count).toBe(1);
      if (COMBOS[fn].damage) expect(r.shot!.combos[fn].damage).toBeGreaterThan(0);
      if (COMBOS[fn].heal) expect(r.shot!.combos[fn].healing).toBeGreaterThan(0);
    }
  });
});
