import { BONDS, FN, RING, type FnId } from '../data';
import { fnArt } from '../art/functions';
import { nameOf, t } from '../i18n';
import { anyPlaced, assign, clearAll, getNode, state } from '../state';
import { CHECK_STEP, Sound, type MarkState } from '../sound';
import { animate, burst, reduced, spring } from '../motion';
import { board, centerX, chipOf, CX, CY, renderSlot, slots } from './board';
import { closePicker } from './pickers';

const $ = <T extends HTMLElement = HTMLElement>(s: string) => document.querySelector<T>(s)!;
const mini = (id: FnId) => `<span class="mini" aria-hidden="true">${fnArt(id)}</span>`;

export function nodeCorrect(i: number) {
  const { e, l } = getNode(i);
  if (state.mode === 'exact') return e === RING[i] && l === RING[i];
  if (!e || e !== l) return false;
  const o = getNode((i + 4) % 8);
  return o.e === o.l && o.e === FN[e].opp;
}

const mark = (slot: HTMLElement, ok: boolean) => slot.classList.add(ok ? 'ok' : 'bad');

let winTimer = 0;
export function clearMarks(hard = false) {
  clearTimeout(winTimer);
  document.querySelectorAll('.slot').forEach(s => s.classList.remove('ok', 'bad'));
  document.querySelectorAll('.beam').forEach(l => l.classList.remove('solved'));
  board.classList.remove('won');
  $('#chant').classList.remove('show');
  $('#result').textContent = '';
  if (hard) { state.checks = 0; state.hints = 0; renderBonds(true); }
}

/* ---------- bonds legend ---------- */
const opened = new Set<number>();
export function renderBonds(reset = false, fresh: number[] = []) {
  if (reset) opened.clear();
  const L = t();
  $('#bonds').innerHTML = BONDS.map((b, i) => opened.has(i)
    ? `<li class="open${fresh.includes(i) ? ' fresh' : ''}" style="--ca:${FN[b.a].c};--cb:${FN[b.b].c}">` +
      `<div class="bp">${mini(b.a)}<i></i>${mini(b.b)}</div>` +
      `<div class="bt"><b>${L.bonds[i].replace('&', '&amp;')}</b><small>${nameOf(b.a)} ${FN[b.a].t.join(' · ')} ↔ ${nameOf(b.b)} ${FN[b.b].t.join(' · ')}</small></div></li>`
    : `<li><div class="bp"><span class="ghost"></span><i></i><span class="ghost"></span></div><div class="bt"><b>? &amp; ?</b><small>${L.bondHint}</small></div></li>`
  ).join('');
}

/* ---------- check ---------- */
export function check() {
  closePicker(false); clearMarks(); state.checks++;
  let correct = 0;
  for (let i = 0; i < 8; i++) {
    const ok = nodeCorrect(i), { e, l } = getNode(i);
    // the verdict sweeps clockwise in time with the chimes
    for (const s of [slots[i].emoji, slots[i].label]) s.style.setProperty('--d', `${(i * CHECK_STEP).toFixed(3)}s`);
    if (ok) correct++;
    if (state.mode === 'exact') {
      if (e) mark(slots[i].emoji, e === RING[i]);
      if (l) mark(slots[i].label, l === RING[i]);
    } else if (ok) {
      mark(slots[i].emoji, true); mark(slots[i].label, true);
    } else if (e || l) {
      const o = getNode((i + 4) % 8);
      const pairOk = e && l && e === l, partnerSet = o.e && o.l && o.e === o.l;
      if (!pairOk || partnerSet) { if (e) mark(slots[i].emoji, false); if (l) mark(slots[i].label, false); }
    }
  }
  const solvedLines: number[] = [], fresh: number[] = [];
  const after = 8 * CHECK_STEP + .1;
  for (let i = 0; i < 4; i++) {
    if (nodeCorrect(i) && nodeCorrect(i + 4)) {
      const beam = $('#beam' + i);
      beam.style.setProperty('--d', `${(after + solvedLines.length * .16).toFixed(2)}s`);
      beam.classList.add('solved');
      solvedLines.push(i);
      const k = BONDS.findIndex(b => b.a === getNode(i).e || b.b === getNode(i).e);
      if (!opened.has(k)) fresh.push(k);
      opened.add(k);
    }
  }
  renderBonds(false, fresh);
  const states: MarkState[] = slots.map(s =>
    (s.emoji.classList.contains('bad') || s.label.classList.contains('bad')) ? 'bad'
      : (s.emoji.classList.contains('ok') || s.label.classList.contains('ok')) ? 'ok' : 'none');
  Sound.check(states, solvedLines, correct === 8);
  const res = $('#result');
  if (correct === 8) win(after + solvedLines.length * .16);
  else if (correct === 0 && !anyPlaced()) res.textContent = t().result.empty;
  else res.innerHTML = t().result.partial(correct, state.mode);
}

