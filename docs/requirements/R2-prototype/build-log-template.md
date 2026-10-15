# R2: Build log (fill in while building, and only with real entries)

> Rule: every row is written during the build, at the moment it happens. Nothing is reconstructed afterwards or invented. The Task 2 write-up is copied from this log.

## Session info
- Tool(s): Lovable / Claude Code
- Start time:
- Freeze time (start + 2 h):
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
- State held in several components and drifting apart (the badge doesn't update after a takeover)
- Trigger rules hardcoded per conversation instead of evaluated on each message
- AI still "replies" in HUMAN_ACTIVE (a state guard is missing)
- Hindi or Devanagari text breaking layout or fonts
- Timers (SLA, 24 h) not cleared on state change
- Mobile layout overflow

## Unbuilt at freeze → "1 more day"
| Item | Linked 1c acceptance criterion | Est. |
|---|---|---|
| | | |
