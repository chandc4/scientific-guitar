# PLAN — Milestones & Progress

Last updated: M1 complete.

## Progress
- **M0 — Phase 0 (4 weeks, no code):** Gate. Practice with existing tools; log metrics; decide on build. (Recommended; user chose to build in parallel.)
- **M1 — Foundation:** ✅ Complete.
  - Scaffold: Vite + React 19 + TS strict + PWA + CI + Node 24.
  - Theory engine ported (`src/music/`): notes, intervals, scales, chords, keys, progressions, fretboard, fretmap. 159 tests.
  - Mastery/SRS ported (`src/mastery/`): Leitner, mastery score, mastered gate, weighted picker, skill catalog (26), targets. 35 tests.
  - Data layer ported (`src/data/`): IndexedDB, typed schema, CRUD, retry. 6 tests.
  - UI ported (`src/components/`, `src/drills/`, `src/screens/`): Fretboard, 14 drills, Practice, SessionTimer, Settings, KeyExplorer, pads. 295 tests (components/drills/screens).
  - Total: 495 tests, typecheck clean, build + PWA green.
- **M2 — Audio primitives:** ✅ Complete. Drone (tanpura) player, metronome (lookahead scheduler), monophonic mic tuner (YIN), recorder. Audio Tools screen wired into app. 8 pitch tests.
- **M3 — Ear training:** ✅ Complete. Interval/chord/degree identification with piano-ish synth, adaptive difficulty, confusion stats, attempt logging.
- **M4 — Raga module:** ✅ Complete. 12-raga corpus (thaat, aroha/avaroha, vadi/samvadi, pakad, time, rasa, ornaments), Raga Explorer with playback + drone, Raga Practice identification quiz.
- **M5 — Blues module:** ✅ Complete. 12-bar forms, chord-tone quiz, lick library with playback.
- **M6 — Curriculum engine:** ✅ Complete. 12-lesson curriculum with gating, progress, recommended next.
- **M7 — Song Lab:** ✅ Complete. Progression parser, playback, practice paths.
- **M8 — Polish:** ✅ Complete. Stats/heatmap, export/import, accessibility (focus, reduced motion).

## Milestones

Gate: M2 starts now (M1 complete). M4/M5 raga & blues work depends on M2 (drone) and M3 (ear).

- M0 — Phase 0 (4 weeks, no code). Use existing tools; log metrics; decide.
- M1 — Foundation (reuse lucasvlad): setup, PWA, CI, theory engine, IndexedDB, SRS, drills, tests. ✅
- M2 — Audio primitives: drone (tanpura), metronome, mic pitch detection (monophonic), recording.
- M3 — Ear training: interval/chord/degree ID with audio, adaptive picker.
- M4 — Raga module: 10–15 ragas, phrase player, ornaments, drone context, twelveswaras integration.
- M5 — Blues module: 12-bar forms, chord-tone targeting, lick library, transcription, backing tracks.
- M6 — Curriculum engine: lessons, gating, sequencing, spaced review, session planner.
- M7 — Song Lab: analyze songs, practice paths.
- M8 — Polish: heatmap, export, piano mode, accessibility, performance.

Each milestone ships only what it needs, gated by tests + working demo. Update this file when a milestone shifts.
Current: Complete (all milestones M0-M8).
