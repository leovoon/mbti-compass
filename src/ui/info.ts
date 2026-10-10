import { FN, TYPES, type FnId, type TypeId } from '../data';
import { fnArt } from '../art/functions';
import { typeArt } from '../art/types';
import { nameOf, tx } from '../i18n';
import { animate, spring, SETTLE } from '../motion';

const dlg = document.querySelector<HTMLDialogElement>('#info')!;
const body = dlg.querySelector<HTMLElement>('.info-body')!;
const closeBtn = dlg.querySelector<HTMLButtonElement>('.info-close')!;
let returnTo: HTMLElement | null = null;
let current: { kind: 'fn'; id: FnId } | { kind: 'type'; id: TypeId } | null = null;

const fnChip = (id: FnId, role: string) =>
  `<button type="button" class="link fn-link" data-fn="${id}" style="--c:${FN[id].c}">` +
  `<span class="mini">${fnArt(id)}</span><span><small>${role}</small><b>${id} · ${nameOf(id)}</b></span></button>`;
const typeChip = (id: TypeId) =>
  `<button type="button" class="link type-link" data-type="${id}" style="--c:${FN[TYPES[id].dom].c}">` +
  `<span class="mini">${typeArt(id)}</span><span><small>${id}</small><b>${TYPES[id].n}</b></span></button>`;

function fnHTML(id: FnId) {
  const F = FN[id];
  return `<div class="info-art" style="--c:${F.c}">${fnArt(id, 'big')}</div>` +
    `<h2 class="ih" id="infoTitle">${id} · ${nameOf(id)}<small>${F.full}</small></h2>` +
    `<div class="iw" style="--c:${F.c}">${F.w}</div>` +
    `<p class="id">${F.d}</p>` +
    `<h3 class="sub">${tx('leads')}</h3><div class="links">${F.t.map(typeChip).join('')}</div>`;
}
function typeHTML(id: TypeId) {
  const T = TYPES[id], c = FN[T.dom].c;
  const [lead, back] = tx('stack').split('·').map(s => s.trim());
  return `<div class="info-art" style="--c:${c}">${typeArt(id)}</div>` +
    `<h2 class="ih" id="infoTitle">${id}<small>${T.n}</small></h2>` +
    `<div class="stack"><i style="background:${c}"></i>${T.dom} <span>+</span> ${T.aux}<i style="background:${FN[T.aux].c}"></i></div>` +
    `<p class="id">${T.d}</p>` +
    `<div class="links">${fnChip(T.dom, lead ?? '')}${fnChip(T.aux, back ?? '')}</div>`;
}

function render() {
  if (!current) return;
  body.innerHTML = current.kind === 'fn' ? fnHTML(current.id) : typeHTML(current.id);
  closeBtn.textContent = tx('close');
}

function show(next: NonNullable<typeof current>, from?: HTMLElement | null) {
  const swapping = dlg.open;
  current = next;
  if (swapping) {
    // cross-link: slide the new card in place
    render();
    animate(body, [{ opacity: 0, transform: 'translateY(10px) scale(.98)' }, { opacity: 1, transform: 'none' }],
      { duration: 320, easing: SETTLE });
    return;
  }
  returnTo = from ?? (document.activeElement as HTMLElement | null);
  render();
  dlg.showModal();
  closeBtn.focus({ preventScroll: true });
  // grow out of whatever opened it
  const r = dlg.getBoundingClientRect(), o = from?.getBoundingClientRect();
  const dx = o ? o.left + o.width / 2 - (r.left + r.width / 2) : 0;
  const dy = o ? o.top + o.height / 2 - (r.top + r.height / 2) : 40;
  animate(dlg, [
    { transform: `translate(${dx}px,${dy}px) scale(.2)`, opacity: 0 },
    { opacity: 1, offset: .35 },
    { transform: 'none', opacity: 1 },
  ], { duration: 620, easing: spring() });
  const art = body.querySelector('.info-art .mascot');
  if (art) animate(art, [{ transform: 'scale(.6) rotate(-10deg)' }, { transform: 'none' }],
    { duration: 800, delay: 120, easing: spring(), fill: 'backwards' });
}

export const showFn = (id: FnId, from?: HTMLElement | null) => show({ kind: 'fn', id }, from);
export const showType = (id: TypeId, from?: HTMLElement | null) => show({ kind: 'type', id }, from);
export const refreshInfo = () => { if (dlg.open) render(); };

export async function closeInfo() {
  if (!dlg.open || dlg.dataset.closing) return;
  dlg.dataset.closing = '1';
  const a = animate(dlg, [{ transform: 'none', opacity: 1 }, { transform: 'translateY(14px) scale(.94)', opacity: 0 }],
    { duration: 180, easing: 'ease-in', fill: 'forwards' });
  dlg.classList.add('closing');
  try { await a?.finished; } catch { /* cancelled */ }
  delete dlg.dataset.closing;
  dlg.classList.remove('closing');
  dlg.close();
  a?.cancel();
  returnTo?.focus({ preventScroll: true });
}

closeBtn.addEventListener('click', () => void closeInfo());
dlg.addEventListener('cancel', e => { e.preventDefault(); void closeInfo(); });
// tap the backdrop (the dialog element itself, outside the card) to close
dlg.addEventListener('click', e => {
  if (e.target === dlg) { void closeInfo(); return; }
  const link = (e.target as Element).closest<HTMLElement>('.link');
  if (link?.dataset.fn) showFn(link.dataset.fn as FnId);
  else if (link?.dataset.type) showType(link.dataset.type as TypeId);
});
