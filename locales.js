window.LOCALES = {
  en: {
    langName: "English",
    docTitle: "The Compass · MBTI 8 Cognitive Functions Quiz",
    h1: 'The <span>Compass</span>',
    sub: {
      exact: "Rebuild the compass as you saw it: 🔮 at the top, every soul facing its opposite across the centre.",
      opposites: "Any arrangement works, as long as each emoji has its own name and every line joins two true opposites."
    },
    mode: { label: "Mode", exact: "Exact picture", opposites: "Opposites only" },
    btn: { check: "Check", hint: "Hint", scatter: "Scatter again", soundOn: "Turn sound on", soundOff: "Mute sound" },
    fieldCap: "Drag, or tap a piece then tap a blank",
    place: n => `${n} / 16 placed`,
    bonds: ["Far & Near", "New & Known", "True & Together", "Works & Worth"],
    bondHint: "Join a line to reveal this bond",
    fn: { Ni: "Seer", Ti: "Architect", Si: "Keeper", Te: "General", Se: "Surfer", Fe: "Host", Ne: "Inventor", Fi: "Monk" },
    fnEmoji: n => `${n} emoji`,
    fnPair: (n, id) => `${n}, ${id}`,
    blankEmoji: i => `Emoji blank ${i}`,
    blankLabel: i => `Name blank ${i}`,
    result: {
      empty: "Place a few pieces on the compass first.",
      partial: (n, mode) => mode === 'exact'
        ? `<em>${n} of 8</em> souls are home. Green stays, rose moves.`
        : `<em>${n} of 8</em> souls are home. Find each one its opposite.`,
      win: (c, h) => `<em>All eight souls are home.</em> ✨ ${c} check${c > 1 ? 's' : ''}, ${h} hint${h === 1 ? '' : 's'}.`,
      hintNone: `<em>Nothing left to hint.</em> Press Check.`,
      hintOne: (e, n) => `Hint: <em>${e} ${n}</em> belongs there.`
    }
  },

  "zh-TW": {
    langName: "繁體中文",
    docTitle: "羅盤 · 八功能心理測驗",
    h1: '<span>羅盤</span>',
    sub: {
      exact: "照你看到的樣子重組羅盤：🔮 在上方，每個靈魂都與正對面的彼此相望。",
      opposites: "任何排列都可以，只要每個 emoji 配上自己的名字，且每條線都連上真正的對立。"
    },
    mode: { label: "模式", exact: "完整圖像", opposites: "只看對立" },
    btn: { check: "檢查", hint: "提示", scatter: "重新散落", soundOn: "開啟聲音", soundOff: "靜音" },
    fieldCap: "拖曳，或先點碎片再點空位",
    place: n => `已放置 ${n} / 16`,
    bonds: ["遠與近", "新與故", "真與合", "行與值"],
    bondHint: "連起一條線以揭曉這段羈絆",
    fn: { Ni: "先知", Ti: "建築師", Si: "守護者", Te: "將軍", Se: "衝浪者", Fe: "主人", Ne: "發明家", Fi: "隱士" },
    fnEmoji: n => `${n} emoji`,
    fnPair: (n, id) => `${n}，${id}`,
    blankEmoji: i => `表情空位 ${i}`,
    blankLabel: i => `名字空位 ${i}`,
    result: {
      empty: "先在羅盤上放幾個碎片吧。",
      partial: (n, mode) => mode === 'exact'
        ? `<em>8 個靈魂中 ${n} 個</em>已歸位。綠色留下，玫瑰色移動。`
        : `<em>8 個靈魂中 ${n} 個</em>已歸位。替每個人找到他的對立。`,
      win: (c, h) => `<em>八個靈魂都回家了。</em> ✨ 檢查 ${c} 次、提示 ${h} 次。`,
      hintNone: `<em>沒有可提示的了。</em>按檢查。`,
      hintOne: (e, n) => `提示：<em>${e} ${n}</em> 屬於那裡。`
    }
  },

  "zh-CN": {
    langName: "简体中文",
    docTitle: "指南针 · 八功能心理测试",
    h1: '<span>指南针</span>',
    sub: {
      exact: "照你看到的样子重组罗盘：🔮 在最上方，每个灵魂都与正对面的彼此相望。",
      opposites: "任何排列都可以，只要每个 emoji 配上自己的名字，且每条线都连上真正的对立。"
    },
    mode: { label: "模式", exact: "完整图案", opposites: "只看对立" },
    btn: { check: "检查", hint: "提示", scatter: "重新散落", soundOn: "开启声音", soundOff: "静音" },
    fieldCap: "拖拽，或先点碎片再点空位",
    place: n => `已放置 ${n} / 16`,
    bonds: ["远与近", "新与故", "真与合", "行与值"],
    bondHint: "连起一条线以揭晓这段羁绊",
    fn: { Ni: "先知", Ti: "架构师", Si: "守护者", Te: "将军", Se: "冲浪者", Fe: "主人", Ne: "发明家", Fi: "隐士" },
    fnEmoji: n => `${n} emoji`,
    fnPair: (n, id) => `${n}，${id}`,
    blankEmoji: i => `表情空位 ${i}`,
    blankLabel: i => `名字空位 ${i}`,
    result: {
      empty: "先在罗盘上放几个碎片吧。",
      partial: (n, mode) => mode === 'exact'
        ? `<em>8 个灵魂中有 ${n} 个</em>已归位。绿色留下，玫红色移动。`
        : `<em>8 个灵魂中有 ${n} 个</em>已归位。替每个人找到他的对立。`,
      win: (c, h) => `<em>八个灵魂都回家了。</em> ✨ 检查 ${c} 次、提示 ${h} 次。`,
      hintNone: `<em>没有可提示的了。</em>按检查。`,
      hintOne: (e, n) => `提示：<em>${e} ${n}</em> 属于那里。`
    }
  },

  ja: {
    langName: "日本語",
    docTitle: "コンパス · 8功能クイズ",
    h1: '<span>コンパス</span>',
    sub: {
      exact: "見たままにコンパスを組み直そう：🔮 は上に、各魂は真逆の相手と向き合う。",
      opposites: "どの並びでもいい。各絵文字に正しい名前がつき、線が真逆の二つを結んでいれば。"
    },
    mode: { label: "モード", exact: "そのまま", opposites: "逆だけ" },
    btn: { check: "判定", hint: "ヒント", scatter: "ばら撒く", soundOn: "音を出す", soundOff: "音を消す" },
    fieldCap: "ドラッグ、または駒をタップしてから空きマスをタップ",
    place: n => `${n} / 16 配置済み`,
    bonds: ["遠と近", "新と故", "真と和", "行と価値"],
    bondHint: "線をつなぐとこの絆が開く",
    fn: { Ni: "先見者", Ti: "建築家", Si: "守護者", Te: "将軍", Se: "波乗り", Fe: "世話役", Ne: "発明家", Fi: "隠者" },
    fnEmoji: n => `${n} emoji`,
    fnPair: (n, id) => `${n}、${id}`,
    blankEmoji: i => `絵文字の空き ${i}`,
    blankLabel: i => `名前の空き ${i}`,
    result: {
      empty: "まず数駒を置いてみよう。",
      partial: (n, mode) => mode === 'exact'
        ? `<em>8 体のうち ${n} 体</em>が帰還。緑はそのまま、バラ色は動かす。`
        : `<em>8 体のうち ${n} 体</em>が帰還。それぞれの真逆を見つけよう。`,
      win: (c, h) => `<em>8 つの魂が全て帰った。</em> ✨ 判定 ${c} 回、ヒント ${h} 回。`,
      hintNone: `<em>ヒントはもうない。</em>判定を押そう。`,
      hintOne: (e, n) => `ヒント：<em>${e} ${n}</em> はここに置く。`
    }
  },

  ko: {
    langName: "한국어",
    docTitle: "나침반 · 8기능 퀴즈",
    h1: '<span>나침반</span>',
    sub: {
      exact: "본 그대로 나침반을 다시 세우세요: 🔮 은 위에, 각 영혼은 정반대와 마주합니다.",
      opposites: "아무 배열이나 가능 — 각 이모지에 제 이름이 붙고, 모든 선이 진짜 반대를 잇기만 하면."
    },
    mode: { label: "모드", exact: "원본 그대로", opposites: "반대만" },
    btn: { check: "확인", hint: "힌트", scatter: "다시 흩어놓기", soundOn: "소리 켜기", soundOff: "소리 끄기" },
    fieldCap: "드래그하거나 조각을 탭한 뒤 빈 칸을 탭",
    place: n => `${n} / 16 배치됨`,
    bonds: ["먼과 가까움", "새로움과 익숙함", "참됨과 함께함", "일과 가치"],
    bondHint: "선을 잇면 이 유대가 열립니다",
    fn: { Ni: "선지자", Ti: "건축가", Si: "수호자", Te: "장군", Se: "서퍼", Fe: "진행자", Ne: "발명가", Fi: "수도사" },
    fnEmoji: n => `${n} emoji`,
    fnPair: (n, id) => `${n}, ${id}`,
    blankEmoji: i => `이모지 빈칸 ${i}`,
    blankLabel: i => `이름 빈칸 ${i}`,
    result: {
      empty: "먼저 조각 몇 개를 올려보세요.",
      partial: (n, mode) => mode === 'exact'
        ? `<em>8개 중 ${n}개</em>의 영혼이 자리에. 초록은 남고, 장밋빛은 이동.`
        : `<em>8개 중 ${n}개</em>의 영혼이 자리에. 각자 반대편을 찾아보세요.`,
      win: (c, h) => `<em>여덟 영혼이 모두 집에 돌아왔습니다.</em> ✨ 확인 ${c}회, 힌트 ${h}회.`,
      hintNone: `<em>남은 힌트가 없습니다.</em>확인을 누르세요.`,
      hintOne: (e, n) => `힌트: <em>${e} ${n}</em> 은 거기에 있어요.`
    }
  },

  es: {
    langName: "Español",
    docTitle: "La Brújula · Quiz de 8 funciones",
    h1: 'La <span>Brújula</span>',
    sub: {
      exact: "Reconstruye la brújula tal como la viste: 🔮 arriba, cada alma frente a su opuesto.",
      opposites: "Cualquier disposición sirve, mientras cada emoji tenga su nombre y cada línea una dos verdaderos opuestos."
    },
    mode: { label: "Modo", exact: "Imagen exacta", opposites: "Solo opuestos" },
    btn: { check: "Comprobar", hint: "Pista", scatter: "Dispersar otra vez", soundOn: "Activar sonido", soundOff: "Silenciar" },
    fieldCap: "Arrastra, o toca una pieza y luego un hueco",
    place: n => `${n} / 16 colocadas`,
    bonds: ["Lejos y Cerca", "Nuevo y Conocido", "Verdadero y Juntos", "Obra y Valor"],
    bondHint: "Une una línea para revelar este vínculo",
    fn: { Ni: "Vidente", Ti: "Arquitecto", Si: "Guardián", Te: "General", Se: "Surfista", Fe: "Anfitrión", Ne: "Inventor", Fi: "Monje" },
    fnEmoji: n => `emoji de ${n}`,
    fnPair: (n, id) => `${n}, ${id}`,
    blankEmoji: i => `Emoji vacío ${i}`,
    blankLabel: i => `Nombre vacío ${i}`,
    result: {
      empty: "Coloca algunas piezas en la brújula primero.",
      partial: (n, mode) => mode === 'exact'
        ? `<em>${n} de 8</em> almas están en casa. Verde se queda, rosa se mueve.`
        : `<em>${n} de 8</em> almas están en casa. Encuentra a cada uno su opuesto.`,
      win: (c, h) => `<em>Las ocho almas están en casa.</em> ✨ ${c} comprobación${c > 1 ? 'es' : ''}, ${h} pista${h === 1 ? '' : 's'}.`,
      hintNone: `<em>No queda nada que pistear.</em>Pulsa Comprobar.`,
      hintOne: (e, n) => `Pista: <em>${e} ${n}</em> va ahí.`
    }
  },

  fr: {
    langName: "Français",
    docTitle: "La Boussole · Quiz des 8 fonctions",
    h1: 'La <span>Boussole</span>',
    sub: {
      exact: "Reconstruis la boussole comme tu l'as vue : 🔮 en haut, chaque âme face à son opposé.",
      opposites: "Tout agencement convient, pourvu que chaque émoji ait son nom et que chaque ligne relie deux véritables opposés."
    },
    mode: { label: "Mode", exact: "Image exacte", opposites: "Opposés seulement" },
    btn: { check: "Vérifier", hint: "Indice", scatter: "Disperser à nouveau", soundOn: "Activer le son", soundOff: "Couper le son" },
    fieldCap: "Glisse, ou touche une pièce puis une case",
    place: n => `${n} / 16 placées`,
    bonds: ["Lointain et Proche", "Nouveau et Connu", "Vrai et Ensemble", "Œuvre et Valeur"],
    bondHint: "Relie une ligne pour révéler ce lien",
    fn: { Ni: "Visionnaire", Ti: "Architecte", Si: "Gardien", Te: "Général", Se: "Surfeur", Fe: "Hôte", Ne: "Inventeur", Fi: "Moine" },
    fnEmoji: n => `émoji ${n}`,
    fnPair: (n, id) => `${n}, ${id}`,
    blankEmoji: i => `Émoji vide ${i}`,
    blankLabel: i => `Nom vide ${i}`,
    result: {
      empty: "Pose d'abord quelques pièces sur la boussole.",
      partial: (n, mode) => mode === 'exact'
        ? `<em>${n} âmes sur 8</em> sont chez elles. Le vert reste, le rose bouge.`
        : `<em>${n} âmes sur 8</em> sont chez elles. Trouve à chacun son opposé.`,
      win: (c, h) => `<em>Les huit âmes sont chez elles.</em> ✨ ${c} vérification${c > 1 ? 's' : ''}, ${h} indice${h > 1 ? 's' : ''}.`,
      hintNone: `<em>Plus rien à indiquer.</em>Appuie sur Vérifier.`,
      hintOne: (e, n) => `Indice : <em>${e} ${n}</em> va là.`
    }
  },

  de: {
    langName: "Deutsch",
    docTitle: "Der Kompass · 8-Funktionen-Quiz",
    h1: 'Der <span>Kompass</span>',
    sub: {
      exact: "Baue den Kompass so wieder, wie du ihn gesehen hast: 🔮 oben, jede Seele ihrem Gegenüber gegenüber.",
      opposites: "Jede Anordnung geht, solange jedes Emoji seinen Namen hat und jede Linie zwei echte Gegensätze verbindet."
    },
    mode: { label: "Modus", exact: "Originalbild", opposites: "Nur Gegensätze" },
    btn: { check: "Prüfen", hint: "Tipp", scatter: "Neu verteilen", soundOn: "Ton an", soundOff: "Ton aus" },
    fieldCap: "Ziehen, oder Feld antippen dann eine Lücke",
    place: n => `${n} / 16 platziert`,
    bonds: ["Fern und Nah", "Neu und Bekannt", "Wahr und Gemeinsam", "Tat und Wert"],
    bondHint: "Verbinde eine Linie, um diese Bindung freizuschalten",
    fn: { Ni: "Seher", Ti: "Architekt", Si: "Hüter", Te: "General", Se: "Surfer", Fe: "Gastgeber", Ne: "Erfinder", Fi: "Mönch" },
    fnEmoji: n => `${n}-Emoji`,
    fnPair: (n, id) => `${n}, ${id}`,
    blankEmoji: i => `Emoji-Platz ${i}`,
    blankLabel: i => `Namen-Platz ${i}`,
    result: {
      empty: "Lege zuerst ein paar Teile auf den Kompass.",
      partial: (n, mode) => mode === 'exact'
        ? `<em>${n} von 8</em> Seelen sind zu Hause. Grün bleibt, Rosa wandert.`
        : `<em>${n} von 8</em> Seelen sind zu Hause. Finde jedem sein Gegenteil.`,
      win: (c, h) => `<em>Alle acht Seelen sind zu Hause.</em> ✨ ${c} Prüfung${c > 1 ? 'en' : ''}, ${h} Tipp${h > 1 ? 's' : ''}.`,
      hintNone: `<em>Kein Tipp mehr übrig.</em>Auf Prüfen drücken.`,
      hintOne: (e, n) => `Tipp: <em>${e} ${n}</em> gehört hierher.`
    }
  },

  "pt-BR": {
    langName: "Português (BR)",
    docTitle: "A Bússola · Quiz das 8 funções",
    h1: 'A <span>Bússola</span>',
    sub: {
      exact: "Reconstrua a bússola como você a viu: 🔮 no topo, cada alma frente ao seu oposto.",
      opposites: "Qualquer disposição serve, desde que cada emoji tenha seu nome e cada linha una dois verdadeiros opostos."
    },
    mode: { label: "Modo", exact: "Imagem exata", opposites: "Só opostos" },
    btn: { check: "Conferir", hint: "Dica", scatter: "Espalhar de novo", soundOn: "Ligar som", soundOff: "Silenciar" },
    fieldCap: "Arraste, ou toque uma peça e depois um espaço",
    place: n => `${n} / 16 posicionadas`,
    bonds: ["Longe e Perto", "Novo e Conhecido", "Verdade e Juntos", "Obra e Valor"],
    bondHint: "Una uma linha para revelar este vínculo",
    fn: { Ni: "Vidente", Ti: "Arquiteto", Si: "Guardião", Te: "General", Se: "Surfista", Fe: "Anfitrião", Ne: "Inventor", Fi: "Monge" },
    fnEmoji: n => `emoji de ${n}`,
    fnPair: (n, id) => `${n}, ${id}`,
    blankEmoji: i => `Emoji vazio ${i}`,
    blankLabel: i => `Nome vazio ${i}`,
    result: {
      empty: "Coloque algumas peças na bússola primeiro.",
      partial: (n, mode) => mode === 'exact'
        ? `<em>${n} de 8</em> almas estão em casa. Verde fica, rosa se move.`
        : `<em>${n} de 8</em> almas estão em casa. Encontre a cada um seu oposto.`,
      win: (c, h) => `<em>As oito almas estão em casa.</em> ✨ ${c} conferência${c > 1 ? 's' : ''}, ${h} dica${h > 1 ? 's' : ''}.`,
      hintNone: `<em>Nada mais para dica.</em>Aperte Conferir.`,
      hintOne: (e, n) => `Dica: <em>${e} ${n}</em> fica lá.`
    }
  }
};
