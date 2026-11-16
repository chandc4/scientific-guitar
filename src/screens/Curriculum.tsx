import { useEffect, useState } from 'react'
import { LESSONS, availableLessons, nextLesson, progress } from '../curriculum/curriculum'
import type { Lesson } from '../curriculum/data'
import './curriculum.css'

const STORAGE_KEY = 'sci-guitar-completed-lessons'

export function Curriculum({ onBack }: { onBack: () => void }) {
  const [completed, setCompleted] = useState<Set<string>>(new Set())

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setCompleted(new Set(JSON.parse(raw)))
    } catch { /* ignore */ }
  }, [])

  const save = (s: Set<string>) => {
    setCompleted(s)
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...s])) } catch { /* ignore */ }
  }

  const toggle = (id: string) => {
    const s = new Set(completed)
    if (s.has(id)) { s.delete(id) } else { s.add(id) }
    save(s)
  }

  const p = progress(completed)
  const next = nextLesson(completed)

  return (
    <div className="screen curriculum-screen">
      <div className="topbar">
        <span className="topbar-title">Curriculum</span>
        <button type="button" className="topbar-btn" onClick={onBack}>Done</button>
      </div>
      <div className="curriculum-progress">
        <span>Progress: {p.done}/{p.total} ({p.percent}%)</span>
        <div className="curriculum-bar"><div className="curriculum-fill" style={{ width: `${p.percent}%` }} /></div>
      </div>
      {next && (
        <div className="curriculum-next">
          <b>Next: {next.title}</b>
          <p>{next.description}</p>
          <span className="curriculum-meta">{next.estimatedMinutes} min · Phase {next.phase}</span>
        </div>
      )}
      <div className="curriculum-list">
        {LESSONS.map((l: Lesson) => {
          const done = completed.has(l.id)
          const avail = availableLessons(completed).some((a) => a.id === l.id)
          return (
            <div key={l.id} className={'curriculum-lesson' + (done ? ' done' : avail ? ' avail' : ' locked')}>
              <div className="curriculum-lesson-head">
                <span className="curriculum-lesson-title">{l.id}. {l.title}</span>
                <span className="curriculum-lesson-phase">P{l.phase}</span>
              </div>
              <p className="curriculum-lesson-desc">{l.description}</p>
              <div className="curriculum-lesson-foot">
                <span>{l.estimatedMinutes} min</span>
                {avail && <button type="button" className="curriculum-toggle" onClick={() => toggle(l.id)}>{done ? 'Mark incomplete' : 'Mark complete'}</button>}
                {!avail && <span className="curriculum-locked">Locked</span>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
