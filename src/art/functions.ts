import { FN, type FnId } from '../data';
import { face, gearPath, sparkle, svg } from './kit';

/* The eight function mascots. Each one echoes the emoji the copy still
 * mentions (🔮 🧩 📜 ⚙️ 🏄 🤝 🎈 🕯️) so learned associations carry over. */
const ART: Record<FnId, () => string> = {
  // 🔮 crystal ball on a little stand
  Ni: () =>
    `<path class="s" d="M30 76 H70 L65 90 H35 Z"/>` +
    `<circle class="m" cx="50" cy="45" r="30"/>` +
    `<ellipse class="hl" cx="37" cy="31" rx="6" ry="9.5" transform="rotate(30 37 31)"/>` +
    sparkle(67, 28, 6) + sparkle(60, 19, 3) +
    face(50, 50),

  // 🧩 puzzle piece
  Ti: () =>
    `<path class="m" d="M22 32 H42 A9 9 0 1 1 58 32 H78 V48 A9 9 0 1 1 78 64 V86 H22 Z"/>` +
    `<rect class="hl" x="28" y="38" width="10" height="6" rx="3"/>` +
    face(50, 62),

  // 📜 scroll
  Si: () =>
    `<rect class="m" x="25" y="22" width="50" height="58"/>` +
    `<rect class="s" x="18" y="14" width="64" height="14" rx="7"/>` +
    `<rect class="s" x="18" y="74" width="64" height="14" rx="7"/>` +
    `<path class="ln thin" d="M34 38 H66 M34 66 H58"/>` +
    face(50, 52, .95, 'calm'),

  // ⚙️ gear
  Te: () =>
    `<path class="m" d="${gearPath(50, 50, 40, 31, 9)}"/>` +
    `<circle class="hl ring" cx="50" cy="50" r="24"/>` +
    face(50, 50),

  // 🏄 surfboard riding a wave
  Se: () =>
    `<g transform="rotate(28 50 46)"><ellipse class="m" cx="50" cy="46" rx="17" ry="38"/>` +
    `<path class="stripe" d="M50 9 V83"/>` +
    `<ellipse class="hl" cx="43" cy="26" rx="3" ry="8"/></g>` +
    `<path class="wave" d="M6 86 Q16 76 26 86 T46 86 T66 86 T86 86 T100 84"/>` +
    face(50, 48, .9, 'grin'),

  // 🤝 heart host with open arms
  Fe: () =>
    `<path class="ln out arm" d="M20 50 Q8 44 10 32"/><path class="ln out arm" d="M80 50 Q92 44 90 32"/>` +
    `<circle class="m" cx="10" cy="30" r="5"/><circle class="m" cx="90" cy="30" r="5"/>` +
    `<path class="m" d="M50 86 C22 68 12 50 20 36 C28 22 44 24 50 36 C56 24 72 22 80 36 C88 50 78 68 50 86 Z"/>` +
    `<ellipse class="hl" cx="31" cy="38" rx="5" ry="7" transform="rotate(-30 31 38)"/>` +
    face(50, 54),

  // 🎈 balloon
  Ne: () =>
    `<path class="ln out string" d="M50 76 Q42 84 50 90 Q56 94 50 99"/>` +
    `<path class="s" d="M45 74 H55 L50 80 Z"/>` +
    `<ellipse class="m" cx="50" cy="42" rx="27" ry="32"/>` +
    `<ellipse class="hl" cx="38" cy="28" rx="5" ry="9" transform="rotate(25 38 28)"/>` +
    face(50, 44, 1, 'grin'),

  // 🕯️ candle with a living flame
  Fi: () =>
    `<ellipse class="s" cx="50" cy="88" rx="26" ry="6"/>` +
    `<path class="m" d="M33 44 Q33 40 37 40 H63 Q67 40 67 44 V86 H33 Z"/>` +
    `<path class="cr ns" d="M38 40 H48 V50 Q43 54 38 50 Z" opacity=".55"/>` +
    `<path class="ln out" d="M50 40 V33"/>` +
    `<g class="flame"><path class="fl" d="M50 6 C59 18 61 25 57 31 C54 35 46 35 43 31 C39 25 41 18 50 6 Z"/>` +
    `<path class="fl2 ns" d="M50 18 C54 24 54 28 52 30 C51 31 49 31 48 30 C46 28 46 24 50 18 Z"/></g>` +
    face(50, 63, .9, 'calm'),
};

const cache = new Map<string, string>();
/** inline SVG for a function mascot */
export function fnArt(id: FnId, cls = '') {
  const k = id + '|' + cls;
  let s = cache.get(k);
  if (!s) { s = svg(ART[id](), { c: FN[id].c, c2: FN[id].c2 }, `fn-${id} ${cls}`); cache.set(k, s); }
  return s;
}
