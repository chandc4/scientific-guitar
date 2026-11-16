// Curriculum lessons (M6). Each lesson gates on prerequisite lessons/skills.

export interface Lesson {
  id: string;
  title: string;
  phase: number;
  skillIds: string[];
  prerequisiteLessons: string[];
  estimatedMinutes: number;
  description: string;
}

export const LESSONS: Lesson[] = [
  { id: 'L1', title: 'Fretboard naturals (strings 1-3)', phase: 1, skillIds: ['fret:natural:s1','fret:natural:s2','fret:natural:s3'], prerequisiteLessons: [], estimatedMinutes: 20, description: 'Name natural notes on the top three strings.' },
  { id: 'L2', title: 'Fretboard naturals (strings 4-6)', phase: 1, skillIds: ['fret:natural:s4','fret:natural:s5','fret:natural:s6'], prerequisiteLessons: ['L1'], estimatedMinutes: 20, description: 'Complete the fretboard naturals.' },
  { id: 'L3', title: 'All strings + neighborhood', phase: 1, skillIds: ['fret:natural:allstrings','fret:natural:neighborhood'], prerequisiteLessons: ['L2'], estimatedMinutes: 20, description: 'Speed and neighborhood navigation.' },
  { id: 'L4', title: 'Intervals: note above & semitones', phase: 1, skillIds: ['int:up','int:semis'], prerequisiteLessons: [], estimatedMinutes: 20, description: 'Name the note a given interval above; count semitones.' },
  { id: 'L5', title: 'Interval navigation on fretboard', phase: 1, skillIds: ['fret:intnav','fret:octave'], prerequisiteLessons: ['L3','L4'], estimatedMinutes: 20, description: 'Find intervals and octaves on the neck.' },
  { id: 'L6', title: 'Chromatic fretboard', phase: 2, skillIds: ['fret:chromatic:s1','fret:chromatic:s2','fret:chromatic:s3','fret:chromatic:s4','fret:chromatic:s5','fret:chromatic:s6'], prerequisiteLessons: ['L3'], estimatedMinutes: 30, description: 'All 12 notes on every string.' },
  { id: 'L7', title: 'Major scale spelling & key signatures', phase: 2, skillIds: ['scale:major','keysig'], prerequisiteLessons: ['L4'], estimatedMinutes: 25, description: 'Spell major scales and key signatures.' },
  { id: 'L8', title: 'Diatonic chords & keys of a chord', phase: 3, skillIds: ['diatonic:triads','diatonic:keys-of-chord'], prerequisiteLessons: ['L7'], estimatedMinutes: 25, description: 'Diatonic triads and which keys contain a chord.' },
  { id: 'L9', title: 'Transposition', phase: 3, skillIds: ['transpose:to-chords','transpose:to-numerals'], prerequisiteLessons: ['L8'], estimatedMinutes: 20, description: 'Numerals ↔ chords in any key.' },
  { id: 'L10', title: 'Ear training: intervals', phase: 2, skillIds: ['ear:interval'], prerequisiteLessons: ['L4'], estimatedMinutes: 20, description: 'Hear and name intervals.' },
  { id: 'L11', title: 'Ear training: chords & degrees', phase: 3, skillIds: ['ear:chord','ear:degree'], prerequisiteLessons: ['L8','L10'], estimatedMinutes: 25, description: 'Hear chord qualities and scale degrees.' },
  { id: 'L12', title: 'Raga & blues introduction', phase: 3, skillIds: [], prerequisiteLessons: ['L9','L11'], estimatedMinutes: 30, description: 'Explore ragas and blues forms.' },
];
