import type { FnId, Kind, Mode } from './data';

/** what is placed where; one function per slot family, swaps keep it unique */
export const state = {
  emoji: Array<FnId | null>(8).fill(null),
  label: Array<FnId | null>(8).fill(null),
  mode: 'opposites' as Mode,
  checks: 0,
  hints: 0,
};

/** values the last Check proved correct. They stay holdable until that slot itself changes. */
export const verified = {
  emoji: Array<FnId | null>(8).fill(null),
  label: Array<FnId | null>(8).fill(null),
};
export const isVerified = (kind: Kind, i: number) => !!state[kind][i] && verified[kind][i] === state[kind][i];
export const clearVerified = () => { verified.emoji.fill(null); verified.label.fill(null); };
/** may this slot open its info card on a long press? */
export const canHold = (kind: Kind, i: number) => !!state[kind][i] && (allPlaced() || isVerified(kind, i));
export const anyHoldable = () => allPlaced() || state.emoji.some((_, i) => isVerified('emoji', i) || isVerified('label', i));

export const placedCount = () =>
  state.emoji.filter(Boolean).length + state.label.filter(Boolean).length;
export const allPlaced = () => placedCount() === 16;
export const anyPlaced = () => placedCount() > 0;
export const getNode = (i: number) => ({ e: state.emoji[i], l: state.label[i] });

/** place (or clear with null). Returns the slot index a displaced value moved to. */
export function assign(kind: Kind, i: number, fn: FnId | null): number | null {
  if (fn === null) { state[kind][i] = null; return null; }
  const other = state[kind].indexOf(fn);
  let moved: number | null = null;
  if (other !== -1 && other !== i) {
    state[kind][other] = state[kind][i];
    moved = state[kind][other] ? other : null;
  }
  state[kind][i] = fn;
  return moved;
}

export function clearAll() {
  state.emoji.fill(null);
  state.label.fill(null);
  clearVerified();
}
