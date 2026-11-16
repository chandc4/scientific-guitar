// Tanpura/drone player using Web Audio. Sustained tones with gentle tremolo
// (amplitude modulation) to mimic plucked-string resonance.

import { ensureAudioRunning, getAudioContext } from './context';

export type DroneTuning = 'sa-pa' | 'sa-ma' | 'sa-pa-sa';

export interface DroneOptions {
  rootPc: number;       // pitch class 0..11 of Sa
  octave?: number;      // Sa octave (default 3 = low-ish)
  tuning?: DroneTuning;
  volume?: number;      // 0..1
}

const PA_SEMITONES = 7;   // perfect 5th
const MA_SEMITONES = 5;   // perfect 4th

function stringMidi(rootPc: number, octave: number, offset: number): number {
  // rootPc + (octave+1)*12 + offset, clamped-ish
  return rootPc + (octave + 1) * 12 + offset;
}

export class DronePlayer {
  private nodes: AudioNode[] = [];
  private gains: GainNode[] = [];
  private master: GainNode | null = null;
  private lfo: OscillatorNode | null = null;
  private running = false;
  private opts: Required<DroneOptions>;

  constructor(opts: DroneOptions) {
    this.opts = {
      rootPc: opts.rootPc,
      octave: opts.octave ?? 3,
      tuning: opts.tuning ?? 'sa-pa',
      volume: opts.volume ?? 0.5,
    };
  }

  setVolume(v: number): void {
    this.opts.volume = Math.max(0, Math.min(1, v));
    if (this.master) this.master.gain.setTargetAtTime(this.opts.volume, getAudioContext().currentTime, 0.05);
  }

  setRoot(pc: number): void {
    this.opts.rootPc = pc;
    if (this.running) { this.stop(); this.start().catch(() => {}); }
  }

  setTuning(t: DroneTuning): void {
    this.opts.tuning = t;
    if (this.running) { this.stop(); this.start().catch(() => {}); }
  }

  isPlaying(): boolean { return this.running; }

  async start(): Promise<void> {
    if (this.running) return;
    const ctx = await ensureAudioRunning();
    const master = ctx.createGain();
    master.gain.value = 0;
    master.gain.linearRampToValueAtTime(this.opts.volume, ctx.currentTime + 0.3);
    master.connect(ctx.destination);
    this.master = master;

    // LFO for tremolo.
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 5.5;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.15;
    lfo.connect(lfoGain);
    lfo.start();
    this.lfo = lfo;

    // Determine string offsets.
    const offsets: number[] = [0]; // Sa (low)
    if (this.opts.tuning === 'sa-pa' || this.opts.tuning === 'sa-pa-sa') offsets.push(PA_SEMITONES);
    if (this.opts.tuning === 'sa-ma') offsets.push(MA_SEMITONES);
    if (this.opts.tuning === 'sa-pa-sa') offsets.push(12); // high Sa

    for (const off of offsets) {
      const midi = stringMidi(this.opts.rootPc, this.opts.octave, off);
      const freq = 440 * Math.pow(2, (midi - 69) / 12);
      this.addVoice(ctx, freq, master, lfoGain);
    }

    this.running = true;
  }

  private addVoice(ctx: AudioContext, freq: number, master: GainNode, lfoGain: GainNode): void {
    const voiceGain = ctx.createGain();
    voiceGain.gain.value = 0.4;
    // Tremolo: LFO modulates voice gain.
    const tremolo = ctx.createGain();
    tremolo.gain.value = 1;
    lfoGain.connect(tremolo.gain);
    voiceGain.connect(tremolo);
    tremolo.connect(master);

    const harmonics = [1, 2, 3];
    const harmonicGains = [1, 0.35, 0.15];
    for (let h = 0; h < harmonics.length; h++) {
      const osc = ctx.createOscillator();
      osc.type = h === 0 ? 'sine' : 'sine';
      osc.frequency.value = freq * harmonics[h]!;
      // slight detune for richness
      osc.detune.value = (Math.random() - 0.5) * 6;
      const g = ctx.createGain();
      g.gain.value = harmonicGains[h]! * 0.3;
      osc.connect(g);
      g.connect(voiceGain);
      osc.start();
      this.nodes.push(osc, g);
    }
    this.nodes.push(voiceGain, tremolo);
    this.gains.push(voiceGain);
  }

  stop(): void {
    if (!this.running || !this.master) return;
    const ctx = getAudioContext();
    const master = this.master;
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setTargetAtTime(0, ctx.currentTime, 0.1);
    const nodes = this.nodes;
    const lfo = this.lfo;
    setTimeout(() => {
      nodes.forEach((n) => { try { (n as OscillatorNode).stop?.(); } catch {} try { n.disconnect(); } catch {} });
      lfo?.stop(); lfo?.disconnect();
      master.disconnect();
    }, 250);
    this.nodes = [];
    this.gains = [];
    this.master = null;
    this.lfo = null;
    this.running = false;
  }
}
