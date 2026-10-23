import "@fontsource-variable/fraunces/soft.css";
import "../styles/tokens.css";
import "../styles/mascot.css";
import "./style.css";
import { FN, FN_KEYS, type FnId } from "../data";
import { fnArt } from "../art/functions";
import { LOCALES, locale, nameOf, setLocale } from "../i18n";
import { arenaCopy, ARENA_LOCALES } from "./copy";
import { mobileCopy } from "./mobile-copy";
import { ArenaAudio } from "./audio";
import { answer, createRun, launch, nextStage, profile, STEP, tick, type Run } from "./engine";
import { FIELD, length, type Vec } from "./physics";
import { draw, loadMascots, type View } from "./render";

let selected: FnId[] = ["Ni", "Se", "Fe"];
let run: Run | null = null;
let angle = -75,
  power = 80;
let pointer: number | null = null;
let dragOrigin: Vec | null = null;
let canvas: HTMLCanvasElement | null = null;
let context: CanvasRenderingContext2D | null = null;
let observer: ResizeObserver | null = null;
let tutorialStep = 0;
let last = 0,
  accumulator = 0;
const view: View = {
  aim: { x: 0, y: -100 },
  dragging: false,
  paused: false,
  reduced: matchMedia("(prefers-reduced-motion: reduce)").matches,
  armed: false,
  trail: [],
};
const $ = <T extends HTMLElement = HTMLElement>(selector: string) =>
  document.querySelector<T>(selector)!;
