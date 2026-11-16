# DECISIONS (ADR-style)

- 2026-11-16: Fork/adapt lucasvlad/guitar-app as the base (inherit tests/CI). 
- 2026-11-16: Tech stack = React 19 + TS strict + Vite + vite-plugin-pwa + Vitest + idb (proven by lucasvlad).
- 2026-11-16: No UI library; plain CSS, mobile-first, >=48px tap targets.
- 2026-11-16: No router; screens switch via React state.
- 2026-11-16: Local-first, no accounts, no tracking.
- 2026-11-16: Raga data cached locally as JSON; MCP for online lookups.
- 2026-11-16: License MIT (recommended).
- 2026-11-16: Node 24 pinned via .nvmrc.
- 2026-11-16: DSP is conceptual only; not in lessons unless requested.
- 2026-11-16: Phase 0 gate before any code.

Add new decisions here with date and rationale.
