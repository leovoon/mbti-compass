import { FN, TYPES, type TypeId } from '../data';
import { face, rays, sparkle, svg } from './kit';

/* Sixteen type mascots. Body = leading function colour, accent = backing
 * function colour, so INFJ (Ni·Fe) is violet with a pink heart. */
const ART: Record<TypeId, () => string> = {
  // Ni·Fe — crescent moon with a small heart-star
  INFJ: () =>
    `<path class="m" d="M60 10 A40 40 0 0 0 60 90 A58 58 0 0 1 60 10 Z"/>` +
    `<path class="hl-line" d="M44 20 Q30 30 28 42"/>` +
    `<path class="a" d="M72 58 C62 50 60 42 64 37 C68 33 72 35 72 39 C72 35 76 33 80 37 C84 42 82 50 72 58 Z"/>` +
    sparkle(74, 20, 6) + sparkle(86, 74, 4) +
    face(32, 52, .72, 'calm'),

  // Ni·Te — telescope on a tripod
  INTJ: () =>
    `<path class="ln out" d="M48 60 L32 92 M52 60 L68 92 M50 60 V94"/>` +
    `<g transform="rotate(-24 50 46)"><rect class="m" x="14" y="34" width="62" height="24" rx="8"/>` +
    `<rect class="a" x="72" y="29" width="14" height="34" rx="5"/>` +
    `<rect class="s" x="8" y="38" width="10" height="16" rx="3"/>` +
    `<rect class="hl" x="22" y="38" width="40" height="4" rx="2"/></g>` +
    sparkle(84, 14, 6) +
    face(44, 50, .72),

  // Ti·Ne — puzzle cube
  INTP: () =>
    `<path class="a" d="M22 34 L38 18 H86 L70 34 Z"/>` +
    `<path class="s" d="M70 34 L86 18 V70 L70 86 Z"/>` +
    `<rect class="m" x="18" y="34" width="52" height="52" rx="5"/>` +
    `<path class="ln thin" d="M38 26 H78 M54 18 L46 34 M70 18 L62 34 M78 34 V82 M78 34 L78 34 M70 52 L86 38 M70 68 L86 54"/>` +
    face(44, 60, .9),

  // Ti·Se — wrench with a sunny grip band
  ISTP: () =>
    `<g transform="rotate(32 50 52)">` +
    `<path class="m" d="M41 90 L41 44.7 A19 19 0 0 1 44 10 L44 22 L56 22 L56 10 A19 19 0 0 1 59 44.7 L59 90 A9 9 0 0 1 41 90 Z"/>` +
    `<rect class="a" x="41" y="72" width="18" height="8"/>` +
    `<rect class="hl" x="44" y="46" width="3.5" height="22" rx="1.75"/>` +
    face(50, 56, .62, 'calm') + `</g>`,

  // Si·Fe — teapot with a heart on the lid
  ISFJ: () =>
    `<path class="ln out" d="M22 52 C6 50 6 76 26 72"/>` +
    `<path class="m" d="M74 56 L90 40 L92 48 L78 70 Z"/>` +
    `<ellipse class="m" cx="48" cy="62" rx="30" ry="25"/>` +
    `<path class="a" d="M30 42 Q48 26 66 42 Z"/>` +
    `<circle class="a" cx="48" cy="30" r="5"/>` +
    `<path class="s ns" d="M22 70 Q48 92 74 70 Q72 82 48 87 Q24 82 22 70 Z"/>` +
    `<path class="steam" d="M82 30 Q78 24 82 18 Q86 12 82 6"/>` +
    face(48, 60),

  // Si·Te — ledger book with a bookmark
  ISTJ: () =>
    `<path class="a" d="M60 10 V36 L66 30 L72 36 V10 Z"/>` +
    `<rect class="m" x="22" y="12" width="56" height="78" rx="6"/>` +
    `<rect class="s" x="22" y="12" width="12" height="78" rx="5"/>` +
    `<rect class="cr" x="44" y="24" width="26" height="12" rx="3"/>` +
    `<path class="ln thin" d="M49 30 H65"/>` +
    face(56, 62, .85, 'calm'),

  // Te·Ni — chess rook
  ENTJ: () =>
    `<path class="m" d="M32 14 H42 V24 H46 V14 H54 V24 H58 V14 H68 V38 L62 44 L66 78 H34 L38 44 L32 38 Z"/>` +
    `<rect class="a" x="24" y="76" width="52" height="14" rx="4"/>` +
    `<rect class="hl" x="40" y="48" width="4" height="22" rx="2"/>` +
    face(50, 56, .8),

  // Te·Si — alarm clock
  ESTJ: () =>
    `<path class="ln out" d="M30 80 L22 92 M70 80 L78 92"/>` +
    `<circle class="a" cx="26" cy="22" r="11"/><circle class="a" cx="74" cy="22" r="11"/>` +
    `<path class="ln out" d="M50 12 V20"/>` +
    `<circle class="m" cx="50" cy="54" r="34"/>` +
    `<circle class="cr" cx="50" cy="54" r="25"/>` +
    `<path class="ln thin" d="M50 31 V35 M73 54 H69 M50 77 V73 M27 54 H31"/>` +
    face(50, 56, .8),

  // Se·Fi — disco mirror ball
  ESFP: () =>
    `<path class="ln out" d="M50 2 V18"/>` +
    `<circle class="m" cx="50" cy="52" r="34"/>` +
    `<path class="grid" d="M18 42 H82 M16 56 H84 M20 70 H80 M50 18 V86 M34 22 Q26 52 34 82 M66 22 Q74 52 66 82"/>` +
    `<rect class="hl" x="30" y="30" width="10" height="9" rx="1.5"/>` +
    sparkle(86, 22, 7, 'a ns') + sparkle(12, 80, 5, 'a ns') + sparkle(14, 26, 4) +
    face(50, 58, .85, 'grin'),

  // Se·Ti — rocket with teal fins
  ESTP: () =>
    `<g class="exhaust"><path class="fl" d="M42 80 Q50 104 58 80 Z"/></g>` +
    `<path class="a" d="M36 52 L20 72 L22 82 L38 74 Z"/><path class="a" d="M64 52 L80 72 L78 82 L62 74 Z"/>` +
    `<path class="m" d="M50 6 C68 22 70 50 64 80 H36 C30 50 32 22 50 6 Z"/>` +
    `<circle class="cr" cx="50" cy="34" r="9"/><circle class="a ns" cx="50" cy="34" r="5" opacity=".6"/>` +
    face(50, 60, .75, 'grin'),

  // Fe·Ni — little sun
  ENFJ: () =>
    `<path class="a" d="${rays(50, 50, 30, 46, 12, 6)}"/>` +
    `<circle class="m" cx="50" cy="50" r="28"/>` +
    `<ellipse class="hl" cx="38" cy="38" rx="5" ry="7" transform="rotate(35 38 38)"/>` +
    face(50, 52),

  // Fe·Si — cupcake with a cherry
  ESFJ: () =>
    `<path class="a" d="M28 60 H72 L66 90 H34 Z"/>` +
    `<path class="ln thin" d="M40 62 L42 88 M50 62 V88 M60 62 L58 88"/>` +
    `<path class="m" d="M22 62 C14 52 24 42 32 44 C32 32 44 28 50 34 C56 28 68 32 68 44 C76 42 86 52 78 62 Z"/>` +
    `<path class="ln out" d="M52 22 Q56 14 62 12"/>` +
    `<circle class="cherry" cx="50" cy="26" r="7"/>` +
    face(50, 74, .7),

  // Ne·Fi — kite with a ribboned tail
  ENFP: () =>
    `<path class="ln out" d="M50 74 Q40 84 50 90 T48 100"/>` +
    `<path class="a" d="M44 82 L40 78 L40 86 Z M56 92 L60 88 L60 96 Z"/>` +
    `<path class="m" d="M50 6 L80 38 L50 74 L20 38 Z"/>` +
    `<path class="s ns" d="M50 6 L80 38 L50 38 Z M50 38 L50 74 L20 38 Z" opacity=".55"/>` +
    `<path class="ln thin" d="M50 6 V74 M20 38 H80"/>` +
    face(50, 40, .78, 'grin'),

  // Ne·Ti — light bulb
  ENTP: () =>
    `<path class="ray" d="M50 2 V8 M18 14 L23 19 M82 14 L77 19 M8 42 H14 M86 42 H92"/>` +
    `<path class="m" d="M38 64 C24 56 20 44 22 36 C26 20 38 12 50 12 C62 12 74 20 78 36 C80 44 76 56 62 64 Z"/>` +
    `<rect class="a" x="38" y="64" width="24" height="10" rx="2"/>` +
    `<rect class="a" x="40" y="74" width="20" height="9" rx="2"/>` +
    `<path class="s" d="M44 83 H56 L53 90 H47 Z"/>` +
    `<ellipse class="hl" cx="36" cy="30" rx="5" ry="8" transform="rotate(35 36 30)"/>` +
    face(50, 40, .9, 'grin'),

  // Fi·Ne — toadstool
  INFP: () =>
    `<path class="cr" d="M36 50 H64 L62 84 Q50 92 38 84 Z"/>` +
    `<path class="m" d="M12 54 C12 28 30 12 50 12 C70 12 88 28 88 54 Q50 62 12 54 Z"/>` +
    `<circle class="cr ns" cx="34" cy="32" r="6"/><circle class="cr ns" cx="60" cy="24" r="4.5"/><circle class="cr ns" cx="70" cy="42" r="5"/>` +
    sparkle(88, 76, 6, 'a ns') + sparkle(10, 78, 4, 'a ns') +
    face(50, 72, .75),

  // Fi·Se — tulip with a sunny leaf
  ISFP: () =>
    `<path class="stem" d="M50 66 V96"/>` +
    `<path class="a" d="M50 90 C36 90 28 80 30 70 C42 70 50 78 50 90 Z"/>` +
    `<path class="m" d="M28 26 L40 38 L50 18 L60 38 L72 26 C78 50 70 68 50 68 C30 68 22 50 28 26 Z"/>` +
    `<path class="s ns" d="M50 18 L60 38 L50 52 L40 38 Z" opacity=".5"/>` +
    face(50, 52, .78),
};

const cache = new Map<TypeId, string>();
export function typeArt(id: TypeId) {
  let s = cache.get(id);
  if (!s) {
    const T = TYPES[id];
    s = svg(ART[id](), { c: FN[T.dom].c, c2: FN[T.dom].c2, a: FN[T.aux].c }, `type-${id}`);
    cache.set(id, s);
  }
  return s;
}
