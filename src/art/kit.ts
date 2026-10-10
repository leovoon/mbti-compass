/* Mascot art kit.
 *
 * Every mascot is a chunky object on a 100×100 grid, drawn in three inks:
 *   .m  body    — the leading function's colour   (--c)
 *   .s  shade   — a deeper step of the same hue   (--c2)
 *   .a  accent  — the backing function's colour   (--a)
 * plus cream (.cr) and a shared midnight outline. Faces are identical across
 * the whole set so the family reads as one cast. Styling lives in mascot.css. */

export interface Palette { c: string; c2: string; a?: string }

const f = (n: number) => +n.toFixed(2);

export function svg(inner: string, p: Palette, cls = '') {
  const a = p.a ?? p.c2;
  return `<svg class="mascot ${cls}" viewBox="0 0 100 100" aria-hidden="true" focusable="false" style="--c:${p.c};--c2:${p.c2};--a:${a}">${inner}</svg>`;
}

/** the shared face: dot eyes with a glint, blush, tiny smile */
export function face(x: number, y: number, s = 1, mood: 'smile' | 'calm' | 'grin' = 'smile') {
  const mouth = mood === 'grin'
    ? '<path class="mouth-o" d="M-4.5 5.5 Q0 12 4.5 5.5 Z"/>'
    : mood === 'calm'
      ? '<path class="ln mouth" d="M-3 7 L3 7"/>'
      : '<path class="ln mouth" d="M-4 6 Q0 10 4 6"/>';
  return `<g class="face" transform="translate(${x} ${y}) scale(${s})">` +
    `<circle class="blush" cx="-14" cy="6.5" r="4"/><circle class="blush" cx="14" cy="6.5" r="4"/>` +
    `<g class="eyes"><ellipse class="ink" cx="-8.5" cy="0" rx="3.1" ry="4"/><ellipse class="ink" cx="8.5" cy="0" rx="3.1" ry="4"/>` +
    `<circle class="glint" cx="-7.6" cy="-1.6" r="1.1"/><circle class="glint" cx="9.4" cy="-1.6" r="1.1"/></g>` +
    mouth + `</g>`;
}

/** four-point sparkle */
export function sparkle(cx: number, cy: number, r: number, cls = 'cr ns') {
  return `<path class="${cls} spark4" d="M${cx} ${cy - r} Q${cx} ${cy} ${cx + r} ${cy} Q${cx} ${cy} ${cx} ${cy + r} Q${cx} ${cy} ${cx - r} ${cy} Q${cx} ${cy} ${cx} ${cy - r} Z"/>`;
}

/** gear outline with trapezoid teeth */
export function gearPath(cx: number, cy: number, ro: number, ri: number, teeth: number) {
  const pts: string[] = [];
  const step = (Math.PI * 2) / teeth;
  for (let k = 0; k < teeth; k++) {
    const a = k * step - Math.PI / 2;
    const seq: [number, number][] = [
      [a - step * 0.5, ri], [a - step * 0.22, ri], [a - step * 0.14, ro], [a + step * 0.14, ro], [a + step * 0.22, ri],
    ];
    for (const [ang, r] of seq) pts.push(`${f(cx + r * Math.cos(ang))} ${f(cy + r * Math.sin(ang))}`);
  }
  return 'M' + pts.join(' L') + ' Z';
}

/** sun rays as rounded triangles */
export function rays(cx: number, cy: number, r1: number, r2: number, n: number, w: number) {
  let d = '';
  for (let k = 0; k < n; k++) {
    const a = (k / n) * Math.PI * 2 - Math.PI / 2;
    const ca = Math.cos(a), sa = Math.sin(a), px = -sa * w, py = ca * w;
    d += `M${f(cx + ca * r1 + px)} ${f(cy + sa * r1 + py)} L${f(cx + ca * r2)} ${f(cy + sa * r2)} L${f(cx + ca * r1 - px)} ${f(cy + sa * r1 - py)} Z `;
  }
  return d.trim();
}
