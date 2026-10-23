import { locale } from "../i18n";
const en = {
  soundOn: "Sound on",
  soundOff: "Sound off",
  close: "Close",
  skip: "Skip tutorial",
  next: "Next",
  play: "Let’s play",
  menu: "Game menu",
  help: "How to play",
  team: "Your team",
  enemyTurn: "Shadows strike back",
  shielded: (a: string, b: string) => `${a} shielded ${b}`,
  took: (a: string, n: number) => `${a} took ${n}`,
  enemyHelp:
    "Each shadow's badge counts down the turns until it attacks. Red zones show where the next attack lands; the aim locks when shown. Attacks hit any ball standing in the zone, including teammates. A beam stops at the first ball, so one ball can shield another.",
  combo: "Bumps",
  consulted: "Consulted",
  comboHelp:
    "Touch a teammate to fire their bump attack for free. Ports face the nearest shadow at turn start. Leave and re-enter to trigger again; repeat strength halves each time within a shot.",
  drag: "Pull back anywhere on the field. Release to shoot.",
  keyboard: "Keyboard: ← → aim, ↑ ↓ power, Enter shoots. Escape cancels your pull.",
  canvas:
    "Slingshot field. Drag anywhere to aim and release to shoot. Keyboard: left and right aim, up and down change power, Enter shoots.",
  tutorial: [
    {
      title: "Pull back. Let go.",
      body: "Touch anywhere on the field and pull away from your target. The glowing ball follows your aim. A longer pull means more speed.",
    },
    {
      title: "Play the rebound.",
      body: "Bounce off walls and shadows. Pass through a teammate to fire their free bump attack along their arrow. Leave and touch them again for another combo at half strength. Arm strike adds your one-use special.",
    },
    {
      title: "A shot, then a choice.",
      body: "After each shot, shadows whose badge reaches 1 attack the red zones, hitting any ball there, teammates included. Then answer a quick question. Only your answers shape your personality letters.",
    },
  ],
};
const zh: typeof en = {
  soundOn: "音效開啟",
  soundOff: "音效關閉",
  close: "關閉",
  skip: "略過教學",
  next: "下一步",
  play: "開始玩",
  menu: "遊戲選單",
  help: "玩法教學",
  team: "你的隊伍",
  enemyTurn: "陰影反擊中",
  shielded: (a: string, b: string) => `${a} 掩護了 ${b}`,
  took: (a: string, n: number) => `${a} 受到 ${n}`,
  enemyHelp:
    "陰影旁的數字是距離攻擊的回合數。紅色區域是下一次攻擊的落點，顯示時就已鎖定。站在區域內的球都會受傷，包括待機的夥伴。光束會停在第一顆球，所以一顆球可以替另一顆擋下。",
  combo: "友情",
  consulted: "諮詢夥伴",
  comboHelp:
    "碰到夥伴就會免費發動友情技。每回合開始時，箭頭會朝向最近的陰影。離開再碰觸可再次發動，同一球內每次重複的威力減半。",
  drag: "在球場任意位置向後拉，放開發射。",
  keyboard: "鍵盤：← → 瞄準、↑ ↓ 力道、Enter 發射、Escape 取消拖曳。",
  canvas: "彈射球場。在任意位置拖曳瞄準，放開發射。鍵盤左右鍵瞄準、上下鍵調整力道、Enter 發射。",
  tutorial: [
    {
      title: "向後拉，放開發射。",
      body: "按住球場任意位置，往目標的反方向拉。發光的球會沿瞄準方向飛出；拉得越長，速度越快。",
    },
    {
      title: "善用反彈。",
      body: "碰到牆壁和陰影會反彈。穿過夥伴就會沿箭頭免費發動友情技。離開再碰觸可再次連擊，威力減半。「準備必殺技」可加入整場一次的絕招。",
    },
    {
      title: "射一球，選一次。",
      body: "每次射擊後，數字到 1 的陰影會攻擊紅色區域，區域內的球都會受傷，夥伴也不例外。接著回答一個小問題。人格字母只根據你的回答產生。",
    },
  ],
};
const zhCN: typeof en = {
  soundOn: "音效开启",
  soundOff: "音效关闭",
  close: "关闭",
  skip: "跳过教程",
  next: "下一步",
  play: "开始玩",
  menu: "游戏菜单",
  help: "玩法教程",
  team: "你的队伍",
  enemyTurn: "阴影反击中",
  shielded: (a: string, b: string) => `${a} 掩护了 ${b}`,
  took: (a: string, n: number) => `${a} 受到 ${n}`,
  enemyHelp:
    "阴影旁的数字是距离攻击的回合数。红色区域是下一次攻击的落点，显示时就已锁定。站在区域内的球都会受伤，包括待机的伙伴。光束会停在第一个球上，所以一个球可以替另一个挡下。",
  combo: "友情",
  consulted: "咨询伙伴",
  comboHelp:
    "碰到伙伴就会免费发动友情技。每回合开始时，箭头会指向最近的阴影。离开后再碰触可再次发动，同一次射击中每次重复的威力减半。",
  drag: "在球场任意位置向后拉，松开发射。",
  keyboard: "键盘：← → 瞄准、↑ ↓ 力度、Enter 发射、Escape 取消拖动。",
  canvas: "弹射球场。在任意位置拖动瞄准，松开发射。键盘左右键瞄准、上下键调整力度、Enter 发射。",
  tutorial: [
    {
      title: "向后拉，松手发射。",
      body: "按住球场任意位置，朝目标的反方向拉。发光的球会沿瞄准方向飞出；拉得越长，速度越快。",
    },
    {
      title: "善用反弹。",
      body: "碰到墙壁和阴影会反弹。穿过伙伴就会沿箭头免费发动友情技。离开后再碰触可再次连击，威力减半。「准备必杀技」可加入整局一次的绝招。",
    },
    {
      title: "射一球，选一次。",
      body: "每次射击后，数字到 1 的阴影会攻击红色区域，区域内的球都会受伤，伙伴也不例外。接着回答一个小问题。人格字母只根据你的回答生成。",
    },
  ],
};
const MOBILE: Record<string, typeof en> = { "zh-TW": zh, "zh-CN": zhCN };
export const mobileCopy = () => MOBILE[locale()] ?? en;
