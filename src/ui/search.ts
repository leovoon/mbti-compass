import { FN, FN_KEYS, TYPES, TYPE_ORDER, type FnId, type TypeId } from "../data";
import { fnArt } from "../art/functions";
import { typeArt } from "../art/types";
import { nameOf, t, tx } from "../i18n";
import { searchCopy } from "../i18n/search";
import { closePicker } from "./pickers";
import { showFn, showType } from "./info";

const icon =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/></svg>';
const isMac = /Mac|iPhone|iPad|iPod/i.test(navigator.platform);
const shortcutLabel = isMac ? "⌘ K" : "Ctrl K";
const root = document.createElement("div");
root.className = "search-root";
root.innerHTML = `<section class="search-panel" id="searchPanel" aria-labelledby="searchTitle" hidden>
  <header class="search-header"><h2 id="searchTitle"></h2><button type="button" class="search-close"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button></header>
  <label class="search-input-wrap">${icon}<span class="sr" id="searchLabel"></span><input type="search" id="compassSearch" aria-labelledby="searchLabel" aria-controls="searchResults" autocomplete="off" spellcheck="false" enterkeyhint="search"></label>
  <p class="search-status" role="status" aria-live="polite" aria-atomic="true"></p>
  <div class="search-results" id="searchResults"></div>
</section>
<div class="search-launcher">
  <kbd class="search-shortcut" aria-hidden="true">${shortcutLabel}</kbd>
  <button type="button" class="search-trigger" aria-keyshortcuts="${isMac ? "Meta+K" : "Control+K"}" aria-expanded="false" aria-controls="searchPanel">${icon}</button>
</div>`;
document.body.append(root);

const panel = root.querySelector<HTMLElement>(".search-panel")!;
const trigger = root.querySelector<HTMLButtonElement>(".search-trigger")!;
const close = root.querySelector<HTMLButtonElement>(".search-close")!;
const input = root.querySelector<HTMLInputElement>("input")!;
const results = root.querySelector<HTMLElement>(".search-results")!;
const status = root.querySelector<HTMLElement>(".search-status")!;
const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase()
    .trim();
const escape = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!,
  );
type Entry = { kind: "fn"; id: FnId } | { kind: "type"; id: TypeId };
const entries: Entry[] = [
  ...FN_KEYS.map((id) => ({ kind: "fn" as const, id })),
  ...TYPE_ORDER.map((id) => ({ kind: "type" as const, id })),
];

function score(entry: Entry, query: string) {
  const id = normalize(entry.id);
  if (id === query) return 0;
  const names =
    entry.kind === "fn"
      ? [
          nameOf(entry.id),
          FN[entry.id].n,
          FN[entry.id].full,
          t().fnInfo?.[entry.id]?.full ?? "",
          FN[entry.id].e,
        ]
      : [TYPES[entry.id].n];
  if (names.some((name) => normalize(name) === query)) return 1;
  if (id.startsWith(query) || names.some((name) => normalize(name).startsWith(query))) return 2;
  const text = normalize([entry.id, ...names].join(" "));
  return query.split(/\s+/).every((word) => text.includes(word)) ? 3 : Infinity;
}

function renderResults() {
  const L = searchCopy();
  const query = normalize(input.value);
  const matches = query
    ? entries
        .map((entry) => ({ entry, rank: score(entry, query) }))
        .filter(({ rank }) => Number.isFinite(rank))
        .sort((a, b) => a.rank - b.rank)
        .map(({ entry }) => entry)
    : entries;
  status.textContent = matches.length
    ? query
      ? `${matches.length} · ${L.suggestions}`
      : L.suggestions
    : L.empty;
  results.innerHTML = (["fn", "type"] as const)
    .map((kind) => {
      const group = matches.filter((entry) => entry.kind === kind);
      if (!group.length) return "";
      return `<section><h3>${escape(kind === "fn" ? L.functions : L.types)}</h3><ul>${group
        .map((entry) => {
          const fn = entry.kind === "fn" ? entry.id : TYPES[entry.id].dom;
          const name = entry.kind === "fn" ? nameOf(entry.id) : TYPES[entry.id].n;
          const detail =
            entry.kind === "fn"
              ? (t().fnInfo?.[entry.id]?.full ?? FN[entry.id].full)
              : `${TYPES[entry.id].dom} · ${TYPES[entry.id].aux}`;
          return `<li><button type="button" class="search-result" data-kind="${entry.kind}" data-id="${entry.id}" style="--c:${FN[fn].c}"><span class="search-art">${entry.kind === "fn" ? fnArt(entry.id) : typeArt(entry.id)}</span><span class="search-result-copy"><b>${entry.id} · ${escape(name)}</b><small>${escape(detail)}</small></span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg></button></li>`;
        })
        .join("")}</ul></section>`;
    })
    .join("");
}