function win(delayS: number) {
  $('#result').innerHTML = t().result.win(state.checks, state.hints);
  winTimer = window.setTimeout(() => {
    board.classList.add('won');
    $('#chant').classList.add('show');
    if (reduced()) return;
    burst(board, CX, CY, RING.map(f => FN[f].c), 40);
    // the cast does a little wave, clockwise
    slots.forEach((_, i) => {
      const chip = chipOf('emoji', i);
      if (chip) animate(chip, [
        { transform: 'none' },
        { transform: 'translateY(-16px) scale(1.12) rotate(-6deg)', offset: .35 },
        { transform: 'translateY(0) scale(.96,1.04)', offset: .7 },
        { transform: 'none' },
      ], { duration: 700, delay: i * 70, easing: 'ease-out' });
    });
  }, delayS * 1000);
}

/* ---------- hint ---------- */
export function hint(after: () => void) {
  closePicker(false); clearMarks();
  let target: number | null = null, fn: FnId | null = null;
  if (state.mode === 'exact') {
    for (let i = 0; i < 8; i++) if (!nodeCorrect(i)) { target = i; fn = RING[i]; break; }
  } else {
    for (let i = 0; i < 8 && target === null; i++) {
      if (nodeCorrect(i)) continue;
      const o = getNode((i + 4) % 8);
      if (o.e && o.e === o.l) { target = i; fn = FN[o.e].opp; }
    }
    if (target === null) {
      const used = new Set<FnId>();
      for (let i = 0; i < 8; i++) if (nodeCorrect(i)) used.add(getNode(i).e!);
      for (let i = 0; i < 8; i++) if (!nodeCorrect(i)) { target = i; break; }
      fn = RING.find(f => !used.has(f)) ?? null;
    }
  }
  if (target === null || !fn) { $('#result').innerHTML = t().result.hintNone; return; }
  state.hints++;
  for (const kind of ['emoji', 'label'] as const) {
    const from = chipOf(kind, target)?.getBoundingClientRect();
    const moved = assign(kind, target, fn);
    renderSlot(kind, target, 'pop');
    if (moved !== null) renderSlot(kind, moved, from ? { from } : 'pop');
    const sl = slots[target][kind];
    sl.classList.remove('hinted'); void sl.offsetWidth; sl.classList.add('hinted');
    setTimeout(() => sl.classList.remove('hinted'), 1500);
  }
  after();
  Sound.hint();
  Sound.place(target, 'emoji', centerX(slots[target].emoji), true);
  $('#result').innerHTML = t().result.hintOne(mini(fn), nameOf(fn));
}

/* ---------- reset ---------- */
export function resetBoard(after: () => void) {
  closePicker(false);
  const chips = [...document.querySelectorAll<HTMLElement>('.slot .chip')];
  const finish = () => {
    clearMarks(true); clearAll();
    slots.forEach((_, i) => { renderSlot('emoji', i); renderSlot('label', i); });
    after();
  };
  Sound.reset();
  if (reduced() || !chips.length) { finish(); return; }
  // everything tumbles back into the hub, then the ring is clear
  const b = board.getBoundingClientRect();
  const hx = b.left + b.width * CX / 100, hy = b.top + b.height * CY / 100;
  const anims = chips.map((c, k) => {
    const r = c.getBoundingClientRect();
    return c.animate([
      { transform: 'none', opacity: 1 },
      { transform: `translate(${hx - (r.left + r.width / 2)}px,${hy - (r.top + r.height / 2)}px) scale(.15) rotate(${k % 2 ? 90 : -90}deg)`, opacity: 0 },
    ], { duration: 420, delay: k * 12, easing: 'cubic-bezier(.55,0,.75,.2)', fill: 'forwards' }).finished;
  });
  Promise.all(anims).then(() => {
    finish();
    animate(board.querySelector('.hub')!, [{ transform: 'scale(1)' }, { transform: 'scale(2.2)' }, { transform: 'scale(1)' }],
      { duration: 520, easing: spring() });
  });
}
