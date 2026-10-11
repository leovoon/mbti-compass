import { FN, RING, type FnId, type Kind } from '../data';
import { fnArt } from '../art/functions';
import { nameOf, t } from '../i18n';
import { canHold, isVerified, state } from '../state';
import { flyFrom, popIn } from '../motion';
import { Sound } from '../sound';

export const CX = 50, CY = 48;
/* On phones the slots are large relative to the board, so the ring opens up
 * into the side margins: neighbours get ~10% more room, nothing leaves the screen. */
const narrow = matchMedia('(max-width:560px)');
let R = narrow.matches ? 36 : 33;
export const pos = (i: number) => {
  const a = (-90 + 45 * i) * Math.PI / 180;
  return { x: CX + R * Math.cos(a), y: CY + R * Math.sin(a) };
};

export const board = document.querySelector<HTMLElement>('#board')!;
const svg = document.querySelector<SVGSVGElement>('#lines')!;

export type Slot = HTMLElement;
export let slots: Record<Kind, Slot>[] = [];

export interface BoardHandlers {
  activate(kind: Kind, i: number): void;
  hold(kind: Kind, i: number): void;
}

const HOLD_MS = 480;

function drawRing() {
  const solved = [...svg.querySelectorAll('.beam.solved')].map(b => b.id);
  // rings, the four diameters (faint track + two gold beams that draw out from the hub)
  let s = `<circle class="ring" cx="${CX}" cy="${CY}" r="${R}"/>` +
    `<circle class="ring inner" cx="${CX}" cy="${CY}" r="${R * .42}"/>`;
  for (let i = 0; i < 4; i++) {
    const p = pos(i), q = pos(i + 4);
    s += `<line class="track" x1="${p.x}" y1="${p.y}" x2="${q.x}" y2="${q.y}"/>` +
      `<g class="beam" id="beam${i}">` +
      `<line pathLength="1" x1="${CX}" y1="${CY}" x2="${p.x}" y2="${p.y}"/>` +
      `<line pathLength="1" x1="${CX}" y1="${CY}" x2="${q.x}" y2="${q.y}"/></g>`;
  }
  // the hub: a little compass star
  const k = 1.5, w = .4;
  s += `<g class="hub"><path d="M${CX} ${CY - k} L${CX + w} ${CY - w} L${CX + k} ${CY} L${CX + w} ${CY + w} L${CX} ${CY + k} L${CX - w} ${CY + w} L${CX - k} ${CY} L${CX - w} ${CY - w} Z"/></g>`;
  svg.innerHTML = s;
  for (const id of solved) svg.querySelector('#' + id)?.classList.add('solved');
  board.querySelectorAll<HTMLElement>('.node').forEach((n, i) => {
    const p = pos(i);
    n.style.left = p.x + '%'; n.style.top = p.y + '%';
  });
}

narrow.addEventListener('change', () => { R = narrow.matches ? 36 : 33; drawRing(); });

export function buildBoard(h: BoardHandlers) {
  slots = RING.map((_, i) => {
    const node = document.createElement('div');
    node.className = 'node';
    node.style.setProperty('--i', String(i));
    const se = mkSlot('emoji', i, h), sl = mkSlot('label', i, h);
    node.append(se, sl);
    board.append(node);
    return { emoji: se, label: sl };
  });
  drawRing();
}

function mkSlot(kind: Kind, i: number, h: BoardHandlers): Slot {
  const b = document.createElement('div');
  b.className = 'slot ' + kind;
  b.dataset.kind = kind; b.dataset.idx = String(i);
  b.setAttribute('role', 'button'); b.tabIndex = 0;
  b.setAttribute('aria-haspopup', 'listbox');
  b.setAttribute('aria-expanded', 'false');

  // press-and-hold opens the info card: once all 16 are placed, or on a slot the last check marked correct
  let timer = 0, held = false, sx = 0, sy = 0;
  const holdable = () => canHold(kind, i);
  const cancel = () => { clearTimeout(timer); timer = 0; b.classList.remove('holding'); document.body.classList.remove('holding'); };
  b.addEventListener('pointerdown', e => {
    held = false; cancel();
    if (!holdable() || e.button > 0) return;
    sx = e.clientX; sy = e.clientY;
    b.classList.add('holding');
    document.body.classList.add('holding');
    Sound.init(); Sound.hold(e.clientX);
    timer = window.setTimeout(() => { held = true; cancel(); h.hold(kind, i); }, HOLD_MS);
  });
  b.addEventListener('pointermove', e => {
    if (timer && Math.hypot(e.clientX - sx, e.clientY - sy) > 10) cancel();
  });
  for (const ev of ['pointerup', 'pointercancel', 'pointerleave'] as const) b.addEventListener(ev, cancel);
  b.addEventListener('contextmenu', e => { if (holdable()) e.preventDefault(); });
  b.addEventListener('click', () => {
    if (held) { held = false; return; } // the release after a hold is not a tap
    h.activate(kind, i);
  });
  b.addEventListener('keydown', e => {
    if (e.target !== b) return;
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); h.activate(kind, i); }
    else if ((e.key === 'i' || e.key === 'I') && holdable()) { e.preventDefault(); h.hold(kind, i); }
  });
  return b;
}

export const chipOf = (kind: Kind, i: number) => slots[i][kind].querySelector<HTMLElement>('.chip');
export const centerX = (el: Element) => { const r = el.getBoundingClientRect(); return r.left + r.width / 2; };

/** how a value arrived, so the chip can animate from where it came from */
export type Arrival = { from: DOMRect; scale?: boolean } | 'pop' | null;

export function renderSlot(kind: Kind, i: number, arrival: Arrival = null) {
  const slot = slots[i][kind], fn: FnId | null = state[kind][i];
  slot.classList.toggle('filled', !!fn);
  slot.classList.toggle('known', isVerified(kind, i));
  slot.innerHTML = '';
  if (fn) {
    slot.style.setProperty('--c', FN[fn].c);
    const v = document.createElement('span');
    v.className = 'chip ' + (kind === 'emoji' ? 'e' : 'l');
    v.style.setProperty('--d', `${-(i * .83 + (kind === 'label' ? .4 : 0)).toFixed(2)}s`);
    v.innerHTML = kind === 'emoji'
      ? fnArt(fn)
      : `<i class="dot"></i><b>${nameOf(fn)}</b><span>${fn}</span>`;
    slot.append(v);
    if (arrival === 'pop') popIn(v);
    else if (arrival) flyFrom(v, arrival.from, { scale: arrival.scale ?? true });
  } else slot.style.removeProperty('--c');

  const L = t();
  const base = kind === 'emoji' ? L.blankEmoji(i + 1) : L.blankLabel(i + 1);
  slot.setAttribute('aria-label', fn ? `${base}: ${kind === 'emoji' ? nameOf(fn) + ' ' + FN[fn].e : nameOf(fn)}` : base);
}

export const renderAll = () => slots.forEach((_, i) => { renderSlot('emoji', i); renderSlot('label', i); });

/** verified slots wear a small gold seal so it's clear they can be held */
export function paintKnown() {
  slots.forEach((s, i) => {
    for (const kind of ['emoji', 'label'] as const) s[kind].classList.toggle('known', isVerified(kind, i));
  });
}
