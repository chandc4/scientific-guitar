import { useState } from 'react'
import { playChord } from '../audio/synth'
import { ensureAudioRunning } from '../audio/context'

import './songlab.css'

interface ParsedChord { symbol: string; root: string; quality: string; midi: number }

const NOTE_TO_PC: Record<string, number> = { C:0,'C#':1,Db:1,D:2,'D#':3,Eb:3,E:4,F:5,'F#':6,Gb:6,G:7,'G#':8,Ab:8,A:9,'A#':10,Bb:10,B:11 }

function parseChord(sym: string): ParsedChord | null {
  const m = sym.match(/^([A-G][#b]?)(.*)$/)
  if (!m) return null
  const root = m[1]!
  const qual = m[2] || 'maj'
  const pc = NOTE_TO_PC[root]
  if (pc === undefined) return null
  const midi = 48 + pc // C3-based
  return { symbol: sym, root, quality: qual, midi }
}

const SAMPLES: { name: string; prog: string }[] = [
  { name: 'Let It Be (I-V-vi-IV)', prog: 'C G Am F' },
  { name: 'Stand By Me (I-vi-IV-V)', prog: 'C Am F G' },
  { name: '12-bar blues in C', prog: 'C7 C7 C7 C7 F7 F7 C7 C7 G7 F7 C7 G7' },
  { name: 'Autumn Leaves (ii-V-I)', prog: 'Am7 D7 Gmaj7 Cmaj7 F#m7b5 B7 Em' },
]

export function SongLab({ onBack }: { onBack: () => void }) {
  const [text, setText] = useState('C G Am F')
  const [playing, setPlaying] = useState(false)

  const chords = text.split(/\s+/).map(parseChord).filter(Boolean) as ParsedChord[]

  const playAll = async () => {
    await ensureAudioRunning()
    setPlaying(true)
    for (let i = 0; i < chords.length; i++) {
      const c = chords[i]!
      // simple triad
      const midis = [c.midi, c.midi + (c.quality.includes('m') ? 3 : 4), c.midi + 7]
      setTimeout(() => playChord(midis, 0.9), i * 1000)
    }
    setTimeout(() => setPlaying(false), chords.length * 1000)
  }

  return (
    <div className="screen songlab-screen">
      <div className="topbar">
        <span className="topbar-title">Song Lab</span>
        <button type="button" className="topbar-btn" onClick={onBack}>Done</button>
      </div>
      <div className="songlab-body">
        <label>Progression (space-separated chord symbols)</label>
        <input type="text" value={text} onChange={(e) => setText(e.target.value)} className="songlab-input" />
        <div className="songlab-samples">
          {SAMPLES.map((s) => <button key={s.name} type="button" className="songlab-sample" onClick={() => setText(s.prog)}>{s.name}</button>)}
        </div>
        <button type="button" className="ear-play-btn" onClick={playAll} disabled={playing || chords.length === 0}>
          {playing ? 'Playing…' : '▶ Play progression'}
        </button>
        <div className="songlab-chords">
          {chords.map((c, i) => (
            <div key={i} className="songlab-chord">
              <span className="songlab-sym">{c.symbol}</span>
              <span className="songlab-root">root: {c.root}</span>
              <button type="button" className="blues-playbar" onClick={() => { ensureAudioRunning().then(() => playChord([c.midi, c.midi + 4, c.midi + 7], 0.8)) }}>▶</button>
            </div>
          ))}
        </div>
        <div className="songlab-practice">
          <h4>Practice path</h4>
          <ul>
            <li>Play each chord's root, 3rd, 5th (arpeggio) over the progression.</li>
            <li>Improvise using the pentatonic of the key over the whole progression.</li>
            <li>Transpose the progression to 3 other keys.</li>
            <li>Identify the Roman numerals (I, IV, V, vi…) for each chord.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
