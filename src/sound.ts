/* Sound: everything is synthesised, nothing is a sample.
 * Each compass position owns a note of D major. Position i and its opposite
 * i+4 sit exactly a perfect fifth (7 semitones) apart, so every solved bond
 * rings as the most consonant interval there is. */
import type { Kind } from './data';

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const SEMI = [0, 2, 4, 7, 7, 9, 11, 14];          // slot i -> semitones above D4
const BASE = 293.66;
const fSlot = (i: number) => BASE * 2 ** (SEMI[i] / 12);
const PENTA = [0, 2, 4, 7, 9];

type W = Window & { webkitAudioContext?: typeof AudioContext };
let ctx: AudioContext | null = null;
let master: GainNode, wet: GainNode;
let on = (() => { try { return localStorage.getItem('compass-sound') !== 'off'; } catch { return true; } })();

function init() {
  if (ctx) { if (ctx.state === 'suspended') void ctx.resume(); return; }
  const AC = window.AudioContext || (window as W).webkitAudioContext;
  if (!AC) return;
  ctx = new AC();
  master = ctx.createGain(); master.gain.value = .55;
  const comp = ctx.createDynamicsCompressor();
  master.connect(comp); comp.connect(ctx.destination);
  const d = ctx.createDelay(1), fb = ctx.createGain(), lp = ctx.createBiquadFilter();
  d.delayTime.value = .27; fb.gain.value = .33; lp.type = 'lowpass'; lp.frequency.value = 2000;
  wet = ctx.createGain(); wet.gain.value = .3;
  wet.connect(d); d.connect(lp); lp.connect(fb); fb.connect(d); lp.connect(master);
}
const ready = (): boolean => on && !!ctx && ctx.state !== 'closed';
const panOf = (x?: number) => x == null ? 0 : clamp((x / innerWidth) * 2 - 1, -1, 1) * .7;

function route(node: AudioNode, pan: number, send = 1) {
  const c = ctx!;
  let n: AudioNode = node;
  if (c.createStereoPanner) { const p = c.createStereoPanner(); p.pan.value = pan; node.connect(p); n = p; }
  n.connect(master);
  if (send) { const s = c.createGain(); s.gain.value = send; n.connect(s); s.connect(wet); }
}
function env(g: GainNode, t: number, a: number, peak: number, dur: number) {
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + a);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
}
interface BellOpts { at?: number; dur?: number; gain?: number; pan?: number; ratio?: number; bright?: number; send?: number }
function bell(freq: number, { at = 0, dur = 1.4, gain = .22, pan = 0, ratio = 3.5, bright = 1.6, send = 1 }: BellOpts = {}) {
  if (!ready()) return;
  const c = ctx!, t = c.currentTime + at;
  const car = c.createOscillator(), mod = c.createOscillator(), mg = c.createGain(), g = c.createGain();
  car.frequency.value = freq; mod.frequency.value = freq * ratio;
  mg.gain.setValueAtTime(freq * bright, t);
  mg.gain.exponentialRampToValueAtTime(freq * .02, t + dur * .6);
  mod.connect(mg); mg.connect(car.frequency);
  env(g, t, .006, gain, dur);
  car.connect(g); route(g, pan, send);
  car.start(t); mod.start(t); car.stop(t + dur + .05); mod.stop(t + dur + .05);
}
interface BlipOpts { at?: number; dur?: number; gain?: number; type?: OscillatorType; pan?: number; send?: number }
function blip(f1: number, f2: number, { at = 0, dur = .12, gain = .08, type = 'sine', pan = 0, send = .4 }: BlipOpts = {}) {
  if (!ready()) return;
  const c = ctx!, t = c.currentTime + at, o = c.createOscillator(), g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(f1, t); o.frequency.exponentialRampToValueAtTime(f2, t + dur);
  env(g, t, .004, gain, dur);
  o.connect(g); route(g, pan, send); o.start(t); o.stop(t + dur + .03);
}
function tap({ at = 0, gain = .12, pan = 0, freq = 1400 } = {}) {
  if (!ready()) return;
  const c = ctx!, t = c.currentTime + at, len = .07;
  const buf = c.createBuffer(1, Math.ceil(c.sampleRate * len), c.sampleRate), ch = buf.getChannelData(0);
  for (let i = 0; i < ch.length; i++) ch[i] = (Math.random() * 2 - 1) * (1 - i / ch.length) ** 3;
  const src = c.createBufferSource(), bp = c.createBiquadFilter(), g = c.createGain();
  src.buffer = buf; bp.type = 'bandpass'; bp.frequency.value = freq; bp.Q.value = 1.2; g.gain.value = gain;
  src.connect(bp); bp.connect(g); route(g, pan, .15); src.start(t);
}
const pentaNote = (oct: number, k: number) => BASE * 2 ** (oct + PENTA[k % 5] / 12 + Math.floor(k / 5));

