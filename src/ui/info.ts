import { FN, TYPES, OTHER_ATTITUDE, functionStacks, type FnId, type TypeId } from "../data";
import { exploreCopy } from "../i18n/explore";
import { loopCopy } from "../i18n/loops";
import { fnArt } from "../art/functions";
import { typeArt } from "../art/types";
import { nameOf, t, tx } from "../i18n";
import { animate, spring, SETTLE } from "../motion";
import { setupTypeSlider, TYPE_VIEWS, type TypeView } from "./type-slider";

const dlg = document.querySelector<HTMLDialogElement>("#info")!;
const body = dlg.querySelector<HTMLElement>(".info-body")!;
const closeBtn = dlg.querySelector<HTMLButtonElement>(".info-close")!;
let returnTo: HTMLElement | null = null;
let flipped = false;
let typeView: TypeView = "typical";
let typeSlider: ReturnType<typeof setupTypeSlider> | null = null;
let flipAnimation: Animation | null = null;
const card = dlg.querySelector<HTMLElement>(".info-card")!;
const flipBtn = dlg.querySelector<HTMLButtonElement>(".info-flip")!;
let current: { kind: "fn"; id: FnId } | { kind: "type"; id: TypeId } | null = null;

const typeChip = (id: TypeId) =>
  `<button type="button" class="link type-link" data-type="${id}" style="--c:${FN[TYPES[id].dom].c}">` +
  `<span class="mini">${typeArt(id)}</span><span><small>${id}</small><b>${TYPES[id].n}</b></span></button>`;

function fnHTML(id: FnId) {
  const F = FN[id],
    I = t().fnInfo?.[id];
  const full = I?.full ?? F.full,
    w = I?.w ?? F.w,
    d = I?.d ?? F.d;
  return (
    `<div class="info-art" style="--c:${F.c}">${fnArt(id, "big")}</div>` +
    `<h2 class="ih" id="infoTitle">${id} · ${nameOf(id)}<small>${full}</small></h2>` +
    `<div class="iw" style="--c:${F.c}">${w}</div>` +
    `<p class="id">${d}</p>` +
    `<h3 class="sub">${tx("leads")}</h3><div class="links">${F.t.map(typeChip).join("")}</div>`
  );
}
const description = (id: FnId) => t().fnInfo?.[id]?.d ?? FN[id].d;

function attitudeHTML(id: FnId) {
  const L = exploreCopy();
  const other = OTHER_ATTITUDE[id];
  return `<div class="info-art" style="--c:${FN[other].c}">${fnArt(other, "big")}</div>
    <h2 class="ih" id="infoTitle">${id} / ${other}<small>${L.other} · ${other}</small></h2>
    <p class="info-note">${L.attitudeNote}</p>
    <dl class="attitude-comparison">${[id, other].map((fn) => `<div><dt style="color:${FN[fn].c}">${fn} · ${nameOf(fn)}</dt><dd>${description(fn)}</dd></div>`).join("")}</dl>`;
}

function stressHTML(id: TypeId) {
  const L = exploreCopy();
  return `<section class="stress" aria-label="${L.stress}">
    <details class="stress-disclaimer">
      <summary aria-label="${L.disclaimer}" title="${L.disclaimer}">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 11v6"/><circle class="info-dot" cx="12" cy="7.5" r="1"/></svg>
      </summary>
      <p class="info-note">${L.stressNote}</p>
    </details>
    ${[TYPES[id].dom, TYPES[id].aux]
      .map((fn) => {
        const [scene, notice, response] = L.reflections[fn];
        return `<section class="stress-pattern"><h3>${fn} · ${nameOf(fn)}</h3><p>${scene}</p><dl><dt>${L.notice}</dt><dd>${notice}</dd><dt>${L.response}</dt><dd>${response}</dd></dl></section>`;
      })
      .join("")}</section>`;
}

function loopHTML(id: TypeId) {
  const L = loopCopy();
  const [first, aux, third] = functionStacks(id).main;
  const pattern = L.pattern
    .replace("{first}", first)
    .replace("{third}", third)
    .replace("{aux}", aux);
  return `<section class="loop-overview" aria-label="${L.label}">
    <div class="loop-header"><h3>${first}–${third} · ${L.label}</h3>
      <details class="stress-disclaimer">
        <summary aria-label="${L.about}" title="${L.about}"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 11v6"/><circle class="info-dot" cx="12" cy="7.5" r="1"/></svg></summary>
        <p class="info-note">${L.note}</p>
      </details>
    </div>
    <p>${pattern}</p>
    <div class="loop-balance"><h4>${L.balance.replace("{aux}", aux)}</h4><p>${L.response}</p><p class="loop-perspective"><strong style="color:${FN[aux].c}">${aux} · ${nameOf(aux)}</strong><br>${description(aux)}</p></div>
  </section>`;
}

