# REFERENCES (pinned)

Use these instead of re-searching. Re-pin (update SHA) only when intentionally upgrading.

## Upstream (reuse source)
- lucasvlad/guitar-app — commit d6fa6c962e57cfffcc66c4b35c771ba5d8055bc6 (2026-11-02, M1+M2). License: (check). Base for fork.
  - src/music/, src/mastery/, src/data/, src/drills/, src/components/, src/screens/
  - CLAUDE.md (agent decisions), docs/SPEC.md, docs/PLAN.md
- twelveswaras/twelveswaras — commit 8a0f2f306ad36eb478b4c7c7dc508b550ca2e0b7 (2026-11-15). License: MIT.
  - MCP server + raga data + ear trainer. Consume via MCP, not vendoring.
- Guitariz/Guitariz — (not pinned; reference only). License: MIT.
- adhit-r/RagaSense — (reference only). License: MIT.
- Rahul7387/guitar-learning-app — (reference only).

## External (do not vendor)
- MTG/saraga — raga audio dataset (only if building analysis).
- iTablaPro / Tanpura Droid / web tanpura — drone apps.
- Drumgenius / iReal Pro / YouTube — backing tracks.

## Standards
- Node 24 (.nvmrc)
- React 19, Vite 8, Vitest 5, TS 7, idb 8 (per lucasvlad package.json).

## How to consume
- Prefer MCP/API over vendoring.
- Clone + run before depending.
- Never depend on raga classification; use raga data.
