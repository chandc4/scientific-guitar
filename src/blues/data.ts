// Blues module data (M5).

export type BluesForm = 'standard' | 'quick-change' | 'minor';

export interface BluesProgression { bars: number[]; } // scale degrees per bar (1,4,5)

export const BLUES_FORMS: Record<BluesForm, { name: string; bars: number[] }> = {
  standard: { name: 'Standard 12-bar', bars: [1,1,1,1,4,4,1,1,5,4,1,5] },
  'quick-change': { name: 'Quick change', bars: [1,4,1,1,4,4,1,1,5,4,1,5] },
  minor: { name: 'Minor blues', bars: [1,1,1,1,4,4,1,1,5,4,1,5] },
};

// Licks: arrays of semitone offsets from the key root (Sa/root), with rhythm ignored (equal notes).
export interface Lick { id: string; name: string; key: string; notes: number[]; description: string }

export const LICKS: Lick[] = [
  { id: 'l1', name: 'Minor pentatonic walk', key: 'any', notes: [0,3,5,6,7,5,3,0], description: 'Classic minor pentatonic descent/ascent.' },
  { id: 'l2', name: 'Blues scale run', key: 'any', notes: [0,3,5,6,7,10,7,5,3,0], description: 'Includes the blue note (6).' },
  { id: 'l3', name: 'Major blues turnaround', key: 'any', notes: [7,4,2,0,-1,0,2,4,7], description: 'Turnaround lick over V7-IV7-I.' },
  { id: 'l4', name: 'Double stop thirds', key: 'any', notes: [0,4,3,7,5,9,7,4], description: 'Parallel thirds, country-blues flavour.' },
  { id: 'l5', name: 'Wes Montgomery octaves', key: 'any', notes: [0,12,2,14,4,16,5,17], description: 'Octave melody (play both notes).' },
  { id: 'l6', name: 'B.B. King box', key: 'any', notes: [10,7,5,3,0,3,5,7,10], description: 'High-position blues box.' },
];
