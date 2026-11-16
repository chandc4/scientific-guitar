import { describe, expect, it } from 'vitest';
import { LESSONS, availableLessons, nextLesson, progress, planSession } from './curriculum';

describe('curriculum', () => {
  it('has 12 lessons', () => expect(LESSONS.length).toBe(12));
  it('L1 available initially', () => {
    const avail = availableLessons(new Set());
    expect(avail.map((l) => l.id)).toContain('L1');
    expect(avail.map((l) => l.id)).toContain('L4');
  });
  it('L2 requires L1', () => {
    const avail = availableLessons(new Set());
    expect(avail.map((l) => l.id)).not.toContain('L2');
    const avail2 = availableLessons(new Set(['L1']));
    expect(avail2.map((l) => l.id)).toContain('L2');
  });
  it('nextLesson picks L1 first', () => {
    expect(nextLesson(new Set())?.id).toBe('L1');
  });
  it('progress', () => {
    const p = progress(new Set(['L1', 'L2']));
    expect(p.done).toBe(2);
    expect(p.total).toBe(12);
  });
  it('planSession', () => {
    const plan = planSession(new Set(), 30);
    expect(plan.length).toBeGreaterThan(0);
  });
});
