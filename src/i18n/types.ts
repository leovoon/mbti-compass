import type { FnId, TypeId } from "../data";

export interface Locale {
  langName: string;
  docTitle: string;
  h1: string;
  /** one line under the title saying what this is for; always visible */
  tagline?: string;
  sub: string;
  btn: { check: string; hint: string; reset: string; soundOn: string; soundOff: string };
  howto: string;
  /** shown once all 16 slots are filled; falls back to English */
  howtoHold?: string;
  close?: string;
  leads?: string;
  stack?: string;
  types?: { title: string; sub: string };
  /** first-visit tour: six steps, in order (welcome, pick, name, goal, check, hold) */
  tour?: {
    steps: { title: string; body: string }[];
    start: string;
    next: string;
    back: string;
    done: string;
    skip: string;
    help: string;
    of: (a: number, b: number) => string;
  };
  place: (n: number) => string;
  bonds: string[];
  bondHint: string;
  fn: Record<FnId, string>;
  /** localised info-card content; falls back to the English FN/TYPES data */
  fnInfo?: Record<FnId, { full: string; w: string; d: string }>;
  /** localised type descriptions; character names stay English (proper nouns) */
  typeInfo?: Partial<Record<TypeId, { d: string }>>;
  fnEmoji: (n: string) => string;
  fnPair: (n: string, id: string) => string;
  blankEmoji: (i: number) => string;
  blankLabel: (i: number) => string;
  result: {
    empty: string;
    partial: (n: number) => string;
    win: (checks: number, hints: number) => string;
    hintNone: string;
    hintOne: (glyph: string, name: string) => string;
  };
}
