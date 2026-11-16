import { describe, expect, it } from 'vitest';
import { DEFAULT_CONFIG, exerciseKey, genExercise } from './exercises';
import { grade as g } from './grading';

describe('exercise generation', () => {
  it('generates interval exercise in range', () => {
    const ex = genExercise('interval', DEFAULT_CONFIG);
    expect(ex.kind).toBe('interval');
    if (ex.kind === 'interval') {
      expect(DEFAULT_CONFIG.intervals).toContain(ex.semitones);
      expect(ex.rootMidi).toBeGreaterThanOrEqual(DEFAULT_CONFIG.rootRange[0]);
      expect(ex.rootMidi).toBeLessThanOrEqual(DEFAULT_CONFIG.rootRange[1]);
    }
  });
  it('generates chord exercise', () => {
    const ex = genExercise('chord', DEFAULT_CONFIG);
    expect(ex.kind).toBe('chord');
  });
  it('generates degree exercise', () => {
    const ex = genExercise('degree', DEFAULT_CONFIG);
    expect(ex.kind).toBe('degree');
    if (ex.kind === 'degree') expect(ex.degree).toBeGreaterThanOrEqual(1);
  });
  it('exerciseKey is stable', () => {
    const ex = genExercise('interval', DEFAULT_CONFIG);
    expect(exerciseKey(ex)).toMatch(/^iv:/);
  });
});

describe('grading', () => {
  it('grades interval', () => {
    const ex = { kind: 'interval' as const, rootMidi: 60, semitones: 7, direction: 'up' as const, mode: 'melodic' as const };
    expect(g(ex, 7)).toBe(true);
    expect(g(ex, 5)).toBe(false);
  });
  it('grades chord', () => {
    const ex = { kind: 'chord' as const, rootMidi: 60, quality: 'min' as const };
    expect(g(ex, 'min')).toBe(true);
    expect(g(ex, 'maj')).toBe(false);
  });
  it('grades degree', () => {
    const ex = { kind: 'degree' as const, keyRootMidi: 60, degree: 5 };
    expect(g(ex, 5)).toBe(true);
    expect(g(ex, 3)).toBe(false);
  });
});
