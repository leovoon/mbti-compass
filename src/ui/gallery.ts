import { FN, TYPE_ORDER, TYPES, type TypeId } from '../data';
import { typeArt } from '../art/types';
import { tx } from '../i18n';
import { showType } from './info';

const grid = document.querySelector<HTMLElement>('#types')!;

export function renderGallery() {
  const T = tx('types');
  document.querySelector('#typesTitle')!.textContent = T.title;
  document.querySelector('#typesSub')!.textContent = T.sub;
  grid.innerHTML = TYPE_ORDER.map((id, k) => {
    const ty = TYPES[id];
    return `<li style="--c:${FN[ty.dom].c};--a:${FN[ty.aux].c};--k:${k}">` +
      `<button type="button" class="type-card" data-type="${id}" aria-label="${id} ${ty.n}">` +
      `<span class="tc-art" style="--d:${(-k * .41).toFixed(2)}s">${typeArt(id)}</span>` +
      `<span class="tc-id">${id}</span><span class="tc-n">${ty.n}</span>` +
      `<span class="tc-stack"><i></i>${ty.dom}<i class="a"></i>${ty.aux}</span></button></li>`;
  }).join('');
}

grid.addEventListener('click', e => {
  const card = (e.target as Element).closest<HTMLElement>('.type-card');
  if (card) showType(card.dataset.type as TypeId, card.querySelector<HTMLElement>('.tc-art'));
});

/* cards rise in as the section scrolls into view */
const io = new IntersectionObserver(entries => {
  for (const en of entries) if (en.isIntersecting) { grid.classList.add('in'); io.disconnect(); }
}, { threshold: .15 });
io.observe(grid);
