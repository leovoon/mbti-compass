import { locale } from "./index";

const COPY: Record<string, [string, string, string, string, string, string]> = {
  en: [
    "Search functions & types",
    "Try INFJ, Ni, or Seer",
    "Suggestions",
    "No matches. Try a type code or function name.",
    "Functions",
    "Types",
  ],
  "zh-TW": [
    "搜尋功能與類型",
    "試試 INFJ、Ni 或先知",
    "推薦",
    "沒有符合的結果，試試類型代碼或功能名稱。",
    "功能",
    "類型",
  ],
  "zh-CN": [
    "搜索功能与类型",
    "试试 INFJ、Ni 或先知",
    "推荐",
    "没有匹配结果，试试类型代码或功能名称。",
    "功能",
    "类型",
  ],
  ja: [
    "機能とタイプを検索",
    "INFJ、Ni、機能名など",
    "候補",
    "一致する結果がありません。タイプコードや機能名を試してください。",
    "機能",
    "タイプ",
  ],
  ko: [
    "기능과 유형 검색",
    "INFJ, Ni, 기능 이름 검색",
    "추천",
    "결과가 없습니다. 유형 코드나 기능 이름을 입력하세요.",
    "기능",
    "유형",
  ],
  es: [
    "Buscar funciones y tipos",
    "Prueba INFJ, Ni o Seer",
    "Sugerencias",
    "Sin resultados. Prueba un código de tipo o nombre de función.",
    "Funciones",
    "Tipos",
  ],
  fr: [
    "Rechercher fonctions et types",
    "Essayez INFJ, Ni ou Seer",
    "Suggestions",
    "Aucun résultat. Essayez un code de type ou un nom de fonction.",
    "Fonctions",
    "Types",
  ],
  de: [
    "Funktionen und Typen suchen",
    "Zum Beispiel INFJ, Ni oder Seer",
    "Vorschläge",
    "Keine Treffer. Versuche einen Typcode oder Funktionsnamen.",
    "Funktionen",
    "Typen",
  ],
  "pt-BR": [
    "Buscar funções e tipos",
    "Tente INFJ, Ni ou Seer",
    "Sugestões",
    "Nenhum resultado. Tente um código de tipo ou nome de função.",
    "Funções",
    "Tipos",
  ],
};

export function searchCopy() {
  const [title, placeholder, suggestions, empty, functions, types] = COPY[locale()] ?? COPY.en;
  return { title, placeholder, suggestions, empty, functions, types };
}
