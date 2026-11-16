import { useEffect, useState } from 'react'
import { getAllAttempts, getSkills, getSettings, saveSettings, clearAllData } from '../data/db'
import type { Attempt } from '../data/types'
import './stats.css'

export function Stats({ onBack }: { onBack: () => void }) {
  const [attempts, setAttempts] = useState<Attempt[]>([])
  const [msg, setMsg] = useState('')

  useEffect(() => { getAllAttempts().then(setAttempts).catch(() => {}) }, [])

  // Heatmap: last 30 days counts.
  const days: { date: string; count: number }[] = []
  const now = new Date()
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    const count = attempts.filter((a) => new Date(a.ts).toISOString().slice(0, 10) === key).length
    days.push({ date: key, count })
  }
  const maxCount = Math.max(1, ...days.map((d) => d.count))

  const total = attempts.length
  const correct = attempts.filter((a) => a.correct).length
  const acc = total ? Math.round((correct / total) * 100) : 0

  const exportData = async () => {
    const skills = await getSkills()
    const settings = await getSettings()
    const blob = new Blob([JSON.stringify({ attempts, skills, settings }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'scientific-guitar-backup.json'
    a.click()
    URL.revokeObjectURL(url)
    setMsg('Exported.')
  }

  const importData = async (file: File) => {
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      if (data.settings) await saveSettings(data.settings)
      if (Array.isArray(data.skills)) for (const s of data.skills) await (await import('../data/db')).putSkill(s)
      // attempts: re-add
      if (Array.isArray(data.attempts)) for (const a of data.attempts) await (await import('../data/db')).logAttempt(a)
      setMsg('Imported. Reload to see changes.')
      getAllAttempts().then(setAttempts)
    } catch (e) {
      setMsg('Import failed: ' + (e as Error).message)
    }
  }

  const reset = async () => {
    if (!confirm('Delete all data?')) return
    await clearAllData()
    setAttempts([])
    setMsg('Cleared.')
  }

  return (
    <div className="screen stats-screen">
      <div className="topbar">
        <span className="topbar-title">Stats & Data</span>
        <button type="button" className="topbar-btn" onClick={onBack}>Done</button>
      </div>
      <div className="stats-summary">
        <span>Total attempts: {total}</span>
        <span>Accuracy: {acc}%</span>
      </div>
      <div className="stats-heatmap">
        {days.map((d) => (
          <div key={d.date} className="heat-cell" title={`${d.date}: ${d.count}`} style={{ opacity: 0.15 + 0.85 * (d.count / maxCount) }} />
        ))}
      </div>
      <div className="stats-actions">
        <button type="button" className="ear-btn" onClick={exportData}>Export JSON</button>
        <label className="ear-btn">
          Import JSON
          <input type="file" accept="application/json" style={{ display: 'none' }} onChange={(e) => { const f = e.target.files?.[0]; if (f) importData(f) }} />
        </label>
        <button type="button" className="ear-btn" onClick={reset}>Reset all data</button>
      </div>
      {msg && <div className="stats-msg">{msg}</div>}
    </div>
  )
}
