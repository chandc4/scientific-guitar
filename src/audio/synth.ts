// Piano-ish additive synthesiser for ear training. Pure helpers + Web Audio glue.

import { ensureAudioRunning, getAudioContext } from './context';

export interface ToneOpts {
  volume?: number;        // 0..1
  attack?: number;        // seconds
  decay?: number;         // seconds to sustain level
  sustain?: number;       // 0..1
  release?: number;       // seconds
  harmonics?: number[];   // multipliers
  harmonicAmps?: number[];// amplitudes
  inharmonicity?: number; // stretch factor
}

const DEFAULTS: Required<ToneOpts> = {
  volume: 0.35,
  attack: 0.008,
  decay: 0.25,
  sustain: 0.45,
  release: 0.35,
  harmonics: [1, 2, 3, 4, 5, 6],
  harmonicAmps: [1, 0.55, 0.32, 0.18, 0.1, 0.05],
  inharmonicity: 0.0004,
};

export function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

// Piano-like inharmonicity: f_n = n * f0 * sqrt(1 + B*n^2)
export function harmonicFreq(f0: number, n: number, B: number): number {
  return n * f0 * Math.sqrt(1 + B * n * n);
}

export interface NoteEvent { freq: number; start: number; duration: number }

export function scheduleNote(ctx: AudioContext, freq: number, when: number, duration: number, opts: ToneOpts = {}): void {
  const o = { ...DEFAULTS, ...opts };
  const master = ctx.createGain();
  master.gain.value = 1;
  master.connect(ctx.destination);

  for (let i = 0; i < o.harmonics.length; i++) {
    const n = o.harmonics[i]!;
    const amp = (o.harmonicAmps[i] ?? 0) * o.volume * (1 / o.harmonics.length);
    const f = harmonicFreq(freq, n, o.inharmonicity);
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = f;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0001, amp), when + o.attack);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0001, amp * o.sustain), when + o.attack + o.decay);
    g.gain.setValueAtTime(Math.max(0.0001, amp * o.sustain), when + duration);
    g.gain.exponentialRampToValueAtTime(0.0001, when + duration + o.release);
    osc.connect(g);
    g.connect(master);
    osc.start(when);
    osc.stop(when + duration + o.release + 0.05);
  }
}

export function playTone(freq: number, duration = 0.9, opts: ToneOpts = {}): void {
  const ctx = getAudioContext();
  ensureAudioRunning().then(() => {
    scheduleNote(ctx, freq, ctx.currentTime + 0.02, duration, opts);
  });
}

export function playInterval(rootMidi: number, semitones: number, mode: 'melodic-up' | 'melodic-down' | 'harmonic' = 'melodic-up', opts: ToneOpts = {}): void {
  const ctx = getAudioContext();
  ensureAudioRunning().then(() => {
    const t0 = ctx.currentTime + 0.05;
    const rootFreq = midiToFreq(rootMidi);
    const otherFreq = midiToFreq(rootMidi + semitones);
    if (mode === 'harmonic') {
      scheduleNote(ctx, rootFreq, t0, 1.1, opts);
      scheduleNote(ctx, otherFreq, t0, 1.1, opts);
    } else if (mode === 'melodic-down') {
      scheduleNote(ctx, rootFreq, t0, 0.7, opts);
      scheduleNote(ctx, otherFreq, t0 + 0.75, 0.7, opts);
    } else {
      scheduleNote(ctx, rootFreq, t0, 0.7, opts);
      scheduleNote(ctx, otherFreq, t0 + 0.75, 0.7, opts);
    }
  });
}

export function playChord(midis: number[], duration = 1.2, opts: ToneOpts = {}): void {
  const ctx = getAudioContext();
  ensureAudioRunning().then(() => {
    const t0 = ctx.currentTime + 0.05;
    for (const m of midis) scheduleNote(ctx, midiToFreq(m), t0, duration, opts);
  });
}

export function playSequence(midis: number[], noteDur = 0.45, gap = 0.05, opts: ToneOpts = {}): void {
  const ctx = getAudioContext();
  ensureAudioRunning().then(() => {
    let t = ctx.currentTime + 0.05;
    for (const m of midis) {
      scheduleNote(ctx, midiToFreq(m), t, noteDur, opts);
      t += noteDur + gap;
    }
  });
}

// Pure helper: chord MIDI notes from root + quality.
export type ChordQualityEar = 'maj' | 'min' | 'dim' | 'aug' | 'maj7' | '7' | 'm7' | 'dim7';
const CHORD_INTERVALS: Record<ChordQualityEar, number[]> = {
  maj: [0, 4, 7],
  min: [0, 3, 7],
  dim: [0, 3, 6],
  aug: [0, 4, 8],
  maj7: [0, 4, 7, 11],
  '7': [0, 4, 7, 10],
  m7: [0, 3, 7, 10],
  dim7: [0, 3, 6, 9],
};

export function chordMidis(rootMidi: number, quality: ChordQualityEar): number[] {
  return CHORD_INTERVALS[quality].map((s) => rootMidi + s);
}

// Pure helper: major scale MIDI degrees (1-based) from key root.
export function degreeMidi(keyRootMidi: number, degree: number): number {
  const majorSteps = [0, 2, 4, 5, 7, 9, 11];
  const idx = ((degree - 1) % 7 + 7) % 7;
  const oct = Math.floor((degree - 1) / 7);
  return keyRootMidi + majorSteps[idx]! + oct * 12;
}

// Interval name list used for answer pads.
export const INTERVAL_NAMES: { semitones: number; name: string; short: string }[] = [
  { semitones: 1, name: 'minor 2nd', short: 'm2' },
  { semitones: 2, name: 'major 2nd', short: 'M2' },
  { semitones: 3, name: 'minor 3rd', short: 'm3' },
  { semitones: 4, name: 'major 3rd', short: 'M3' },
  { semitones: 5, name: 'perfect 4th', short: 'P4' },
  { semitones: 6, name: 'tritone', short: 'TT' },
  { semitones: 7, name: 'perfect 5th', short: 'P5' },
  { semitones: 8, name: 'minor 6th', short: 'm6' },
  { semitones: 9, name: 'major 6th', short: 'M6' },
  { semitones: 10, name: 'minor 7th', short: 'm7' },
  { semitones: 11, name: 'major 7th', short: 'M7' },
  { semitones: 12, name: 'octave', short: 'P8' },
];

export const CHORD_QUALITY_NAMES: { quality: ChordQualityEar; name: string }[] = [
  { quality: 'maj', name: 'Major' },
  { quality: 'min', name: 'Minor' },
  { quality: 'dim', name: 'Diminished' },
  { quality: 'aug', name: 'Augmented' },
  { quality: 'maj7', name: 'Major 7' },
  { quality: '7', name: 'Dominant 7' },
  { quality: 'm7', name: 'Minor 7' },
  { quality: 'dim7', name: 'Dim 7' },
];

export const DEGREE_NAMES = ['1', '2', '3', '4', '5', '6', '7'];
