import { useCallback, useEffect, useState } from 'react'
import { RAGAS, playPakad } from '../raga/raga'
import { ensureAudioRunning } from '../audio/context'
import './raga.css'

export function RagaPractice({ onBack }: { onBack: () => void }) {
  const [current, setCurrent] = useState(RAGAS[Math.floor(Math.random() * RAGAS.length)]!)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [score, setScore] = useState({ correct: 0, total: 0 })

  const next = useCallback(() => {
    const r = RAGAS[Math.floor(Math.random() * RAGAS.length)]!
    setCurrent(r)
    setFeedback(null)
    ensureAudioRunning().then(() => playPakad(r, 0))
  }, [])

  useEffect(() => { ensureAudioRunning().then(() => playPakad(current, 0)) }, []) // eslint-disable-line

  const choose = (id: string) => {
    if (feedback) return
    const ok = id === current.id
    setScore((s) => ({ correct: s.correct + (ok ? 1 : 0), total: s.total + 1 }))
    setFeedback(ok ? 'Correct!' : `Wrong — it was ${current.name}`)
  }

  const acc = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0

  return (
    <div className="screen raga-screen">
      <div className="topbar">
        <span className="topbar-title">Raga Practice</span>
        <button type="button" className="topbar-btn" onClick={onBack}>Done</button>
      </div>
      <div className="raga-quiz">
        <p className="raga-quiz-prompt">Listen to the phrase and identify the raga.</p>
        <button type="button" className="ear-play-btn" onClick={() => ensureAudioRunning().then(() => playPakad(current, 0))}>▶ Replay</button>
        <div className="raga-quiz-options">
          {RAGAS.map((r) => (
            <button key={r.id} type="button" className="raga-quiz-btn" onClick={() => choose(r.id)} disabled={!!feedback}>{r.name}</button>
          ))}
        </div>
        {feedback && <div className={'ear-feedback ' + (feedback.startsWith('Correct') ? 'correct' : 'wrong')}>{feedback}</div>}
        <div className="ear-scorebar">
          <span>Score: {score.correct}/{score.total} ({acc}%)</span>
          <button type="button" className="ear-btn" onClick={next}>Next</button>
        </div>
      </div>
    </div>
  )
}
