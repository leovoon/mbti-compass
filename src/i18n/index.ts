import { LOCALES } from './locales';
import type { Locale } from './types';
import type { FnId } from '../data';

export { LOCALES };
export type { Locale };

const KEY = 'compass-locale';
let current = detect();

function detect(): string {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved && LOCALES[saved]) return saved;
  } catch { /* private mode */ }
  for (const raw of navigator.languages ?? [navigator.language]) {
    if (!raw) continue;
    const k = raw.toLowerCase();
    if (k.startsWith('zh')) return /tw|hk|mo|hant/.test(k) ? 'zh-TW' : 'zh-CN';
    if (k.startsWith('pt')) return 'pt-BR';
    const base = k.split('-')[0];
    if (LOCALES[base]) return base;
  }
  return 'en';
}

export const locale = () => current;
export const t = (): Locale => LOCALES[current];
/** English fallback for optional strings a locale hasn't translated yet */
export const tx = <K extends keyof Locale>(k: K): NonNullable<Locale[K]> =>
  (LOCALES[current][k] ?? LOCALES.en[k]) as NonNullable<Locale[K]>;
export const nameOf = (id: FnId) => t().fn[id];

export function setLocale(next: string) {
  current = LOCALES[next] ? next : 'en';
  try { localStorage.setItem(KEY, current); } catch { /* ignore */ }
}
