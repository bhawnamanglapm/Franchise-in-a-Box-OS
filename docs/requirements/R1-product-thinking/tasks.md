# R1: Product Thinking: detailed tasks

Total estimate: **1.5 h** (Day 1). Order = execution order.

| # | Task | Output | Est. | Owner | Depends on |
|---|---|---|---|---|---|
| T1.01 | Confirm D-04 (30-day order), D-05 (badge), D-06 (SLA) | Decision log updated | 5 m | You | — |
| T1.02 | Finalise the 1a ranking table; tighten each "why now" to one line | F1.1 | 10 m | You + Claude | T1.01 |
| T1.03 | Write the dependency-trap paragraph and day-30 success criteria | F1.2, F1.3, F1.4 | 10 m | You + Claude | T1.02 |
| T1.04 | Create Sheet tab `AI_Human_Split`: 37 rows × (module, action, owner, freq/month, manual minutes, AI share of minutes, value weight) | F1.5, F1.6 | 20 m | You | — |
| T1.05 | Add formulas: count (generous and strict), time-weighted, value-weighted. Confirm the outputs: 76 / 68 / 79 / 56%. | F1.6 | 10 m | You | T1.04 |
| T1.06 | Write the 76% verdict and the capacity insight, citing A19/A20 | F1.7, F1.8 | 5 m | You + Claude | T1.05 |
| T1.07 | Write the Autonomy Rate definition, event schema, audit and investor view | F1.9–F1.11 | 10 m | You + Claude | T1.01 |
| T1.08 | Finalise the 1c spec: stories, states, transitions, UI, states, validation, edges, AC, metrics | F1.12–F1.19 | 15 m | You + Claude | T1.01 |
| T1.09 | Verify Meta error code 131047 and the 4,096-character limit against current Meta docs; update A23 | Verified facts | 5 m | Claude | — |
| T1.10 | Add 2–3 line TL;DRs to 1a, 1b and 1c; cut filler | Doc-ready section | 5 m | You | T1.02–T1.08 |

## Hand-offs
- The 1c spec goes to **R2** as the build spec, and its acceptance criteria become the R2 test script.
- The 1a ranking goes to **R4** as the consistency baseline.
- The Autonomy Rate definition goes to **R2** (the computed badge) and to **R8** (exec summary).
