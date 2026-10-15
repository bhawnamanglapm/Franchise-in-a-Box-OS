# R1 output: Product Thinking (Task 1)

| File | Brief item | What it contains |
|---|---|---|
| [1a-prioritisation.md](1a-prioritisation.md) | 1a | 30-day module ranking, the dependency trap, the WhatsApp critical path, day-30 success criteria |
| [1b-ai-human-split.md](1b-ai-human-split.md) | 1b | Action map summary, the split measured three ways with sensitivity, the verdict on 76%, consultant capacity, and the Autonomy Rate (definition, events, audit, investor view) |
| [ai-human-split.csv](ai-human-split.csv) | 1b | All 37 actions with owner, frequency, minutes, AI share and value weight. Import it as the Sheet tab `AI_Human_Split`; the formulas are in 1b §2. |
| [ai-human-split.xlsx](ai-human-split.xlsx) | 1b | The same 37 rows with the formulas already built in: the 4 split measures, hours, brands per consultant, and a per-module summary. Upload it to Google Drive and open it with Google Sheets. Yellow cells are editable estimates; blue cells recalculate. |
| [1c-takeover-spec.md](1c-takeover-spec.md) | 1c | Conversation Takeover spec: 7 states, 9 transitions, UI, empty/loading/error states, validation, 8 edge cases, 8 acceptance criteria, metrics |

## Key numbers

All of these come from `ai-human-split.csv` and use estimates A19, A20, A34 and A35.

| Measure | Value |
|---|---|
| AI share by count (strict / generous) | 68% / 81% |
| AI share by time (full build / day-30 slice) | 87% / 76.5% |
| AI share by value | 68% |
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
| 1a: 5 modules ranked; dependency trap; numeric day-30 criteria; BSP critical path | Done |
| 1b: 37 actions mapped; split 3 ways; explicit verdict; Autonomy Rate with events, unedited rule and audit; ≥ 2 outcome metrics; A19/A20 labelled | Done |
| 1b: formulas live in a Google Sheet tab that matches the doc | Workbook ready with formulas (values checked against the doc). **To do (you):** upload `ai-human-split.xlsx` to Google Drive, open with Google Sheets, set link sharing to "anyone with the link can view" |
| 1c: stories, scope, states, transitions with guards, UI, error states, numeric validation, ≥ 6 edge cases, ≥ 6 testable ACs, metrics with targets, Meta facts verified | Done |
| Each sub-task opens with a TL;DR; no unsourced numbers | Done. Targets are labelled as proposals, and estimates cite A-IDs. |
| Consistent with R4 and R2B | R2B F2B.09 updated to the 7-state machine; R4 is checked when it's written next |

## Hand-offs
- **R4:** the 1a ranking is its consistency baseline.
- **R2B:** the 1c spec is the build spec. AC1, AC2, AC4, AC5 and AC7 go into its test script.
- **R2A, R2B, R2C:** the badge uses the Autonomy Rate rule from 1b §5.
- **R8:** the 76% verdict and the capacity line go into the executive summary.
