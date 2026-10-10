import './styles/tokens.css';
import './styles/mascot.css';
import { FN_KEYS, TYPE_ORDER, TYPES, FN } from './data';
import { fnArt } from './art/functions';
import { typeArt } from './art/types';

const cell = (art: string, a: string, b: string) =>
  `<figure><div class="art">${art}</div><figcaption><b>${a}</b> ${b}</figcaption></figure>`;

document.body.style.cssText = 'margin:0;background:var(--bg1);color:var(--text);font:14px system-ui;padding:24px';
document.head.insertAdjacentHTML('beforeend', `<style>
  #sheet{display:grid;grid-template-columns:repeat(8,1fr);gap:18px}
  figure{margin:0;text-align:center}
  .art{width:110px;height:110px;margin:0 auto;padding:8px;border-radius:24px;background:rgba(255,255,255,.04)}
  h2{grid-column:1/-1;margin:12px 0 0;font-weight:600}
  b{color:var(--gold)}
</style>`);
document.getElementById('sheet')!.innerHTML =
  '<h2>Functions</h2>' + FN_KEYS.map(id => cell(fnArt(id), id, FN[id].n)).join('') +
  '<h2>Types</h2>' + TYPE_ORDER.map(id => cell(typeArt(id), id, TYPES[id].n)).join('');
