// Shared AudioContext. Browsers require creation/resume inside a user gesture.

let ctx: AudioContext | null = null;

export function getAudioContext(): AudioContext {
  if (!ctx) {
    const Ctor = (window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext }).AudioContext
      ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) throw new Error('Web Audio not supported');
    ctx = new Ctor();
  }
  return ctx;
}

export async function ensureAudioRunning(): Promise<AudioContext> {
  const c = getAudioContext();
  if (c.state === 'suspended') await c.resume();
  return c;
}

export function closeAudioContext(): void {
  if (ctx) { ctx.close().catch(() => {}); ctx = null; }
}
