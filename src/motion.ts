/* Motion helpers. Every effect is a no-op under prefers-reduced-motion. */

const mq = matchMedia('(prefers-reduced-motion: reduce)');
export const reduced = () => mq.matches;

const SPRING = 'linear(0,.009,.035 2.1%,.141 4.4%,.723 12.9%,.938 16.7%,1.017 19.4%,1.067,1.099 24.3%,1.108 26%,1.098 28.6%,1.017 34.6%,.991 38.4%,.983 42.6%,1.001 58.7%,1)';
const SPRING_FALLBACK = 'cubic-bezier(.34,1.56,.64,1)';
let springOk: boolean | null = null;
export function spring() {
  if (springOk === null) springOk = CSS.supports('transition-timing-function', SPRING);
  return springOk ? SPRING : SPRING_FALLBACK;
}
export const SETTLE = 'cubic-bezier(.16,1,.3,1)';

export function animate(el: Element, frames: Keyframe[], opts: KeyframeAnimationOptions) {
  if (reduced() || !el.animate) return null;
  return el.animate(frames, opts);
}

const centre = (r: DOMRect) => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 });

/** FLIP: make `el` (already in its final place) look like it flew in from `from` */
export function flyFrom(el: Element, from: DOMRect, { scale = true, delay = 0 } = {}) {
  const to = el.getBoundingClientRect();
  if (!to.width) return;
  const a = centre(from), b = centre(to);
  const s = scale ? Math.min(from.width / to.width, from.height / to.height) : 1;
  const dx = a.x - b.x, dy = a.y - b.y;
  // a slight arc: lift toward the outside of the travel, then land
  const lift = Math.min(40, Math.hypot(dx, dy) * .18);
  animate(el, [
    { transform: `translate(${dx}px,${dy}px) scale(${s})`, offset: 0 },
    { transform: `translate(${dx * .45}px,${dy * .45 - lift}px) scale(${(s + 1.12) / 2}) rotate(${dx > 0 ? -6 : 6}deg)`, offset: .45 },
    { transform: 'none', offset: 1 },
  ], { duration: 560, delay, easing: SETTLE, fill: 'backwards' });
}

/** a springy arrival for things that appear in place */
export function popIn(el: Element, delay = 0) {
  animate(el, [
    { transform: 'scale(.35) rotate(-14deg)', opacity: 0 },
    { transform: 'none', opacity: 1 },
  ], { duration: 620, delay, easing: spring(), fill: 'backwards' });
}

/** confetti of tiny stars in the given colours, from a point on `host` (% coords) */
export function burst(host: HTMLElement, xPct: number, yPct: number, colors: string[], n = 30) {
  if (reduced()) return;
  for (let i = 0; i < n; i++) {
    const sp = document.createElement('span');
    const a = Math.random() * Math.PI * 2, dist = 70 + Math.random() * 200;
    sp.className = 'spark';
    sp.style.cssText = `left:${xPct}%;top:${yPct}%;--c:${colors[i % colors.length]}`;
    host.append(sp);
    sp.animate([
      { transform: 'translate(-50%,-50%) scale(1) rotate(0)', opacity: 1 },
      { transform: `translate(calc(-50% + ${Math.cos(a) * dist}px),calc(-50% + ${Math.sin(a) * dist}px)) scale(.2) rotate(${Math.random() * 360}deg)`, opacity: 0 },
    ], { duration: 1100 + Math.random() * 500, delay: Math.random() * 280, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'both' })
      .finished.finally(() => sp.remove());
  }
}
