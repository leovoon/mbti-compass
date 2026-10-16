/* First-visit tour: six coach marks anchored to the real UI.
 *
 * Learn by doing: steps 2 and 3 wait for the player to actually place a mascot
 * and a name (or press Next). A spotlight glides from target to target; the
 * page stays live underneath, so pickers open above the dim as usual.
 * Shown once (localStorage), replayable from the "?" button. */
import { tx } from "../i18n";
import { exploreCopy } from "../i18n/explore";
import { state } from "../state";
import { animate, spring } from "../motion";
import { slots } from "./board";
import { closePicker } from "./pickers";

const KEY = "compass-tour-done";
type Step = { target: () => Element | null; wait?: "emoji" | "label"; pad?: number };

/** the first slot index that still needs a value, so step 2 and 3 point at real work */
let focusIdx = 0;
const firstEmpty = () => {
  const i = state.emoji.findIndex((v) => !v);
  return i === -1 ? 0 : i;
};

const STEPS: Step[] = [
  { target: () => null }, // welcome
  { target: () => slots[focusIdx].emoji, wait: "emoji", pad: 10 }, // pick a mascot
  { target: () => slots[focusIdx].label, wait: "label", pad: 8 }, // name it
  { target: () => document.querySelector(".board"), pad: -24 }, // the goal
  { target: () => document.querySelector(".actions"), pad: 8 }, // check / hint
  { target: () => document.querySelector(".slot.known, .slot.filled, .slot.emoji"), pad: 10 }, // hold to meet
];

let root: HTMLElement | null = null,
  hole: HTMLElement,
  card: HTMLElement;
let at = -1;
let onScroll: (() => void) | null = null;

export const tourDone = () => {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return true;
  }
};
const markDone = () => {
  try {
    localStorage.setItem(KEY, "1");
  } catch {
    /* ignore */
  }
};
export const tourActive = () => at >= 0;

function build() {
  root = document.createElement("div");
  root.className = "tour";
  root.innerHTML = `<div class="tour-hole"></div><div class="tour-card" role="dialog" aria-live="polite" aria-labelledby="tourTitle"></div>`;
  document.body.append(root);
  hole = root.querySelector(".tour-hole")!;
  card = root.querySelector(".tour-card")!;
  card.addEventListener("click", (e) => {
    const b = (e.target as Element).closest<HTMLButtonElement>("button");
    if (!b) return;
    if (b.dataset.act === "next") go(at + 1);
    else if (b.dataset.act === "back") go(at - 1);
    else end();
  });
}

export function startTour() {
  closePicker(false);
  if (!root) build();
  focusIdx = firstEmpty();
  root!.classList.add("on");
  document.body.classList.add("touring");
  onScroll = () => place(false);
  addEventListener("resize", onScroll);
  addEventListener("scroll", onScroll, { passive: true });
  go(0);
}

function end() {
  if (!root || at < 0) return;
  at = -1;
  markDone();
  document.body.classList.remove("touring");
  if (onScroll) {
    removeEventListener("resize", onScroll);
    removeEventListener("scroll", onScroll);
  }
  const a = animate(root, [{ opacity: 1 }, { opacity: 0 }], { duration: 220, easing: "ease-out" });
  const done = () => root!.classList.remove("on");
  if (a) a.finished.then(done);
  else done();
  document.querySelectorAll(".tour-target").forEach((el) => el.classList.remove("tour-target"));
}

function go(n: number) {
  if (n >= STEPS.length) {
    end();
    return;
  }
  at = Math.max(0, n);
  const T = tx("tour"),
    s = T.steps[at],
    last = at === STEPS.length - 1;
  const dots = STEPS.map(
    (_, k) => `<i class="${k === at ? "on" : k < at ? "past" : ""}"></i>`,
  ).join("");
  card.innerHTML =
    `<div class="tour-top"><span class="tour-dots" aria-label="${T.of(at + 1, STEPS.length)}">${dots}</span>` +
    `${last ? "" : `<button type="button" class="tour-skip" data-act="skip">${T.skip}</button>`}</div>` +
    `<h3 id="tourTitle">${s.title}</h3><p>${at === 5 ? exploreCopy().hold : s.body}</p>` +
    `<div class="tour-nav">` +
    (at > 0 ? `<button type="button" class="btn" data-act="back">${T.back}</button>` : "") +
    `<button type="button" class="btn ${STEPS[at].wait ? "" : "primary"}" data-act="next">${at === 0 ? T.start : last ? T.done : T.next}</button></div>`;
  document.querySelectorAll(".tour-target").forEach((el) => el.classList.remove("tour-target"));
  const el = STEPS[at].target();
  if (el) {
    el.classList.add("tour-target");
    const r = el.getBoundingClientRect();
    if (r.top < 70 || r.bottom > innerHeight - 200)
      el.scrollIntoView({ block: "center", behavior: "smooth" });
  }
  place(true);
  card.querySelector<HTMLElement>('[data-act="next"]')?.focus({ preventScroll: true });
}

