import { FN, FN_KEYS, type FnId, type Kind } from '../data';
import { fnArt } from '../art/functions';
import { nameOf, t } from '../i18n';
import { state } from '../state';
import { Sound } from '../sound';
import { centerX, slots } from './board';

const veil = document.querySelector<HTMLElement>('#veil')!;
const hub = document.querySelector<HTMLElement>('#hub')!;
const drop = document.querySelector<HTMLElement>('#drop')!;
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

/** called with the element the user picked, so the value can fly out of it */
export type ChooseFn = (kind: Kind, i: number, id: FnId, source: Element) => void;
let onChoose: ChooseFn = () => {};
export const setChooser = (fn: ChooseFn) => { onChoose = fn; };

let open: { kind: Kind; idx: number; slot: HTMLElement } | null = null;
export const isOpen = (kind: Kind, i: number) => !!open && open.kind === kind && open.idx === i;

export function closePicker(restoreFocus = true) {
  if (!open) return;
  const { slot } = open;
  open = null;
  veil.classList.remove('on');
  drop.classList.remove('on');
  drop.style.height = '';
  slot.classList.remove('open-slot');
  slot.setAttribute('aria-expanded', 'false');
  hub.querySelectorAll('.ropt').forEach(el => el.classList.add('pre'));
  setTimeout(() => { if (!open) { hub.innerHTML = ''; drop.innerHTML = ''; } }, 360);
  if (restoreFocus) slot.focus({ preventScroll: true });
}

export function openPicker(kind: Kind, i: number) {
  closePicker(false);
  const slot = slots[i][kind];
  open = { kind, idx: i, slot };
  slot.classList.add('open-slot');
  slot.setAttribute('aria-expanded', 'true');
  Sound.select(centerX(slot));
  if (kind === 'emoji') openRadial(i); else openDrop(i);
}

function openRadial(i: number) {
  const slot = slots[i].emoji, cur = state.emoji[i];
  const rect = slot.getBoundingClientRect();
  const small = innerWidth < 560;
  const RD = small ? 74 : 98, OE = small ? 50 : 60;
  const pad = RD + OE / 2 + 12;
  const cx = clamp(rect.left + rect.width / 2, pad, innerWidth - pad);
  const cy = clamp(rect.top + rect.height / 2, pad, innerHeight - pad);
  hub.style.left = cx + 'px'; hub.style.top = cy + 'px';
  FN_KEYS.forEach((id, k) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'ropt pre' + (cur === id ? ' cur' : '');
    b.style.setProperty('--i', String(k));
    const a = -Math.PI / 2 + k * Math.PI / 4;
    b.style.setProperty('--dx', (RD * Math.cos(a)).toFixed(1) + 'px');
    b.style.setProperty('--dy', (RD * Math.sin(a)).toFixed(1) + 'px');
    b.innerHTML = fnArt(id);
    b.setAttribute('role', 'option');
    b.setAttribute('aria-selected', String(cur === id));
    b.setAttribute('aria-label', t().fnEmoji(nameOf(id)));
    b.addEventListener('click', ev => { ev.stopPropagation(); choose('emoji', i, id, b); });
    hub.append(b);
  });
  veil.classList.add('on');
  requestAnimationFrame(() => requestAnimationFrame(() => {
    hub.querySelectorAll('.ropt').forEach(el => el.classList.remove('pre'));
    hub.querySelector<HTMLElement>('.ropt')?.focus({ preventScroll: true });
  }));
}

function openDrop(i: number) {
  const slot = slots[i].label, cur = state.label[i];
  const sRect = slot.getBoundingClientRect();
  const GAP = 4, MINH = 236;
  let sBottom = sRect.bottom;
  const need = sBottom + GAP + MINH - innerHeight;
  if (need > 0) {
    const maxY = document.documentElement.scrollHeight - innerHeight;
    const actual = Math.min(need, Math.max(0, maxY - scrollY));
    if (actual > 1) window.scrollBy({ top: actual, behavior: 'smooth' });
    sBottom -= actual;
  }
  drop.textContent = '';
  const list = document.createElement('div'); list.className = 'dlist';
  FN_KEYS.forEach((id, k) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = cur === id ? 'cur' : '';
    b.style.setProperty('--i', String(k));
    b.style.setProperty('--c', FN[id].c);
    b.setAttribute('role', 'option');
    b.setAttribute('aria-selected', String(cur === id));
    b.innerHTML = `<i class="dot"></i><span class="nm">${nameOf(id)}</span><span class="id">${id}</span>`;
    b.addEventListener('click', ev => { ev.stopPropagation(); choose('label', i, id, b.querySelector('.nm')!); });
    list.append(b);
  });
  drop.append(list);
  drop.style.height = Math.max(MINH, innerHeight - sBottom - GAP) + 'px';
  drop.classList.add('on');
  veil.classList.add('on');
  const dRect = drop.getBoundingClientRect();
  const tx = clamp(sRect.left + sRect.width / 2 - (dRect.left + drop.clientLeft), 30, drop.clientWidth - 30);
  drop.style.setProperty('--tx', tx + 'px');
  list.querySelector<HTMLElement>('button')?.focus({ preventScroll: true });
}

function choose(kind: Kind, i: number, id: FnId, source: Element) {
  // hide the picked option at once: its twin is about to fly out of it
  (source.closest('.ropt') as HTMLElement | null)?.classList.add('taken');
  onChoose(kind, i, id, source);
  closePicker();
}

veil.addEventListener('click', () => closePicker());
document.addEventListener('keydown', e => { if (e.key === 'Escape') closePicker(); });
