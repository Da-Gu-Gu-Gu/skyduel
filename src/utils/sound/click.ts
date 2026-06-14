// A short, synthesized "click" blip using the Web Audio API — no asset file needed.
// The AudioContext is created lazily and resumed on demand; since this only ever runs
// inside a click handler (a user gesture), autoplay policies are satisfied.

let audioCtx: AudioContext | null = null;

const getCtx = (): AudioContext | null => {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  audioCtx = audioCtx ?? new Ctor();
  return audioCtx;
};

export const playClickSound = () => {
  const ctx = getCtx();
  if (!ctx) return;
  if (ctx.state === "suspended") ctx.resume();

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "triangle";
  osc.frequency.setValueAtTime(620, now);
  osc.frequency.exponentialRampToValueAtTime(920, now + 0.05);

  // Quick pluck envelope so it reads as a tactile "click", not a tone.
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.15, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.13);
};
