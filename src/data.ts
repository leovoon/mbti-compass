export type FnId = 'Ni' | 'Ti' | 'Si' | 'Te' | 'Se' | 'Fe' | 'Ne' | 'Fi';
export type Mode = 'exact' | 'opposites';
export type Kind = 'emoji' | 'label';

export interface Fn {
  /** emoji alias — kept for copy that mentions it; the mascot art echoes it */
  e: string;
  /** archetype (English; localised via locale.fn) */
  n: string;
  /** the two types that lead with this function */
  t: [TypeId, TypeId];
  opp: FnId;
  /** palette: body, shade. Opposites sit on complementary hues. */
  c: string;
  c2: string;
  full: string;
  /** the one word it is "worth it" for — its half of the bond */
  w: string;
  d: string;
}

export const FN: Record<FnId, Fn> = {
  Ni: { e: '🔮', n: 'Seer',      t: ['INFJ', 'INTJ'], opp: 'Se', c: '#a08cff', c2: '#7a63e6',
        full: 'Introverted Intuition', w: 'Far',
        d: 'Sees where things are heading. Quietly boils many signals down into one deep hunch about the future.' },
  Ti: { e: '🧩', n: 'Architect', t: ['INTP', 'ISTP'], opp: 'Fe', c: '#5ed6c4', c2: '#36ab9c',
        full: 'Introverted Thinking', w: 'True',
        d: 'Builds an inner framework of logic. Worth it if it is accurate, consistent and actually makes sense.' },
  Si: { e: '📜', n: 'Keeper',    t: ['ISFJ', 'ISTJ'], opp: 'Ne', c: '#f2b77a', c2: '#cf8d50',
        full: 'Introverted Sensing', w: 'Known',
        d: 'Trusts what has been tried and remembered. Compares the present with stored experience and values the familiar.' },
  Te: { e: '⚙️', n: 'General',   t: ['ENTJ', 'ESTJ'], opp: 'Fi', c: '#86c8ff', c2: '#5a9fe0',
        full: 'Extraverted Thinking', w: 'Works',
        d: 'Organises the outer world for results. Worth it if it is efficient, measurable and gets things done.' },
  Se: { e: '🏄', n: 'Surfer',    t: ['ESFP', 'ESTP'], opp: 'Ni', c: '#ffd45e', c2: '#e6ad2e',
        full: 'Extraverted Sensing', w: 'Near',
        d: 'Lives fully in the present moment. Reacts to what is right here, right now, with sharp senses and instinct.' },
  Fe: { e: '🤝', n: 'Host',      t: ['ENFJ', 'ESFJ'], opp: 'Ti', c: '#ffa3c4', c2: '#ec7ba3',
        full: 'Extraverted Feeling', w: 'Together',
        d: 'Reads the room and tends to the group. Worth it if people feel included, safe and in harmony.' },
  Ne: { e: '🎈', n: 'Inventor',  t: ['ENFP', 'ENTP'], opp: 'Si', c: '#d6a4ff', c2: '#b077ea',
        full: 'Extraverted Intuition', w: 'New',
        d: 'Spots possibilities and links between ideas. Always asking "what if?" and chasing what is fresh.' },
  Fi: { e: '🕯️', n: 'Monk',      t: ['INFP', 'ISFP'], opp: 'Te', c: '#ff8a8a', c2: '#e2605f',
        full: 'Introverted Feeling', w: 'Worth',
        d: 'Checks everything against personal values. Worth it if it feels authentic and honours what truly matters to me.' },
};
export const FN_KEYS = Object.keys(FN) as FnId[];

/** clockwise from the top; slot i faces slot i+4 across the centre */
export const RING: FnId[] = ['Ni', 'Ti', 'Si', 'Te', 'Se', 'Fe', 'Ne', 'Fi'];
export const BONDS: { a: FnId; b: FnId }[] = [
  { a: 'Ni', b: 'Se' },
  { a: 'Ne', b: 'Si' },
  { a: 'Ti', b: 'Fe' },
  { a: 'Te', b: 'Fi' },
];

export type TypeId =
  | 'INTJ' | 'INFJ' | 'INTP' | 'ISTP' | 'ISFJ' | 'ISTJ' | 'ENTJ' | 'ESTJ'
  | 'ESFP' | 'ESTP' | 'ENFJ' | 'ESFJ' | 'ENFP' | 'ENTP' | 'INFP' | 'ISFP';

export interface MbtiType {
  /** the object it is */
  n: string;
  /** leads with · backed by */
  dom: FnId;
  aux: FnId;
  d: string;
}

export const TYPES: Record<TypeId, MbtiType> = {
  INFJ: { n: 'Moonwatch',  dom: 'Ni', aux: 'Fe', d: 'A quiet crescent that sees the tide turning long before anyone else — and wants everyone to make it to shore.' },
  INTJ: { n: 'Stargazer',  dom: 'Ni', aux: 'Te', d: 'A telescope fixed on one far star, already drawing the route to reach it.' },
  INTP: { n: 'Puzzlebox',  dom: 'Ti', aux: 'Ne', d: 'A cube that keeps turning itself over, sure there is a cleaner solution on the next face.' },
  ISTP: { n: 'Fixer',      dom: 'Ti', aux: 'Se', d: 'A trusty wrench: calm, precise, and happiest with something real to take apart.' },
  ISFJ: { n: 'Teapot',     dom: 'Si', aux: 'Fe', d: 'Always warm, always ready, remembers exactly how you take it.' },
  ISTJ: { n: 'Ledger',     dom: 'Si', aux: 'Te', d: 'A well-kept book where every promise is written down and every one is kept.' },
  ENTJ: { n: 'Rook',       dom: 'Te', aux: 'Ni', d: 'The tower on the board that moves in straight lines toward a plan only it can fully see.' },
  ESTJ: { n: 'Clockwork',  dom: 'Te', aux: 'Si', d: 'An alarm clock that keeps the whole house running on time, the way it always has.' },
  ESFP: { n: 'Disco',      dom: 'Se', aux: 'Fi', d: 'A mirror ball that catches every light in the room and throws it back, brighter.' },
  ESTP: { n: 'Rocket',     dom: 'Se', aux: 'Ti', d: 'Launches first, adjusts mid-air, lands somewhere exciting.' },
  ENFJ: { n: 'Sunny',      dom: 'Fe', aux: 'Ni', d: 'A small sun that warms the whole room and quietly points it toward tomorrow.' },
  ESFJ: { n: 'Cupcake',    dom: 'Fe', aux: 'Si', d: 'Made for sharing, remembers every birthday, brings the party to you.' },
  ENFP: { n: 'Kite',       dom: 'Ne', aux: 'Fi', d: 'Climbs any breeze toward a new idea, tethered to what it truly loves.' },
  ENTP: { n: 'Spark',      dom: 'Ne', aux: 'Ti', d: 'A light bulb that flickers on at the first “what if…?” and refuses to switch off.' },
  INFP: { n: 'Toadstool',  dom: 'Fi', aux: 'Ne', d: 'A soft little mushroom with a whole storybook world growing under its cap.' },
  ISFP: { n: 'Bloom',      dom: 'Fi', aux: 'Se', d: 'A tulip that opens on its own schedule, in its own colour, right now.' },
};
/** gallery order follows the ring: each function's two types side by side */
export const TYPE_ORDER: TypeId[] = RING.flatMap(f => FN[f].t);
