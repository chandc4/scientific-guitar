// M2 audio primitives — pure (testable) pitch-detection helpers.

export interface PitchResult {
  frequency: number;
  confidence: number;
}

function fractionalDiff(buffer: Float32Array, n: number, tau: number): number {
  let sum = 0;
  let count = 0;
  for (let i = 0; i < n; i++) {
    const j = i + tau;
    if (j >= n - 1) break;
    const j0 = Math.floor(j);
    const frac = j - j0;
    const v = buffer[j0]! + (buffer[j0 + 1]! - buffer[j0]!) * frac;
    const diff = buffer[i]! - v;
    sum += diff * diff;
    count++;
  }
  return count > 0 ? sum / count : Infinity;
}

export function detectPitch(buffer: Float32Array, sampleRate: number): PitchResult {
  const n = buffer.length;
  const half = Math.floor(n / 2);
  const d = new Float32Array(half);
  for (let tau = 0; tau < half; tau++) {
    let sum = 0;
    for (let i = 0; i + tau < n; i++) {
      const diff = buffer[i]! - buffer[i + tau]!;
      sum += diff * diff;
    }
    d[tau] = sum;
  }
  let rms = 0;
  for (let i = 0; i < n; i++) rms += buffer[i]! * buffer[i]!;
  rms = Math.sqrt(rms / n);
  if (rms < 1e-4) return { frequency: 0, confidence: 0 };

  const cmnd = new Float32Array(half);
  cmnd[0] = 1;
  let running = 0;
  for (let tau = 1; tau < half; tau++) {
    running += d[tau]!;
    cmnd[tau] = running === 0 ? 1 : (d[tau]! * tau) / running;
  }

  const minLag = Math.max(2, Math.floor(sampleRate / 1000));
  const threshold = 0.15;
  let tau = -1;
  for (let t = minLag; t < half - 1; t++) {
    if (cmnd[t]! < threshold && cmnd[t]! < cmnd[t - 1]! && cmnd[t]! <= cmnd[t + 1]!) {
      while (t + 1 < half - 1 && cmnd[t + 1]! < cmnd[t]!) t++;
      tau = t;
      break;
    }
  }
  if (tau === -1) {
    let min = Infinity;
    for (let t = minLag; t < half - 1; t++) {
      if (cmnd[t]! < min) { min = cmnd[t]!; tau = t; }
    }
    if (min > 0.5) return { frequency: 0, confidence: 0 };
  }

  // Fractional refinement via fine search around the integer minimum.
  let bestTau = tau;
  let bestVal = fractionalDiff(buffer, n, tau);
  const step0 = 0.1;
  for (let f = tau - 1; f <= tau + 1; f += step0) {
    const v = fractionalDiff(buffer, n, f);
    if (v < bestVal) { bestVal = v; bestTau = f; }
  }
  // refine
  for (let f = bestTau - 0.1; f <= bestTau + 0.1; f += 0.01) {
    const v = fractionalDiff(buffer, n, f);
    if (v < bestVal) { bestVal = v; bestTau = f; }
  }
  for (let f = bestTau - 0.01; f <= bestTau + 0.01; f += 0.001) {
    const v = fractionalDiff(buffer, n, f);
    if (v < bestVal) { bestVal = v; bestTau = f; }
  }

  if (bestTau <= 0) return { frequency: 0, confidence: 0 };
  const confidence = Math.max(0, 1 - cmnd[tau]!);
  return { frequency: sampleRate / bestTau, confidence };
}

export function frequencyToMidi(freq: number): number {
  if (freq <= 0) return 0;
  return 69 + 12 * Math.log2(freq / 440);
}

export function midiToFrequency(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export interface NoteInfo {
  midi: number;
  frequency: number;
  name: string;
  cents: number;
  pitchClass: number;
}

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export function frequencyToNote(freq: number): NoteInfo | null {
  if (freq <= 0) return null;
  const midiFloat = frequencyToMidi(freq);
  const midi = Math.round(midiFloat);
  const pc = ((midi % 12) + 12) % 12;
  const octave = Math.floor(midi / 12) - 1;
  const cents = 1200 * (midiFloat - midi);
  return {
    midi,
    frequency: midiToFrequency(midi),
    name: NOTE_NAMES[pc]! + octave,
    cents,
    pitchClass: pc,
  };
}

export function rootPcToMidi(pc: number, octave = 4): number {
  return pc + (octave + 1) * 12;
}
