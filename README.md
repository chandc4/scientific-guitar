# Scientific Guitar Trainer

A local-first, offline-capable PWA for learning guitar through a first-principles,
frequency/interval-based framework, with depth in Indian ragas and Western blues.

Companion to the learning protocol in `INDEPENDENT_REVIEW.md` and `practice_log.md`.

## Status
- **M0 (Phase 0):** Gate — practice with existing tools; 4 weeks.
- **M1 (Foundation):** ✅ Complete. Theory engine + mastery/SRS + IndexedDB + full UI (fretboard drills, theory drills, Key Explorer, 15-min sessions, settings). 495 tests green.
- **M2 (Audio primitives):** ✅ Complete — drone (tanpura), metronome, mic tuner (YIN), recorder. Audio Tools screen.
- **M3 (Ear training):** ✅ Complete — intervals, chords, degrees; adaptive difficulty; confusion stats.
- **M4 (Raga module):** ✅ Complete — 12 ragas, explorer, identification quiz.
- **M5 (Blues module):** ✅ Complete — 12-bar, chord tones, licks.
- **M6 (Curriculum engine):** ✅ Complete — lessons, gating, progress.
- **M7 (Song Lab):** ✅ Complete — analyze & practice songs.
- **M8 (Polish):** ✅ Complete — stats, export/import, a11y.

See `docs/PLAN.md` for the full milestone list and `docs/DECISIONS.md` for ADRs.

## How to run (development)
```powershell
cd C:\Users\Chandra\py_projects\guitar
npm install
npm run dev          # Vite dev server; open the printed URL (LAN) on your phone
npm run check        # typecheck + tests + production build (run before committing)
npm run test         # Vitest single run
npm run test:watch   # watch mode
npm run build        # production build to dist/
npm run preview      # serve dist/ locally
```
Requires Node 24 (see `.nvmrc`). Use fnm: `fnm install 24 && fnm use 24`.

## How to use the app
1. **Open app → press Start.** The app picks what to practice based on your weakest items (spaced repetition).
2. **Fretboard drills** (6): Note on string, Reverse, Neighborhood, All strings, Interval navigation, Octave finder. Use natural or chromatic note sets and a string subset.
3. **Theory drills** (8): Intervals (note above + semitone count), Scale spelling, Key signatures, Diatonic chords, Keys of a chord, Transposer (both directions). Graded on spelled note, not just pitch.
4. **Key Explorer:** any key's notes, signature, relative minor, triads, seventh chords, common progressions; scale fretboard labelled by note name, interval, or degree.
5. **15-minute timed session:** four fretboard blocks then a 5-minute rotating theory mix. Pause/Skip, per-block tally, auto-pauses when backgrounded, wake lock keeps screen on.
6. **Settings:** spelling preference (auto/sharps/flats), fret mode (natural/chromatic), string subset.

Everything is stored locally in IndexedDB (no accounts, no tracking). Works offline after first load (PWA service worker).

## How it supports the scientific protocol
- **Hear → Explain → Locate → Play → Transpose → Apply → Verify:** theory drills cover Explain/Locate; fretboard drills cover Locate/Play; sessions cover Play/Verify.
- **Spaced repetition:** Leitner boxes (1/3/7/14/30 days); mastery = ≥90% accuracy over last 3 practice days + median time within target.
- **Adaptive picker:** favours notes you recently missed or answered slowly; never repeats the last item.
- **Key-agnostic:** all drills use random keys; answers graded on spelled note.

## Status
All milestones M0-M8 complete. App is feature-complete; further work is iterative polish.

## Project layout
```
src/music/        Pure theory engine (notes, intervals, scales, keys, chords, progressions, fretboard)
src/mastery/      Mastery scoring, Leitner SRS, weighted picker, skill targets
src/data/         IndexedDB access (only module touching storage)
src/drills/       Drill components + shared hook + drill lists
src/components/   Fretboard, NotePad, GradeButtons, answer pads
src/screens/      Practice, SessionTimer, Settings, KeyExplorer
docs/             SPEC, PLAN, ARCHITECTURE, REUSE_INVENTORY, DECISIONS, PITFALLS, GLOSSARY
```

## Agent/LLM context
- `AGENT.md` / `agent.md` — canonical agent guide.
- `GEMINI.md` / `gemin.md` — Gemini-specific notes (pointer to AGENT.md).
- `TUTOR_SYSTEM_PROMPT.md` — reusable LLM tutor prompt.
- `INDEPENDENT_REVIEW.md` — independent review and rationale.
- `practice_log.md` — practice log template.

## License
MIT (recommended; matches the ecosystem).
