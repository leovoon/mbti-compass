import type { FnId } from "../data";

export type Cue =
  | "select"
  | "pull"
  | "launch"
  | "bounce"
  | "hit"
  | "combo"
  | "attack"
  | "strike"
  | "choice"
  | "clear"
  | "win"
  | "lose";
export interface Tone {
  frequency: number;
  end: number;
  duration: number;
  delay: number;
  gain: number;
  wave: OscillatorType;
}
const notes: Record<FnId, number> = { Ni: 0, Se: 7, Ne: 2, Si: 9, Ti: 4, Fe: 11, Te: 5, Fi: 12 };
/** Pure score generation keeps the effects testable without an audio device. */
export function score(cue: Cue, fn: FnId = "Ni", amount = 0): Tone[] {
  const root = 293.66 * 2 ** (notes[fn] / 12);
  const tone = (
    frequency: number,
    end = frequency,
    duration = 0.12,
    delay = 0,
    gain = 0.09,
    wave: OscillatorType = "sine",
  ): Tone => ({ frequency, end, duration, delay, gain, wave });
  switch (cue) {
    case "pull":
      return [tone(root * (1 + Math.min(1, Math.max(0, amount))), root * 1.5, 0.055, 0, 0.025)];
    case "launch":
      return [tone(root * 2, root / 2, 0.23, 0, 0.13, "triangle")];
    case "bounce":
      return [tone(root * 2, root * 1.7, 0.065, 0, 0.045)];
    case "hit":
      return [
        tone(root / 2, 70, 0.14, 0, 0.12, "triangle"),
        tone(root * 2 ** (Math.min(amount, 8) / 12), root * 2, 0.17, 0.015, 0.065),
      ];
    case "attack":
      return [
        tone(root / 2, root / 4, 0.3, 0, 0.11, "sawtooth"),
        tone(root * 1.06, root / 2, 0.22, 0.02, 0.05, "square"),
      ];
    case "combo":
      return [tone(root, root, 0.18, 0, 0.06), tone(root * 1.5, root * 2, 0.2, 0.035, 0.05)];
    case "strike":
      return [0, 7, 12].map((n, i) =>
        tone(root * 2 ** (n / 12), root * 2 ** ((n + 12) / 12), 0.25, i * 0.045, 0.075, "triangle"),
      );
    case "clear":
    case "win":
      return (cue === "win" ? [0, 4, 7, 12, 16, 19] : [0, 4, 7]).map((n, i) =>
        tone(293.66 * 2 ** (n / 12), 293.66 * 2 ** (n / 12), 0.35, i * 0.085, 0.07),
      );
    case "lose":
      return [tone(root, root / 2, 0.4, 0, 0.08, "triangle")];
    case "choice":
      return [tone(root, root * 1.5, 0.12, 0, 0.055)];
    default:
      return [tone(660, 990, 0.06, 0, 0.04)];
  }
}

let enabled = true;
try {
  enabled = localStorage.getItem("compass-sound") !== "off";
} catch {
  /* Storage is optional. */
}
let context: AudioContext | null = null;
let master: GainNode | null = null;
const voices = new Set<OscillatorNode>();
const last = new Map<Cue, number>();
function stop() {
  for (const oscillator of voices) {
    try {
      oscillator.stop();
    } catch {
      /* Already ended. */
    }
  }
  voices.clear();
  last.clear();
}
export const ArenaAudio = {
  get on() {
    return enabled;
  },
  unlock() {
    if (!enabled) return;
    try {
      if (!context || context.state === "closed") {
        const AC =
          window.AudioContext ||
          (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!AC) return;
        context = new AC();
        master = context.createGain();
        master.gain.value = 0.55;
        const limiter = context.createDynamicsCompressor();
        master.connect(limiter);
        limiter.connect(context.destination);
      }
      if (context.state === "suspended") void context.resume().catch(() => {});
    } catch {
      /* Audio failures never block play. */
    }
  },
  toggle() {
    enabled = !enabled;
    try {
      localStorage.setItem("compass-sound", enabled ? "on" : "off");
    } catch {
      /* Storage is optional. */
    }
    if (!enabled) stop();
    else this.unlock();
    return enabled;
  },
  stop,
  play(cue: Cue, fn: FnId = "Ni", amount = 0, pan = 0) {
    if (!enabled || !context || !master || context.state !== "running") return;
    const now = context.currentTime;
    const interval = cue === "pull" ? 0.09 : cue === "bounce" || cue === "hit" ? 0.045 : 0;
    if (now - (last.get(cue) ?? -Infinity) < interval) return;
    last.set(cue, now);
    for (const note of score(cue, fn, amount)) {
      if (voices.size >= 24) break;
      const osc = context.createOscillator(),
        envelope = context.createGain();
      const panner = context.createStereoPanner?.();
      const start = now + note.delay,
        end = start + note.duration;
      osc.type = note.wave;
      osc.frequency.setValueAtTime(note.frequency, start);
      osc.frequency.exponentialRampToValueAtTime(note.end, end);
      envelope.gain.setValueAtTime(0.0001, start);
      envelope.gain.exponentialRampToValueAtTime(note.gain, start + 0.006);
      envelope.gain.exponentialRampToValueAtTime(0.0001, end);
      osc.connect(envelope);
      if (panner) {
        panner.pan.value = Math.max(-0.7, Math.min(0.7, pan));
        envelope.connect(panner);
        panner.connect(master);
      } else envelope.connect(master);
      voices.add(osc);
      osc.onended = () => {
        voices.delete(osc);
        osc.disconnect();
        envelope.disconnect();
        panner?.disconnect();
      };
      osc.start(start);
      osc.stop(end + 0.02);
    }
  },
};
