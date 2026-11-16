# REUSE INVENTORY

| Need | Source | Usage | License |
|---|---|---|---|
| Theory engine | lucasvlad/guitar-app src/music | Adapt | (check repo) |
| SRS/mastery | lucasvlad/guitar-app src/mastery | Adapt | (check repo) |
| IndexedDB | lucasvlad/guitar-app src/data | Adapt | (check repo) |
| Fretboard/drills | lucasvlad/guitar-app src/drills, src/components | Adapt patterns | (check repo) |
| Mic feedback | Rahul7387/guitar-learning-app | Reference | (check repo) |
| Raga data + Sa detection + ear trainer | twelveswaras (MCP) | Consume via MCP | MIT |
| Raga metadata | adhit-r/RagaSense | Reference only | MIT |
| Raga dataset | MTG/saraga | Only if building analysis | (check) |
| Audio features | Guitariz/Guitariz | Reference (later) | MIT |

Rules: prefer MCP/API over vendoring; clone+run before depending; never depend on raga classification as a feature; use raga data.
Pinned SHAs: see REFERENCES.md.
