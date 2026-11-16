import { describe, expect, it } from 'vitest';
import { emptyMatrix, record, accuracyFor, mostConfused, totals } from './confusion';

describe('confusion matrix', () => {
  it('records and computes accuracy', () => {
    let m = emptyMatrix();
    m = record(m, 'm3', 'm3');
    m = record(m, 'm3', 'M3');
    m = record(m, 'm3', 'm3');
    expect(accuracyFor(m, 'm3')).toBeCloseTo(2 / 3);
  });
  it('mostConfused', () => {
    let m = emptyMatrix();
    m = record(m, 'm3', 'M3');
    m = record(m, 'm3', 'M3');
    m = record(m, 'm3', 'm3');
    expect(mostConfused(m, 'm3')).toBe('M3');
  });
  it('totals', () => {
    let m = emptyMatrix();
    m = record(m, 'a', 'a');
    m = record(m, 'b', 'a');
    const t = totals(m);
    expect(t.total).toBe(2);
    expect(t.correct).toBe(1);
  });
});
