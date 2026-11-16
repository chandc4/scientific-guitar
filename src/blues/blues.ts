// Blues helpers.

import { playChord, playSequence } from '../audio/synth';
import { BLUES_FORMS, type BluesForm, LICKS } from './data';

export interface BluesChord { degree: number; rootMidi: number; quality: '7' | 'm7' }

export function progressionChords(keyRootMidi: number, form: BluesForm = 'standard', minor = false): BluesChord[] {
  const steps = [0, 2, 4, 5, 7, 9, 11];
  const formBars = BLUES_FORMS[form].bars;
  return formBars.map((deg) => {
    const idx = deg - 1;
    const rootMidi = keyRootMidi + steps[idx % 7]! + Math.floor(idx / 7) * 12;
    return { degree: deg, rootMidi, quality: minor ? 'm7' : '7' };
  });
}

export function chordMidisForBlues(bc: BluesChord): number[] {
  // dominant/minor 7: root, M3/m3, P5, m7
  const third = bc.quality === '7' ? 4 : 3;
  return [bc.rootMidi, bc.rootMidi + third, bc.rootMidi + 7, bc.rootMidi + 10];
}

export async function playProgression(keyRootMidi: number, form: BluesForm = 'standard', bpm = 120): Promise<void> {
  const { ensureAudioRunning } = await import('../audio/context');
  await ensureAudioRunning();
  const chords = progressionChords(keyRootMidi, form);
  const beat = 60 / bpm;
  const barDur = beat * 4;
  // We'll schedule via playChord with delays using setTimeout chaining (simple).
  for (let i = 0; i < chords.length; i++) {
    const c = chords[i]!;
    const midis = chordMidisForBlues(c);
    setTimeout(() => { playChord(midis, barDur * 0.9); }, i * barDur * 1000);
  }
}

export async function playLick(lickId: string, keyRootMidi = 60): Promise<void> {
  const lick = LICKS.find((l) => l.id === lickId);
  if (!lick) return;
  const { ensureAudioRunning } = await import('../audio/context');
  await ensureAudioRunning();
  const midis = lick.notes.map((s) => keyRootMidi + s);
  playSequence(midis, 0.22, 0.04);
}

export { LICKS, BLUES_FORMS };
export type { BluesForm };