function stackHTML(id: TypeId) {
  const stacks = functionStacks(id);
  const functions = flipped ? stacks.shadow : stacks.main;
  return `<ul class="function-stack" role="list">${functions
    .map((fn) => {
      return `<li class="stack-row" style="--c:${FN[fn].c}">
      <div class="stack-content">
        <button type="button" class="stack-function link" data-fn="${fn}">
          <span class="mini">${fnArt(fn)}</span>
          <span class="stack-identity"><b>${fn}</b><span>${nameOf(fn)}</span></span>
          <svg class="stack-chevron" viewBox="0 0 20 20" aria-hidden="true"><path d="m7 4 6 6-6 6"/></svg>
        </button>
        <p class="stack-description">${description(fn)}</p>
      </div>
    </li>`;
    })
    .join("")}</ul>`;
}

function typeHTML(id: TypeId) {
  const T = TYPES[id];
  const L = exploreCopy();
  if (flipped) {
    return `<div class="type-info-layout"><div class="type-intro">
      <div class="info-art" style="--c:${FN[T.dom].c}">${typeArt(id, "shadow")}</div>
      <h2 class="ih" id="infoTitle">${id}<small>${T.n} · ${L.shadow}</small></h2>
      <p class="info-note">${L.shadowNote}</p>
      </div><section class="type-stack-panel" aria-label="${L.shadow}">${stackHTML(id)}</section></div>`;
  }
  return `<div class="type-info-layout"><div class="type-intro">
    <div class="info-art type-mood-art" data-view="${typeView}" style="--c:${FN[T.dom].c}">${TYPE_VIEWS.map((view) => `<span class="type-mood" data-mood="${view}" aria-hidden="true">${typeArt(id, "main", view)}</span>`).join("")}</div>
    <h2 class="ih" id="infoTitle">${id}<small>${T.n}</small></h2>
    <div class="type-view-switch" role="group" aria-labelledby="infoTitle">
      <button type="button" data-type-view="typical" aria-pressed="${typeView === "typical"}" aria-controls="typeOverview">${L.typical}</button>
      <button type="button" data-type-view="stress" aria-pressed="${typeView === "stress"}" aria-controls="typeOverview">${L.stress}</button>
      <button type="button" data-type-view="loop" aria-pressed="${typeView === "loop"}" aria-controls="typeOverview">${loopCopy().label}</button>
    </div>
    <div id="typeOverview" class="type-slider">${TYPE_VIEWS.map((view) => `<div class="type-slide" data-view="${view}" role="region" aria-label="${view === "typical" ? L.typical : view === "stress" ? L.stress : loopCopy().label}" aria-hidden="${view !== typeView}" ${view !== typeView ? "inert" : ""}><div class="type-slide-content">${view === "stress" ? stressHTML(id) : view === "loop" ? loopHTML(id) : `<p class="id">${t().typeInfo?.[id]?.d ?? T.d}</p>`}</div></div>`).join("")}</div>
    </div><section class="type-stack-panel" aria-labelledby="stackTitle">
    <h3 class="stack-heading" id="stackTitle">${L.main}</h3>
    ${stackHTML(id)}</section></div>`;
}

function render() {
  if (!current) return;
  typeSlider?.dispose();
  typeSlider = null;
  const L = exploreCopy();
  dlg.dataset.kind = current.kind;
  card.classList.toggle("is-shadow", current.kind === "type" && flipped);
  body.innerHTML =
    current.kind === "fn"
      ? flipped
        ? attitudeHTML(current.id)
        : fnHTML(current.id)
      : typeHTML(current.id);
  const destination = current.kind === "fn" ? OTHER_ATTITUDE[current.id] : L.shadow;
  flipBtn.textContent = flipped ? `${L.back} ${current.id}` : `${L.flip} ${destination}`;
  flipBtn.setAttribute("aria-pressed", String(flipped));
  closeBtn.textContent = tx("close");
  if (current.kind === "type" && !flipped) {
    typeSlider = setupTypeSlider(body, typeView, (view) => {
      typeView = view;
      body.querySelectorAll<HTMLButtonElement>("[data-type-view]").forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.typeView === view));
      });
      const art = body.querySelector<HTMLElement>(".type-mood-art");
      if (art) art.dataset.view = view;
    });
  }
}

