# agent.md — Scientific Guitar Learning Tool: Agent Development Guide

This file is the single source of truth for any coding agent (Claude, Gemini, Copilot, etc.)
working on this repository. Read it before making changes. Update it when architecture or
roadmap decisions change.

---

## 1. Project identity

- **Name:** Scientific Guitar Learning System (working title: "FretLab" / TBD)
- **Mission:** Help a learner master guitar — with depth in Indian ragas and Western blues — through a first-principles, frequency/interval-based framework, using existing open-source components wherever possible and building only what is genuinely missing.
- **Primary user:** A single serious learner initially; designed to be reusable by many (PWA, offline, no accounts, local-first data).
- **Non-goals:** Not a DAW, not a tuner, not a tanpura, not a raga classifier, not a monolithic "AI teacher." Not tab-parroting.
- **Status:** Scaffold complete (green `npm run check`: typecheck + test + build + PWA). Phase 0 (4 weeks, no feature building) is the current gate. See `INDEPENDENT_REVIEW.md`.

---

## 2. Core philosophy (do not violate)

1. **Interval vectors are the unit of knowledge.** Scales, chords, arpeggios, raga phrases, blues licks are semitone vectors first (`[0,4,7]`, `[0,2,4,5,7,9,11]`), fretboard geometry second.
2. **Key-agnostic.** Identify root → define template → transpose. Never hardcode keys.
3. **Theory is a map, not the vehicle.** Every concept must pass the 7-gate loop (Hear, Explain, Locate, Play, Transpose, Apply, Verify). Theory alone is not "learned."
4. **Ear first.** Sing/identify before naming or playing. No shape is taught without its sound.
5. **Expose tuning asymmetry.** Standard tuning = fourths except G–B (major third). Always explain why a shape changes there; never call patterns universal.
6. **Separate theory from technique.** Different modules, different drills.
7. **Reuse over build.** Use existing repos as libraries/references/data. Build only curriculum, interaction, and raga/blues-specific layers.
8. **Measurement-driven.** Mastery = aural ID ≥90% (3 sessions) + clean execution + transposition to ≥3 keys + musical application, re-tested without aids at 7/30 days.
9. **Raga ≠ scale; blues ≠ scale.** Raga = melodic grammar + ornaments + drone. Blues = groove + phrasing + chord-tone targeting.

---

## 3. Reuse decisions (answer to "do we reuse existing repos?")

**Yes — reuse, do not rebuild.** Verified assets:

| Component | Source | How we use it |
|---|---|---|
| Theory engine (notes, spelling, intervals, scales, keys, chords, progressions, fretboard) | `lucasvlad/guitar-app` (`src/music/`) | Adapt as our `src/music/` core. Pure functions, no I/O. |
| Spaced repetition (Leitner 1/3/7/14/30d) + mastery scoring + adaptive picker | `lucasvlad/guitar-app` (`src/mastery/`) | Adapt as `src/mastery/`. |
| Local storage (IndexedDB, versioned) | `lucasvlad/guitar-app` (`src/data/`) | Adapt. Local-first, no accounts. |
| Fretboard UI + drills | `lucasvlad/guitar-app` (`src/drills/`, `src/components/`) | Adapt patterns. |
| Mic note/chord feedback | `Rahul7387/guitar-learning-app` (Fretline) | Reference for Web Audio pitch detection. |
| Raga data + tonic (Sa) detection + raga ear trainer | `twelveswaras/twelveswaras` (MCP server + web) | **First integration.** Consume via MCP, not vendoring. |
| Raga metadata/relationships (Melakarta/Janya) | `adhit-r/RagaSense` | Reference only. |
| Raga audio dataset | `MTG/saraga` | Only if building analysis later. |
| Audio features (chord detection, source separation/Demucs) | `Guitariz/Guitariz` | Reference for later milestones. |

**Rules for reuse:**
- Prefer consuming via MCP/API over vendoring.
- Clone and run any repo before depending on it; several are early-stage.
- Do not take on a repo's license obligations lightly; check licenses (twelveswaras = MIT).
- Never depend on raga *classification* as a feature; use raga *data*.

**We build (not reuse):** raga curriculum module, blues vocabulary module, phrase-level feedback, practice scheduler orchestration, and the interval→fretboard→ear→application pedagogy layer.

---

## 4. Architecture (target)

