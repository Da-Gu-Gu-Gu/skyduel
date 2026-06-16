// Per-emote sound effects, synthesized with the Web Audio API (no asset files,
// same lazy-context approach as click.ts). Each emote is a layered musical phrase
// — melody + harmony + sub-bass + sparkle arpeggios, routed through a lowpass
// filter (and optional vibrato) so it reads as a produced game SFX rather than a
// plain notification beep. Phrase lengths are matched to each emote's GSAP
// animation duration in emoteAnimations.ts so audio and motion finish together.

import type { EmoteType } from "../../pages/Home/emotes";

let audioCtx: AudioContext | null = null;

const getCtx = (): AudioContext | null => {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  audioCtx = audioCtx ?? new Ctor();
  return audioCtx;
};

interface Note {
  /** Start offset from when the emote fires, in seconds. */
  start: number;
  /** Note length in seconds. */
  dur: number;
  /** Starting frequency in Hz. */
  freq: number;
  /** Optional target frequency to glide to over the note's duration. */
  to?: number;
  /** Override the emote's default waveform for this note (e.g. a square sparkle). */
  wave?: OscillatorType;
  /** Gain multiplier (0-1) relative to the emote gain — for layering harmonies quieter. */
  gain?: number;
  /** Vibrato depth in Hz; adds a gentle pitch wobble for a "magical"/instrument feel. */
  vibrato?: number;
}

interface EmoteSound {
  /** Default waveform for the phrase. */
  wave: OscillatorType;
  /** Peak gain (kept low so SFX stay gentle even when layered). */
  gain: number;
  /** Lowpass cutoff in Hz — lower = warmer/rounder, tames harsh square/saw harmonics. */
  cutoff: number;
  notes: Note[];
}

