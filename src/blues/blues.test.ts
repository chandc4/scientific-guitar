import { describe, expect, it } from 'vitest';
import { progressionChords, chordMidisForBlues } from './blues';

describe('blues progression', () => {
  it('has 12 bars', () => {
    expect(progressionChords(60, 'standard').length).toBe(12);
  });
  it('first bar is I7', () => {
    const c = progressionChords(60, 'standard')[0]!;
    expect(c.degree).toBe(1);
    expect(c.rootMidi).toBe(60);
  });
  it('chordMidisForBlues dominant 7', () => {
    const c = progressionChords(60, 'standard')[0]!;
    expect(chordMidisForBlues(c)).toEqual([60, 64, 67, 70]);
  });
});
