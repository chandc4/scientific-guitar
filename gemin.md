# gemin.md — Pointer

**Canonical agent guide: `AGENT.md`.** Read it first. This file only adds Gemini-specific notes
to avoid duplicate, drifting documentation.

## Gemini-specific tips
- All note/interval/fretboard math goes in `src/music/`. UI never computes notes.
- Prefer TS interfaces over classes for data models.
- Randomized logic takes an RNG param `() => number` for testability.
- When unsure about a repo's API, fetch its README/source via tools rather than guessing.
- Do not fabricate raga data; source from twelveswaras or verified references.
- Run `npm run check` (typecheck + tests + build) to validate any change; it's fast.
- Reference docs: `docs/SPEC.md`, `docs/PLAN.md`, `docs/ARCHITECTURE.md`,
  `docs/REUSE_INVENTORY.md`, `docs/DECISIONS.md`, `docs/PITFALLS.md`, `REFERENCES.md`.
- Pinned upstream SHAs are in `REFERENCES.md`; don't re-fetch unless upgrading.
