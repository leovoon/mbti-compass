import type { FnId } from "../data";
import { locale } from "../i18n";
export interface ArenaCopy {
  title: string;
  back: string;
  language: string;
  intro: string;
  select: string;
  selected: (n: number) => string;
  start: string;
  how: string;
  instructions: string;
  keyboard: string;
  resolve: string;
  turn: string;
  hits: string;
  bounces: string;
  strike: string;
  armed: string;
  spent: string;
  fire: string;
  angle: string;
  power: string;
  pause: string;
  resume: string;
  restart: string;
  ready: string;
  flying: string;
  paused: string;
  choice: string;
  next: string;
  cleared: string;
  won: string;
  lost: string;
  again: string;
  profile: string;
  disclaimer: string;
  progress: (n: number) => string;
  stage: string;
  shadow: string;
  damage: string;
  reflection: string;
  recovery: string;
  remaining: string;
  canvas: string;
  unavailable: string;
  fallback: string;
  stages: [string, string, string, string];
  themes: [string, string, string, string];
  kits: Record<FnId, { passive: string; strike: string }>;
  questions: { prompt: string; options: [string, string] }[];
}
const en: ArenaCopy = {
  title: "Shadow arena",
  back: "Back to the compass",
  language: "Language",
  intro: "Pull back. Find your angle. Meet your opposite.",
  select: "Choose your trio",
  selected: (n) => `${n} of 3 selected`,
  start: "Enter the arena",
  how: "How to play",
  instructions:
    "Drag from the active ball, pull away from your target, then release. Clear every shadow before your resolve runs out. Teammates take turns; each has one strike for the whole run.",
  keyboard:
    "Or set angle and power below, then launch. On the field: ← → aim, ↑ ↓ power, Enter launches, Escape cancels a drag.",
  resolve: "Resolve",
  turn: "Turn",
  hits: "Hits",
  bounces: "Bounces",
  strike: "Arm strike",
  armed: "Strike armed",
  spent: "Strike spent",
  fire: "Launch",
  angle: "Angle",
  power: "Power",
  pause: "Pause",
  resume: "Resume",
  restart: "Change team",
  ready: "Pull the highlighted ball to aim.",
  flying: "In flight",
  paused: "Paused",
  choice: "Between shots",
  next: "Next stage",
  cleared: "Shadows cleared",
  won: "Integration complete",
  lost: "Take a breath. Try another angle.",
  again: "Play again",
  profile: "Your choices so far",
  disclaimer:
    "A playful reflection, not a validated personality assessment. Only your answers shape these letters. ? means a tie or an unanswered dimension; your shots and team never affect the result.",
  progress: (n) => `${n} of 8 reflections`,
  stage: "Stage",
  shadow: "Shadow",
  damage: "Damage",
  reflection: "Your next instinct?",
  recovery: "+18 resolve for the next stage",
  remaining: "Shadows remaining",
  canvas:
    "Slingshot battlefield. Use the angle, power and launch controls below as an alternative to dragging.",
  unavailable:
    "Canvas is unavailable in this browser. Try an up-to-date browser, or return to the compass.",
  fallback: "Arena text is in English for this language.",
  stages: [
    "The distant & the immediate",
    "The possible & the familiar",
    "The precise & the shared",
    "The whole compass",
  ],
  themes: ["Ni · Se", "Ne · Si", "Ti · Fe", "Integration · Te · Fi"],
  kits: {
    Ni: {
      passive: "See 3 reflections. Bump: forward laser, 32 damage.",
      strike: "Foresight: 2.8× damage.",
    },
    Se: {
      passive: "30% faster; 24 bounces. Bump: nearby shockwave, 30 damage.",
      strike: "Full throttle: 1.5× speed, 1.8× damage.",
    },
    Ne: {
      passive: "Bump: three spreading rays, 20 damage per target.",
      strike: "Possibility burst: 1.8× damage, 70% splash.",
    },
    Si: {
      passive: "Slower deceleration. Bump: restores 9 team resolve.",
      strike: "Safe return: +20 resolve, 1.8× damage.",
    },
    Ti: {
      passive: "Bump: narrow piercing laser, 42 damage.",
      strike: "Perfect proof: 3× damage.",
    },
    Fe: {
      passive: "Bump: healing pulse restores 12 team resolve.",
      strike: "Together: +24 resolve, 1.6× damage, 35% splash.",
    },
    Te: {
      passive: "25 base damage. Bump: three focused rays, 26 damage per target.",
      strike: "Decisive action: 2.2× damage, 40% splash.",
    },
    Fi: {
      passive: "Bump: nearby flame wave, 24 damage; restores 4 team resolve.",
      strike: "Inner flame: +12 resolve, 2.5× damage.",
    },
  },
  questions: [
    {
      prompt: "You have a moment to reset. What helps?",
      options: ["A little quiet to gather my thoughts.", "Talking it through with someone."],
    },
    {
      prompt: "An unfamiliar challenge appears. Where do you start?",
      options: ["Look for the pattern behind it.", "Look closely at what is here."],
    },
    {
      prompt: "Two plans both work. What breaks the tie?",
      options: ["The most consistent reasoning.", "How each plan affects people."],
    },
    {
      prompt: "There is still time before the next move.",
      options: ["Set a plan and commit to it.", "Keep my options open a little longer."],
    },
    {
      prompt: "You have a new idea. Your first instinct?",
      options: ["Think it through before sharing.", "Develop it by talking with others."],
    },
    {
      prompt: "What makes a new route compelling?",
      options: ["The possibilities it could open.", "The concrete evidence it will work."],
    },
    {
      prompt: "Someone disagrees with your call. What comes first?",
      options: ["Check whether the argument holds.", "Understand what matters to them."],
    },
    {
      prompt: "The plan changes halfway through. What feels better?",
      options: ["Make a new plan with clear steps.", "Adapt as the next situation unfolds."],
    },
  ],
};
const zh: ArenaCopy = {
  title: "陰影競技場",
  back: "回到功能羅盤",
  language: "語言",
  intro: "向後拉，找好角度，遇見你的對立面。",
  select: "選擇三位夥伴",
  selected: (n) => `已選 ${n} / 3 位`,
  start: "進入競技場",
  how: "玩法說明",
  instructions:
    "從發光的球向目標反方向拖曳，放開即可發射。在決心耗盡前擊破所有陰影。三位夥伴輪流出手，每位整場只能使用一次必殺技。",
  keyboard:
    "也可以調整下方的角度與力道後發射。在球場上：← → 瞄準、↑ ↓ 調整力道、Enter 發射、Escape 取消拖曳。",
  resolve: "決心",
  turn: "回合",
  hits: "命中",
  bounces: "反彈",
  strike: "準備必殺技",
  armed: "必殺技已就緒",
  spent: "必殺技已使用",
  fire: "發射",
  angle: "角度",
  power: "力道",
  pause: "暫停",
  resume: "繼續",
  restart: "更換隊伍",
  ready: "向後拖曳發光的球來瞄準。",
  flying: "飛行中",
  paused: "已暫停",
  choice: "回合之間",
  next: "前往下一關",
  cleared: "陰影已清除",
  won: "完成整合",
  lost: "深呼吸，再換個角度試試。",
  again: "再玩一次",
  profile: "目前的選擇傾向",
  disclaimer:
    "這是輕鬆的自我探索，並非經過驗證的人格測驗。字母只根據你的回答產生。? 代表平手或尚未回答；射擊表現和隊伍不會影響結果。",
  progress: (n) => `已完成 ${n} / 8 次反思`,
  stage: "關卡",
  shadow: "陰影",
  damage: "傷害",
  reflection: "下一步，你的直覺是？",
  recovery: "下一關恢復 18 點決心",
  remaining: "剩餘陰影",
  canvas: "彈射球場。除了拖曳，也可以使用下方的角度、力道及發射控制。",
  unavailable: "此瀏覽器無法使用 Canvas。請更新瀏覽器，或回到功能羅盤。",
  fallback: "此語言的競技場文字暫以英文顯示。",
  stages: ["遠方與此刻", "可能與熟悉", "精確與共感", "完整的羅盤"],
  themes: ["Ni · Se", "Ne · Si", "Ti · Fe", "整合 · Te · Fi"],
  kits: {
    Ni: { passive: "預見 3 次反彈。友情技：前向雷射，32 傷害。", strike: "先見之明：2.8 倍傷害。" },
    Se: {
      passive: "速度 +30%，反彈上限 24 次。友情技：周圍衝擊波，30 傷害。",
      strike: "全速前進：1.5 倍速度、1.8 倍傷害。",
    },
    Ne: {
      passive: "友情技：三向擴散光束，每個目標 20 傷害。",
      strike: "可能性爆發：1.8 倍傷害、70% 擴散。",
    },
    Si: {
      passive: "減速更慢。友情技：恢復隊伍 9 點決心。",
      strike: "安心歸來：恢復 20 點決心、1.8 倍傷害。",
    },
    Ti: { passive: "友情技：精準貫穿雷射，42 傷害。", strike: "完美證明：3 倍傷害。" },
    Fe: {
      passive: "友情技：治癒脈衝，恢復隊伍 12 點決心。",
      strike: "攜手同行：恢復 24 點決心、1.6 倍傷害、35% 擴散。",
    },
    Te: {
      passive: "基礎傷害 25。友情技：三向集中光束，每個目標 26 傷害。",
      strike: "果斷行動：2.2 倍傷害、40% 擴散。",
    },
    Fi: {
      passive: "友情技：周圍火焰波，24 傷害；恢復隊伍 4 點決心。",
      strike: "內在火焰：恢復 12 點決心、2.5 倍傷害。",
    },
  },
  questions: [
    {
      prompt: "有一點時間可以調整狀態，什麼對你有幫助？",
      options: ["安靜一下，整理思緒。", "找個人聊一聊。"],
    },
    {
      prompt: "遇到陌生的挑戰，你會從哪裡開始？",
      options: ["尋找背後的模式。", "仔細觀察眼前的事實。"],
    },
    {
      prompt: "兩個計畫都可行，你會以什麼做決定？",
      options: ["哪個推理最一致。", "各個計畫對人的影響。"],
    },
    { prompt: "下一步之前還有時間。", options: ["訂好計畫，決定照著做。", "再保留一下選擇空間。"] },
    {
      prompt: "有了新點子，你的第一個反應是？",
      options: ["先想清楚再分享。", "透過和別人討論來發展。"],
    },
    {
      prompt: "一條新路線，什麼讓你心動？",
      options: ["它可能開啟的新機會。", "證明它可行的具體資訊。"],
    },
    {
      prompt: "有人不同意你的判斷，你先做什麼？",
      options: ["檢查論點是否成立。", "了解對方在意的是什麼。"],
    },
    {
      prompt: "計畫中途變了，哪種做法讓你自在？",
      options: ["重新訂出清楚的步驟。", "依接下來的情況隨機應變。"],
    },
  ],
};
const zhCN: ArenaCopy = {
  title: "阴影竞技场",
  back: "返回功能罗盘",
  language: "语言",
  intro: "向后拉，找准角度，遇见你的对立面。",
  select: "选择三位伙伴",
  selected: (n) => `已选 ${n} / 3 位`,
  start: "进入竞技场",
  how: "玩法说明",
  instructions:
    "在球场上朝目标的反方向拖动，松开即可发射。在决心耗尽前击破所有阴影。三位伙伴轮流出手，每位整局只能使用一次必杀技。",
  keyboard: "键盘：← → 瞄准、↑ ↓ 调整力度、Enter 发射、Escape 取消拖动。",
  resolve: "决心",
  turn: "回合",
  hits: "命中",
  bounces: "反弹",
  strike: "准备必杀技",
  armed: "必杀技已就绪",
  spent: "必杀技已使用",
  fire: "发射",
  angle: "角度",
  power: "力度",
  pause: "暂停",
  resume: "继续",
  restart: "更换队伍",
  ready: "向后拖动发光的球来瞄准。",
  flying: "飞行中",
  paused: "已暂停",
  choice: "回合之间",
  next: "进入下一关",
  cleared: "阴影已清除",
  won: "完成整合",
  lost: "深呼吸，换个角度再试试。",
  again: "再玩一次",
  profile: "目前的选择倾向",
  disclaimer:
    "这是轻松的自我探索，并非经过验证的人格测试。字母只根据你的回答生成。? 表示平局或尚未回答；射击表现和队伍不会影响结果。",
  progress: (n) => `已完成 ${n} / 8 次反思`,
  stage: "关卡",
  shadow: "阴影",
  damage: "伤害",
  reflection: "下一步，你的直觉是？",
  recovery: "下一关恢复 18 点决心",
  remaining: "剩余阴影",
  canvas: "弹射球场。在任意位置拖动瞄准，松开发射。",
  unavailable: "此浏览器无法使用 Canvas。请更新浏览器，或返回功能罗盘。",
  fallback: "该语言的竞技场文字暂以英文显示。",
  stages: ["远方与此刻", "可能与熟悉", "精确与共情", "完整的罗盘"],
  themes: ["Ni · Se", "Ne · Si", "Ti · Fe", "整合 · Te · Fi"],
  kits: {
    Ni: { passive: "预见 3 次反弹。友情技：前向激光，32 伤害。", strike: "先见之明：2.8 倍伤害。" },
    Se: {
      passive: "速度 +30%，反弹上限 24 次。友情技：周围冲击波，30 伤害。",
      strike: "全速前进：1.5 倍速度、1.8 倍伤害。",
    },
    Ne: {
      passive: "友情技：三向扩散光束，每个目标 20 伤害。",
      strike: "可能性爆发：1.8 倍伤害、70% 溅射。",
    },
    Si: {
      passive: "减速更慢。友情技：恢复队伍 9 点决心。",
      strike: "安心归来：恢复 20 点决心、1.8 倍伤害。",
    },
    Ti: { passive: "友情技：精准贯穿激光，42 伤害。", strike: "完美证明：3 倍伤害。" },
    Fe: {
      passive: "友情技：治愈脉冲，恢复队伍 12 点决心。",
      strike: "携手同行：恢复 24 点决心、1.6 倍伤害、35% 溅射。",
    },
    Te: {
      passive: "基础伤害 25。友情技：三向集中光束，每个目标 26 伤害。",
      strike: "果断行动：2.2 倍伤害、40% 溅射。",
    },
    Fi: {
      passive: "友情技：周围火焰波，24 伤害；恢复队伍 4 点决心。",
      strike: "内在火焰：恢复 12 点决心、2.5 倍伤害。",
    },
  },
  questions: [
    {
      prompt: "有一点时间调整状态，什么对你有帮助？",
      options: ["安静一会儿，整理思绪。", "找个人聊一聊。"],
    },
    {
      prompt: "遇到陌生的挑战，你会从哪里开始？",
      options: ["寻找背后的规律。", "仔细观察眼前的事实。"],
    },
    {
      prompt: "两个方案都可行，你会依据什么做决定？",
      options: ["哪个推理最自洽。", "各个方案对人的影响。"],
    },
    {
      prompt: "下一步之前还有时间。",
      options: ["定好计划，按计划执行。", "再多保留一些选择余地。"],
    },
    {
      prompt: "有了新点子，你的第一反应是？",
      options: ["先想清楚再分享。", "通过和别人讨论来完善。"],
    },
    {
      prompt: "一条新路线，什么最吸引你？",
      options: ["它可能带来的新机会。", "证明它可行的具体依据。"],
    },
    {
      prompt: "有人不同意你的判断，你先做什么？",
      options: ["检查论点是否站得住。", "了解对方在意的是什么。"],
    },
    {
      prompt: "计划中途变了，哪种做法让你更自在？",
      options: ["重新制定清晰的步骤。", "根据接下来的情况随机应变。"],
    },
  ],
};
export const ARENA_LOCALES: Record<string, ArenaCopy> = { en, "zh-TW": zh, "zh-CN": zhCN };
export const arenaCopy = () => ARENA_LOCALES[locale()] ?? en;
