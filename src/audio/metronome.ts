// Accurate metronome using the Web Audio lookahead scheduler pattern.

import { ensureAudioRunning, getAudioContext } from './context';

export interface MetronomeOptions {
  bpm?: number;
  beatsPerBar?: number;
  onTick?: (beat: number, time: number) => void;
}

export function secondsPerBeat(bpm: number): number {
  return 60 / Math.max(1, bpm);
}

export class Metronome {
  private bpm: number;
  private beatsPerBar: number;
  private onTick: ((beat: number, time: number) => void) | undefined;
  private timer: number | null = null;
  private nextBeatTime = 0;
  private beatIndex = 0;
  private running = false;
  private lookahead = 0.1; // seconds
  private scheduleAhead = 0.1;

  constructor(opts: MetronomeOptions = {}) {
    this.bpm = opts.bpm ?? 120;
    this.beatsPerBar = opts.beatsPerBar ?? 4;
    this.onTick = opts.onTick;
  }

  setBpm(bpm: number): void { this.bpm = Math.max(20, Math.min(300, bpm)); }
  getBpm(): number { return this.bpm; }
  setBeatsPerBar(n: number): void { this.beatsPerBar = Math.max(1, Math.min(12, n)); }
  getBeatsPerBar(): number { return this.beatsPerBar; }
  setOnTick(cb: ((beat: number, time: number) => void) | undefined): void { this.onTick = cb; }
  isRunning(): boolean { return this.running; }

  async start(): Promise<void> {
    if (this.running) return;
    const ctx = await ensureAudioRunning();
    this.running = true;
    this.beatIndex = 0;
    this.nextBeatTime = ctx.currentTime + 0.05;
    this.scheduler();
  }

  stop(): void {
    this.running = false;
    if (this.timer !== null) { window.clearTimeout(this.timer); this.timer = null; }
  }

  private scheduler(): void {
    if (!this.running) return;
    const ctx = getAudioContext();
    while (this.nextBeatTime < ctx.currentTime + this.scheduleAhead) {
      this.scheduleBeat(this.nextBeatTime, this.beatIndex);
      this.nextBeatTime += secondsPerBeat(this.bpm);
      this.beatIndex = (this.beatIndex + 1) % this.beatsPerBar;
    }
    this.timer = window.setTimeout(() => this.scheduler(), this.lookahead * 1000);
  }

  private scheduleBeat(time: number, beat: number): void {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const isDown = beat === 0;
    osc.frequency.value = isDown ? 1000 : 700;
    osc.type = 'square';
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(isDown ? 0.6 : 0.35, time + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.06);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(time);
    osc.stop(time + 0.08);
    this.onTick?.(beat, time);
  }
}
