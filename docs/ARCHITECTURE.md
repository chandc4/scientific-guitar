# ARCHITECTURE

See AGENT.md §4 for the module layout. Key rules:

- `src/music/` is pure: no React, no I/O, no randomness. All note/interval/fretboard math.
- UI never computes notes or intervals; it calls `src/music`.
- `src/data/` is the only module touching IndexedDB.
- `src/mastery/` uses injectable RNG for testability.
- Strict TS, Vite, React 19, PWA (offline), IndexedDB local-first.
- No regex parsing; plain code.
- Small files, minimal abstractions.

## Data flow
User session → curriculum picks weakest skill (mastery) → drill renders fretboard from music engine → attempt logged to IndexedDB → mastery/SRS updated → next item.

## Offline
Service worker precaches build (vite-plugin-pwa). All data local. Raga data cached as JSON; MCP lookups online only.
