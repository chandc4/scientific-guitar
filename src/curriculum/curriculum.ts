// Curriculum helpers (pure).

import { LESSONS, type Lesson } from './data';
export { LESSONS };

export function lessonById(id: string): Lesson | undefined { return LESSONS.find((l) => l.id === id); }

export function availableLessons(completed: Set<string>): Lesson[] {
  return LESSONS.filter((l) => l.prerequisiteLessons.every((p) => completed.has(p)));
}

export function nextLesson(completed: Set<string>): Lesson | undefined {
  const avail = availableLessons(completed).filter((l) => !completed.has(l.id));
  return avail.sort((a, b) => a.phase - b.phase || LESSONS.indexOf(a) - LESSONS.indexOf(b))[0];
}

export function progress(completed: Set<string>): { done: number; total: number; percent: number } {
  const total = LESSONS.length;
  const done = LESSONS.filter((l) => completed.has(l.id)).length;
  return { done, total, percent: total ? Math.round((done / total) * 100) : 0 };
}

// Session plan: returns ordered list of lesson ids for a given available minutes.
export function planSession(completed: Set<string>, availableMinutes: number): string[] {
  const plan: string[] = [];
  let remaining = availableMinutes;
  const next = nextLesson(completed);
  if (next && remaining >= next.estimatedMinutes * 0.5) {
    plan.push(next.id);
    remaining -= next.estimatedMinutes;
  }
  // Add a review lesson if available time remains.
  const reviewCandidate = availableLessons(completed).find((l) => completed.has(l.id));
  if (reviewCandidate && remaining >= 10) plan.push(reviewCandidate.id);
  return plan;
}
