import { DrillOptions } from '../drills/DrillOptions'
import { DRILLS, type DrillId } from '../drills/drillList'
import { THEORY_DRILLS, type TheoryDrillId } from '../drills/theoryDrillList'
import type { Settings } from '../data/types'

export type PracticeTarget = 'session' | 'settings' | 'key-explorer' | 'audio' | 'ear' | 'raga-explorer' | 'raga-practice' | 'blues' | 'curriculum' | 'songlab' | 'stats' | DrillId | TheoryDrillId

interface PracticeProps {
  settings: Settings
  onChange: (s: Settings) => void
  onOpen: (screen: PracticeTarget) => void
}

// Home: one big Start session button first, then single drills, reference, options, and Settings.
export function Practice({ settings, onChange, onOpen }: PracticeProps) {
  return (
    <div className="screen">
      <button type="button" className="start" onClick={() => onOpen('session')}>
        Start session
        <span className="start-sub">15 minutes</span>
      </button>
      <div className="section-label">Fretboard</div>
      <div className="drill-list">
        {DRILLS.map((d) => (
          <button key={d.id} type="button" className="list-btn" onClick={() => onOpen(d.id)}>
            {d.title}
          </button>
        ))}
      </div>
      <div className="section-label">Theory</div>
      <div className="drill-list">
        {THEORY_DRILLS.map((d) => (
          <button key={d.id} type="button" className="list-btn" onClick={() => onOpen(d.id)}>
            {d.title}
          </button>
        ))}
      </div>
      <div className="section-label">Reference</div>
      <div className="drill-list">
        <button type="button" className="list-btn" onClick={() => onOpen('key-explorer')}>
          Key Explorer
        </button>
        <button type="button" className="list-btn" onClick={() => onOpen('audio')}>
          Audio Tools (drone, metronome, tuner, recorder)
        </button>
        <button type="button" className="list-btn" onClick={() => onOpen('ear')}>
          Ear Training (intervals, chords, degrees)
        </button>
        <button type="button" className="list-btn" onClick={() => onOpen('raga-explorer')}>
          Raga Explorer
        </button>
        <button type="button" className="list-btn" onClick={() => onOpen('raga-practice')}>
          Raga Practice (identify raga)
        </button>
        <button type="button" className="list-btn" onClick={() => onOpen('blues')}>
          Blues (12-bar, chord tones, licks)
        </button>
        <button type="button" className="list-btn" onClick={() => onOpen('curriculum')}>
          Curriculum (lessons & progress)
        </button>
        <button type="button" className="list-btn" onClick={() => onOpen('songlab')}>
          Song Lab (analyze & practice songs)
        </button>
        <button type="button" className="list-btn" onClick={() => onOpen('stats')}>
          Stats & Data (heatmap, export/import)
        </button>
      </div>
      <DrillOptions settings={settings} onChange={onChange} />
      <button type="button" className="link-btn" onClick={() => onOpen('settings')}>
        Settings
      </button>
    </div>
  )
}
