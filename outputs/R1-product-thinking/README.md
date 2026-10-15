# R1 output: Product Thinking (Task 1)

| File | Brief item | What it contains |
|---|---|---|
| [1a-prioritisation.md](1a-prioritisation.md) | 1a | Four bottleneck hypotheses, weighted module scoring, the 30-day ranking, the dependency trap, the WhatsApp critical path, a day-by-day roadmap with a day-5 decision gate, day-30 success criteria, risks |
| [1b-ai-human-split.md](1b-ai-human-split.md) | 1b | Action map with an AI-model vs software-rules split, the split measured three ways with sensitivity, the verdict on 76%, consultant capacity, and the Autonomy Rate (definition, three measures kept apart, events, audit, investor view), the pilot plan to validate 76%, and how each workflow is judged end to end (10 dimensions, a six-part workflow definition, task vs outcome, five lenses) |
| [ai-human-split.csv](ai-human-split.csv) | 1b | All 37 actions with owner, frequency, minutes, AI share, value weight and engine (model / rules / human). Import it as the Sheet tab `AI_Human_Split`; the formulas are in 1b §2. |
| [ai-human-split.xlsx](ai-human-split.xlsx) | 1b | The same 37 rows with the formulas already built in: the 4 split measures, hours, brands per consultant, and a per-module summary. Yellow cells are editable estimates; blue cells recalculate. |
| [**Live Google Sheet**](https://docs.google.com/spreadsheets/d/1pl8JSEAvlPR1mexlfx0cwiFMPU-B4-QJFga4N31pl1o/edit?usp=sharing) | 1b | The workbook above, converted to a native Google Sheet. This is the link for reviewers. |
| [1c-takeover-spec.md](1c-takeover-spec.md) | 1c | How the feature was chosen (6 candidates screened), then the Conversation Takeover spec: 7 states, 9 transitions, UI, empty/loading/error states, validation, 10 edge cases, 8 acceptance criteria, metrics, and the events it writes for the Autonomy Rate |
| [**Task 1 as a PDF (start here)**](Task-1-Product-Thinking.pdf) | 1a–1c | 24-page download for reviewers: a one-page plain-English summary (questions, answers, headline numbers, glossary), then 1a, 1b and 1c in full with the state diagram, and the assumptions appendix. Built from the .md files. |
| [**Task 1 as one Google Doc**](https://docs.google.com/document/d/18ThKEZmmZ-7fAyAi9UFVFgm0G9DyfJg3Lt2Ze_lIjME/edit) | 1a–1c | 1a, 1b and 1c combined, plus an appendix of the assumptions and decisions they cite. Built from the three .md files on 15 Oct 2026; the .md files stay the source of truth. |

## Key numbers

All of these come from `ai-human-split.csv` and use estimates A19, A20, A34 and A35.

| Measure | Value |
|---|---|
| AI share by count (strict / generous) | 68% / 81% |
| AI share by time (full build / day-30 slice) | 87% / 76.5% |
| AI share by value | 68% |
| Of the 87% automated time: AI models / software rules | 53.6% / 33.5% |
| Human hours per brand per month (with AI / without) | 58.8 / 456.6 |
| Brands per consultant (with AI / without) | ~2.7 / ~0.35 |

## Decisions and facts settled here
- **Confirmed:** D-04 (30-day order), D-05 (badge = "AI: X% of work | Humans: 100% of closes", X computed), D-06 (10-business-minute SLA).
- **A23 verified:** WhatsApp error 131047 (24-hour window) and the 4,096-character text limit, with sources in 1c.
- **New assumptions:** A34 (set-up spread over 6 months), A35 (160 consultant hours a month).
- **Changed from the earlier draft:** the original 37-row map wasn't saved, so it was rebuilt from the brief. The split figures changed from count 76% / time 79% / value 56% to the numbers above, and the repo docs were updated to match.

## Definition of done: status

| Item | Status |
|---|---|
| 1a: 5 modules ranked with a scored framework; dependency trap; numeric day-30 criteria; BSP critical path; roadmap with a decision gate; risks | Done |
| 1b: 37 actions mapped; split 3 ways; explicit verdict; Autonomy Rate with events, unedited rule and audit; ≥ 2 outcome metrics; A19/A20 labelled | Done |
| 1b: formulas live in a Google Sheet tab that matches the doc | Done: [live Sheet](https://docs.google.com/spreadsheets/d/1pl8JSEAvlPR1mexlfx0cwiFMPU-B4-QJFga4N31pl1o/edit?usp=sharing). The computed values in the Sheet were read back and match the doc (68 / 81 / 87.1 / 68%, 456.6 h, 58.8 h, 2.7 brands). |
| 1c: stories, scope, states, transitions with guards, UI, error states, numeric validation, ≥ 6 edge cases, ≥ 6 testable ACs, metrics with targets, Meta facts verified | Done |
| Each sub-task opens with a TL;DR; no unsourced numbers | Done. Targets are labelled as proposals, and estimates cite A-IDs. |
| Consistent with R4 and R2B | R2B F2B.09 updated to the 7-state machine; R4 is checked when it's written next |

## Hand-offs
- **R4:** the 1a ranking is its consistency baseline.
- **R2B:** the 1c spec is the build spec. AC1, AC2, AC4, AC5 and AC7 go into its test script.
- **R2A, R2B, R2C:** the badge uses the Autonomy Rate rule from 1b §5.
- **R8:** the 76% verdict and the capacity line go into the executive summary.
