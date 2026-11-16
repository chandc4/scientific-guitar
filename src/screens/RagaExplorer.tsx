import { useState } from 'react'
import { RAGAS, ragaById, playAroha, playAvaroha, playPakad, sargamName } from '../raga/raga'
import { DronePlayer } from '../audio/drone'
import { ensureAudioRunning } from '../audio/context'
import './raga.css'

export function RagaExplorer({ onBack }: { onBack: () => void }) {
  const [selected, setSelected] = useState(RAGAS[0]!.id)
  const [droneOn, setDroneOn] = useState(false)
  const droneRef = { current: null as DronePlayer | null }
  const raga = ragaById(selected)!

  const toggleDrone = async () => {
    await ensureAudioRunning()
    if (droneOn) { droneRef.current?.stop(); droneRef.current = null; setDroneOn(false) }
    else {
      const d = new DronePlayer({ rootPc: 0, octave: 3, tuning: 'sa-pa', volume: 0.4 })
      droneRef.current = d
      await d.start()
      setDroneOn(true)
    }
  }

  return (
    <div className="screen raga-screen">
      <div className="topbar">
        <span className="topbar-title">Raga Explorer</span>
        <button type="button" className="topbar-btn" onClick={onBack}>Done</button>
      </div>
      <div className="raga-layout">
        <aside className="raga-list">
          {RAGAS.map((r) => (
            <button key={r.id} type="button" className={'raga-item' + (selected === r.id ? ' active' : '')} onClick={() => setSelected(r.id)}>{r.name}</button>
          ))}
        </aside>
        <main className="raga-detail">
          <h2>{raga.name} <span className="raga-thaat">({raga.thaat} thaat)</span></h2>
          <div className="raga-meta">
            <span><b>Vadi:</b> {sargamName(raga.vadi)}</span>
            <span><b>Samvadi:</b> {sargamName(raga.samvadi)}</span>
            <span><b>Time:</b> {raga.time}</span>
            <span><b>Rasa:</b> {raga.rasa}</span>
          </div>
          <div className="raga-row">
            <b>Aroha:</b> {raga.aroha.map(sargamName).join(' ')}
            <button type="button" className="raga-play" onClick={() => playAroha(raga)}>▶</button>
          </div>
          <div className="raga-row">
            <b>Avaroha:</b> {raga.avaroha.map(sargamName).join(' ')}
            <button type="button" className="raga-play" onClick={() => playAvaroha(raga)}>▶</button>
          </div>
          <div className="raga-row">
            <b>Pakad:</b>
            {raga.pakad.map((p, i) => (
              <span key={i} className="raga-pakad">
                {p.map(sargamName).join(' ')}
                <button type="button" className="raga-play small" onClick={() => playPakad(raga, i)}>▶</button>
              </span>
            ))}
          </div>
          <div className="raga-row"><b>Ornaments:</b> {raga.ornaments.join(', ')}</div>
          <p className="raga-notes">{raga.notes}</p>
          <button type="button" className="raga-drone" onClick={toggleDrone}>{droneOn ? 'Stop drone' : 'Drone (Sa)'}</button>
        </main>
      </div>
    </div>
  )
}
