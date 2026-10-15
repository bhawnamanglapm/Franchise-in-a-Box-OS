# R2A: Onboarding Wizard: build log (fill in while building, and only with real entries)

> Rule: every row is written during the build, at the moment it happens. Nothing is reconstructed afterwards or invented. The Task 2 Option A write-up is copied from this log.

## Session info
- Tool(s): Lovable / Claude Code
- Start time:
- Deployed URL:

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

## Things to watch for (so entries are specific)
- Design tokens replaced with Tailwind defaults (e.g. `bg-gray-900` instead of `#0A0A0F`)
- Step validation that only runs on submit, so Next isn't actually blocked
- File checks done by extension only (a renamed file passes), or by MIME type only (some browsers send an empty type)
- Donut percentages that drift from 100% through rounding
- Readiness Score hardcoded or computed once, so it doesn't change when inputs change
- Draft autosave overwriting a newer state, or restoring a half-uploaded file
- ₹ formatting (lakh / crore grouping) wrong or inconsistent
- Mobile layout overflow in the stepper or the donut legend

## Unbuilt items → "1 more day"
| Item | Linked feature ID | Est. |
|---|---|---|
| | | |