// Note frequencies (Hz): C4 262 E4 330 G4 392 A4 440 | C5 523 E5 659 G5 784 A5 880 B5 988 | C6 1047 E6 1319.
const SOUNDS: Record<EmoteType, EmoteSound> = {
  // happy (~1.8s): bright ascending arpeggio, harmony, then a sparkle flourish.
  happy: {
    wave: "triangle",
    gain: 0.13,
    cutoff: 6500,
    notes: [
      { start: 0, dur: 0.18, freq: 523 },
      { start: 0.16, dur: 0.18, freq: 659 },
      { start: 0.32, dur: 0.18, freq: 784 },
      { start: 0.48, dur: 0.34, freq: 1047 },
      { start: 0.48, dur: 0.34, freq: 659, gain: 0.5 }, // harmony third below
      { start: 0.82, dur: 0.5, freq: 784, vibrato: 6 },
      // sparkle tail
      { start: 1.0, dur: 0.1, freq: 1047, wave: "square", gain: 0.4 },
      { start: 1.12, dur: 0.1, freq: 1319, wave: "square", gain: 0.4 },
      { start: 1.24, dur: 0.1, freq: 1047, wave: "square", gain: 0.4 },
      { start: 1.36, dur: 0.44, freq: 1319, gain: 0.6, vibrato: 8 },
    ],
  },

  // laugh (~2.0s): bouncy "ha-ha-ha" pairs tumbling down over a low bob.
  laugh: {
    wave: "square",
    gain: 0.07,
    cutoff: 3200,
    notes: [
      { start: 0, dur: 0.09, freq: 680 },
      { start: 0.13, dur: 0.09, freq: 570 },
      { start: 0.26, dur: 0.09, freq: 680 },
      { start: 0.39, dur: 0.09, freq: 570 },
      { start: 0.52, dur: 0.09, freq: 640 },
      { start: 0.65, dur: 0.09, freq: 540 },
      { start: 0.78, dur: 0.09, freq: 640 },
      { start: 0.91, dur: 0.09, freq: 540 },
      { start: 1.04, dur: 0.09, freq: 600 },
      { start: 1.17, dur: 0.09, freq: 500 },
      { start: 1.3, dur: 0.09, freq: 600 },
      { start: 1.43, dur: 0.09, freq: 500 },
      { start: 1.56, dur: 0.18, freq: 560 },
      { start: 1.74, dur: 0.26, freq: 470 },
      // warm low bob underneath
      { start: 0, dur: 0.9, freq: 220, wave: "triangle", gain: 0.5 },
      { start: 0.95, dur: 0.9, freq: 196, wave: "triangle", gain: 0.5 },
    ],
  },

  // love (~1.75s): warm rise to a sustained chord with octave shimmer + vibrato.
  love: {
    wave: "sine",
    gain: 0.15,
    cutoff: 5000,
    notes: [
      { start: 0, dur: 0.28, freq: 659 },
      { start: 0.24, dur: 0.28, freq: 831 },
      { start: 0.48, dur: 0.72, freq: 988, vibrato: 5 },
      { start: 0.48, dur: 0.72, freq: 1318, gain: 0.45 }, // octave shimmer
      { start: 0.48, dur: 0.72, freq: 659, gain: 0.5 }, // body
      { start: 1.2, dur: 0.55, freq: 880, gain: 0.7, vibrato: 6 },
      { start: 1.2, dur: 0.55, freq: 1760, wave: "triangle", gain: 0.25 }, // sparkle
    ],
  },

  // cool (~2.45s): slow confident upward glides with a sub-bass, sustained finish.
  cool: {
    wave: "sawtooth",
    gain: 0.09,
    cutoff: 1900,
    notes: [
      { start: 0, dur: 0.5, freq: 330, to: 494 },
      { start: 0, dur: 0.5, freq: 165, wave: "sine", gain: 0.6 },
      { start: 0.45, dur: 0.6, freq: 494, to: 659 },
      { start: 0.45, dur: 0.6, freq: 247, wave: "sine", gain: 0.6 },
      { start: 1.0, dur: 0.65, freq: 659, to: 740 },
      { start: 1.0, dur: 0.65, freq: 330, wave: "sine", gain: 0.6 },
      { start: 1.6, dur: 0.85, freq: 740, to: 880, vibrato: 5 },
      { start: 1.6, dur: 0.85, freq: 440, wave: "sine", gain: 0.6 },
    ],
  },

  // think (~2.85s): pensive wandering "hmm…" with a questioning rise at the end.
  think: {
    wave: "sine",
    gain: 0.12,
    cutoff: 2400,
    notes: [
      { start: 0, dur: 0.42, freq: 466, to: 415 },
      { start: 0.4, dur: 0.45, freq: 440, to: 392 },
      { start: 0.85, dur: 0.55, freq: 415, to: 440, vibrato: 4 },
      { start: 1.4, dur: 0.55, freq: 392, to: 370 },
      { start: 1.95, dur: 0.45, freq: 415 },
      { start: 2.4, dur: 0.45, freq: 466, to: 523, vibrato: 6 }, // "?" lift
    ],
  },

  // surprised (~1.85s): big zip up, fluttering peak, then a descending sparkle.
  surprised: {
    wave: "triangle",
    gain: 0.14,
    cutoff: 6500,
    notes: [
      { start: 0, dur: 0.2, freq: 350, to: 1300 },
      { start: 0.2, dur: 0.12, freq: 1200 },
      { start: 0.34, dur: 0.12, freq: 1400 },
      { start: 0.48, dur: 0.12, freq: 1250 },
      { start: 0.62, dur: 0.12, freq: 1500 },
      { start: 0.76, dur: 0.32, freq: 1300, to: 1100 },
      // descending sparkle arpeggio
      { start: 1.1, dur: 0.1, freq: 1319, wave: "square", gain: 0.4 },
      { start: 1.22, dur: 0.1, freq: 1047, wave: "square", gain: 0.4 },
      { start: 1.34, dur: 0.1, freq: 880, wave: "square", gain: 0.4 },
      { start: 1.46, dur: 0.39, freq: 988, to: 784, gain: 0.6, vibrato: 6 },
    ],
  },

  // sad (~2.6s): slow drooping descent that trails off into the low register.
  sad: {
    wave: "sine",
    gain: 0.13,
    cutoff: 1500,
    notes: [
      { start: 0, dur: 0.42, freq: 440, to: 415 },
      { start: 0.38, dur: 0.44, freq: 392, to: 370 },
      { start: 0.78, dur: 0.46, freq: 349, to: 330 },
      { start: 1.2, dur: 0.5, freq: 311, to: 294, vibrato: 3 },
      { start: 1.7, dur: 0.5, freq: 294, to: 262 },
      { start: 2.1, dur: 0.5, freq: 262, to: 233, vibrato: 3 },
    ],
  },

  // angry (~1.4s): aggressive growling tremolo with grit + a sinking tail.
  angry: {
    wave: "sawtooth",
    gain: 0.16,
    cutoff: 1300,
    notes: [
      { start: 0, dur: 0.14, freq: 150 },
      { start: 0.16, dur: 0.14, freq: 120 },
      { start: 0.32, dur: 0.14, freq: 150 },
      { start: 0.48, dur: 0.14, freq: 120 },
      { start: 0.64, dur: 0.14, freq: 150 },
      { start: 0.8, dur: 0.14, freq: 120 },
      { start: 0.96, dur: 0.42, freq: 110, to: 70 },
      // detuned sub for grit
      { start: 0, dur: 1.36, freq: 75, wave: "square", gain: 0.4 },
    ],
  },
};

const playNote = (ctx: AudioContext, sound: EmoteSound, note: Note, dest: AudioNode) => {
  const now = ctx.currentTime + note.start;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();

  osc.type = note.wave ?? sound.wave;
  osc.frequency.setValueAtTime(note.freq, now);
  if (note.to) osc.frequency.exponentialRampToValueAtTime(note.to, now + note.dur);

  // Pluck/swell envelope so notes blend musically rather than clicking on/off.
  const peak = sound.gain * (note.gain ?? 1);
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(peak, now + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, now + note.dur);

  osc.connect(g).connect(dest);

  // Optional vibrato via a low-frequency oscillator modulating pitch.
  if (note.vibrato) {
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 5.5;
    lfoGain.gain.value = note.vibrato;
    lfo.connect(lfoGain).connect(osc.frequency);
    lfo.start(now);
    lfo.stop(now + note.dur + 0.05);
  }

  osc.start(now);
  osc.stop(now + note.dur + 0.05);
};

export const playEmoteSound = (type: EmoteType) => {
  const ctx = getCtx();
  if (!ctx) return;
  if (ctx.state === "suspended") ctx.resume();

  const sound = SOUNDS[type];
  if (!sound) return;

  // Shared signal chain: notes -> lowpass filter -> master gain -> output.
  const master = ctx.createGain();
  master.gain.value = 0.9;
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = sound.cutoff;
  filter.Q.value = 0.7;
  filter.connect(master).connect(ctx.destination);

  sound.notes.forEach((note) => playNote(ctx, sound, note, filter));
};
