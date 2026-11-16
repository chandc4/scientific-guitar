import { describe, expect, it } from 'vitest';
import { RAGAS, identifyRaga, ragaById, arohaMidis, sargamName } from './raga';

describe('raga corpus', () => {
  it('has 12 ragas', () => expect(RAGAS.length).toBe(12));
  it('each raga has aroha starting at 0', () => {
    for (const r of RAGAS) expect(r.aroha[0]).toBe(0);
  });
  it('ragaById works', () => expect(ragaById('yaman')?.name).toBe('Yaman'));
  it('arohaMidis', () => {
    const r = ragaById('bhoopali')!;
    expect(arohaMidis(r, 60)).toEqual([60, 64, 67, 69, 72]);
  });
  it('sargamName', () => {
    expect(sargamName(0)).toBe('Sa');
    expect(sargamName(7)).toBe('Pa');
  });
  it('identifyRaga finds Yaman from its pakad', () => {
    const r = ragaById('yaman')!;
    const phrase = r.pakad[0]!;
    const hits = identifyRaga(phrase);
    expect(hits.map((h) => h.id)).toContain('yaman');
  });
});
