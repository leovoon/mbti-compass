import type { FnId, Mode } from '../data';

export interface Locale {
  langName: string;
  docTitle: string;
  h1: string;
  sub: Record<Mode, string>;
  mode: { label: string } & Record<Mode, string>;
  btn: { check: string; hint: string; reset: string; soundOn: string; soundOff: string };
  howto: string;
  /** shown once all 16 slots are filled; falls back to English */
  howtoHold?: string;
  close?: string;
  leads?: string;
  stack?: string;
  types?: { title: string; sub: string };
  place: (n: number) => string;
  bonds: string[];
  bondHint: string;
  fn: Record<FnId, string>;
  fnEmoji: (n: string) => string;
  fnPair: (n: string, id: string) => string;
  blankEmoji: (i: number) => string;
  blankLabel: (i: number) => string;
  result: {
    empty: string;
    partial: (n: number, mode: Mode) => string;
    win: (checks: number, hints: number) => string;
    hintNone: string;
    hintOne: (glyph: string, name: string) => string;
  };
}
