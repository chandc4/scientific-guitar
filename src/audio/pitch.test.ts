import { describe, expect, it } from 'vitest';
import { detectPitch, frequencyToMidi, frequencyToNote, midiToFrequency } from './pitch';

describe('frequency helpers', () => {
  it('round-trips A4', () => {
    expect(midiToFrequency(69)).toBeCloseTo(440, 5);
    expect(frequencyToMidi(440)).toBeCloseTo(69, 5);
  });
  it('frequencyToNote A4', () => {
    const n = frequencyToNote(440)!;
    expect(n.name).toBe('A4');
    expect(n.cents).toBeCloseTo(0, 5);
    expect(n.pitchClass).toBe(9);
  });
  it('frequencyToNote detects cents off', () => {
    const n = frequencyToNote(445)!;
    expect(n.name).toBe('A4');
    expect(n.cents).toBeGreaterThan(0);
  });
  it('returns null for non-positive freq', () => {
    expect(frequencyToNote(0)).toBeNull();
    expect(frequencyToNote(-1)).toBeNull();
  });
});

describe('detectPitch (YIN)', () => {
  function sine(freq: number, sr: number, n: number): Float32Array {
    const buf = new Float32Array(n);
    for (let i = 0; i < n; i++) buf[i] = Math.sin((2 * Math.PI * freq * i) / sr);
    return buf;
  }
  it('detects 440 Hz', () => {
    const buf = sine(440, 44100, 2048);
    const r = detectPitch(buf, 44100);
    expect(r.frequency).toBeCloseTo(440, 0);
    expect(r.confidence).toBeGreaterThan(0.9);
  });
  it('detects 261.63 Hz (C4)', () => {
    const buf = sine(261.63, 44100, 2048);
    const r = detectPitch(buf, 44100);
    expect(r.frequency).toBeCloseTo(261.63, 0);
  });
  it('detects 880 Hz', () => {
    const buf = sine(880, 44100, 2048);
    const r = detectPitch(buf, 44100);
    expect(r.frequency).toBeCloseTo(880, 0);
  });
  it('returns 0/confidence 0 for silence', () => {
    const buf = new Float32Array(2048);
    const r = detectPitch(buf, 44100);
    expect(r.frequency).toBe(0);
  });
});
