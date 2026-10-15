# R1 requirements coverage

This file checks every item in the R1 requirement files ([`docs/requirements/R1-product-thinking/`](../../docs/requirements/R1-product-thinking/)) against the Task 1 outputs, and shows where each one is answered. Checked 15 Oct 2026.

**Result:** every Must and Should item is covered. One Could item (F1.21) was left out on purpose. One cross-check (consistency with R4) waits until R4 is written.

## 1. What the brief asks

| Brief question | Answered in |
|---|---|
| 1a: "Which modules would you ship first (within 30 days) and why?" | [1a](1a-prioritisation.md): §4 ranking, with reasons in §1–§3 and §5 |
| 1b: "Map all actions → AI vs Human" | [1b](1b-ai-human-split.md) §1 and the [live Sheet](https://docs.google.com/spreadsheets/d/1pl8JSEAvlPR1mexlfx0cwiFMPU-B4-QJFga4N31pl1o/edit?usp=sharing) (37 actions) |
| 1b: "Is 76% AI realistic?" | 1b §2 (measured three ways) and §3 (verdict) |
| 1b: "How would you improve this metric for investor credibility?" | 1b §5 (Autonomy Rate, audit, investor view) and §6 (pilot plan) |
| 1c: "Pick one unclear feature…" | [1c](1c-takeover-spec.md): "How we chose this feature" |
| 1c: UI behaviour | 1c §2 |
| 1c: State transitions | 1c §3 |
| 1c: Error handling | 1c §4 |
| 1c: Success criteria | 1c §5 |

## 2. What reviewers judge (evaluation.md)

| Reviewer's bar | Where it's met |
|---|---|
| Founder: ranking tied to revenue, not ease of building | 1a §1 (lens), §3 (business impact weighted highest), §5 (dependency trap) |
| Senior PM: 1b questions how 76% is measured and who audits it | 1b §2 (three methods, sensitivity), §5 (definition, weekly audit by a lead consultant) |
| Senior PM: an engineer could build 1c without asking a question | 1c §3 (every transition has a trigger, an "Only if" check and an action), §4 (errors, edge cases, validation), §5 (11 tests) |
| Operator: volumes and hours hold up | 1b §1 (inputs labelled A19, A20, A34), §2 sensitivity table |
| Operator: split turns into consultant capacity | 1b §4 (≈ 2.7 brands per consultant vs ≈ 0.35 without AI) |

## 3. Features (features.md)

| ID | Item | MoSCoW | Where | Status |
|---|---|---|---|---|
| F1.1 | 30-day ranking table | M | 1a §4 | ✅ |
| F1.2 | Dependency trap | M | 1a §5 | ✅ |
| F1.3 | Day-30 success criteria | M | 1a §8 | ✅ |
| F1.4 | Day-1 WhatsApp critical path | S | 1a §6 | ✅ No lead time is quoted because none was verified |
| F1.5 | Action map, 37 actions × owner | M | 1b §1, CSV, XLSX, live Sheet | ✅ |
| F1.6 | Three-way split with inputs visible | M | 1b §2 (formulas), Sheet | ✅ |
| F1.7 | Verdict on 76% | M | 1b §3 | ✅ |
| F1.8 | Consultant capacity | S | 1b §4 | ✅ |
| F1.9 | Autonomy Rate definition, event schema, unedited rule | M | 1b §5 | ✅ |
| F1.10 | Audit design | M | 1b §5 "Audit" | ✅ |
| F1.11 | Investor view: badge + 3 outcome metrics | M | 1b §5 "Investor view" | ✅ |
| F1.12 | Why Takeover beats the Readiness Score | S | 1c "How we chose this feature" | ✅ |
| F1.13 | User stories, v1 scope | M | 1c §1 | ✅ |
| F1.14 | State table + transitions (trigger, guard, action) | M | 1c §3 | ✅ The guard is the "Only if" column |
| F1.15 | UI: inbox, header, Why-flagged card, takeover panel, composer | M | 1c §2 B and C | ✅ Plus the agent status strip (§2 A) |
| F1.16 | Empty / loading / error states | M | 1c §4 | ✅ |
| F1.17 | Validation rules | M | 1c §4 "Validation rules" | ✅ |
| F1.18 | Edge cases (≥ 7) | M | 1c §4 "Edge cases" | ✅ 10 |
| F1.19 | Acceptance criteria (≥ 6) + post-launch metrics | M | 1c §5 | ✅ 11 tests + pilot metrics |
| F1.20 | Mermaid state diagram | C | 1c §3 (GitHub and PDF) | ✅ |
| F1.21 | Partner-distribution framing | C | — | Left out on purpose: no natural fit in Task 1. It's covered in R7 (F7.6). |
| F1.22 | Full Readiness Score spec | W | — | Out of scope; named only as the runner-up in 1c |

## 4. Tasks (tasks.md)

| Task | Done | Evidence |
|---|---|---|
| T1.01 Confirm D-04, D-05, D-06 | ✅ | `docs/assumptions-and-decisions.md`: all three "Confirmed", 15 Oct 2026 |
| T1.02 Ranking table | ✅ | 1a §4 |
| T1.03 Dependency trap, day-30 criteria, critical path | ✅ | 1a §5, §8, §6 |
| T1.04 Sheet tab `AI_Human_Split` (37 rows) | ✅ | Live Sheet |
| T1.05 Formulas; outputs 68 / 81 / 87 / 68% | ✅ | Read back from the Sheet; they match the doc |
| T1.06 Verdict + capacity, citing A19/A20 | ✅ | 1b §3, §4 |
| T1.07 Autonomy Rate, schema, audit, investor view | ✅ | 1b §5 |
| T1.08 Full 1c spec | ✅ | 1c §1–§6 |
| T1.09 Verify error 131047 and the 4,096-character limit | ✅ | 1c "Platform facts used"; A23 marked Verified |
| T1.10 2–3 line TL;DRs | ✅ | Top of 1a, 1b, 1c |

## 5. Definition of done (definition-of-done.md)

| Item | Status |
|---|---|
| 1a: 5 modules ranked, each with a 30-day scope and a reason | ✅ 1a §4 |
| 1a: dependency trap stated | ✅ 1a §5 |
| 1a: numeric day-30 criteria | ✅ 1a §8 (6 targets) |
| 1a: WhatsApp BSP flagged as the day-1 critical path | ✅ 1a §6 |
| 1b: 37 actions mapped with AI / AI→H / H | ✅ 1b §1 |
| 1b: split shown 3 ways, formulas in a Sheet, doc matches the Sheet | ✅ 1b §2, live Sheet |
| 1b: explicit verdict | ✅ 1b §3 |
| 1b: Autonomy Rate with event schema, unedited rule, audit cadence | ✅ 1b §5 (weekly audit) |
| 1b: autonomy paired with ≥ 2 outcome metrics | ✅ 3 metrics (1b §5) |
| 1b: A19/A20 labelled as estimates | ✅ 1b §1 |
| 1c: user stories and v1 scope | ✅ 1c §1 |
| 1c: every state named; every transition has a trigger, guard and action | ✅ 1c §3 |
| 1c: empty, loading and error states, including send failure, out-of-window send, claim conflict and disconnect | ✅ 1c §4 |
| 1c: numeric validation (4,096 characters, required reason, `state_version`) | ✅ 1c §4 "Validation rules" |
| 1c: ≥ 6 edge cases | ✅ 10 |
| 1c: ≥ 6 testable acceptance criteria | ✅ 11 |
| 1c: post-launch metrics with targets | ✅ 1c §5 "Pilot metrics" (targets labelled as proposals) |
| 1c: Meta facts verified (A23) | ✅ |
| Overall: 2–3 line TL;DR on each part | ✅ |
| Overall: consistent with R2B | ✅ R2B features, 9-step test script and DoD updated to match 1c |
| Overall: consistent with R4 | ⏳ Checked when R4 is written (R4 uses 1a as its baseline) |
| Overall: no unsourced numbers | ✅ Estimates cite A-IDs; targets are labelled as proposals; platform facts link to Meta's docs |

## 6. Hand-offs (tasks.md)

| Hand-off | Where it landed | Status |
|---|---|---|
| 1c spec → R2B build spec; acceptance tests → R2B test script | `docs/requirements/R2B-whatsapp-agent-panel/`: F2B.09, F2B.16, F2B.17, F2B.23; the 9-step script covers AC1, AC2, AC4, AC5, AC7, AC9, AC10 | ✅ |
| 1a ranking → R4 consistency baseline | R4 T4.03, T4.05, F4.5 | ✅ (the check itself runs when R4 is written) |
| Autonomy Rate → R2B badge | F2B.02 (with the model-vs-rules split on hover). R2A and R2C not built (D-10) | ✅ |
| Autonomy Rate, 76% verdict and capacity line → R8 | R8 F8.1, T8.03 | ✅ |
| 1b onboarding actions → R2A | Not applicable: R2A not built (D-10) | — |
