// Grading for ear-training answers (pure).

import type { Exercise } from './exercises';

export function gradeInterval(ex: Extract<Exercise, { kind: 'interval' }>, answerSemis: number): boolean {
  return answerSemis === ex.semitones;
}

export function gradeChord(ex: Extract<Exercise, { kind: 'chord' }>, answer: string): boolean {
  return answer === ex.quality;
}

export function gradeDegree(ex: Extract<Exercise, { kind: 'degree' }>, answer: number): boolean {
  return answer === ex.degree;
}

export function grade(ex: Exercise, answer: unknown): boolean {
  if (ex.kind === 'interval') return gradeInterval(ex, answer as number);
  if (ex.kind === 'chord') return gradeChord(ex, answer as string);
  return gradeDegree(ex, answer as number);
}
