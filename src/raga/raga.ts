// Raga helpers (pure + audio glue).

import { RAGAS, type Raga } from './data';
import { playSequence } from '../audio/synth';
import { DronePlayer } from '../audio/drone';
import { ensureAudioRunning } from '../audio/context';

const SARGAM = ['Sa', 'Re♭', 'Re', 'Ga♭', 'Ga', 'Ma', 'Ma♯', 'Pa', 'Dha♭', 'Dha', 'Ni♭', 'Ni'];

export function sargamName(semi: number): string { return SARGAM[((semi % 12) + 12) % 12]!; }

export function ragaById(id: string): Raga | undefined { return RAGAS.find((r) => r.id === id); }

// Convert aroha semitone offsets to MIDI note numbers given Sa MIDI.
export function arohaMidis(raga: Raga, saMidi: number): number[] {
  return raga.aroha.map((s) => saMidi + s);
}
export function avarohaMidis(raga: Raga, saMidi: number): number[] {
  return raga.avaroha.map((s) => saMidi + s);
}
export function pakadMidis(raga: Raga, saMidi: number): number[][] {
  return raga.pakad.map((p) => p.map((s) => saMidi + s));
}

export async function playAroha(raga: Raga, saMidi = 60): Promise<void> {
  await ensureAudioRunning();
  playSequence(arohaMidis(raga, saMidi), 0.35, 0.05);
}
export async function playAvaroha(raga: Raga, saMidi = 60): Promise<void> {
  await ensureAudioRunning();
  playSequence(avarohaMidis(raga, saMidi), 0.35, 0.05);
}
export async function playPakad(raga: Raga, idx = 0, saMidi = 60): Promise<void> {
  await ensureAudioRunning();
  const p = pakadMidis(raga, saMidi)[idx];
  if (p) playSequence(p, 0.3, 0.05);
}

export function ragaMatchesNotes(raga: Raga, semis: number[]): boolean {
  const set = new Set(raga.aroha);
  return semis.every((s) => set.has(((s % 12) + 12) % 12));
}

// Simple raga recognition: given a phrase (semitones), find ragas whose pakad contains a subsequence.
export function identifyRaga(phrase: number[]): Raga[] {
  const norm = phrase.map((s) => ((s % 12) + 12) % 12);
  const hits: Raga[] = [];
  for (const r of RAGAS) {
    for (const p of r.pakad) {
      const pn = p.map((s) => ((s % 12) + 12) % 12);
      // check if phrase contains pakad as subsequence
      let i = 0;
      for (const n of norm) {
        if (i < pn.length && n === pn[i]) i++;
      }
      if (i === pn.length) { hits.push(r); break; }
    }
  }
  return hits;
}

export { RAGAS };
export type { Raga };
export { DronePlayer };
