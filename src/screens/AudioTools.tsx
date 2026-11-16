import { useCallback, useEffect, useRef, useState } from 'react'
import { DronePlayer, type DroneTuning } from '../audio/drone'
import { Metronome } from '../audio/metronome'
import { Recorder } from '../audio/recorder'
import { detectPitch, frequencyToNote } from '../audio/pitch'
import { ensureAudioRunning, getAudioContext } from '../audio/context'
import './audio.css'

type Tab = 'drone' | 'metronome' | 'tuner' | 'recorder'

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

export function AudioTools({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<Tab>('drone')

  return (
    <div className="screen audio-screen">
      <div className="topbar">
        <span className="topbar-title">Audio Tools</span>
        <button type="button" className="topbar-btn" onClick={onBack}>Done</button>
      </div>
      <div className="audio-tabs">
        {(['drone', 'metronome', 'tuner', 'recorder'] as Tab[]).map((t) => (
          <button key={t} type="button" className={'audio-tab' + (tab === t ? ' active' : '')} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>
      <div className="audio-body">
        {tab === 'drone' && <DronePanel />}
        {tab === 'metronome' && <MetronomePanel />}
        {tab === 'tuner' && <TunerPanel />}
        {tab === 'recorder' && <RecorderPanel />}
      </div>
    </div>
  )
}

function DronePanel() {
  const [root, setRoot] = useState(0) // C
  const [octave, setOctave] = useState(3)
  const [tuning, setTuning] = useState<DroneTuning>('sa-pa')
  const [volume, setVolume] = useState(0.5)
  const [playing, setPlaying] = useState(false)
  const droneRef = useRef<DronePlayer | null>(null)

  useEffect(() => {
    droneRef.current = new DronePlayer({ rootPc: root, octave, tuning, volume })
    return () => { droneRef.current?.stop(); droneRef.current = null }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // sync options when playing changes? We recreate on option change while playing.
  useEffect(() => {
    const d = droneRef.current
    if (!d) return
    if (playing) {
      d.setRoot(root); d.setTuning(tuning); d.setVolume(volume)
    }
  }, [root, octave, tuning, volume, playing])

  const toggle = async () => {
    await ensureAudioRunning()
    const d = droneRef.current
    if (!d) return
    if (playing) { d.stop(); setPlaying(false) }
    else {
      // recreate with latest opts
      d.stop()
      const nd = new DronePlayer({ rootPc: root, octave, tuning, volume })
      droneRef.current = nd
      await nd.start()
      setPlaying(true)
    }
  }

  return (
    <div className="audio-panel">
      <div className="audio-row">
        <label>Sa (root)</label>
        <select value={root} onChange={(e) => setRoot(Number(e.target.value))}>
          {NOTE_NAMES.map((n, i) => <option key={i} value={i}>{n}</option>)}
        </select>
      </div>
      <div className="audio-row">
        <label>Octave</label>
        <input type="range" min={2} max={5} value={octave} onChange={(e) => setOctave(Number(e.target.value))} />
        <span>{octave}</span>
      </div>
      <div className="audio-row">
        <label>Tuning</label>
        <select value={tuning} onChange={(e) => setTuning(e.target.value as DroneTuning)}>
          <option value="sa-pa">Sa–Pa (5th)</option>
          <option value="sa-ma">Sa–Ma (4th)</option>
          <option value="sa-pa-sa">Sa–Pa–Sa'</option>
        </select>
      </div>
      <div className="audio-row">
        <label>Volume</label>
        <input type="range" min={0} max={1} step={0.01} value={volume} onChange={(e) => setVolume(Number(e.target.value))} />
      </div>
      <button type="button" className="audio-btn" onClick={toggle}>{playing ? 'Stop drone' : 'Start drone'}</button>
    </div>
  )
}

function MetronomePanel() {
  const [bpm, setBpm] = useState(120)
  const [beats, setBeats] = useState(4)
  const [running, setRunning] = useState(false)
  const [beat, setBeat] = useState(0)
  const metroRef = useRef<Metronome | null>(null)

  useEffect(() => {
    const m = new Metronome({ bpm, beatsPerBar: beats, onTick: (b) => setBeat(b) })
    metroRef.current = m
    return () => { m.stop(); metroRef.current = null }
  }, []) // eslint-disable-line

  useEffect(() => { metroRef.current?.setBpm(bpm) }, [bpm])
  useEffect(() => { metroRef.current?.setBeatsPerBar(beats) }, [beats])

  const toggle = async () => {
    const m = metroRef.current
    if (!m) return
    await ensureAudioRunning()
    if (running) { m.stop(); setRunning(false) }
    else { m.setOnTick((b) => setBeat(b)); await m.start(); setRunning(true) }
  }

  return (
    <div className="audio-panel">
      <div className="audio-row">
        <label>BPM</label>
        <input type="range" min={20} max={300} value={bpm} onChange={(e) => setBpm(Number(e.target.value))} />
        <span>{bpm}</span>
      </div>
      <div className="audio-row">
        <label>Beats/bar</label>
        <input type="number" min={1} max={12} value={beats} onChange={(e) => setBeats(Number(e.target.value))} />
      </div>
      <div className="metronome-display">
        {Array.from({ length: beats }).map((_, i) => (
          <span key={i} className={'beat-dot' + (running && beat === i ? ' active' : '') + (i === 0 ? ' down' : '')} />
        ))}
      </div>
      <button type="button" className="audio-btn" onClick={toggle}>{running ? 'Stop' : 'Start'}</button>
    </div>
  )
}

function TunerPanel() {
  const [note, setNote] = useState<string>('--')
  const [cents, setCents] = useState(0)
  const [freq, setFreq] = useState(0)
  const [running, setRunning] = useState(false)
  const streamRef = useRef<MediaStream | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const rafRef = useRef<number>(0)

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = 0
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    analyserRef.current = null
    setRunning(false)
  }, [])

  const start = async () => {
    await ensureAudioRunning()
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const ctx = getAudioContext()
    const source = ctx.createMediaStreamSource(stream)
    const analyser = ctx.createAnalyser()
    analyser.fftSize = 2048
    source.connect(analyser)
    streamRef.current = stream
    analyserRef.current = analyser
    setRunning(true)

    const buf = new Float32Array(analyser.fftSize)
    const loop = () => {
      const a = analyserRef.current
      if (!a) return
      a.getFloatTimeDomainData(buf)
      const r = detectPitch(buf, ctx.sampleRate)
      if (r.frequency > 0 && r.confidence > 0.8) {
        const n = frequencyToNote(r.frequency)
        if (n) { setNote(n.name); setCents(n.cents); setFreq(r.frequency) }
      } else {
        setNote('--'); setCents(0); setFreq(0)
      }
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
  }

  useEffect(() => stop, [stop])

  return (
    <div className="audio-panel tuner">
      <div className="tuner-note">{note}</div>
      <div className="tuner-cents">{freq > 0 ? `${freq.toFixed(1)} Hz  ${cents > 0 ? '+' : ''}${cents.toFixed(0)} cents` : 'play a note'}</div>
      <div className="tuner-bar">
        <div className="tuner-needle" style={{ left: `${50 + Math.max(-50, Math.min(50, cents / 2))}%` }} />
      </div>
      <button type="button" className="audio-btn" onClick={running ? stop : start}>{running ? 'Stop' : 'Start tuner'}</button>
    </div>
  )
}

function RecorderPanel() {
  const [running, setRunning] = useState(false)
  const [level, setLevel] = useState(0)
  const [url, setUrl] = useState<string | null>(null)
  const recRef = useRef<Recorder | null>(null)
  const rafRef = useRef<number>(0)

  const stop = async () => {
    const r = recRef.current
    if (!r) return
    const blob = await r.stop()
    if (url) URL.revokeObjectURL(url)
    setUrl(URL.createObjectURL(blob))
    setRunning(false)
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = 0
  }

  const start = async () => {
    await ensureAudioRunning()
    const r = new Recorder()
    recRef.current = r
    await r.start()
    setRunning(true)
    setUrl(null)
    const loop = () => {
      setLevel(r.getLevel())
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
  }

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }, [])

  return (
    <div className="audio-panel">
      <div className="level-meter">
        <div className="level-fill" style={{ width: `${level * 100}%` }} />
      </div>
      <button type="button" className="audio-btn" onClick={running ? stop : start}>{running ? 'Stop & save' : 'Record'}</button>
      {url && (
        <div className="audio-row">
          <audio controls src={url} />
          <a href={url} download="recording.webm">Download</a>
        </div>
      )}
    </div>
  )
}
