// Ear-training exercise definitions and generators (pure).

import { chordMidis, degreeMidi, playChord, playInterval, playTone, type ChordQualityEar } from '../audio/synth';

export type ExerciseKind = 'interval' | 'chord' | 'degree';

export interface IntervalExercise {
  kind: 'interval';
  rootMidi: number;
  semitones: number;
  direction: 'up' | 'down';
  mode: 'melodic' | 'harmonic';
}

export interface ChordExercise {
  kind: 'chord';
  rootMidi: number;
  quality: ChordQualityEar;
}

export interface DegreeExercise {
  kind: 'degree';
  keyRootMidi: number;
  degree: number; // 1..7
}

export type Exercise = IntervalExercise | ChordExercise | DegreeExercise;

export interface ExerciseConfig {
  // interval
  intervals: number[];       // semitone values allowed
  directions: ('up' | 'down')[];
  modes: ('melodic' | 'harmonic')[];
  // chord
  chords: ChordQualityEar[];
  // degree
  degrees: number[];        // 1..7
  // common
  rootRange: [number, number]; // MIDI range for root
  keyRange: [number, number];
}

export const DEFAULT_CONFIG: ExerciseConfig = {
  intervals: [3, 4, 5, 7, 8, 9],
  directions: ['up'],
  modes: ['melodic'],
  chords: ['maj', 'min', 'dim', 'aug'],
  degrees: [1, 2, 3, 4, 5, 6, 7],
  rootRange: [48, 72],
  keyRange: [48, 60],
};

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

export function genInterval(cfg: ExerciseConfig): IntervalExercise {
  return {
    kind: 'interval',
    rootMidi: randInt(cfg.rootRange[0], cfg.rootRange[1]),
    semitones: pick(cfg.intervals),
    direction: pick(cfg.directions),
    mode: pick(cfg.modes),
  };
}

export function genChord(cfg: ExerciseConfig): ChordExercise {
  return {
    kind: 'chord',
    rootMidi: randInt(cfg.rootRange[0], cfg.rootRange[1]),
    quality: pick(cfg.chords),
  };
}

export function genDegree(cfg: ExerciseConfig): DegreeExercise {
  return {
    kind: 'degree',
    keyRootMidi: randInt(cfg.keyRange[0], cfg.keyRange[1]),
    degree: pick(cfg.degrees),
  };
}

export function genExercise(kind: ExerciseKind, cfg: ExerciseConfig): Exercise {
  if (kind === 'interval') return genInterval(cfg);
  if (kind === 'chord') return genChord(cfg);
  return genDegree(cfg);
}

// Unique key for an exercise item (for SRS / mastery tracking).
export function exerciseKey(ex: Exercise): string {
  if (ex.kind === 'interval') return `iv:${ex.semitones}:${ex.direction}:${ex.mode}`;
  if (ex.kind === 'chord') return `ch:${ex.quality}`;
  return `deg:${ex.degree}`;
}

// Answer option sets.
export function intervalOptions(cfg: ExerciseConfig): number[] {
  return [...cfg.intervals].sort((a, b) => a - b);
}
export function chordOptions(cfg: ExerciseConfig): ChordQualityEar[] {
  return [...cfg.chords];
}
export function degreeOptions(cfg: ExerciseConfig): number[] {
  return [...cfg.degrees].sort((a, b) => a - b);
}

// Playback helpers.
export function playExercise(ex: Exercise): void {
  if (ex.kind === 'interval') {
    const semis = ex.direction === 'down' ? -ex.semitones : ex.semitones;
    playInterval(ex.rootMidi, semis, ex.mode === 'harmonic' ? 'harmonic' : (ex.direction === 'down' ? 'melodic-down' : 'melodic-up'));
  } else if (ex.kind === 'chord') {
    playChord(chordMidis(ex.rootMidi, ex.quality));
  } else {
    const m = degreeMidi(ex.keyRootMidi, ex.degree);
    playTone(440 * Math.pow(2, (m - 69) / 12), 0.9);
  }
}