export type MarkState = 'ok' | 'bad' | 'none';
/** delay between ring positions when Check sweeps the compass — motion uses it too */
export const CHECK_STEP = .085;

export const Sound = {
  init,
  get on() { return on; },
  toggle() {
    on = !on;
    try { localStorage.setItem('compass-sound', on ? 'on' : 'off'); } catch { /* ignore */ }
    if (on) { init(); bell(fSlot(0) * 2, { gain: .12, dur: .8 }); }
    return on;
  },
  tick(x?: number) { blip(2200, 1800, { dur: .03, gain: .03, pan: panOf(x), send: 0 }); },
  select(x?: number) { blip(660, 990, { dur: .07, gain: .05, pan: panOf(x) }); },
  /** soft rising shimmer while a hold builds, then a chime when the card opens */
  hold(x?: number) { blip(880, 1320, { dur: .4, gain: .025, pan: panOf(x), send: .6 }); },
  reveal(i: number, x?: number) {
    bell(fSlot(i) * 2, { gain: .1, dur: 1.2, ratio: 2, bright: .7, pan: panOf(x) });
  },
  place(i: number, kind: Kind, x: number | undefined, paired: boolean) {
    const f = fSlot(i) * (kind === 'emoji' ? 1 : .5);
    bell(f, { gain: kind === 'emoji' ? .2 : .16, bright: kind === 'emoji' ? 1.8 : .9, pan: panOf(x) });
    tap({ gain: .05, pan: panOf(x), freq: 900 });
    if (paired) bell(fSlot(i) * 1.5, { at: .09, gain: .07, dur: 1.1, ratio: 2, bright: .6, pan: panOf(x) });
  },
  check(states: MarkState[], solvedLines: number[], won: boolean) {
    if (!ready()) return;
    const step = CHECK_STEP;
    states.forEach((s, i) => {
      const pan = Math.sin((-90 + 45 * i) * Math.PI / 180 + Math.PI / 2) * .6;
      if (s === 'ok') bell(fSlot(i), { at: i * step, gain: .16, dur: 1.1, pan });
      else if (s === 'bad') blip(120, 70, { at: i * step, dur: .16, gain: .09, pan, send: .1 });
    });
    const after = states.length * step + .1;
    solvedLines.forEach((l, k) => {
      bell(fSlot(l), { at: after + k * .16, gain: .13, dur: 2, ratio: 2, bright: .9, pan: -.4 });
      bell(fSlot(l + 4), { at: after + k * .16, gain: .13, dur: 2, ratio: 2, bright: .9, pan: .4 });
    });
    if (won) this.win(after + solvedLines.length * .16 + .2);
  },
  win(at = 0) {
    if (!ready()) return;
    [...new Set(SEMI)].concat([12, 16, 19, 24]).forEach((s, k) =>
      bell(BASE * 2 ** (s / 12), { at: at + k * .07, gain: .12, dur: 2.4, pan: Math.sin(k) * .6 }));
    [0, 7, 12, 16].forEach(s => bell(BASE / 2 * 2 ** (s / 12), { at: at + .9, gain: .09, dur: 4, ratio: 2, bright: .5 }));
    for (let k = 0; k < 14; k++)
      blip(pentaNote(2, k), pentaNote(2, k), { at: at + 1 + Math.random() * 1.6, dur: .08, gain: .03, pan: Math.random() * 1.6 - .8 });
  },
  hint() { for (let k = 0; k < 6; k++) blip(pentaNote(1, k * 2), pentaNote(1, k * 2 + 1), { at: k * .045, dur: .07, gain: .045, pan: -.5 + k * .2 }); },
  reset() {
    if (!ready()) return;
    for (let k = 0; k < 10; k++) {
      const f = pentaNote(1, Math.random() * 10 | 0);
      blip(f, f * .98, { at: k * .032 + Math.random() * .02, dur: .08, gain: .035, pan: Math.random() * 1.4 - .7, send: .5 });
    }
  },
};
