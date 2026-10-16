import { FN, FN_KEYS, TYPE_ORDER, TYPES, type FnId, type TypeId } from "../data";
import { fnArt } from "../art/functions";
import { nameOf } from "../i18n";
import { exploreCopy } from "../i18n/explore";
import { typeArt } from "../art/types";
import { tx } from "../i18n";
import { showFn, showType } from "./info";

const grid = document.querySelector<HTMLElement>("#types")!;

export function renderGallery() {
  document.querySelector("#functionsTitle")!.textContent = exploreCopy().functions;
  document.querySelector("#functions")!.innerHTML = FN_KEYS.map(
    (id) =>
      `<li><button type="button" class="link" data-fn="${id}" style="--c:${FN[id].c}"><span class="mini">${fnArt(id)}</span><span><small>${id}</small><b>${nameOf(id)}</b></span></button></li>`,
  ).join("");
  const T = tx("types");
  document.querySelector("#typesTitle")!.textContent = T.title;
  document.querySelector("#typesSub")!.textContent = T.sub;
  grid.innerHTML = TYPE_ORDER.map((id, k) => {
    const ty = TYPES[id];
    return (
      `<li style="--c:${FN[ty.dom].c};--a:${FN[ty.aux].c};--k:${k}">` +
      `<button type="button" class="type-card" data-type="${id}" aria-label="${id} ${ty.n}">` +
      `<span class="tc-art" style="--d:${(-k * 0.41).toFixed(2)}s">${typeArt(id)}</span>` +
      `<span class="tc-id">${id}</span><span class="tc-n">${ty.n}</span>` +
      `<span class="tc-stack"><i></i>${ty.dom}<i class="a"></i>${ty.aux}</span></button></li>`
    );
  }).join("");
}

grid.addEventListener("click", (e) => {
  const card = (e.target as Element).closest<HTMLElement>(".type-card");
  if (card) showType(card.dataset.type as TypeId, card);
});

document.querySelector("#functions")!.addEventListener("click", (event) => {
  const button = (event.target as Element).closest<HTMLButtonElement>("button[data-fn]");
  if (button) showFn(button.dataset.fn as FnId, button);
});

/* cards rise in as the section scrolls into view */
const io = new IntersectionObserver(
  (entries) => {
    for (const en of entries)
      if (en.isIntersecting) {
        grid.classList.add("in");
        io.disconnect();
      }
  },
  { threshold: 0.15 },
);
io.observe(grid);
