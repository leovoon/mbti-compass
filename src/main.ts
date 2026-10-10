import '@fontsource-variable/fraunces/soft.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/mascot.css';
import './styles/board.css';
import './styles/pickers.css';
import './styles/info.css';
import './styles/sections.css';

import type { FnId, Kind, Mode } from './data';
import { LOCALES, locale, setLocale, t, tx } from './i18n';
import { allPlaced, assign, placedCount, state } from './state';
import { Sound } from './sound';
import { buildBoard, centerX, chipOf, renderAll, renderSlot, slots } from './ui/board';
import { closePicker, isOpen, openPicker, setChooser } from './ui/pickers';
import { check, clearMarks, hint, renderBonds, resetBoard } from './ui/game';
import { closeInfo, refreshInfo, showFn } from './ui/info';
import { renderGallery } from './ui/gallery';

const $ = <T extends HTMLElement = HTMLElement>(s: string) => document.querySelector<T>(s)!;

/* ---------- sky ---------- */
const sky = $('.sky');
for (let i = 0; i < 110; i++) {
  const s = document.createElement('i');
  const z = Math.random() * 1.7 + .4;
  s.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 100}%;width:${z}px;height:${z}px;--o:${.2 + Math.random() * .6};animation-delay:${Math.random() * 6}s`;
  sky.append(s);
}

/* ---------- board ---------- */
buildBoard({
  activate(kind, i) {
    Sound.init();
    if (isOpen(kind, i)) closePicker(); else openPicker(kind, i);
  },
  hold(kind, i) {
    const id = state[kind][i];
    if (!id) return;
    closePicker(false);
    Sound.reveal(i, centerX(slots[i][kind]));
    showFn(id, slots[i][kind]);
  },
});

setChooser((kind: Kind, i: number, id: FnId, source: Element) => {
  const clearing = state[kind][i] === id;
  const from = source.getBoundingClientRect();
  const oldHere = chipOf(kind, i)?.getBoundingClientRect();
  const moved = assign(kind, i, clearing ? null : id);
  renderSlot(kind, i, clearing ? null : { from, scale: kind === 'emoji' });
  // a swapped-out value travels to the slot it was displaced into
  if (moved !== null) renderSlot(kind, moved, oldHere ? { from: oldHere } : 'pop');
  clearMarks();
  afterChange();
  if (!clearing)
    Sound.place(i, kind, centerX(slots[i][kind]), state.emoji[i] === state.label[i] && !!state.emoji[i]);
});

let wasAll = false;
function afterChange() {
  const n = placedCount();
  $('#status').textContent = t().place(n);
  $('#checkBtn').classList.toggle('ready', n === 16);
  const all = allPlaced();
  $('#howto').textContent = all ? tx('howtoHold') : t().howto;
  $('#howto').classList.toggle('glow', all);
  if (all && !wasAll) document.querySelector('.stage')!.classList.add('all');
  if (!all) { document.querySelector('.stage')!.classList.remove('all'); void closeInfo(); }
  wasAll = all;
}

/* ---------- controls ---------- */
document.querySelectorAll<HTMLButtonElement>('.seg button').forEach(b => b.addEventListener('click', () => {
  state.mode = b.dataset.mode as Mode;
  document.querySelectorAll('.seg button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
  $('.seg').style.setProperty('--x', b.dataset.mode === 'exact' ? '0' : '1');
  $('#sub').textContent = t().sub[state.mode];
  closePicker(false); clearMarks(); Sound.init(); Sound.tick(centerX(b));
}));
$('#checkBtn').addEventListener('click', () => { Sound.init(); check(); });
$('#hintBtn').addEventListener('click', () => { Sound.init(); hint(afterChange); });
$('#resetBtn').addEventListener('click', () => { Sound.init(); resetBoard(afterChange); });

const soundBtn = $<HTMLButtonElement>('#soundBtn');
function paintSound() {
  const L = t();
  soundBtn.dataset.on = String(Sound.on);
  soundBtn.setAttribute('aria-pressed', String(Sound.on));
  soundBtn.setAttribute('aria-label', Sound.on ? L.btn.soundOff : L.btn.soundOn);
  soundBtn.title = Sound.on ? L.btn.soundOff : L.btn.soundOn;
}
soundBtn.addEventListener('click', () => { Sound.toggle(); paintSound(); });

/* ---------- locale ---------- */
const langSel = $<HTMLSelectElement>('#langSel');
for (const [k, v] of Object.entries(LOCALES)) {
  const o = document.createElement('option');
  o.value = k; o.textContent = v.langName;
  langSel.append(o);
}
langSel.addEventListener('change', () => {
  setLocale(langSel.value);
  closePicker(false);
  applyLocale();
  Sound.init(); Sound.tick(centerX(langSel));
});

function applyLocale() {
  const L = t();
  document.documentElement.lang = locale();
  document.title = L.docTitle;
  $('#h1').innerHTML = L.h1;
  $('#sub').textContent = L.sub[state.mode];
  langSel.value = locale();
  $('.seg').setAttribute('aria-label', L.mode.label);
  const segs = document.querySelectorAll('.seg button');
  segs[0].textContent = L.mode.exact;
  segs[1].textContent = L.mode.opposites;
  $('#checkBtn').textContent = L.btn.check;
  $('#hintBtn').textContent = L.btn.hint;
  $('#resetBtn').textContent = L.btn.reset;
  $('#chant').textContent = L.bonds.join(' · ');
  paintSound();
  renderAll();
  renderBonds();
  renderGallery();
  refreshInfo();
  afterChange();
}

applyLocale();
renderBonds(true);
requestAnimationFrame(() => document.body.classList.add('ready'));