body.addEventListener("click", (event) => {
  const button = (event.target as Element).closest<HTMLButtonElement>("[data-type-view]");
  const next = button?.dataset.typeView;
  if (
    current?.kind !== "type" ||
    dlg.dataset.closing ||
    (next !== "typical" && next !== "stress" && next !== "loop")
  )
    return;
  flipAnimation?.cancel();
  typeSlider?.select(next);
});

flipBtn.addEventListener("click", () => {
  if (dlg.dataset.closing) return;
  flipAnimation?.cancel();
  flipped = !flipped;
  render();
  card.scrollTop = 0;
  flipBtn.focus({ preventScroll: true });
  flipAnimation = animate(
    body,
    [
      { transform: `perspective(900px) rotateY(${flipped ? -85 : 85}deg)`, opacity: 0.25 },
      { transform: "perspective(900px) rotateY(0deg)", opacity: 1 },
    ],
    { duration: 320, easing: SETTLE },
  );
});

function show(next: NonNullable<typeof current>, from?: HTMLElement | null) {
  const swapping = dlg.open;
  flipAnimation?.cancel();
  flipped = false;
  typeView = "typical";
  current = next;
  card.scrollTop = 0;
  if (swapping) {
    // cross-link: slide the new card in place
    render();
    closeBtn.focus({ preventScroll: true });
    animate(
      body,
      [
        { opacity: 0, transform: "translateY(10px) scale(.98)" },
        { opacity: 1, transform: "none" },
      ],
      { duration: 320, easing: SETTLE },
    );
    return;
  }
  returnTo = from ?? (document.activeElement as HTMLElement | null);
  render();
  dlg.showModal();
  closeBtn.focus({ preventScroll: true });
  // grow out of whatever opened it
  const r = dlg.getBoundingClientRect(),
    o = from?.getBoundingClientRect();
  const dx = o ? o.left + o.width / 2 - (r.left + r.width / 2) : 0;
  const dy = o ? o.top + o.height / 2 - (r.top + r.height / 2) : 40;
  animate(
    dlg,
    [
      { transform: `translate(${dx}px,${dy}px) scale(.2)`, opacity: 0 },
      { opacity: 1, offset: 0.35 },
      { transform: "none", opacity: 1 },
    ],
    { duration: 620, easing: spring() },
  );
  const art = body.querySelector(".info-art .mascot");
  if (art)
    animate(art, [{ transform: "scale(.6) rotate(-10deg)" }, { transform: "none" }], {
      duration: 800,
      delay: 120,
      easing: spring(),
      fill: "backwards",
    });
}

export const showFn = (id: FnId, from?: HTMLElement | null) => show({ kind: "fn", id }, from);
export const showType = (id: TypeId, from?: HTMLElement | null) => show({ kind: "type", id }, from);
export const refreshInfo = () => {
  if (!dlg.open) return;
  const restoreFocus = body.contains(document.activeElement);
  render();
  if (restoreFocus) flipBtn.focus({ preventScroll: true });
};

export async function closeInfo() {
  if (!dlg.open || dlg.dataset.closing) return;
  dlg.dataset.closing = "1";
  flipAnimation?.cancel();
  const a = animate(
    dlg,
    [
      { transform: "none", opacity: 1 },
      { transform: "translateY(14px) scale(.94)", opacity: 0 },
    ],
    { duration: 180, easing: "ease-in", fill: "forwards" },
  );
  dlg.classList.add("closing");
  try {
    await a?.finished;
  } catch {
    /* cancelled */
  }
  delete dlg.dataset.closing;
  dlg.classList.remove("closing");
  typeSlider?.dispose();
  typeSlider = null;
  dlg.close();
  a?.cancel();
  returnTo?.focus({ preventScroll: true });
}

closeBtn.addEventListener("click", () => void closeInfo());
dlg.addEventListener("cancel", (e) => {
  e.preventDefault();
  void closeInfo();
});
// tap the backdrop (the dialog element itself, outside the card) to close
dlg.addEventListener("click", (e) => {
  if (e.target === dlg) {
    void closeInfo();
    return;
  }
  const link = (e.target as Element).closest<HTMLElement>(".link");
  if (link?.dataset.fn) showFn(link.dataset.fn as FnId);
  else if (link?.dataset.type) showType(link.dataset.type as TypeId);
});
