import { useCallback, useEffect, useRef, useState } from 'react'
import type { Exercise, ExerciseConfig, ExerciseKind } from '../ear/exercises'
import { DEFAULT_CONFIG, genExercise, exerciseKey, playExercise } from '../ear/exercises'
import { grade } from '../ear/grading'
import { emptyMatrix, record, accuracyFor, totals, type ConfusionMatrix } from '../ear/confusion'
import { INTERVAL_NAMES, CHORD_QUALITY_NAMES, DEGREE_NAMES } from '../audio/synth'
import { ensureAudioRunning } from '../audio/context'
import { logAttempt } from '../data/db'
import './ear.css'

type Difficulty = 'easy' | 'medium' | 'hard'

const DIFFICULTY_CONFIG: Record<Difficulty, ExerciseConfig> = {
  easy: { ...DEFAULT_CONFIG, intervals: [3, 4, 7, 12], chords: ['maj', 'min'], degrees: [1, 5], rootRange: [55, 67], keyRange: [55, 60] },
  medium: { ...DEFAULT_CONFIG, intervals: [1, 3, 4, 5, 7, 8, 9, 12], chords: ['maj', 'min', 'dim', 'aug', '7'], degrees: [1, 2, 3, 4, 5], rootRange: [48, 72], keyRange: [48, 60] },
  hard: { ...DEFAULT_CONFIG },
}

function optionsFor(kind: ExerciseKind, cfg: ExerciseConfig): { value: unknown; label: string }[] {
  if (kind === 'interval') return cfg.intervals.map((s) => {
    const info = INTERVAL_NAMES.find((i) => i.semitones === s)!
    return { value: s, label: info.short }
  })
  if (kind === 'chord') return cfg.chords.map((q) => {
    const info = CHORD_QUALITY_NAMES.find((c) => c.quality === q)!
    return { value: q, label: info.name }
  })
  return cfg.degrees.map((d) => ({ value: d, label: DEGREE_NAMES[d - 1]! }))
}

export function EarTraining({ onBack }: { onBack: () => void }) {
  const [kind, setKind] = useState<ExerciseKind>('interval')
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [answer, setAnswer] = useState<unknown>(null)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [correctAnswer, setCorrectAnswer] = useState<unknown>(null)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [matrix, setMatrix] = useState<ConfusionMatrix>(emptyMatrix())
  const [showStats, setShowStats] = useState(false)
  const lastKeyRef = useRef<string | undefined>(undefined)

  const cfg = DIFFICULTY_CONFIG[difficulty]

  const next = useCallback(() => {
    let ex = genExercise(kind, cfg)
    // avoid immediate repeat of same item key
    let tries = 0
    while (exerciseKey(ex) === lastKeyRef.current && tries < 5) { ex = genExercise(kind, cfg); tries++ }
    lastKeyRef.current = exerciseKey(ex)
    setExercise(ex)
    setAnswer(null)
    setFeedback(null)
    setCorrectAnswer(null)
    // auto-play
    ensureAudioRunning().then(() => playExercise(ex))
  }, [kind, cfg])

  useEffect(() => { next() }, [kind, difficulty]) // eslint-disable-line

  const handleAnswer = (val: unknown) => {
    if (!exercise || feedback) return
    setAnswer(val)
    const ok = grade(exercise, val)
    const ca = exercise.kind === 'interval' ? (exercise as { semitones: number }).semitones
      : exercise.kind === 'chord' ? (exercise as { quality: string }).quality
      : (exercise as { degree: number }).degree
    setCorrectAnswer(ca)
    setFeedback(ok ? 'correct' : 'wrong')
    setScore((s) => ({ correct: s.correct + (ok ? 1 : 0), total: s.total + 1 }))
    setStreak((st) => {
      const ns = ok ? st + 1 : 0
      setBestStreak((b) => Math.max(b, ns))
      return ns
    })
    setMatrix((m) => record(m, exerciseKey(exercise), ok ? exerciseKey(exercise) : exerciseKey(exercise) + ':x'))
    // log attempt
    const skillId = kind === 'interval' ? 'ear:interval' : kind === 'chord' ? 'ear:chord' : 'ear:degree'
    logAttempt({ skillId, drill: kind === 'interval' ? 'ear-interval' : kind === 'chord' ? 'ear-chord' : 'ear-degree', prompt: exerciseKey(exercise), correct: ok, ms: 0, ts: Date.now() }).catch(() => {})
  }

  const replay = () => { if (exercise) { ensureAudioRunning().then(() => playExercise(exercise)) } }

  const acc = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0
  const opts = exercise ? optionsFor(kind, cfg) : []

  return (
    <div className="screen ear-screen">
      <div className="topbar">
        <span className="topbar-title">Ear Training</span>
        <button type="button" className="topbar-btn" onClick={onBack}>Done</button>
      </div>

      <div className="ear-tabs">
        {(['interval', 'chord', 'degree'] as ExerciseKind[]).map((k) => (
          <button key={k} type="button" className={'ear-tab' + (kind === k ? ' active' : '')} onClick={() => setKind(k)}>{k}</button>
        ))}
      </div>

      <div className="ear-controls">
        <label>Difficulty</label>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <button type="button" className="ear-btn small" onClick={() => setShowStats((v) => !v)}>{showStats ? 'Hide stats' : 'Stats'}</button>
      </div>

      <div className="ear-scorebar">
        <span>Score: {score.correct}/{score.total} ({acc}%)</span>
        <span>Streak: {streak} (best {bestStreak})</span>
      </div>

      <div className="ear-play">
        <button type="button" className="ear-play-btn" onClick={replay}>▶ Play</button>
        <button type="button" className="ear-btn" onClick={next}>Next</button>
      </div>

      <div className="ear-options">
        {opts.map((o) => {
          const isChosen = answer === o.value
          const isCorrect = feedback && o.value === correctAnswer
          const isWrong = feedback && isChosen && o.value !== correctAnswer
          return (
            <button
              key={String(o.value)}
              type="button"
              className={'ear-option' + (isChosen ? ' chosen' : '') + (isCorrect ? ' correct' : '') + (isWrong ? ' wrong' : '')}
              onClick={() => handleAnswer(o.value)}
              disabled={!!feedback}
            >
              {o.label}
            </button>
          )
        })}
      </div>

      {feedback && (
        <div className={'ear-feedback ' + feedback}>
          {feedback === 'correct' ? 'Correct!' : `Wrong — answer: ${String(correctAnswer)}`}
        </div>
      )}

      {showStats && (
        <div className="ear-stats">
          <h4>Accuracy by item</h4>
          {Object.keys(matrix.rows).length === 0 && <p>No data yet.</p>}
          {Object.keys(matrix.rows).map((k) => (
            <div key={k} className="ear-stat-row">
              <span>{k.split(':')[1] ?? k}</span>
              <span>{Math.round(accuracyFor(matrix, k) * 100)}%</span>
            </div>
          ))}
          <p className="ear-stat-total">Total answers: {totals(matrix).total}</p>
        </div>
      )}
    </div>
  )
}
