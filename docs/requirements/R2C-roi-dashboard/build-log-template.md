# R2C: ROI Dashboard: build log (fill in while building, and only with real entries)

> Rule: every row is written during the build, at the moment it happens. Nothing is reconstructed afterwards or invented. The Task 2 Option C write-up is copied from this log.

## Session info
- Tool(s): Lovable / Claude Code
- Start time:
- Deployed URL:
- R5 Sheet version used for inputs:

## Prompt log

| # | Time | Tool | Exact prompt (paste verbatim) | What AI produced | What AI got wrong (component · symptom · likely cause) | What I fixed manually (how) | Time lost |
|---|---|---|---|---|---|---|---|
| 1 | | | | | | | |
| 2 | | | | | | | |
| 3 | | | | | | | |
| 4 | | | | | | | |
| 5 | | | | | | | |
| 6 | | | | | | | |
| 7 | | | | | | | |

## R5 match check
| Output | R5 Sheet value | Dashboard value | Match? |
|---|---|---|---|
| Payback month | | | |
| Y1 EBITDA | | | |
| Y3 cumulative cash | | | |

## Things to watch for (so entries are specific)
- Design tokens replaced with Tailwind defaults (e.g. `bg-gray-900` instead of `#0A0A0F`)
- Numbers hardcoded inside chart or card components instead of read from `computeModel`
- Payback that ignores ramp-up, the franchise fee or working capital
- Off-by-one month in payback (month 0 vs month 1)
- Royalty applied to EBITDA instead of revenue
- Benchmark values filled in by the AI without a source
- ₹ formatting (lakh / crore grouping) wrong or inconsistent
- Chart breaking when cumulative cash never crosses zero
- Mobile layout overflow in the chart or the sensitivity table

## Unbuilt items → "1 more day"
| Item | Linked feature ID | Est. |
|---|---|---|
| | | |
