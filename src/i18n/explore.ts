import { locale } from "./index";
import type { FnId } from "../data";

export type Reflection = [scene: string, notice: string, response: string];
export interface ExploreCopy {
  settings: string;
  language: string;
  explore: string;
  functions: string;
  other: string;
  flip: string;
  back: string;
  main: string;
  shadow: string;
  shadowNote: string;
  attitudeNote: string;
  typical: string;
  stress: string;
  stressNote: string;
  disclaimer: string;
  notice: string;
  response: string;
  roles: [string, string, string, string];
  shadowRoles: [string, string, string, string];
  functionDetails: string;
  hold: string;
  reflections: Record<FnId, Reflection>;
}

export const EXPLORE: Record<string, ExploreCopy> = {
  en: {
    settings: "Settings",
    language: "Language",
    explore: "Explore functions & types",
    functions: "Meet the eight",
    other: "Other attitude",
    flip: "Flip to",
    back: "Back to",
    main: "Main stack",
    shadow: "Shadow stack",
    shadowNote:
      "One eight-function interpretation: each main function changes attitude. Shadow functions aren't inherently unhealthy. This model isn't settled psychology.",
    attitudeNote:
      "Same process, a different direction of attention. Compare the two perspectives below; this is different from the opposite pairs on the board.",
    shadowRoles: [
      "Dominant counterpart · Another attitude toward your usual starting point",
      "Auxiliary counterpart · Another attitude toward your supporting perspective",
      "Tertiary counterpart · Another attitude toward your third function",
      "Inferior counterpart · Another attitude toward your least familiar main function",
    ],
    functionDetails: "About this function",
    typical: "Typical",
    stress: "Under stress",
    disclaimer: "About these stress examples",
    stressNote:
      "Two reflection prompts inspired by this type's leading functions. These are illustrative situations, not predictions or diagnoses. Keep only what fits your experience.",
    notice: "Notice",
    response: "Try",
    roles: [
      "Dominant · your usual starting point",
      "Auxiliary · a supporting perspective",
      "Tertiary · another resource",
      "Inferior · a less familiar perspective",
    ],
    hold: "A correct pair keeps a gold border. Press and hold it to meet the function, or use Explore functions & types below the board.",
    reflections: {
      Ni: [
        "A short reply arrives, and you spend the evening convinced the relationship is ending.",
        "One interpretation starts feeling like a fact before you've checked it.",
        "Write down what actually happened, then ask one open question before drawing a conclusion.",
      ],
      Ne: [
        "A deadline is close, but each new possibility sends you rewriting the plan.",
        "More options are making it harder to finish even a small part.",
        "Park the new ideas and choose one small version to finish today.",
      ],
      Si: [
        "A last-minute change leaves you checking the old plan again and again.",
        "You're comparing everything with how it used to work, even when the situation has changed.",
        "Keep one familiar routine and try one small adjustment to the new situation.",
      ],
      Se: [
        "After a difficult day, you keep adding purchases or plans so you don't have to stop.",
        "Immediate relief is pushing aside tomorrow's needs.",
        "Pause before the next commitment. Check your energy, budget, and what your body needs.",
      ],
      Ti: [
        "After a disagreement, you spend hours perfecting your argument instead of replying.",
        "You're editing the explanation but avoiding the conversation.",
        "Send a simple question about what the other person meant; you can refine your view afterward.",
      ],
      Te: [
        "A shared project slips, so you take over every task and start correcting everyone.",
        "Getting it done is crowding out listening and realistic limits.",
        "Agree on one priority together, then hand back a task with a clear expectation.",
      ],
      Fi: [
        "Feedback on your work feels like a verdict on who you are, and you pull away.",
        "A specific criticism is becoming a judgment of your whole worth.",
        "Name the value that feels threatened, then ask which concrete part needs changing.",
      ],
      Fe: [
        "You say yes to another favor while privately wishing someone would notice you're exhausted.",
        "Keeping everyone comfortable is hiding your own limits.",
        "Name one need directly and offer only what you can give without resentment.",
      ],
    },
  },
  "zh-TW": {
    settings: "設定",
    language: "語言",
    explore: "探索功能與類型",
    functions: "認識八種功能",
    other: "另一種態度",
    flip: "翻面看",
    back: "回到",
    main: "主要功能序列",
    shadow: "陰影功能序列",
    shadowNote:
      "這是八功能模型的一種詮釋：將每個主要功能的內外向態度對調。陰影功能不等於不健康；這個模型也不是心理學定論。",
    attitudeNote: "同一種心理過程，注意力朝向不同。比較下方兩種觀點；這與羅盤上的對立配對不同。",
    shadowRoles: [
      "主導的對應功能 · 以另一種態度看待慣常的出發點",
      "輔助的對應功能 · 支持觀點的另一種態度",
      "第三的對應功能 · 第三功能的另一種態度",
      "劣勢的對應功能 · 最不熟悉的主要功能的另一種態度",
    ],
    functionDetails: "關於這個功能",
    typical: "平常狀態",
    stress: "壓力之下",
    disclaimer: "關於這些壓力情境",
    stressNote:
      "以下兩個自我觀察情境以這個類型的前兩個功能為靈感。它們是例子，不是預測或診斷；只留下符合你經驗的部分。",
    notice: "留意",
    response: "試試",
    roles: [
      "主導 · 慣常的出發點",
      "輔助 · 支持你的觀點",
      "第三 · 另一項資源",
      "劣勢 · 較不熟悉的觀點",
    ],
    hold: "答對的配對會保留金色邊框。長按即可認識功能，也可以使用羅盤下方的「探索功能與類型」。",
    reflections: {
      Ni: [
        "收到一則簡短回覆後，你整晚都認定這段關係快結束了。",
        "還沒確認，一種解讀就像成了事實。",
        "寫下實際發生的事，先問一個開放式問題再下結論。",
      ],
      Ne: [
        "期限快到了，每個新可能卻又讓你重寫計畫。",
        "選項越多，連一小部分都越難完成。",
        "先存下新點子，今天只完成一個小版本。",
      ],
      Si: [
        "臨時變動讓你一再回頭檢查舊計畫。",
        "情況已經改變，你仍用過去的做法衡量一切。",
        "保留一個熟悉的習慣，再為新情況做一個小調整。",
      ],
      Se: [
        "難熬的一天後，你不斷購物或加排行程，好讓自己不用停下來。",
        "眼前的舒緩開始擠掉明天的需要。",
        "答應下一件事前停一下，看看體力、預算和身體需要什麼。",
      ],
      Ti: [
        "爭執後，你花幾小時完善論點，卻一直沒回覆。",
        "你反覆修改解釋，卻避開了對話。",
        "先簡單問對方原本的意思，之後再整理自己的看法。",
      ],
      Te: [
        "合作進度落後，你接手所有工作，開始糾正每個人。",
        "趕快完成的念頭擠掉了傾聽與實際限制。",
        "一起確認一個優先事項，再把一項工作交回去並說清楚期待。",
      ],
      Fi: [
        "工作上的回饋像是在否定你整個人，於是你退縮了。",
        "具體的批評變成了對自身價值的判決。",
        "說出哪個價值讓你感到受威脅，再問清楚哪個具體部分需要調整。",
      ],
      Fe: [
        "明明累壞了，你仍答應幫忙，心裡希望有人能看出你的疲憊。",
        "照顧大家的感受，讓你的界線消失了。",
        "直接說出一個需要，只付出你不會因此心生怨懟的份量。",
      ],
    },
  },
  "zh-CN": {
    settings: "设置",
    language: "语言",
    explore: "探索功能与类型",
    functions: "认识八种功能",
    other: "另一种态度",
    flip: "翻面看",
    back: "回到",
    main: "主要功能序列",
    shadow: "阴影功能序列",
    shadowNote:
      "这是八功能模型的一种诠释：将每个主要功能的内外向态度对调。阴影功能不等于不健康；这个模型也不是心理学定论。",
    attitudeNote: "同一种心理过程，注意力朝向不同。比较下方两种观点；这与罗盘上的对立配对不同。",
    shadowRoles: [
      "主导的对应功能 · 以另一种态度看待惯常的出发点",
      "辅助的对应功能 · 支持观点的另一种态度",
      "第三的对应功能 · 第三功能的另一种态度",
      "劣势的对应功能 · 最不熟悉的主要功能的另一种态度",
    ],
    functionDetails: "关于这个功能",
    typical: "平常状态",
    stress: "压力之下",
    disclaimer: "关于这些压力情境",
    stressNote:
      "以下两个自我观察情境以这个类型的前两个功能为灵感。它们是例子，不是预测或诊断；只留下符合你经验的部分。",
    notice: "留意",
    response: "试试",
    roles: [
      "主导 · 惯常的出发点",
      "辅助 · 支持你的观点",
      "第三 · 另一项资源",
      "劣势 · 较不熟悉的观点",
    ],
    hold: "答对的配对会保留金色边框。长按即可认识功能，也可以使用罗盘下方的“探索功能与类型”。",
    reflections: {
      Ni: [
        "收到一则简短回复后，你整晚都认定这段关系快结束了。",
        "还没确认，一种解读就像成了事实。",
        "写下实际发生的事，先问一个开放式问题再下结论。",
      ],
      Ne: [
        "期限快到了，每个新可能却又让你重写计划。",
        "选项越多，连一小部分都越难完成。",
        "先存下新点子，今天只完成一个小版本。",
      ],
      Si: [
        "临时变动让你一再回头检查旧计划。",
        "情况已经改变，你仍用过去的做法衡量一切。",
        "保留一个熟悉的习惯，再为新情况做一个小调整。",
      ],
      Se: [
        "难熬的一天后，你不断购物或加排行程，好让自己不用停下来。",
        "眼前的舒缓开始挤掉明天的需要。",
        "答应下一件事前停一下，看看体力、预算和身体需要什么。",
      ],
      Ti: [
        "争执后，你花几小时完善论点，却一直没回复。",
        "你反复修改解释，却避开了对话。",
        "先简单问对方原本的意思，之后再整理自己的看法。",
      ],
      Te: [
        "合作进度落后，你接手所有工作，开始纠正每个人。",
        "赶快完成的念头挤掉了倾听与实际限制。",
        "一起确认一个优先事项，再把一项工作交回去并说清楚期待。",
      ],
      Fi: [
        "工作上的反馈像是在否定你整个人，于是你退缩了。",
        "具体的批评变成了对自身价值的判决。",
        "说出哪个价值让你感到受威胁，再问清楚哪个具体部分需要调整。",
      ],
      Fe: [
        "明明累坏了，你仍答应帮忙，心里希望有人能看出你的疲惫。",
        "照顾大家的感受，让你的界线消失了。",
        "直接说出一个需要，只付出你不会因此心生怨怼的份量。",
      ],
    },
  },
  ja: {
    settings: "設定",
    language: "言語",
    explore: "機能とタイプを見る",
    functions: "8つの機能を知る",
    other: "もう一方の態度",
    flip: "裏返して見る：",
    back: "戻る：",
    main: "主要機能",
    shadow: "シャドウ機能",
    shadowNote:
      "8機能モデルの一つの解釈では、主要機能の内向・外向を入れ替えます。シャドウ機能は不健康という意味ではなく、このモデルも心理学の定説ではありません。",
    attitudeNote:
      "同じ心理過程でも、注意の向きが異なります。下の二つを比べてみましょう。盤面の対立ペアとは別の関係です。",
    shadowRoles: [
      "主機能の対応機能 · いつもの出発点を別の態度で捉える",
      "補助機能の対応機能 · 支えとなる視点を別の態度で捉える",
      "第三機能の対応機能 · 第三機能を別の態度で捉える",
      "劣等機能の対応機能 · 不慣れな主要機能を別の態度で捉える",
    ],
    functionDetails: "この機能について",
    typical: "普段の状態",
    stress: "ストレスを感じるとき",
    disclaimer: "ストレスの例について",
    stressNote:
      "このタイプの上位2機能をもとにした振り返りの例です。予測や診断ではありません。自分の経験に合う部分だけ参考にしてください。",
    notice: "気づくこと",
    response: "試せること",
    roles: [
      "主機能 · いつもの出発点",
      "補助機能 · 支えとなる視点",
      "第三機能 · 別の手がかり",
      "劣等機能 · 慣れていない視点",
    ],
    hold: "正解したペアには金色の枠が残ります。長押しするか、盤面の下の「機能とタイプを見る」から詳しく読めます。",
    reflections: {
      Ni: [
        "短い返信を見て、関係が終わるのだと一晩中考えてしまう。",
        "確認する前に、一つの解釈が事実のようになる。",
        "実際に起きたことを書き、結論の前に自由に答えられる質問を一つする。",
      ],
      Ne: [
        "締め切りが近いのに、新しい可能性のたびに計画を作り直す。",
        "選択肢が増えるほど、小さな作業も終わらなくなる。",
        "新しい案はメモに残し、今日は小さな形を一つ完成させる。",
      ],
      Si: [
        "急な変更で、古い計画を何度も確認してしまう。",
        "状況が変わっても、以前のやり方が基準になっている。",
        "慣れた習慣を一つ残し、新しい状況に小さく合わせてみる。",
      ],
      Se: [
        "つらい一日の後、立ち止まらないよう買い物や予定を増やす。",
        "今すぐ楽になることが、明日の必要を押しのける。",
        "次の約束の前に止まり、体力と予算、体の声を確かめる。",
      ],
      Ti: [
        "口論の後、返信せずに何時間も自分の説明を練り直す。",
        "説明は磨いているのに、対話を避けている。",
        "まず相手の意図を短く尋ねる。考えを整えるのはその後でもいい。",
      ],
      Te: [
        "共同作業が遅れ、全部引き受けて全員に修正を求め始める。",
        "終わらせることばかりで、話を聞く余裕や現実的な限界が消える。",
        "優先事項を一つ一緒に決め、期待を伝えて作業を一つ返す。",
      ],
      Fi: [
        "仕事への意見が自分全体への否定に感じられ、距離を置く。",
        "具体的な指摘が、自分の価値への判決になっている。",
        "傷ついた価値観を言葉にし、直すべき具体的な点を尋ねる。",
      ],
      Fe: [
        "疲れ切っているのに頼みを引き受け、誰かが気づくのを待つ。",
        "周囲を気遣ううちに、自分の限界が見えなくなる。",
        "必要なことを一つ率直に伝え、無理なくできる分だけ引き受ける。",
      ],
    },
  },
  ko: {
    settings: "설정",
    language: "언어",
    explore: "기능과 유형 살펴보기",
    functions: "여덟 기능 만나기",
    other: "다른 태도",
    flip: "뒤집어 보기:",
    back: "돌아가기:",
    main: "주요 기능 배열",
    shadow: "그림자 기능 배열",
    shadowNote:
      "8기능 모델의 한 해석에서는 주요 기능의 내향·외향을 바꿉니다. 그림자 기능이 곧 건강하지 않다는 뜻은 아닙니다. 이 모델은 심리학의 확정된 정설이 아닙니다.",
    attitudeNote:
      "같은 심리 과정이지만 주의가 향하는 방향이 다릅니다. 아래 두 관점을 비교해 보세요. 보드의 대립 쌍과는 다른 관계입니다.",
    shadowRoles: [
      "주기능의 대응 기능 · 익숙한 출발점을 다른 태도로 바라보기",
      "부기능의 대응 기능 · 받쳐 주는 관점을 다른 태도로 바라보기",
      "3차 기능의 대응 기능 · 세 번째 기능을 다른 태도로 바라보기",
      "열등 기능의 대응 기능 · 덜 익숙한 주요 기능을 다른 태도로 바라보기",
    ],
    functionDetails: "이 기능 알아보기",
    typical: "평소 모습",
    stress: "스트레스를 받을 때",
    disclaimer: "스트레스 예시 안내",
    stressNote:
      "이 유형의 앞선 두 기능에서 착안한 성찰 예시입니다. 예측이나 진단이 아니니 자신의 경험에 맞는 부분만 참고하세요.",
    notice: "살펴보기",
    response: "시도하기",
    roles: [
      "주기능 · 익숙한 출발점",
      "부기능 · 받쳐 주는 관점",
      "3차 기능 · 또 다른 자원",
      "열등 기능 · 덜 익숙한 관점",
    ],
    hold: "맞힌 쌍에는 금색 테두리가 남습니다. 길게 누르거나 보드 아래의 ‘기능과 유형 살펴보기’를 이용하세요.",
    reflections: {
      Ni: [
        "짧은 답장을 받고 관계가 끝날 거라는 생각으로 밤을 보냅니다.",
        "확인하기 전에 하나의 해석이 사실처럼 느껴집니다.",
        "실제로 일어난 일을 적고, 결론을 내리기 전에 열린 질문을 하나 해 보세요.",
      ],
      Ne: [
        "마감이 가까운데 새 가능성이 떠오를 때마다 계획을 다시 씁니다.",
        "선택지가 많아질수록 작은 부분도 끝내기 어렵습니다.",
        "새 아이디어는 적어 두고 오늘 끝낼 작은 결과물 하나를 고르세요.",
      ],
      Si: [
        "갑작스러운 변경에 예전 계획을 계속 확인합니다.",
        "상황이 바뀌었는데도 과거 방식으로 모든 것을 비교합니다.",
        "익숙한 습관 하나는 유지하고 새 상황에 맞게 작은 부분을 바꿔 보세요.",
      ],
      Se: [
        "힘든 하루 뒤 멈추지 않으려고 쇼핑이나 약속을 계속 늘립니다.",
        "당장의 위안이 내일의 필요를 밀어냅니다.",
        "다음 약속 전에 잠시 멈추고 체력, 예산, 몸의 필요를 확인하세요.",
      ],
      Ti: [
        "다툰 뒤 답장 대신 몇 시간씩 논리를 다듬습니다.",
        "설명은 고치면서 대화는 피하고 있습니다.",
        "상대가 어떤 뜻이었는지 간단히 물어보세요. 생각은 그 뒤에도 다듬을 수 있습니다.",
      ],
      Te: [
        "공동 작업이 늦어지자 모든 일을 떠맡고 사람들을 지적합니다.",
        "끝내려는 마음에 경청과 현실적인 한계를 놓칩니다.",
        "우선순위 하나를 함께 정하고, 기대를 명확히 하며 일 하나를 돌려주세요.",
      ],
      Fi: [
        "업무 피드백이 나라는 사람에 대한 판결처럼 느껴져 물러납니다.",
        "구체적인 지적이 자신의 가치 전체에 대한 평가로 번집니다.",
        "어떤 가치가 위협받는지 말로 정리하고, 바꿔야 할 구체적인 부분을 물어보세요.",
      ],
      Fe: [
        "지쳤는데도 부탁을 수락하며 누군가 알아주길 바랍니다.",
        "모두를 편하게 하려다 자신의 한계를 감춥니다.",
        "필요한 것 하나를 직접 말하고, 원망 없이 줄 수 있는 만큼만 제안하세요.",
      ],
    },
  },
  es: {
    settings: "Ajustes",
    language: "Idioma",
    explore: "Explorar funciones y tipos",
    functions: "Las ocho funciones",
    other: "Otra actitud",
    flip: "Dar la vuelta a",
    back: "Volver a",
    main: "Funciones principales",
    shadow: "Funciones sombra",
    shadowNote:
      "Una interpretación de ocho funciones cambia la actitud de cada función principal. Las funciones sombra no son dañinas por naturaleza. Este modelo no es un consenso de la psicología.",
    attitudeNote:
      "El mismo proceso con otra dirección de la atención. Compara las dos perspectivas; esta relación es distinta de las parejas opuestas del tablero.",
    shadowRoles: [
      "Contraparte dominante · Otra actitud hacia tu punto de partida habitual",
      "Contraparte auxiliar · Otra actitud hacia tu perspectiva de apoyo",
      "Contraparte terciaria · Otra actitud hacia tu tercera función",
      "Contraparte inferior · Otra actitud hacia tu función principal menos familiar",
    ],
    functionDetails: "Sobre esta función",
    typical: "Habitualmente",
    stress: "Bajo estrés",
    disclaimer: "Sobre estos ejemplos de estrés",
    stressNote:
      "Dos ejemplos para reflexionar, inspirados en las dos primeras funciones de este tipo. No son predicciones ni diagnósticos. Quédate con lo que encaje con tu experiencia.",
    notice: "Observa",
    response: "Prueba",
    roles: [
      "Dominante · punto de partida habitual",
      "Auxiliar · una perspectiva de apoyo",
      "Terciaria · otro recurso",
      "Inferior · una perspectiva menos familiar",
    ],
    hold: "Una pareja correcta conserva el borde dorado. Mantenla pulsada para conocer la función o usa Explorar funciones y tipos debajo del tablero.",
    reflections: {
      Ni: [
        "Recibes una respuesta breve y pasas la noche convencido de que la relación se acaba.",
        "Una interpretación parece un hecho antes de comprobarla.",
        "Anota lo que ocurrió y haz una pregunta abierta antes de sacar conclusiones.",
      ],
      Ne: [
        "Se acerca la entrega, pero cada posibilidad nueva te hace rehacer el plan.",
        "Tener más opciones dificulta terminar incluso una parte pequeña.",
        "Guarda las ideas nuevas y elige una versión pequeña que puedas terminar hoy.",
      ],
      Si: [
        "Un cambio de última hora te lleva a revisar el plan anterior una y otra vez.",
        "Comparas todo con cómo funcionaba antes, aunque la situación haya cambiado.",
        "Conserva una rutina familiar y prueba un ajuste pequeño a la nueva situación.",
      ],
      Se: [
        "Tras un día difícil, sigues comprando o haciendo planes para no parar.",
        "El alivio inmediato desplaza las necesidades de mañana.",
        "Antes del próximo compromiso, revisa tu energía, tu presupuesto y lo que necesita tu cuerpo.",
      ],
      Ti: [
        "Después de discutir, pasas horas perfeccionando tu argumento en vez de responder.",
        "Retocas la explicación mientras evitas la conversación.",
        "Pregunta de forma sencilla qué quiso decir la otra persona; podrás afinar tu opinión después.",
      ],
      Te: [
        "Un proyecto se retrasa y asumes todas las tareas mientras corriges a todos.",
        "Terminar está dejando poco espacio para escuchar y reconocer límites reales.",
        "Acordad una prioridad y devuelve una tarea con expectativas claras.",
      ],
      Fi: [
        "Un comentario sobre tu trabajo parece un juicio sobre quién eres y te alejas.",
        "Una crítica concreta se convierte en un juicio sobre todo tu valor.",
        "Nombra el valor que sientes amenazado y pregunta qué parte concreta necesita cambios.",
      ],
      Fe: [
        "Aceptas otro favor esperando que alguien note lo agotado que estás.",
        "Mantener cómodos a los demás oculta tus propios límites.",
        "Expresa una necesidad y ofrece solo lo que puedas dar sin resentimiento.",
      ],
    },
  },
  fr: {
    settings: "Réglages",
    language: "Langue",
    explore: "Explorer les fonctions et les types",
    functions: "Les huit fonctions",
    other: "Autre attitude",
    flip: "Retourner vers",
    back: "Revenir à",
    main: "Fonctions principales",
    shadow: "Fonctions d’ombre",
    shadowNote:
      "Une interprétation à huit fonctions inverse l’attitude de chaque fonction principale. Les fonctions d’ombre ne sont pas malsaines en elles-mêmes. Ce modèle ne fait pas consensus en psychologie.",
    attitudeNote:
      "Le même processus, avec une autre direction de l’attention. Comparez les deux perspectives ; ce lien diffère des paires opposées du plateau.",
    shadowRoles: [
      "Pendant de la dominante · Une autre attitude envers votre point de départ habituel",
      "Pendant de l’auxiliaire · Une autre attitude envers votre perspective de soutien",
      "Pendant de la tertiaire · Une autre attitude envers votre troisième fonction",
      "Pendant de l’inférieure · Une autre attitude envers votre fonction principale moins familière",
    ],
    functionDetails: "À propos de cette fonction",
    typical: "Habituellement",
    stress: "Sous stress",
    disclaimer: "À propos de ces exemples de stress",
    stressNote:
      "Deux exemples pour réfléchir, inspirés des deux premières fonctions de ce type. Ce ne sont ni des prédictions ni des diagnostics. Gardez ce qui correspond à votre expérience.",
    notice: "À observer",
    response: "À essayer",
    roles: [
      "Dominante · point de départ habituel",
      "Auxiliaire · un regard en soutien",
      "Tertiaire · une autre ressource",
      "Inférieure · un regard moins familier",
    ],
    hold: "Une paire correcte garde son contour doré. Appuyez longuement pour découvrir la fonction, ou utilisez Explorer les fonctions et les types sous le plateau.",
    reflections: {
      Ni: [
        "Une réponse brève arrive et vous passez la soirée à croire que la relation se termine.",
        "Une interprétation devient un fait avant toute vérification.",
        "Notez ce qui s’est passé, puis posez une question ouverte avant de conclure.",
      ],
      Ne: [
        "L’échéance approche, mais chaque nouvelle possibilité vous fait refaire le plan.",
        "Plus d’options rendent difficile de terminer même une petite partie.",
        "Mettez les nouvelles idées de côté et choisissez une petite version à finir aujourd’hui.",
      ],
      Si: [
        "Un changement de dernière minute vous pousse à relire sans cesse l’ancien plan.",
        "Vous comparez tout au passé alors que la situation a changé.",
        "Gardez une habitude familière et essayez un petit ajustement à la nouvelle situation.",
      ],
      Se: [
        "Après une journée difficile, vous multipliez achats ou sorties pour ne pas vous arrêter.",
        "Le soulagement immédiat prend la place des besoins de demain.",
        "Avant le prochain engagement, vérifiez votre énergie, votre budget et les besoins de votre corps.",
      ],
      Ti: [
        "Après un désaccord, vous peaufinez votre argument pendant des heures sans répondre.",
        "Vous révisez l’explication tout en évitant la conversation.",
        "Demandez simplement ce que l’autre voulait dire ; vous pourrez affiner votre avis ensuite.",
      ],
      Te: [
        "Un projet prend du retard : vous reprenez toutes les tâches et corrigez tout le monde.",
        "Finir prend le pas sur l’écoute et les limites réelles.",
        "Fixez ensemble une priorité, puis rendez une tâche avec des attentes claires.",
      ],
      Fi: [
        "Un retour sur votre travail ressemble à un jugement sur votre personne et vous vous éloignez.",
        "Une critique précise devient un jugement sur toute votre valeur.",
        "Nommez la valeur qui semble menacée, puis demandez quel point concret doit changer.",
      ],
      Fe: [
        "Vous acceptez encore un service en espérant que quelqu’un remarquera votre épuisement.",
        "Le confort des autres masque vos propres limites.",
        "Exprimez un besoin directement et proposez seulement ce que vous pouvez donner sans rancœur.",
      ],
    },
  },
  de: {
    settings: "Einstellungen",
    language: "Sprache",
    explore: "Funktionen und Typen erkunden",
    functions: "Die acht Funktionen",
    other: "Andere Haltung",
    flip: "Umdrehen zu",
    back: "Zurück zu",
    main: "Hauptfunktionen",
    shadow: "Schattenfunktionen",
    shadowNote:
      "Eine Deutung mit acht Funktionen kehrt bei jeder Hauptfunktion die introvertierte oder extravertierte Haltung um. Schattenfunktionen sind nicht grundsätzlich ungesund. Dieses Modell ist kein gesicherter psychologischer Konsens.",
    attitudeNote:
      "Derselbe Prozess mit einer anderen Richtung der Aufmerksamkeit. Vergleiche die Perspektiven unten. Das ist eine andere Beziehung als die Gegensatzpaare auf dem Spielfeld.",
    shadowRoles: [
      "Gegenstück der Dominanten · Eine andere Haltung zu deinem üblichen Ausgangspunkt",
      "Gegenstück der Hilfsfunktion · Eine andere Haltung zu deiner stützenden Perspektive",
      "Gegenstück der Tertiären · Eine andere Haltung zu deiner dritten Funktion",
      "Gegenstück der Inferioren · Eine andere Haltung zu deiner weniger vertrauten Hauptfunktion",
    ],
    functionDetails: "Über diese Funktion",
    typical: "Im Alltag",
    stress: "Unter Stress",
    disclaimer: "Über diese Stressbeispiele",
    stressNote:
      "Zwei Beispiele zur Selbstreflexion, angeregt durch die ersten beiden Funktionen dieses Typs. Keine Vorhersagen oder Diagnosen. Behalte nur, was zu deiner Erfahrung passt.",
    notice: "Achte darauf",
    response: "Versuche",
    roles: [
      "Dominant · dein üblicher Ausgangspunkt",
      "Hilfsfunktion · eine stützende Perspektive",
      "Tertiär · eine weitere Ressource",
      "Inferior · eine weniger vertraute Perspektive",
    ],
    hold: "Ein richtiges Paar behält seinen goldenen Rand. Halte es gedrückt oder nutze Funktionen und Typen erkunden unter dem Spielfeld.",
    reflections: {
      Ni: [
        "Eine kurze Antwort kommt, und du glaubst den ganzen Abend, die Beziehung gehe zu Ende.",
        "Eine Deutung fühlt sich schon vor dem Nachfragen wie eine Tatsache an.",
        "Notiere, was wirklich passiert ist, und stelle eine offene Frage, bevor du Schlüsse ziehst.",
      ],
      Ne: [
        "Die Frist rückt näher, doch jede neue Möglichkeit führt zu einem neuen Plan.",
        "Mehr Optionen machen es schwerer, auch nur einen kleinen Teil abzuschließen.",
        "Notiere neue Ideen für später und schließe heute eine kleine Version ab.",
      ],
      Si: [
        "Eine kurzfristige Änderung lässt dich immer wieder den alten Plan prüfen.",
        "Du misst alles am bisherigen Ablauf, obwohl sich die Lage geändert hat.",
        "Behalte eine vertraute Gewohnheit und passe eine Kleinigkeit an die neue Lage an.",
      ],
      Se: [
        "Nach einem schweren Tag kaufst oder planst du immer weiter, um nicht innezuhalten.",
        "Die sofortige Erleichterung verdrängt die Bedürfnisse von morgen.",
        "Prüfe vor der nächsten Zusage deine Energie, dein Budget und die Bedürfnisse deines Körpers.",
      ],
      Ti: [
        "Nach einem Streit feilst du stundenlang an deiner Begründung, statt zu antworten.",
        "Du überarbeitest die Erklärung, vermeidest aber das Gespräch.",
        "Frage kurz nach, was die andere Person meinte. Deine Sicht kannst du danach weiterentwickeln.",
      ],
      Te: [
        "Ein gemeinsames Projekt stockt. Du übernimmst alle Aufgaben und korrigierst jeden.",
        "Das Fertigwerden verdrängt Zuhören und realistische Grenzen.",
        "Legt gemeinsam eine Priorität fest und gib eine Aufgabe mit klaren Erwartungen zurück.",
      ],
      Fi: [
        "Rückmeldung zur Arbeit fühlt sich wie ein Urteil über dich als Person an, und du ziehst dich zurück.",
        "Konkrete Kritik wird zum Urteil über deinen gesamten Wert.",
        "Benenne den bedrohten Wert und frage, welcher konkrete Teil geändert werden soll.",
      ],
      Fe: [
        "Du sagst noch einen Gefallen zu und hoffst, jemand bemerke deine Erschöpfung.",
        "Damit sich alle wohlfühlen, verbirgst du deine Grenzen.",
        "Sprich ein Bedürfnis direkt aus und biete nur an, was du ohne Groll geben kannst.",
      ],
    },
  },
  "pt-BR": {
    settings: "Ajustes",
    language: "Idioma",
    explore: "Explorar funções e tipos",
    functions: "As oito funções",
    other: "Outra atitude",
    flip: "Virar para",
    back: "Voltar para",
    main: "Funções principais",
    shadow: "Funções sombra",
    shadowNote:
      "Uma interpretação de oito funções troca a atitude de cada função principal. Funções sombra não são prejudiciais por natureza. Esse modelo não é um consenso da psicologia.",
    attitudeNote:
      "O mesmo processo, com outra direção da atenção. Compare as perspectivas abaixo; essa relação é diferente dos pares opostos do tabuleiro.",
    shadowRoles: [
      "Contraparte dominante · Outra atitude diante do seu ponto de partida habitual",
      "Contraparte auxiliar · Outra atitude diante da sua perspectiva de apoio",
      "Contraparte terciária · Outra atitude diante da sua terceira função",
      "Contraparte inferior · Outra atitude diante da sua função principal menos familiar",
    ],
    functionDetails: "Sobre esta função",
    typical: "No dia a dia",
    stress: "Sob estresse",
    disclaimer: "Sobre estes exemplos de estresse",
    stressNote:
      "Dois exemplos para reflexão, inspirados nas duas primeiras funções deste tipo. Não são previsões nem diagnósticos. Considere apenas o que combina com sua experiência.",
    notice: "Observe",
    response: "Experimente",
    roles: [
      "Dominante · ponto de partida habitual",
      "Auxiliar · uma perspectiva de apoio",
      "Terciária · outro recurso",
      "Inferior · uma perspectiva menos familiar",
    ],
    hold: "Um par correto mantém a borda dourada. Segure para conhecer a função ou use Explorar funções e tipos abaixo do tabuleiro.",
    reflections: {
      Ni: [
        "Chega uma resposta curta e você passa a noite achando que a relação vai acabar.",
        "Uma interpretação parece um fato antes de você conferir.",
        "Anote o que aconteceu e faça uma pergunta aberta antes de concluir.",
      ],
      Ne: [
        "O prazo está perto, mas cada nova possibilidade faz você refazer o plano.",
        "Mais opções tornam difícil terminar até uma pequena parte.",
        "Guarde as novas ideias e escolha uma versão pequena para concluir hoje.",
      ],
      Si: [
        "Uma mudança de última hora faz você conferir o plano antigo sem parar.",
        "Você compara tudo com o jeito anterior, mesmo quando a situação mudou.",
        "Mantenha uma rotina familiar e tente um pequeno ajuste à nova situação.",
      ],
      Se: [
        "Depois de um dia difícil, você continua comprando ou marcando programas para não parar.",
        "O alívio imediato deixa de lado as necessidades de amanhã.",
        "Antes do próximo compromisso, confira sua energia, seu orçamento e o que seu corpo precisa.",
      ],
      Ti: [
        "Depois de uma discussão, você passa horas aperfeiçoando seu argumento em vez de responder.",
        "Você revisa a explicação, mas evita a conversa.",
        "Pergunte de forma simples o que a outra pessoa quis dizer; depois você pode refinar sua opinião.",
      ],
      Te: [
        "Um projeto atrasa e você assume todas as tarefas, corrigindo todo mundo.",
        "Terminar está tomando o lugar da escuta e dos limites reais.",
        "Combinem uma prioridade e devolva uma tarefa com expectativas claras.",
      ],
      Fi: [
        "Um comentário sobre seu trabalho parece um julgamento de quem você é, e você se afasta.",
        "Uma crítica específica vira um julgamento de todo o seu valor.",
        "Diga qual valor parece ameaçado e pergunte qual parte concreta precisa mudar.",
      ],
      Fe: [
        "Você aceita mais um favor esperando que alguém perceba seu cansaço.",
        "Deixar todos confortáveis esconde seus próprios limites.",
        "Expresse uma necessidade diretamente e ofereça apenas o que pode dar sem ressentimento.",
      ],
    },
  },
};

export const exploreCopy = (): ExploreCopy => EXPLORE[locale()] ?? EXPLORE.en;
