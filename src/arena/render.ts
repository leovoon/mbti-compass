import { FN, FN_KEYS, type FnId } from "../data";
import { fnArt } from "../art/functions";
import mascotCss from "../styles/mascot.css?inline";
import { KITS, type Run } from "./engine";
import { FIELD, trajectory, type Vec } from "./physics";
import { COMBOS, comboRays } from "./combos";

const images = new Map<FnId, HTMLImageElement>();
/** Shadows reuse each mascot's outline as a solid ink cut-out, so they read as the function's dark twin. */
const silhouettes = new Map<FnId, HTMLCanvasElement>();
function silhouette(fn: FnId) {
  const cached = silhouettes.get(fn);
  if (cached) return cached;
  const image = images.get(fn);
  if (!image) return null;
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d");
  if (!g) return null;
  g.drawImage(image, 14, 14, 100, 100);
  g.globalCompositeOperation = "source-in";
  g.fillStyle = "#07040f";
  g.fillRect(0, 0, 128, 128);
  silhouettes.set(fn, c);
  return c;
}
export async function loadMascots() {
  await Promise.all(
    FN_KEYS.map(async (id) => {
      const source = fnArt(id)
        .replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" ')
        .replace(">", `><style>:root{--ink:#1b1338;--cream:#fff3dc}${mascotCss}</style>`);
      const image = new Image();
      image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(source)}`;
      try {
        await image.decode();
        images.set(id, image);
      } catch {
        /* Function initials remain available. */
      }
    }),
  );
}
function disk(ctx: CanvasRenderingContext2D, p: Vec, r: number, color: string) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
  ctx.fill();
}
function mascot(ctx: CanvasRenderingContext2D, fn: FnId, p: Vec, size: number) {
  const image = images.get(fn);
  if (image) ctx.drawImage(image, p.x - size / 2, p.y - size / 2, size, size);
  else {
    ctx.fillStyle = FN[fn].c;
    ctx.font = "bold 20px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(fn, p.x, p.y + 6);
  }
}
export interface View {
  aim: Vec;
  dragging: boolean;
  paused: boolean;
  reduced: boolean;
  armed: boolean;
  trail: Vec[];
}
export function draw(ctx: CanvasRenderingContext2D, run: Run, view: View) {
  const { width, height } = FIELD;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#100c29";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "#282044";
  for (let i = 0; i < 42; i++) {
    const x = (i * 137 + 33) % width,
      y = (i * 83 + 41) % height;
    ctx.fillRect(x, y, 2, 2);
  }
  ctx.strokeStyle = "#51406b";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(18, 18, width - 36, height - 36, 10);
  ctx.stroke();
  ctx.strokeStyle = "#2c2449";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(240, 290, 136, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(240, 140);
  ctx.lineTo(240, 440);
  ctx.moveTo(90, 290);
  ctx.lineTo(390, 290);
  ctx.stroke();
  const now = view.reduced ? 0 : performance.now() / 1000;
  const live = run.enemies.filter((e) => e.hp > 0);
  // Telegraphs sit under everything: faint for later attacks, bright when they fire next.
  const firing =
    run.phase === "enemy" && run.enemyPhase && !run.enemyPhase.fired
      ? run.enemyPhase.queue[run.enemyPhase.index]
      : null;
  for (const enemy of live) {
    const plan = enemy.attack.plan;
    const imminent = enemy.attack.countdown <= 1 || firing?.enemyId === enemy.id;
    if (!imminent && run.phase !== "aim") continue;
    ctx.save();
    ctx.globalAlpha =
      firing?.enemyId === enemy.id ? 0.55 + 0.35 * Math.sin(now * 30) ** 2 : imminent ? 0.4 : 0.12;
    ctx.fillStyle = ctx.strokeStyle = "#ff5f7a";
    if (plan.kind === "beam") {
      ctx.lineWidth = plan.width * 2;
      ctx.setLineDash([10, 8]);
      ctx.beginPath();
      ctx.moveTo(plan.origin.x, plan.origin.y);
      ctx.lineTo(
        plan.origin.x + plan.direction.x * plan.range,
        plan.origin.y + plan.direction.y * plan.range,
      );
      ctx.stroke();
    } else if (plan.kind === "blast") {
      ctx.beginPath();
      ctx.arc(plan.target.x, plan.target.y, plan.radius, 0, Math.PI * 2);
      ctx.globalAlpha *= 0.6;
      ctx.fill();
    } else {
      ctx.globalAlpha *= 0.6;
      ctx.fillRect(18, plan.target.y - plan.width, width - 36, plan.width * 2);
      ctx.fillRect(plan.target.x - plan.width, 18, plan.width * 2, height - 36);
    }
    ctx.restore();
  }
  for (const enemy of live) {
    const bob = Math.sin(now * 1.6 + enemy.id) * 3;
    const p = { x: enemy.x, y: enemy.y + bob };
    const color = FN[enemy.fn].c;
    // Pooled shadow underneath
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.ellipse(
      enemy.x,
      enemy.y + enemy.radius * 0.95,
      enemy.radius * 0.9,
      enemy.radius * 0.22,
      0,
      0,
      Math.PI * 2,
    );
    ctx.fill();
    ctx.restore();
    // Ink silhouette with a coloured rim light
    const size = enemy.radius * 2.25;
    const cut = silhouette(enemy.fn);
    ctx.save();
    ctx.shadowColor = color;
    ctx.shadowBlur = enemy.boss ? 22 : 14;
    if (cut) ctx.drawImage(cut, p.x - size / 2, p.y - size / 2, size, size);
    else disk(ctx, p, enemy.radius, "#07040f");
    ctx.restore();
    // Glowing slanted eyes
    const eye = enemy.radius * 0.17,
      ex = enemy.radius * 0.3,
      ey = p.y - enemy.radius * 0.02;
    ctx.save();
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.ellipse(p.x + side * ex, ey, eye, eye * 0.55, side * 0.35, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    // Health as a ring around the shadow
    const ring = enemy.radius + 7;
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#2c2140";
    ctx.beginPath();
    ctx.arc(p.x, p.y, ring, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, ring, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * enemy.hp) / enemy.maxHp);
    ctx.stroke();
    // Countdown badge: turns until this shadow attacks
    const n = Math.max(1, enemy.attack.countdown);
    const bx = p.x + ring * 0.75,
      by = p.y - ring * 0.75;
    disk(ctx, { x: bx, y: by }, 12, n <= 1 ? "#ff5f7a" : "#241a3a");
    ctx.strokeStyle = n <= 1 ? "#fff3dc" : "#ff8fa3";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(bx, by, 12, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#fff3dc";
    ctx.font = "bold 13px system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(n), bx, by + 1);
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#e2d8ec";
    ctx.font = "11px system-ui";
    ctx.fillText(`${enemy.fn} · ${enemy.hp}`, p.x, p.y + ring + 15);
  }
  for (const hit of run.incoming) {
    const { plan } = hit;
    ctx.save();
    ctx.globalAlpha = Math.min(1, hit.life / 0.2);
    ctx.strokeStyle = ctx.fillStyle = "#ff5f7a";
    ctx.shadowColor = "#ff5f7a";
    ctx.shadowBlur = 16;
    if (plan.kind === "beam") {
      ctx.lineWidth = plan.width * 2;
      ctx.beginPath();
      ctx.moveTo(plan.origin.x, plan.origin.y);
      ctx.lineTo(hit.end.x, hit.end.y);
      ctx.stroke();
    } else if (plan.kind === "blast") {
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(plan.target.x, plan.target.y, plan.radius, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.fillRect(18, plan.target.y - plan.width, width - 36, plan.width * 2);
      ctx.fillRect(plan.target.x - plan.width, 18, plan.width * 2, height - 36);
    }
    ctx.restore();
  }
  for (const effect of run.effects) {
    const kit = COMBOS[effect.fn];
    ctx.save();
    ctx.globalAlpha = Math.min(1, effect.life / 0.2);
    ctx.strokeStyle = FN[effect.fn].c;
    ctx.lineWidth = kit.kind === "laser" ? kit.width * 2 : 4;
    if (kit.kind === "laser" || kit.kind === "spread") {
      for (const ray of comboRays(effect.fn, effect.direction)) {
        ctx.beginPath();
        ctx.moveTo(effect.origin.x, effect.origin.y);
        ctx.lineTo(effect.origin.x + ray.x * kit.range, effect.origin.y + ray.y * kit.range);
        ctx.stroke();
      }
    } else {
      const radius = view.reduced ? kit.range : kit.range * (1 - effect.life / 0.45);
      ctx.beginPath();
      ctx.arc(effect.origin.x, effect.origin.y, Math.max(1, radius), 0, Math.PI * 2);
      ctx.stroke();
      if (kit.heal) {
        ctx.font = "bold 18px system-ui";
        ctx.fillStyle = "#7fe6b4";
        ctx.textAlign = "center";
        ctx.fillText(
          `+${Math.floor(kit.heal * effect.scale)}`,
          effect.origin.x,
          effect.origin.y - 34,
        );
      }
    }
    ctx.restore();
  }
  const fn = run.team[run.active];
  if (run.phase === "aim" && !view.paused) {
    const path = trajectory(
      run.positions[run.active],
      view.aim,
      run.enemies.filter((e) => e.hp > 0),
      KITS[fn].preview,
    );
    ctx.save();
    ctx.strokeStyle = FN[fn].c;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 8]);
    ctx.globalAlpha = 0.85;
    ctx.beginPath();
    path.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
    ctx.stroke();
    ctx.restore();
    if (view.dragging) {
      const p = run.positions[run.active];
      ctx.strokeStyle = "#fff3dc";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - view.aim.x, p.y - view.aim.y);
      ctx.stroke();
      disk(ctx, { x: p.x - view.aim.x, y: p.y - view.aim.y }, 5, "#fff3dc");
    }
  }
  if (!view.reduced)
    view.trail.forEach((p, i) => {
      ctx.globalAlpha = (i / view.trail.length) * 0.3;
      disk(ctx, p, 8, FN[fn].c);
    });
  ctx.globalAlpha = 1;
  run.team.forEach((id, i) => {
    const p = i === run.active && run.shot ? run.shot.position : run.positions[i];
    const active = i === run.active && (run.phase === "aim" || run.phase === "flight");
    disk(ctx, p, 20, "#221a3c");
    if (active) {
      ctx.strokeStyle = view.armed ? "#fff3dc" : FN[id].c;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 25, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = FN[id].c;
      ctx.beginPath();
      ctx.moveTo(p.x - 5, p.y + 34);
      ctx.lineTo(p.x + 5, p.y + 34);
      ctx.lineTo(p.x, p.y + 28);
      ctx.fill();
    }
    if (!active) {
      const d = run.ports[i];
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(Math.atan2(d.y, d.x));
      ctx.fillStyle = FN[id].c;
      ctx.beginPath();
      ctx.moveTo(34, 0);
      ctx.lineTo(23, -6);
      ctx.lineTo(23, 6);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      ctx.strokeStyle = FN[id].c;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 24, 0, Math.PI * 2);
      ctx.stroke();
    }
    mascot(ctx, id, p, 37);
    ctx.fillStyle = "#f4efff";
    ctx.font = "bold 11px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(id, p.x, p.y + 47);
  });
  for (const pop of run.pops) {
    ctx.globalAlpha = Math.min(1, pop.life * 3);
    ctx.font = "bold 24px system-ui";
    ctx.textAlign = "center";
    ctx.strokeStyle = "#100c29";
    ctx.lineWidth = 4;
    ctx.strokeText(`${pop.value}`, pop.x, pop.y);
    ctx.fillStyle = pop.incoming ? "#ff8fa3" : "#fff3dc";
    ctx.fillText(pop.incoming ? `-${pop.value}` : `${pop.value}`, pop.x, pop.y);
  }
  ctx.globalAlpha = 1;
}