```
src/
  music/        Pure theory engine: notes, spelling, intervals, scales, keys,
                chords, progressions, fretboard mapping, tunings, capo.
                No React, no I/O, no randomness. Unit-tested.
  mastery/      Pure mastery scoring, Leitner scheduling, weighted picker,
                skill targets. Injectable RNG for testability.
  data/         Data model types + IndexedDB access (idb). Only module touching storage.
  drills/       One component per drill + shared drill-run hook + options.
  components/   Shared UI: Fretboard, NotePad, grade buttons, DronePlayer.
  screens/      Practice (start), SessionTimer, Settings, RagaLab, BluesLab, SongLab.
  raga/         Raga data model, phrase grammar, ornament guides, drone context.
  blues/        Blues vocabulary, 12-bar forms, lick grammar, chord-tone targets.
  ear/          Ear-training engine: interval/chord/degree/phrase ID.
  audio/        Mic pitch detection (monophonic first), onset, timing (later).
  curriculum/   Lesson definitions, gating, sequencing, spaced review orchestration.
  practice/     Practice log, metrics, session planner.
```

**Constraints (from lucasvlad, keep them):**
- No regex for parsing; plain code.
- All music logic in `src/music`; UI never computes notes/intervals.
- Small files, minimal abstractions, each milestone builds only what it needs.
- Strict TypeScript, Vite, React 19, PWA (offline), IndexedDB local-first.
- CI: typecheck + tests + build on every push.

---

## 5. Design principles for the tool

- **Local-first, no accounts, no tracking.** Data in IndexedDB. Exportable.
- **Offline-capable PWA.** Service worker precaches build.
- **One rule UX:** open app → press Start. App picks what to practice from weakest items.
- **Hear before play.** Audio (drone) is a first-class primitive, not an afterthought.
- **Drone-first for raga.** Tanpura drone always available; Sa is the reference.
- **Metronome always available** for timing work.
- **Recording & self-review** built in (weekly review rubric).
- **Accessibility:** mobile-first tap targets ≥48px; works on phone (primary device).
- **No AI in the critical path of learning.** The LLM tutor is external (prompt + MCP); the app works without it.

---

## 6. Roadmap (milestones)

Gate: do not start Milestone 1 until Phase 0 (4 weeks) is complete and the gap analysis is documented.

- **M0 — Phase 0 (4 weeks, no code).** Use existing tools; run the protocol; log metrics. Decide whether to build.
- **M1 — Foundation (reuse lucasvlad).** Project setup, PWA, CI/CD, theory engine port, IndexedDB, mastery/SRS, basic fretboard drills. Tests.
- **M2 — Audio primitives.** Drone player, metronome, mic pitch detection (monophonic), recording.
- **M3 — Ear training.** Interval/chord/degree ID with audio; adaptive picker.
- **M4 — Raga module.** Raga data (10–15 ragas), phrase player, ornament guides, drone context, raga ear trainer (integrate twelveswaras).
- **M5 — Blues module.** 12-bar forms, chord-tone targeting, lick library, transcription workflow, backing-track integration.
- **M6 — Curriculum engine.** Lesson definitions, gating, sequencing, spaced review orchestration, session planner.
- **M7 — Song Lab.** Analyze songs (key, progression, intervals), practice paths.
- **M8 — Polish.** Heatmap, export, piano mode, accessibility, performance.

Each milestone ships only what it needs and is gated by tests + a working demo.

---

## 7. Quality bar (every PR must satisfy)

- TypeScript strict, no `any` without justification.
- Pure music logic in `src/music`; UI never computes notes/intervals.
- Unit tests for all theory/mastery functions; integration tests for drills.
- Injectable RNG in randomized code (test statistics over seeded draws).
- No regex for parsing; plain code.
- Small files; minimal abstractions.
- CI green (typecheck + tests + build).
- Offline still works after change (PWA).
- No regression in mastery/SRS behavior without explicit migration.

---

## 8. Agent workflow instructions

- Read `AGENT.md`, `INDEPENDENT_REVIEW.md`, and `practice_log.md` before changes.
- Prefer editing existing files over creating new ones; do not create docs beyond what's needed.
- Do not build features outside the current milestone without approval.
- When adding a dependency, justify reuse vs. build in the PR description.
- When touching theory logic, add/update tests in the same change.
- Never claim audio analysis capability the app doesn't have; DSP stays conceptual.
- Update this file's roadmap when milestones shift.
- Keep commits small and focused; one concern per commit.

---

## 9. Success criteria for the tool (not the learner)

The tool is "done enough" when a new user can:
1. Open app → press Start → get an adaptive 15-min session.
2. Drill fretboard with SRS and mastery tracking.
3. Practice with a drone + metronome + mic feedback.
4. Train ear (intervals, chords, degrees).
5. Work through a raga (Sa → pakad → ornaments → apply) and a blues (12-bar → chord tones → licks → solo).
6. Record and self-review a performance.
7. Use entirely offline.

---

## 10. Open questions for the human

- App name and branding.
- Whether to fork `lucasvlad/guitar-app` or start fresh (recommend fork + extend, to inherit tests/CI).
- Hosting (GitHub Pages vs. self-host).
- Whether to integrate twelveswaras via MCP at runtime or cache raga data locally (recommend: cache a curated subset locally for offline; MCP for lookups online).
- License for our code (recommend MIT to match ecosystem).
