import { useEffect, useState } from 'react'
import { BLUES_FORMS, LICKS, type BluesForm } from '../blues/data'
import { progressionChords, chordMidisForBlues, playProgression, playLick } from '../blues/blues'
import { ensureAudioRunning } from '../audio/context'
import { playChord } from '../audio/synth'
import './blues.css'

type Tab = 'progression' | 'chordtones' | 'licks'

export function BluesPractice({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<Tab>('progression')
  const [form, setForm] = useState<BluesForm>('standard')
  const [keyRoot, setKeyRoot] = useState(60) // C
  const [minor, setMinor] = useState(false)

  return (
    <div className="screen blues-screen">
      <div className="topbar">
        <span className="topbar-title">Blues</span>
        <button type="button" className="topbar-btn" onClick={onBack}>Done</button>
      </div>
      <div className="blues-tabs">
        {(['progression', 'chordtones', 'licks'] as Tab[]).map((t) => (
          <button key={t} type="button" className={'blues-tab' + (tab === t ? ' active' : '')} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>
      <div className="blues-controls">
        <label>Form</label>
        <select value={form} onChange={(e) => setForm(e.target.value as BluesForm)}>
          {Object.entries(BLUES_FORMS).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
        </select>
        <label>Key (MIDI root)</label>
        <input type="number" min={48} max={72} value={keyRoot} onChange={(e) => setKeyRoot(Number(e.target.value))} />
        <label><input type="checkbox" checked={minor} onChange={(e) => setMinor(e.target.checked)} /> minor</label>
      </div>
      <div className="blues-body">
        {tab === 'progression' && <ProgressionView form={form} keyRoot={keyRoot} minor={minor} />}
        {tab === 'chordtones' && <ChordToneQuiz form={form} keyRoot={keyRoot} minor={minor} />}
        {tab === 'licks' && <LickView keyRoot={keyRoot} />}
      </div>
    </div>
  )
}

function ProgressionView({ form, keyRoot, minor }: { form: BluesForm; keyRoot: number; minor: boolean }) {
  const chords = progressionChords(keyRoot, form, minor)
  const playAll = () => { ensureAudioRunning().then(() => playProgression(keyRoot, form, 120)) }
  return (
    <div className="blues-panel">
      <div className="blues-prog">
        {chords.map((c, i) => (
          <div key={i} className="blues-bar">
            <span className="bar-num">{i + 1}</span>
            <span className="bar-chord">{c.degree === 1 ? 'I' : c.degree === 4 ? 'IV' : 'V'}7</span>
            <button type="button" className="blues-playbar" onClick={() => { ensureAudioRunning().then(() => playChord(chordMidisForBlues(c), 0.9)) }}>▶</button>
          </div>
        ))}
      </div>
      <button type="button" className="ear-play-btn" onClick={playAll}>▶ Play progression</button>
    </div>
  )
}

function ChordToneQuiz({ form, keyRoot, minor }: { form: BluesForm; keyRoot: number; minor: boolean }) {
  const chords = progressionChords(keyRoot, form, minor)
  const [idx, setIdx] = useState(0)
  const [target, setTarget] = useState<'root' | '3rd' | '5th' | '7th'>('3rd')
  const [feedback, setFeedback] = useState<string | null>(null)
  const [score, setScore] = useState({ correct: 0, total: 0 })

  const chord = chords[idx % chords.length]!
  const midis = chordMidisForBlues(chord)
  const toneMap: Record<string, number> = { root: midis[0]!, '3rd': midis[1]!, '5th': midis[2]!, '7th': midis[3]! }
  const correctMidi = toneMap[target]!

  const playChordNow = () => { ensureAudioRunning().then(() => playChord(midis, 1.0)) }
  useEffect(() => { ensureAudioRunning().then(() => playChord(midis, 1.0)) }, [idx, target]) // eslint-disable-line

  const noteNames = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']
  // restrict to chord tones + 2 distractors
  const chordPcs = new Set(midis.map((m) => m % 12))
  const distractors = [0,1,2,3,4,5,6,7,8,9,10,11].filter((pc) => !chordPcs.has(pc)).slice(0, 2)
  const optionPcs = [...chordPcs, ...distractors]

  const answer = (pc: number) => {
    if (feedback) return
    const ok = pc === (correctMidi % 12)
    setScore((s) => ({ correct: s.correct + (ok ? 1 : 0), total: s.total + 1 }))
    setFeedback(ok ? 'Correct!' : `Wrong — ${target} is ${noteNames[correctMidi % 12]}`)
  }

  const next = () => {
    setIdx((i) => i + 1)
    setFeedback(null)
    const t = (['root', '3rd', '5th', '7th'] as const)[Math.floor(Math.random() * 4)]!
    setTarget(t)
  }

  const acc = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0

  return (
    <div className="blues-panel">
      <div className="blues-quiz-prompt">Bar { (idx % chords.length) + 1 } — identify the <b>{target}</b> of the chord.</div>
      <button type="button" className="ear-play-btn" onClick={playChordNow}>▶ Play chord</button>
      <div className="blues-choices">
        {optionPcs.map((pc) => (
          <button key={pc} type="button" className="ear-option" onClick={() => answer(pc)} disabled={!!feedback}>
            {noteNames[pc]}
          </button>
        ))}
      </div>
      {feedback && <div className={'ear-feedback ' + (feedback.startsWith('Correct') ? 'correct' : 'wrong')}>{feedback}</div>}
      <div className="ear-scorebar">
        <span>Score: {score.correct}/{score.total} ({acc}%)</span>
        <button type="button" className="ear-btn" onClick={next}>Next</button>
      </div>
    </div>
  )
}

function LickView({ keyRoot }: { keyRoot: number }) {
  const [selected, setSelected] = useState(LICKS[0]!.id)
  const lick = LICKS.find((l) => l.id === selected)!
  return (
    <div className="blues-panel">
      <select value={selected} onChange={(e) => setSelected(e.target.value)}>
        {LICKS.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
      </select>
      <p className="raga-notes">{lick.description}</p>
      <div className="raga-row">
        Notes: {lick.notes.join(', ')}
      </div>
      <button type="button" className="ear-play-btn" onClick={() => ensureAudioRunning().then(() => playLick(lick.id, keyRoot))}>▶ Play lick</button>
    </div>
  )
}