export function refreshSearch() {
  const L = searchCopy();
  root.querySelector("#searchTitle")!.textContent = L.title;
  root.querySelector("#searchLabel")!.textContent = L.title;
  trigger.setAttribute("aria-label", L.title);
  trigger.title = `${L.title} (${shortcutLabel})`;
  close.setAttribute("aria-label", tx("close"));
  input.placeholder = L.placeholder;
  const active = document.activeElement as HTMLElement | null;
  const activeId = active?.dataset.id;
  const activeKind = active?.dataset.kind;
  // Keep the result nodes alive while an info card owns the return-focus target.
  if (!document.querySelector("#info[open]")) {
    renderResults();
    if (activeId && activeKind)
      results
        .querySelector<HTMLButtonElement>(`[data-kind="${activeKind}"][data-id="${activeId}"]`)
        ?.focus({ preventScroll: true });
  }
}

const SEARCH_HISTORY_KEY = "compassSearchOpen";
let historyClosing = false;
let reopenAfterBack = false;

function paintOpen(open: boolean, restoreFocus = true) {
  panel.hidden = !open;
  trigger.setAttribute("aria-expanded", String(open));
  if (open) {
    closePicker(false);
    renderResults();
    input.focus({ preventScroll: true });
  } else if (restoreFocus) trigger.focus({ preventScroll: true });
}

function setOpen(open: boolean, restoreFocus = true) {
  if (historyClosing) {
    reopenAfterBack = open;
    return;
  }
  if (open === !panel.hidden) return;
  if (open) {
    history.pushState({ ...history.state, [SEARCH_HISTORY_KEY]: true }, "");
  } else if (history.state?.[SEARCH_HISTORY_KEY]) {
    historyClosing = true;
    history.back();
  }
  paintOpen(open, restoreFocus);
}

window.addEventListener("popstate", () => {
  const open = history.state?.[SEARCH_HISTORY_KEY] === true;
  historyClosing = false;
  if (open !== !panel.hidden) paintOpen(open);
  if (reopenAfterBack) {
    reopenAfterBack = false;
    setOpen(true);
  }
});
// Restore a search entry reached by reload or browser session restoration.
if (history.state?.[SEARCH_HISTORY_KEY] === true) paintOpen(true);

trigger.addEventListener("click", () => setOpen(Boolean(panel.hidden)));
close.addEventListener("click", () => setOpen(false));
input.addEventListener("input", (event) => {
  if (!(event as InputEvent).isComposing) renderResults();
});
input.addEventListener("compositionend", renderResults);
results.addEventListener("click", (event) => {
  const button = (event.target as Element).closest<HTMLButtonElement>(".search-result");
  if (!button) return;
  if (button.dataset.kind === "fn") showFn(button.dataset.id as FnId, button);
  else showType(button.dataset.id as TypeId, button);
});
root.addEventListener("keydown", (event) => {
  if (event.isComposing) return;
  if (event.key === "Escape" && !panel.hidden) {
    event.preventDefault();
    event.stopPropagation();
    setOpen(false);
    return;
  }
  const buttons = [...results.querySelectorAll<HTMLButtonElement>(".search-result")];
  if (event.target === input && event.key === "Enter") {
    event.preventDefault();
    buttons[0]?.click();
  } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (event.target !== input && index < 0) return;
    event.preventDefault();
    if (index === 0 && event.key === "ArrowUp") input.focus();
    else
      buttons[
        index < 0
          ? event.key === "ArrowUp"
            ? buttons.length - 1
            : 0
          : Math.max(0, Math.min(buttons.length - 1, index + (event.key === "ArrowDown" ? 1 : -1)))
      ]?.focus();
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !panel.hidden && !document.querySelector("dialog[open]")) {
    event.preventDefault();
    setOpen(false);
    return;
  }
  if (!(event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey))) return;
  if (document.querySelector("dialog[open]") || document.body.classList.contains("touring")) return;
  event.preventDefault();
  setOpen(Boolean(panel.hidden));
});
document.addEventListener("pointerdown", (event) => {
  if (
    !panel.hidden &&
    !root.contains(event.target as Node) &&
    !document.querySelector("dialog[open]")
  ) {
    setOpen(false, panel.contains(document.activeElement));
  }
});
root.addEventListener("focusout", () => {
  queueMicrotask(() => {
    if (
      !panel.hidden &&
      !root.contains(document.activeElement) &&
      !document.querySelector("dialog[open]")
    ) {
      setOpen(false, false);
    }
  });
});
