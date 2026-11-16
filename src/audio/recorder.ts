// Microphone recording + live level meter.

import { ensureAudioRunning, getAudioContext } from './context';

export class Recorder {
  private stream: MediaStream | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  private analyser: AnalyserNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private running = false;

  isRecording(): boolean { return this.running; }

  async start(): Promise<void> {
    if (this.running) return;
    await ensureAudioRunning();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.stream = stream;
    const ctx = getAudioContext();
    const source = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    source.connect(analyser);
    this.source = source;
    this.analyser = analyser;

    const mr = new MediaRecorder(stream);
    this.chunks = [];
    mr.ondataavailable = (e) => { if (e.data.size > 0) this.chunks.push(e.data); };
    mr.start();
    this.mediaRecorder = mr;
    this.running = true;
  }

  async stop(): Promise<Blob> {
    return new Promise((resolve) => {
      const mr = this.mediaRecorder;
      if (!mr) { resolve(new Blob()); return; }
      mr.onstop = () => {
        const blob = new Blob(this.chunks, { type: mr.mimeType || 'audio/webm' });
        this.cleanup();
        resolve(blob);
      };
      mr.stop();
    });
  }

  getLevel(): number {
    if (!this.analyser) return 0;
    const data = new Uint8Array(this.analyser.fftSize);
    this.analyser.getByteTimeDomainData(data);
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      const v = (data[i]! - 128) / 128;
      sum += v * v;
    }
    return Math.min(1, Math.sqrt(sum / data.length) * 3);
  }

  private cleanup(): void {
    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = null;
    this.mediaRecorder = null;
    this.analyser = null;
    this.source?.disconnect();
    this.source = null;
    this.running = false;
  }
}