const escape = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
const text = (selector: string, value: string) => {
  const el = $(selector);
  if (el && el.textContent !== value) el.textContent = value;
};
function soundButton() {
  const m = mobileCopy();
  return `<button id="sound" aria-pressed="${ArenaAudio.on}">${ArenaAudio.on ? m.soundOn : m.soundOff}</button>`;
}
function shell(content: string) {
  cancelDrag();
  observer?.disconnect();
  canvas = null;
  context = null;
  const c = arenaCopy();
  document.documentElement.lang = ARENA_LOCALES[locale()] ? locale() : "en";
  document.title = `${c.title} · MBTI Compass`;
  document
    .querySelector('link[rel="canonical"]')
    ?.setAttribute("href", "https://mbti-compass.slower.workers.dev/arena");
  document.body.classList.toggle("in-battle", !!run);
  document.body.innerHTML = `<header class="arena-header"><a href="/">${c.back}</a><div>${soundButton()}<label><span class="sr">${c.language}</span><select id="language">${Object.entries(
    LOCALES,
  )
    .map(
      ([id, l]) =>
        `<option value="${id}" ${locale() === id ? "selected" : ""}>${l.langName}</option>`,
    )
    .join(
      "",
    )}</select></label></div></header><main class="arena-main">${content}</main><dialog id="game-dialog" aria-labelledby="dialog-title"></dialog>`;
  $("#sound").onclick = () => {
    ArenaAudio.toggle();
    $("#sound").setAttribute("aria-pressed", String(ArenaAudio.on));
    text("#sound", ArenaAudio.on ? mobileCopy().soundOn : mobileCopy().soundOff);
    ArenaAudio.play("select");
  };
  $<HTMLSelectElement>("#language").onchange = (e) => {
    setLocale((e.target as HTMLSelectElement).value);
    if (run) {
      battle();
      if (view.paused) openMenu();
    } else lobby();
  };
  const dialog = $<HTMLDialogElement>("#game-dialog");
  dialog.oncancel = (e) => {
    e.preventDefault();
    closeDialog();
  };
}
function lobby() {
  ArenaAudio.stop();
  run = null;
  view.paused = false;
  view.armed = false;
  view.trail = [];
  const c = arenaCopy(),
    m = mobileCopy();
  shell(
    `<section class="lobby"><div class="lobby-heading"><h1>${c.title}</h1><p>${c.intro}</p></div><div class="selection-heading"><h2>${c.select}</h2><span id="selection-count">${c.selected(selected.length)}</span></div><div class="roster">${FN_KEYS.map((id) => `<button class="recruit" data-fn="${id}" aria-pressed="${selected.includes(id)}" style="--fn:${FN[id].c}"><span class="recruit-art">${fnArt(id)}</span><span class="recruit-copy"><strong>${id} <span>${escape(nameOf(id))}</span></strong><span>${c.kits[id].passive}</span><small>${c.kits[id].strike}</small></span></button>`).join("")}</div><div class="lobby-footer"><button id="learn">${m.help}</button><button class="primary" id="start" ${selected.length !== 3 ? "disabled" : ""}>${c.start}</button></div><p class="disclaimer">${c.disclaimer}</p></section>`,
  );
  document.querySelectorAll<HTMLButtonElement>("[data-fn]").forEach((button) => {
    button.onclick = () => {
      ArenaAudio.unlock();
      ArenaAudio.play("select");
      const id = button.dataset.fn as FnId;
      if (selected.includes(id)) selected = selected.filter((f) => f !== id);
      else if (selected.length < 3) selected.push(id);
      document.querySelectorAll<HTMLButtonElement>("[data-fn]").forEach((b) => {
        b.setAttribute("aria-pressed", String(selected.includes(b.dataset.fn as FnId)));
        b.disabled = selected.length === 3 && !selected.includes(b.dataset.fn as FnId);
      });
      text("#selection-count", c.selected(selected.length));
      $<HTMLButtonElement>("#start").disabled = selected.length !== 3;
    };
    button.disabled = selected.length === 3 && !selected.includes(button.dataset.fn as FnId);
  });
  $("#learn").onclick = () => openTutorial();
  $("#start").onclick = () => {
    ArenaAudio.unlock();
    ArenaAudio.play("select");
    run = createRun(selected);
    angle = -75;
    power = 80;
    accumulator = 0;
    battle();
    let learned = false;
    try {
      learned = localStorage.getItem("arena-tutorial-v3") === "done";
    } catch {
      /* Show tutorial when storage is unavailable. */
    }
    if (!learned) openTutorial();
    else canvas?.focus({ preventScroll: true });
  };
}
function battle() {
  if (!run) return;
  const c = arenaCopy(),
    m = mobileCopy();
  shell(
    `<section class="battle-screen"><div class="battle-toolbar"><div><h1>${c.title}</h1><span>${c.stage} ${run.stage + 1}/4 · ${c.themes[run.stage]}</span></div><button id="menu">${m.menu}</button></div><div class="battle-hud"><label for="resolve">${c.resolve} <b id="resolve-value">100</b></label><meter id="resolve" min="0" max="100" value="100"></meter><span>${c.hits} <b id="hits">0</b></span><span>${c.bounces} <b id="bounces">0</b></span><span>${m.combo} <b id="combos">0</b></span></div><div class="field-region"><canvas id="field" tabindex="0" aria-label="${m.canvas}" aria-describedby="controls-help">${m.canvas}</canvas><div id="decision" class="decision-layer" hidden></div></div><footer class="battle-dock"><div id="team" class="team"></div><div class="shot-bar"><p id="status" role="status"></p><button id="strike" aria-pressed="false">${c.strike}</button></div><p id="controls-help" class="sr">${m.keyboard}</p><output id="aim-readout" class="sr" aria-live="polite"></output></footer></section>`,
  );
  $("#menu").onclick = openMenu;
  $("#strike").onclick = () => {
    if (!run || run.phase !== "aim" || view.paused || run.used.has(run.team[run.active])) return;
    ArenaAudio.unlock();
    view.armed = !view.armed;
    ArenaAudio.play("select", run.team[run.active]);
    sync();
  };
  canvas = $<HTMLCanvasElement>("#field");
  context = canvas.getContext("2d");
  if (!context) {
    $(".field-region").textContent = c.unavailable;
    return;
  }
  const resize = () => {
    if (!canvas || !context) return;
    cancelDrag();
    const region = $(".field-region");
    const scale = Math.min(region.clientWidth / FIELD.width, region.clientHeight / FIELD.height);
    const width = Math.max(1, Math.floor(FIELD.width * scale)),
      height = Math.max(1, Math.floor(FIELD.height * scale));
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(canvas.width / FIELD.width, 0, 0, canvas.height / FIELD.height, 0, 0);
    draw(context, run!, view);
  };
  observer = new ResizeObserver(resize);
  observer.observe($(".field-region"));
  resize();
  canvas.onpointerdown = (e) => {
    if (!run || run.phase !== "aim" || view.paused || pointer !== null || e.button !== 0) return;
    ArenaAudio.unlock();
    canvas!.focus({ preventScroll: true });
    canvas!.setPointerCapture(e.pointerId);
    pointer = e.pointerId;
    dragOrigin = point(e);
    view.dragging = true;
    view.aim = { x: 0, y: 0 };
  };
  canvas.onpointermove = (e) => {
    if (pointer !== e.pointerId || !dragOrigin || !run) return;
    const p = point(e);
    view.aim = { x: dragOrigin.x - p.x, y: dragOrigin.y - p.y };
    angle = (Math.atan2(view.aim.y, view.aim.x) * 180) / Math.PI;
    power = Math.min(100, length(view.aim) / 1.5);
    ArenaAudio.play("pull", run.team[run.active], power / 100);
  };
  canvas.onpointerup = (e) => {
    if (pointer !== e.pointerId) return;
    const valid = length(view.aim) >= 12;
    cancelDrag();
    if (valid) fire();
    else updateAim();
  };
  canvas.onpointercancel = () => {
    cancelDrag();
    updateAim();
  };
  canvas.onlostpointercapture = () => {
    if (pointer !== null) {
      cancelDrag();
      updateAim();
    }
  };
  canvas.onkeydown = (e) => {
    if (e.key === "Escape") {
      cancelDrag();
      updateAim();
      return;
    }
    if (run?.phase !== "aim" || view.paused) return;
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Enter", " "].includes(e.key)) return;
    e.preventDefault();
    ArenaAudio.unlock();
    if (e.key === "ArrowLeft") angle -= 3;
    if (e.key === "ArrowRight") angle += 3;
    if (e.key === "ArrowUp") power += 5;
    if (e.key === "ArrowDown") power -= 5;
    angle = ((angle + 540) % 360) - 180;
    power = Math.max(5, Math.min(100, power));
    updateAim();
    text("#aim-readout", `${c.angle} ${Math.round(angle)}°, ${c.power} ${Math.round(power)}%`);
    if (e.key === "Enter" || e.key === " ") fire();
  };
  updateAim();
  renderDecision();
  sync();
}
function point(e: PointerEvent): Vec {
  const rect = canvas!.getBoundingClientRect();
  return {
    x: ((e.clientX - rect.left) / rect.width) * FIELD.width,
    y: ((e.clientY - rect.top) / rect.height) * FIELD.height,
  };
}
function cancelDrag() {
  const old = pointer;
  pointer = null;
  dragOrigin = null;
  view.dragging = false;
  if (old !== null && canvas?.hasPointerCapture(old)) canvas.releasePointerCapture(old);
}
function updateAim() {
  view.aim = {
    x: Math.cos((angle * Math.PI) / 180) * power * 1.5,
    y: Math.sin((angle * Math.PI) / 180) * power * 1.5,
  };
}
function fire() {
  if (!run || view.paused) return;
  if (launch(run, view.aim, power / 100, view.armed)) {
    ArenaAudio.play(view.armed ? "strike" : "launch", run.team[run.active]);
    view.armed = false;
    view.trail = [];
    renderDecision();
    sync();
  }
}
function renderDecision(focus = false) {
  if (!run) return;
  const c = arenaCopy(),
    r = run;
  $("#team").innerHTML = r.team
    .map(
      (id, i) =>
        `<span class="teammate ${i === r.active ? "active" : ""}" style="--fn:${FN[id].c}" ${i === r.active ? 'aria-current="true"' : ""}>${fnArt(id)}<strong>${id}</strong><span>${r.used.has(id) ? c.spent : escape(nameOf(id))}</span></span>`,
    )
    .join("");
  const decision = $("#decision");
  decision.hidden = r.phase === "aim" || r.phase === "flight" || r.phase === "enemy";
  canvas?.setAttribute("tabindex", decision.hidden ? "0" : "-1");
  if (decision.hidden) {
    decision.innerHTML = "";
    return;
  }
  let html = "";
  if (r.phase === "choice") {
    const q = c.questions[r.answers.length];
    const m = mobileCopy();
    // Context only: what happened on the field is shown, never scored.
    const context = [
      r.lastConsulted.length ? `${m.consulted}: ${r.lastConsulted.join(" + ")}` : "",
      ...r.protections.map((p) => m.shielded(r.team[p.blocker], r.team[p.protected])),
      ...[...new Set(r.received.map((h) => h.ball))].map((ball) =>
        m.took(
          r.team[ball],
          r.received.filter((h) => h.ball === ball).reduce((s, h) => s + h.damage, 0),
        ),
      ),
    ].filter(Boolean);
    html = `<p class="decision-progress">${c.choice} · ${r.answers.length + 1}/8</p>${context.length ? `<p class="decision-context">${context.map(escape).join(" · ")}</p>` : ""}<h2 id="decision-title" tabindex="-1">${q.prompt}</h2><div class="answer-options">${q.options.map((option, i) => `<button data-answer="${i}">${option}</button>`).join("")}</div>`;
  } else if (r.phase === "clear") {
    html = `<h2 id="decision-title" tabindex="-1">${c.cleared}</h2><p>${c.recovery}</p><button id="next" class="primary">${c.next}</button>`;
  } else {
    html = `<h2 id="decision-title" tabindex="-1">${r.phase === "won" ? c.won : c.lost}</h2><p>${c.damage}: ${r.damage} · ${c.turn}: ${r.turns}</p><h3>${c.profile}: <strong class="result-code">${profile(r.answers).code}</strong></h3><p class="disclaimer">${c.disclaimer}</p><button id="again" class="primary">${c.again}</button>`;
  }
  decision.innerHTML = `<section class="decision-card" aria-labelledby="decision-title">${html}</section>`;
  document.querySelectorAll<HTMLButtonElement>("[data-answer]").forEach((button) => {
    button.onclick = () => {
      if (view.paused) return;
      ArenaAudio.unlock();
      ArenaAudio.play("choice");
      answer(r, Number(button.dataset.answer) as 0 | 1);
      renderDecision(true);
      sync();
      if (r.phase === "aim") canvas?.focus({ preventScroll: true });
    };
  });
  if ($("#next"))
    $("#next").onclick = () => {
      if (view.paused) return;
      ArenaAudio.unlock();
      ArenaAudio.play("select");
      nextStage(r);
      angle = -75;
      power = 80;
      battle();
      canvas?.focus({ preventScroll: true });
    };
  if ($("#again")) $("#again").onclick = lobby;
  if (focus) $("#decision-title")?.focus({ preventScroll: true });
}
function sync() {
  if (!run) return;
  const c = arenaCopy(),
    r = run,
    fn = r.team[r.active];
  text("#resolve-value", String(r.hp));
  $<HTMLMeterElement>("#resolve").value = r.hp;
  text("#hits", String(r.shot?.hits ?? r.lastHits));
  text("#bounces", String(r.shot?.bounces ?? r.lastBounces));
  text("#combos", String(r.shot?.comboCount ?? r.lastComboCount));
  text(
    "#status",
    r.phase === "aim"
      ? mobileCopy().drag
      : r.phase === "flight"
        ? c.flying
        : r.phase === "enemy"
          ? mobileCopy().enemyTurn
          : c.progress(r.answers.length),
  );
  const strike = $<HTMLButtonElement>("#strike");
  strike.disabled = r.phase !== "aim" || view.paused || r.used.has(fn);
  strike.setAttribute("aria-pressed", String(view.armed));
  text("#strike", r.used.has(fn) ? c.spent : view.armed ? c.armed : c.strike);
}
function showDialog(html: string) {
  ArenaAudio.unlock();
  ArenaAudio.stop();
  cancelDrag();
  view.paused = true;
  accumulator = 0;
  const dialog = $<HTMLDialogElement>("#game-dialog");
  dialog.innerHTML = html;
  if (!dialog.open) dialog.showModal();
  $("#dialog-title")?.focus({ preventScroll: true });
  sync();
}
function closeDialog() {
  $<HTMLDialogElement>("#game-dialog").close();
  view.paused = false;
  last = 0;
  accumulator = 0;
  updateAim();
  sync();
  if (run) {
    if (run.phase === "aim") canvas?.focus({ preventScroll: true });
    else $("#decision-title")?.focus({ preventScroll: true });
  }
}
function openMenu() {
  if (!run) return;
  const c = arenaCopy(),
    m = mobileCopy();
  showDialog(
    `<div class="dialog-top"><h2 id="dialog-title" tabindex="-1">${c.paused}</h2><button id="close-menu">${c.resume}</button></div><div class="menu-actions"><button id="tutorial">${m.help}</button><button id="restart">${c.restart}</button></div><p>${m.comboHelp}</p><p>${m.enemyHelp}</p><h3>${m.team}</h3>${run.team.map((id) => `<div class="kit-detail"><strong style="color:${FN[id].c}">${id} · ${escape(nameOf(id))}</strong><p>${c.kits[id].passive}<br>${c.kits[id].strike}</p></div>`).join("")}<h3>${c.profile}: ${profile(run.answers).code}</h3><p>${c.progress(run.answers.length)}</p><p class="disclaimer">${c.disclaimer}</p><p class="disclaimer">${m.keyboard}</p>`,
  );
  $("#close-menu").onclick = closeDialog;
  $("#tutorial").onclick = () => openTutorial();
  $("#restart").onclick = lobby;
}
function openTutorial(step = 0) {
  tutorialStep = step;
  const m = mobileCopy(),
    lesson = m.tutorial[step];
  const art =
    step === 0
      ? '<path d="M70 115 L110 35 M70 115 L40 165"/><path d="M96 42 L110 35 L111 51"/><circle class="tutorial-ball" cx="70" cy="115" r="18"/><circle class="tutorial-finger" cx="40" cy="165" r="10"/>'
      : step === 1
        ? '<path d="M35 160 L140 70 L80 25" stroke-dasharray="5 6"/><path d="M150 20 V170"/><circle class="tutorial-ball" cx="35" cy="160" r="16"/><circle cx="80" cy="25" r="13"/>'
        : '<circle class="tutorial-ball" cx="40" cy="65" r="18"/><circle cx="90" cy="65" r="18"/><circle cx="140" cy="65" r="18"/><rect x="25" y="110" width="130" height="25" rx="8"/><rect x="25" y="145" width="130" height="25" rx="8"/>';
  showDialog(
    `<section class="tutorial"><div class="tutorial-meta"><span>${step + 1} / 3</span><button id="skip">${m.skip}</button></div><svg class="tutorial-art" viewBox="0 0 180 190" aria-hidden="true">${art}</svg><h2 id="dialog-title" tabindex="-1">${lesson.title}</h2><p>${lesson.body}</p><button id="tutorial-next" class="primary">${step === 2 ? m.play : m.next}</button></section>`,
  );
  const finish = () => {
    try {
      localStorage.setItem("arena-tutorial-v3", "done");
    } catch {
      /* Tutorial remains replayable. */
    }
    closeDialog();
  };
  $("#skip").onclick = finish;
  $("#tutorial-next").onclick = () => {
    ArenaAudio.play("select");
    if (tutorialStep < 2) openTutorial(tutorialStep + 1);
    else finish();
  };
}
function frame(now: number) {
  const delta = last ? Math.min((now - last) / 1000, 0.05) : 0;
  last = now;
  if (run && context && !document.hidden) {
    const phase = run.phase;
    if (!view.paused) {
      accumulator += delta;
      while (accumulator >= STEP) {
        const shot = run.shot,
          hits = shot?.hits ?? 0,
          bounces = shot?.bounces ?? 0,
          combos = shot?.comboCount ?? 0,
          attacks = run.attackSerial,
          fn = run.team[run.active];
        tick(run);
        accumulator -= STEP;
        if (run.attackSerial > attacks) {
          const r = run,
            source = r.incoming[r.incoming.length - 1]?.plan.enemyId;
          ArenaAudio.play("attack", r.enemies.find((e) => e.id === source)?.fn ?? "Ni");
        }
        if (shot && shot.comboCount > combos)
          ArenaAudio.play("combo", shot.consulted[shot.consulted.length - 1]);
        if (shot && shot.hits > hits)
          ArenaAudio.play("hit", fn, shot.hits, (shot.position.x / FIELD.width) * 2 - 1);
        else if (shot && shot.bounces > bounces)
          ArenaAudio.play("bounce", fn, 0, (shot.position.x / FIELD.width) * 2 - 1);
      }
      if (run.shot) {
        view.trail.push({ ...run.shot.position });
        if (view.trail.length > 14) view.trail.shift();
      } else view.trail = [];
    }
    if (run.phase !== phase) {
      if (run.phase === "lost") ArenaAudio.play("lose");
      else if (run.pending === "won") ArenaAudio.play("win");
      else if (run.pending === "clear") ArenaAudio.play("clear");
      else if (run.phase !== "enemy") ArenaAudio.play("choice");
      view.armed = false;
      updateAim();
      renderDecision(true);
    }
    sync();
    draw(context, run, view);
  }
  requestAnimationFrame(frame);
}
document.addEventListener("visibilitychange", () => {
  last = 0;
  accumulator = 0;
  if (document.hidden) {
    ArenaAudio.stop();
    if (run && !$<HTMLDialogElement>("#game-dialog").open) openMenu();
  }
});
window.addEventListener("pagehide", () => ArenaAudio.stop());
void loadMascots();
lobby();
requestAnimationFrame(frame);
