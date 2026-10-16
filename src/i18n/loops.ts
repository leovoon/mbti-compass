import { locale } from "./index";

interface LoopCopy {
  label: string;
  about: string;
  note: string;
  pattern: string;
  balance: string;
  response: string;
}

const COPY: Record<string, LoopCopy> = {
  en: {
    label: "Loop",
    about: "About loop theory",
    note: "Dominant–tertiary loops are a personality-type interpretation, not an established clinical mechanism. Using these functions together is normal; the proposed problem is becoming inflexible and excluding other perspectives. This describes the main stack, even when you are viewing shadow functions.",
    pattern:
      "In this interpretation, {first} and {third} keep reinforcing each other while the balancing perspective of {aux} gets less attention.",
    balance: "Bring in {aux}",
    response:
      "Use the perspective below to find one thing your current interpretation may be missing. Try a small check before deciding; let the result change your view.",
  },
  "zh-TW": {
    label: "迴圈",
    about: "關於迴圈理論",
    note: "主導與第三功能的迴圈是人格類型的一種詮釋，不是已確立的臨床機制。同時使用這些功能很正常；這個說法關注的是思考變得僵化、排除其他觀點。即使正在看陰影功能，這裡談的仍是主要功能序列。",
    pattern: "在這種詮釋中，{first} 與 {third} 不斷強化彼此，卻較少留意 {aux} 帶來的平衡觀點。",
    balance: "帶入 {aux} 的觀點",
    response:
      "用下方的觀點找出目前解讀可能漏掉的一件事。決定前先做一個小確認，讓結果有機會改變你的看法。",
  },
  "zh-CN": {
    label: "循环",
    about: "关于循环理论",
    note: "主导与第三功能的循环是人格类型的一种诠释，不是已确立的临床机制。同时使用这些功能很正常；这个说法关注的是思考变得僵化、排除其他观点。即使正在看阴影功能，这里谈的仍是主要功能序列。",
    pattern: "在这种诠释中，{first} 与 {third} 不断强化彼此，却较少留意 {aux} 带来的平衡观点。",
    balance: "带入 {aux} 的观点",
    response:
      "用下方的观点找出目前解读可能漏掉的一件事。决定前先做一个小确认，让结果有机会改变你的看法。",
  },
  ja: {
    label: "ループ",
    about: "ループ理論について",
    note: "主機能と第三機能のループはタイプ論の解釈であり、確立された臨床的メカニズムではありません。両方を使うことは普通です。問題とされるのは柔軟性を失い、他の視点を排除することです。シャドウ機能を表示中も、ここでは主要機能を扱います。",
    pattern:
      "この解釈では、{first} と {third} が互いを強め、バランスを取る {aux} の視点に注意が向きにくくなります。",
    balance: "{aux} の視点を取り入れる",
    response:
      "下の視点から、今の解釈が見落としていることを一つ探してみましょう。決める前に小さく確かめ、結果に応じて考えを変えてみてください。",
  },
  ko: {
    label: "루프",
    about: "루프 이론 안내",
    note: "주기능과 3차 기능의 루프는 성격 유형의 한 해석이며 확립된 임상 기제가 아닙니다. 두 기능을 함께 쓰는 것은 정상입니다. 이 해석에서 문제 삼는 것은 경직되어 다른 관점을 배제하는 것입니다. 그림자 기능을 보고 있어도 여기서는 주요 기능을 다룹니다.",
    pattern:
      "이 해석에서는 {first}와 {third}가 서로를 강화하면서 균형을 잡아 주는 {aux}의 관점에 덜 주의를 기울입니다.",
    balance: "{aux}의 관점 더하기",
    response:
      "아래 관점으로 지금의 해석이 놓친 것 하나를 찾아보세요. 결정 전에 작게 확인하고 그 결과에 따라 생각을 바꿔 보세요.",
  },
  es: {
    label: "Bucle",
    about: "Sobre la teoría de los bucles",
    note: "Los bucles dominante–terciaria son una interpretación de tipos, no un mecanismo clínico establecido. Usar ambas funciones es normal; el problema propuesto es perder flexibilidad y excluir otras perspectivas. Esto se refiere a las funciones principales, incluso al ver las funciones sombra.",
    pattern:
      "Según esta interpretación, {first} y {third} se refuerzan mutuamente mientras la perspectiva equilibradora de {aux} recibe menos atención.",
    balance: "Incorpora {aux}",
    response:
      "Usa la perspectiva de abajo para encontrar algo que tu interpretación podría estar omitiendo. Haz una pequeña comprobación antes de decidir y permite que el resultado cambie tu opinión.",
  },
  fr: {
    label: "Boucle",
    about: "À propos de la théorie des boucles",
    note: "Les boucles dominante–tertiaire sont une interprétation typologique, pas un mécanisme clinique établi. Utiliser les deux fonctions est normal ; le problème proposé est la rigidité et l’exclusion d’autres perspectives. Il s’agit des fonctions principales, même lorsque les fonctions d’ombre sont affichées.",
    pattern:
      "Selon cette interprétation, {first} et {third} se renforcent mutuellement tandis que la perspective équilibrante de {aux} reçoit moins d’attention.",
    balance: "Faire une place à {aux}",
    response:
      "Utilisez la perspective ci-dessous pour repérer un élément que votre interprétation pourrait négliger. Faites une petite vérification avant de décider et laissez le résultat modifier votre avis.",
  },
  de: {
    label: "Schleife",
    about: "Über die Schleifentheorie",
    note: "Dominant-tertiäre Schleifen sind eine typologische Deutung, kein gesicherter klinischer Mechanismus. Beide Funktionen zu nutzen ist normal; gemeint ist eine Verengung, die andere Perspektiven ausschließt. Dies bezieht sich auf die Hauptfunktionen, auch wenn Schattenfunktionen angezeigt werden.",
    pattern:
      "In dieser Deutung verstärken sich {first} und {third} gegenseitig, während die ausgleichende Perspektive von {aux} weniger Aufmerksamkeit bekommt.",
    balance: "{aux} einbeziehen",
    response:
      "Nutze die folgende Perspektive, um etwas zu finden, das deine Deutung übersieht. Prüfe vor einer Entscheidung eine Kleinigkeit und lass das Ergebnis deine Sicht verändern.",
  },
  "pt-BR": {
    label: "Loop",
    about: "Sobre a teoria dos loops",
    note: "Loops dominante–terciária são uma interpretação de tipos, não um mecanismo clínico estabelecido. Usar as duas funções é normal; o problema proposto é perder flexibilidade e excluir outras perspectivas. Isso se refere às funções principais, mesmo ao visualizar as funções sombra.",
    pattern:
      "Nessa interpretação, {first} e {third} se reforçam enquanto a perspectiva de equilíbrio de {aux} recebe menos atenção.",
    balance: "Inclua {aux}",
    response:
      "Use a perspectiva abaixo para encontrar algo que sua interpretação pode estar deixando de lado. Faça uma pequena verificação antes de decidir e permita que o resultado mude sua visão.",
  },
};

export const loopCopy = (): LoopCopy => COPY[locale()] ?? COPY.en;