/** fit the spotlight to the target and park the card beside it (below if room, else above) */
function place(stepChanged: boolean) {
  if (at < 0) return;
  const el = STEPS[at].target(),
    pad = STEPS[at].pad ?? 8;
  const er = el?.getBoundingClientRect();
  const big = !!er && er.height > innerHeight * 0.55;
  // a big target (the whole board) keeps the card beside it when the screen is wide enough
  const side = er ? Math.max(innerWidth - er.right, er.left) - 28 : 0;
  const beside = big && side >= 250;
  const cw = beside ? Math.min(320, side) : Math.min(340, innerWidth - 24);
  card.style.width = cw + "px";
  const ch = card.offsetHeight;
  if (!el) {
    // welcome: the spotlight shrinks to nothing in the middle, the card sits centred
    Object.assign(hole.style, {
      left: innerWidth / 2 + "px",
      top: innerHeight / 2 + "px",
      width: "0px",
      height: "0px",
      borderRadius: "50%",
    });
    Object.assign(card.style, {
      left: (innerWidth - cw) / 2 + "px",
      top: Math.max(16, (innerHeight - ch) / 2) + "px",
    });
  } else {
    const r = el.getBoundingClientRect();
    const radius = getComputedStyle(el).borderRadius;
    Object.assign(hole.style, {
      left: r.left - pad + "px",
      top: r.top - pad + "px",
      width: r.width + pad * 2 + "px",
      height: r.height + pad * 2 + "px",
      borderRadius: radius === "0px" ? "22px" : `calc(${radius} + ${Math.max(0, pad)}px)`,
    });
    const below = r.bottom + pad + 14,
      above = r.top - pad - 14 - ch;
    let top = below + ch <= innerHeight - 12 ? below : above >= 12 ? above : innerHeight - ch - 12;
    let left = Math.min(Math.max(12, r.left + r.width / 2 - cw / 2), innerWidth - cw - 12);
    if (beside) {
      top = Math.min(Math.max(12, r.top + r.height / 2 - ch / 2), innerHeight - ch - 12);
      left = innerWidth - r.right >= r.left ? r.right + 14 : r.left - cw - 14;
    } else if (big) {
      // narrow screens: the bottom edge of the viewport, over the least important strip
      top = innerHeight - ch - 12;
    }
    Object.assign(card.style, { left: left + "px", top: Math.max(12, top) + "px" });
  }
  if (stepChanged)
    animate(
      card,
      [
        { opacity: 0, transform: "translateY(8px) scale(.97)" },
        { opacity: 1, transform: "none" },
      ],
      { duration: 420, easing: spring() },
    );
}

/** called by the board when the player places something; advances "do it" steps */
export function tourNotify(kind: "emoji" | "label", i: number) {
  if (at < 0) return;
  const w = STEPS[at].wait;
  if (w !== kind) return;
  if (kind === "emoji") focusIdx = i; // the name step points at the mascot they just placed
  setTimeout(() => {
    if (at >= 0 && STEPS[at].wait === kind) go(at + 1);
  }, 650);
}

// capture phase: read the picker state before the picker's own Esc handler closes it
document.addEventListener(
  "keydown",
  (e) => {
    if (at < 0 || e.key !== "Escape") return;
    if (
      document.querySelector("#veil.on") ||
      (document.querySelector("#info") as HTMLDialogElement).open
    )
      return;
    end();
  },
  true,
);

export function maybeStartTour() {
  if (tourDone()) return;
  setTimeout(() => {
    if (!tourDone() && at < 0) startTour();
  }, 900);
}
