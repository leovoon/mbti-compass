import { describe, expect, it } from "vite-plus/test";
import { score, ArenaAudio, type Cue } from "./audio";
import { FN_KEYS } from "../data";

describe("procedural audio", () => {
  it("generates bounded, finite envelopes for every cue and mascot", () => {
    const cues: Cue[] = [
      "select",
      "pull",
      "launch",
      "bounce",
      "hit",
      "combo",
      "attack",
      "strike",
      "choice",
      "clear",
      "win",
      "lose",
    ];
    for (const cue of cues)
      for (const fn of FN_KEYS)
        for (const note of score(cue, fn, 1)) {
          expect(note.frequency).toBeGreaterThan(0);
          expect(note.end).toBeGreaterThan(0);
          expect(note.frequency).toBeLessThan(20000);
          expect(note.end).toBeLessThan(20000);
          expect(note.duration).toBeGreaterThan(0.006);
          expect(note.duration).toBeLessThan(1);
          expect(note.gain).toBeLessThanOrEqual(0.13);
          expect(note.delay).toBeGreaterThanOrEqual(0);
        }
  });
  it("gives functions different pitches and stronger pulls a higher pitch", () => {
    expect(score("hit", "Ni")).not.toEqual(score("hit", "Se"));
    expect(score("pull", "Ni", 1)[0].frequency).toBeGreaterThan(
      score("pull", "Ni", 0)[0].frequency,
    );
  });
  it("is safe before audio initialization and can stop repeatedly", () => {
    expect(() => {
      ArenaAudio.play("hit");
      ArenaAudio.stop();
      ArenaAudio.stop();
    }).not.toThrow();
  });
});
