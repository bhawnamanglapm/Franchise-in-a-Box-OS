# R2B tasks status

Checks every task in [`tasks.md`](../../docs/requirements/R2B-whatsapp-agent-panel/tasks.md), plus the 9-step test script. **Last checked: 15 Oct 2026, after the UI build and the B-only change (commits 8b30977, 5c2b7a4, da0463c).**

With Claude Code building (D-01 revised), "Prompt N" tasks became build steps done by Claude Code, with you reviewing at each checkpoint. Owners below are the new ones.

## Tasks

| # | Task (short) | Owner now | Status | Evidence / what's missing |
|---|---|---|---|---|
| T2B.01 | Build brief | Claude | Done | [build-brief.md](build-brief.md) (approved plan, with a 15 Oct note on the B-only change) |
| T2B.02 | Prompt pack | — | Not applicable | Claude Code builds from the brief, so there is no Lovable prompt pack. Your actual prompts are logged in [build-log.md](build-log.md) |
| T2B.03 | Create project; open the build log | Claude | Done | `prototypes/r2b-whatsapp-agent-panel/` + build-log.md started 15:47 IST |
| T2B.04 | Scaffold, tokens, shell, nav, badge; check hex values | Claude | Done | Shell, 5-module nav and computed badge on screen (8b30977). All 5 tokens found in the built CSS (hex or `rgb()` form) |
| T2B.05 | Mock data + inbox + chips + filter | Claude | Done, one gap | Inbox with chips, brand tags and All / Needs human / Mine filters (screenshots). **Gap:** no Devanagari Hindi chat in the seed; only in a Simulate example |
| T2B.06 | Thread + system events | Claude | Done | Bubbles, system pills, day separators, failed-send Retry (screenshots) |
| T2B.07 | Trigger engine + "Why flagged" card | Claude | Done | Engine with 23 tests; card shows rule, label and actual value ([desktop-flagged.png](screenshots/desktop-flagged.png)) |
| T2B.08 | State machine + buttons + composer rules | Claude | Done | Tests AC1–AC11; Claim / Return / Won / Lost buttons and the locked composer on screen ([desktop-claimed.png](screenshots/desktop-claimed.png)) |
| T2B.09 | Simulate box + computed badge + SLA countdown | Claude | Done | Side column on desktop, bottom sheet at 375 px ([m375-simulate.png](screenshots/m375-simulate.png)); badge recomputes; "6:00 to claim" chips |
| T2B.10 | Takeover panel, 24 h window, opt-out, empty/error states | Claude | Done, one gap | All built. **Gap:** the suggested reply now has 6 unit tests (fix #14), but the summary's budget, timeline and score fields have no direct test. Opt-out, template picker and error states are not yet in a screenshot |
| — | *New:* Agent Switchboard + live tracking (F2B.24, F2B.25) | Claude | Done | Added after the brief check (prompt 6, da0463c) |
| T2B.11 | Log unbuilt items into "1 more day" | Claude | Not started | Table in build-log.md is still empty. Candidates listed in [features-status.md](features-status.md) W5 |
| T2B.12 | Stretch: live LLM reply | — | Skipped for now | Needs R3's model (D-08) |
| T2B.13 | Deploy to Vercel; confirm public URL | Claude, or you if the Vercel connector needs a login | Not started | After the Playwright run |
| T2B.14 | 9-step test in a fresh browser, desktop + 375 px | Claude (Playwright) + you (final look) | Not started | `tests/e2e/` exists; the spec isn't written yet. See below |
| T2B.15 | Fix any blocker; redeploy once | Claude | Not started | — |
| T2B.16 | Write-up from the log | Claude drafts, you review | Not started | — |
| T2B.17 | 3 screenshots | Claude (Playwright) | Partial | 6 taken in [screenshots/](screenshots/); 3 to be picked for the write-up |
| T2B.18 | After R5: replace illustrative facts with R5's approved figures; redeploy | You | Blocked | Waits on R5 |

## 9-step test script

| Step | What it checks | Unit test (logic) | Seen in screenshots | Playwright (real UI) |
|---|---|---|---|---|
| 1 | URL loads, dark theme, computed badge | Badge: "Autonomy Rate (1b §5)" | Yes | Not run |
| 2 | Hinglish high-intent message → FLAGGED with reasons, 1 holding message (AC1) | Pass: AC1 | Yes (flagged + Why flagged) | Not run |
| 3 | Claim → HUMAN_ACTIVE; AI doesn't reply | Pass: "9-step test, step 3" | Yes (claimed) | Not run |
| 4 | Return without reason blocked; with reason → AI_ACTIVE (AC4) | Pass: AC4 | No | Not run |
| 5 | STOP → OPTED_OUT, all sending off (AC7); 375 px layout | Pass: AC7 | 375 px layout yes; opt-out no | Not run |
| 6 | 4,097 chars blocked, 4,096 sends (AC5) | Pass: AC5 | Counter only | Not run |
| 7 | Second consultant → "Already claimed by Priya" (AC2) | Pass: AC2 | No | Not run |
| 8 | Take over before the 2 s AI reply → "AI reply cancelled" (AC9) | Pass: AC9 | No | Not run |
| 9 | Double-click Take over → 1 assignment, 1 log entry (AC10) | Pass: AC10 | No | Not run |
