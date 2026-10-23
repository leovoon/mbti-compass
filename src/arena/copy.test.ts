import { describe, expect, it } from "vite-plus/test";
import { ARENA_LOCALES } from "./copy";
import { QUESTIONS } from "./engine";
import { LOCALES } from "../i18n/locales";

describe("arena copy", () => {
  it("covers English plus both Chinese scripts, each with a real site locale", () => {
    expect(Object.keys(ARENA_LOCALES).sort()).toEqual(["en", "zh-CN", "zh-TW"]);
    for (const id of Object.keys(ARENA_LOCALES)) expect(LOCALES[id]).toBeDefined();
  });
  it("gives every locale one two-option question per reflection", () => {
    for (const copy of Object.values(ARENA_LOCALES)) {
      expect(copy.questions).toHaveLength(QUESTIONS.length);
      for (const q of copy.questions) expect(q.options).toHaveLength(2);
    }
  });
});
