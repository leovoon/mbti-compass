import "@fontsource-variable/fraunces/soft.css";
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/mascot.css";
import "./styles/board.css";
import "./styles/pickers.css";
import "./styles/info.css";
import "./styles/sections.css";
import "./styles/tour.css";
import "./styles/search.css";

import type { FnId, Kind } from "./data";
import { LOCALES, locale, setLocale, t, tx } from "./i18n";
import { exploreCopy } from "./i18n/explore";
import { allPlaced, assign, placedCount, state } from "./state";
import { Sound } from "./sound";
import { buildBoard, centerX, chipOf, renderAll, renderSlot, slots } from "./ui/board";
import { closePicker, isOpen, openPicker, setChooser } from "./ui/pickers";
import { check, clearMarks, hint, paintHowto, renderBonds, resetBoard } from "./ui/game";
import { refreshInfo, showFn } from "./ui/info";
import { renderGallery } from "./ui/gallery";
import { refreshSearch } from "./ui/search";
import { maybeStartTour, startTour, tourNotify } from "./ui/tour";

const $ = <T extends HTMLElement = HTMLElement>(s: string) => document.querySelector<T>(s)!;

/* ---------- sky ---------- */
const sky = $(".sky");
for (let i = 0; i < 110; i++) {
  const s = document.createElement("i");
  const z = Math.random() * 1.7 + 0.4;
  s.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 100}%;width:${z}px;height:${z}px;--o:${0.2 + Math.random() * 0.6};animation-delay:${Math.random() * 6}s`;
  sky.append(s);
}

/* ---------- board ---------- */
buildBoard({
  activate(kind, i) {
    Sound.init();
    if (isOpen(kind, i)) closePicker();
    else openPicker(kind, i);
  },
  hold(kind, i) {
    const id = state[kind][i];
    if (!id) return;
    getSelection()?.removeAllRanges(); // a long press may have started a text selection
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
  renderSlot(kind, i, clearing ? null : { from, scale: kind === "emoji" });
  // a swapped-out value travels to the slot it was displaced into
  if (moved !== null) renderSlot(kind, moved, oldHere ? { from: oldHere } : "pop");
  clearMarks();
  afterChange();
  if (!clearing) {
    Sound.place(
      i,
      kind,
      centerX(slots[i][kind]),
      state.emoji[i] === state.label[i] && !!state.emoji[i],
    );
    tourNotify(kind, i);
  }
});

let wasAll = false;
function afterChange() {
  const n = placedCount();
  $("#status").textContent = t().place(n);
  $("#checkBtn").classList.toggle("ready", n === 16);
  const all = allPlaced();
  paintHowto();
  if (all && !wasAll) document.querySelector(".stage")!.classList.add("all");
  if (!all) document.querySelector(".stage")!.classList.remove("all");
  wasAll = all;
}

/* ---------- controls ---------- */
$("#checkBtn").addEventListener("click", () => {
  Sound.init();
  check();
});
$("#hintBtn").addEventListener("click", () => {
  Sound.init();
  hint(afterChange);
});
$("#resetBtn").addEventListener("click", () => {
  Sound.init();
  resetBoard(afterChange);
});
$("#helpBtn").addEventListener("click", () => {
  Sound.init();
  Sound.tick(centerX($("#helpBtn")));
  startTour();
});

const soundBtn = $<HTMLButtonElement>("#soundBtn");
function paintSound() {
  const L = t();
  soundBtn.dataset.on = String(Sound.on);
  soundBtn.setAttribute("aria-pressed", String(Sound.on));
  soundBtn.setAttribute("aria-label", Sound.on ? L.btn.soundOff : L.btn.soundOn);
  soundBtn.title = Sound.on ? L.btn.soundOff : L.btn.soundOn;
}
soundBtn.addEventListener("click", () => {
  Sound.toggle();
  paintSound();
});

$("#exploreLink").addEventListener("click", () => {
  closePicker(false);
  $("#functionsTitle").focus({ preventScroll: true });
});

/* ---------- locale ---------- */
const langSel = $<HTMLSelectElement>("#langSel");
for (const [k, v] of Object.entries(LOCALES)) {
  const o = document.createElement("option");
  o.value = k;
  o.textContent = v.langName;
  langSel.append(o);
}
langSel.addEventListener("change", () => {
  setLocale(langSel.value);
  closePicker(false);
  applyLocale();
  Sound.init();
  Sound.tick(centerX(langSel));
});

function applyLocale() {
  const L = t();
  const E = exploreCopy();
  $("#languageLabel").textContent = E.language;
  langSel.title = `${E.language}: ${L.langName}`;
  $(".header-language").title = langSel.title;
  $("#exploreLink").textContent = E.explore;
  document.documentElement.lang = locale();
  document.title = L.docTitle;
  $("#h1").innerHTML = `MBTI ${L.h1}`;
  $("#tagline").textContent = tx("tagline");
  $("#sub").textContent = L.sub;
  langSel.value = locale();
  $("#checkBtn").textContent = L.btn.check;
  $("#hintBtn").textContent = L.btn.hint;
  $("#resetBtn").textContent = L.btn.reset;
  const help = tx("tour").help;
  $("#helpBtn").title = help;
  $("#helpBtn").setAttribute("aria-label", help);
  $("#chant").textContent = L.bonds.join(" · ");
  paintSound();
  renderAll();
  renderBonds();
  renderGallery();
  refreshSearch();
  refreshInfo();
  afterChange();
}

applyLocale();
renderBonds(true);
requestAnimationFrame(() => document.body.classList.add("ready"));
maybeStartTour();
