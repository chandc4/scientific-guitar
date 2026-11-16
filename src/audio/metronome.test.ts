import { describe, expect, it } from 'vitest';
import { secondsPerBeat } from './metronome';

describe('secondsPerBeat', () => {
  it('120 bpm = 0.5s', () => expect(secondsPerBeat(120)).toBeCloseTo(0.5));
  it('60 bpm = 1s', () => expect(secondsPerBeat(60)).toBeCloseTo(1));
  it('clamps low bpm', () => expect(secondsPerBeat(0)).toBeCloseTo(secondsPerBeat(1)));
});
