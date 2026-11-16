# GEMINI.md — Scientific Guitar Learning Tool: Context for Gemini

This file provides project context for Gemini (and Gemini-based agents). It mirrors `AGENT.md`;
read both. `AGENT.md` is the canonical agent guide; this file adds Gemini-specific usage notes.

---

## 1. Project identity

- **Name:** Scientific Guitar Learning System (working title TBD)
- **Mission:** Help a learner master guitar — depth in Indian ragas and Western blues — via a
  first-principles frequency/interval framework, reusing existing open-source components and
  building only what is genuinely missing.
- **Primary user:** single serious learner initially; designed reusable by many (PWA, offline,
  no accounts, local-first).
- **Non-goals:** not a DAW, tuner, tanpura, raga classifier, or monolithic AI teacher.
  Not tab-parroting.
- **Status:** Scaffold complete (green `npm run check`). Phase 0 gate (4 weeks, no feature building). See `INDEPENDENT_REVIEW.md`.

---

## 2. Core philosophy (do not violate)

1. Interval vectors are the unit of knowledge (`[0,4,7]`, `[0,2,4,5,7,9,11]`).
2. Key-agnostic: root → template → transpose.
3. Theory is a map, not the vehicle. Every concept passes the 7-gate loop: Hear, Explain,
   Locate, Play, Transpose, Apply, Verify.
4. Ear first: sing/identify before naming or playing.
5. Expose tuning asymmetry: standard tuning is fourths except G–B (major third).
6. Separate theory from technique.
7. Reuse over build.
8. Measurement-driven mastery (aural ID ≥90% ×3 sessions, clean execution, ≥3-key
   transposition, musical application, re-tested without aids at 7/30 days).
9. Raga ≠ scale; blues ≠ scale.

---

## 3. Reuse decisions (do we reuse existing repos?)

**Yes.** Verified assets and how to use them:

- `lucasvlad/guitar-app` → theory engine, SRS/mastery, IndexedDB, fretboard drills (adapt).
- `twelveswaras/twelveswaras` → raga data, tonic (Sa) detection, raga ear trainer (integrate via MCP; first priority).
- `Rahul7387/guitar-learning-app` → mic feedback reference.
- `Guitariz/Guitariz` → audio features reference (later).
- `adhit-r/RagaSense`, `MTG/saraga` → raga metadata/dataset reference only.

**Build (not reuse):** raga curriculum, blues vocabulary, phrase feedback, scheduler orchestration,
pedagogy layer. Do not build DAW/tuner/tanpura/classifier.

---

## 4. Architecture (target)

```
src/music/        Pure theory engine (notes, spelling, intervals, scales, keys, chords,
                  progressions, fretboard, tunings, capo). No React/I/O/randomness.
src/mastery/      Pure mastery + Leitner SRS + weighted picker (injectable RNG).
src/data/         IndexedDB access (only module touching storage).
src/drills/       Drill components + shared hook.
src/components/   Fretboard, NotePad, grade buttons, DronePlayer.
src/screens/      Practice, SessionTimer, Settings, RagaLab, BluesLab, SongLab.
src/raga/         Raga data model, phrase grammar, ornaments, drone context.
src/blues/        Blues vocabulary, 12-bar forms, lick grammar, chord targets.
src/ear/          Ear-training engine.
src/audio/        Mic pitch detection (monophonic first), onset/timing (later).
src/curriculum/   Lessons, gating, sequencing, spaced review.
src/practice/     Practice log, metrics, session planner.
```

Constraints: strict TS, Vite, React 19, PWA offline, local-first IndexedDB, CI green,
no regex parsing, all music logic in `src/music`, small files, minimal abstractions.

---

## 5. Design principles

- Local-first, no accounts, no tracking; exportable data.
- Offline-capable PWA.
- One-rule UX: open → press Start; app picks weakest items.
- Hear before play; drone is first-class.
- Drone-first for raga (Sa reference).
- Metronome always available.
- Recording + self-review built in.
- Mobile-first, tap targets ≥48px.
- No AI in critical learning path; LLM tutor is external (prompt + MCP).

---

## 6. Roadmap (milestones)

Gate: M1 starts only after Phase 0 (4 weeks) complete + gap analysis documented.

- M0 — Phase 0 (4 weeks, no code). Use existing tools; log metrics; decide.
- M1 — Foundation (reuse lucasvlad): setup, PWA, CI, theory engine, IndexedDB, SRS, drills, tests.
- M2 — Audio primitives: drone, metronome, mic pitch (monophonic), recording.
- M3 — Ear training: interval/chord/degree ID with audio, adaptive picker.
- M4 — Raga module: 10–15 ragas, phrase player, ornaments, drone, twelveswaras integration.
- M5 — Blues module: 12-bar forms, chord-tone targeting, lick library, transcription, backing tracks.
- M6 — Curriculum engine: lessons, gating, sequencing, spaced review, session planner.
- M7 — Song Lab: analyze songs, practice paths.
- M8 — Polish: heatmap, export, piano mode, accessibility, performance.

Each milestone ships only what it needs, gated by tests + working demo.

---

## 7. Quality bar (every PR)

- TS strict, no unjustified `any`.
- Pure music logic in `src/music`; UI never computes notes/intervals.
- Unit tests for theory/mastery; integration tests for drills.
- Injectable RNG in randomized code.
- No regex parsing.
- Small files, minimal abstractions.
- CI green (typecheck + tests + build).
- Offline still works.
- No SRS/mastery regression without migration.

---

## 8. Agent workflow (Gemini-specific)

- Read `AGENT.md`, `INDEPENDENT_REVIEW.md`, `practice_log.md` before changes.
- Prefer editing over creating; don't add docs beyond need.
- Don't build outside current milestone without approval.
- Justify reuse vs. build when adding dependencies.
- Add/update tests with theory changes.
- Never claim audio analysis the app lacks.
- Update roadmap when milestones shift.
- Small, focused commits.

Gemini-specific tips:
- When generating code, keep modules small and pure; put all note/interval math in `src/music`.
- Prefer TypeScript interfaces over classes for data models.
- For randomized logic, accept an RNG parameter (`() => number`) for testability.
- When unsure about a repo's API, fetch its README/source via tools rather than guessing.
- Do not fabricate raga data; source from twelveswaras or verified references.

---

## 9. Success criteria for the tool

A new user can: open app → Start → adaptive 15-min session; drill fretboard with SRS/mastery;
practice with drone + metronome + mic feedback; train ear; work through a raga and a blues
end-to-end; record and self-review; use fully offline.

---

## 10. Open questions for the human

- App name/branding.
- Fork `lucasvlad/guitar-app` vs. fresh start (recommend fork).
- Hosting (GitHub Pages vs. self-host).
- Cache curated raga subset locally vs. MCP at runtime (recommend cache subset + MCP lookups).
- License (recommend MIT).
