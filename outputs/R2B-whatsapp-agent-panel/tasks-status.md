# R2B tasks status

Checks every task in [`tasks.md`](../../docs/requirements/R2B-whatsapp-agent-panel/tasks.md), plus the 9-step test script. **Last checked: 16 Oct 2026, after the Playwright 9-step run and the write-up.**

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
| T2B.07 | Trigger engine + "Why flagged" card | Claude | Done | Engine with 23 tests; R3 was written from this trigger table, so they match (D-12); card shows rule, label and actual value ([desktop-flagged.png](screenshots/desktop-flagged.png)) |
| T2B.08 | State machine + buttons + composer rules | Claude | Done | Tests AC1–AC11; Claim / Return / Won / Lost buttons and the locked composer on screen ([desktop-claimed.png](screenshots/desktop-claimed.png)) |
| T2B.09 | Simulate box + computed badge + SLA countdown | Claude | Done | Side column on desktop, bottom sheet at 375 px ([m375-simulate.png](screenshots/m375-simulate.png)); badge recomputes; "6:00 to claim" chips |
| T2B.10 | Takeover panel, 24 h window, opt-out, empty/error states | Claude | Done, one gap | All built. **Gap:** the suggested reply now has 6 unit tests (fix #14), but the summary's budget, timeline and score fields have no direct test. Opt-out, template picker and error states are not yet in a screenshot |
| — | *New:* Agent Switchboard + live tracking (F2B.24, F2B.25) | Claude | Done | Added after the brief check (prompt 6, da0463c) |
| T2B.11 | Log unbuilt items into "1 more day" | Claude | Done | 6 items in [build-log.md](build-log.md), each mapped to a 1c acceptance criterion, ~8 h |
| T2B.12 | Stretch: live LLM reply | — | Skipped for now | Needs R3's model (D-08) |
| T2B.13 | Deploy to Vercel; confirm public URL | Claude (you approved the CLI login) | Done | https://fiab-r2b-whatsapp-agent-panel.vercel.app, a new project; opens with no login |
| T2B.14 | 9-step test in a fresh browser, desktop + 375 px | Claude (Playwright) + you (final look) | Done (your final look pending) | [`nine-step.spec.ts`](../../prototypes/r2b-whatsapp-agent-panel/tests/e2e/nine-step.spec.ts): 4 of 4 runs pass (1440 px + 375 px, local + live), 16 Oct. See below |
| T2B.15 | Fix any blocker; redeploy once | Claude | Done, nothing to fix | The run found no blocker, so no redeploy |
| T2B.16 | Write-up from the log | Claude drafts, you review | Drafted, your review pending | [README.md](README.md) |
| T2B.17 | 3 screenshots | Claude (Playwright) | Done | Flagged (desktop), claimed (desktop), opted out (375 px), taken by the Playwright run; in the write-up |
| T2B.18 | After R5: replace illustrative facts with R5's approved figures; redeploy | You | Blocked | Waits on R5 |

## 9-step test script

Playwright column: [`nine-step.spec.ts`](../../prototypes/r2b-whatsapp-agent-panel/tests/e2e/nine-step.spec.ts), run 16 Oct 2026 in a fresh browser profile at 1440 px and 375 px, against the local build and the live URL.

| Step | What it checks | Unit test (logic) | Playwright (real UI) |
|---|---|---|---|
| 1 | URL loads, dark theme, computed badge | Badge: "Autonomy Rate (1b §5)" | Pass ×4 |
| 2 | Hinglish high-intent message → FLAGGED with reasons, 1 holding message (AC1) | Pass: AC1 | Pass ×4 |
| 3 | Claim → HUMAN_ACTIVE; AI doesn't reply | Pass: "9-step test, step 3" | Pass ×4 |
| 4 | Return without reason blocked; with reason → AI_ACTIVE (AC4) | Pass: AC4 | Pass ×4 |
| 5 | STOP → OPTED_OUT, all sending off (AC7); 375 px layout | Pass: AC7 | Pass ×4 (scroll width ≤ 375 asserted at phone width) |
| 6 | 4,097 chars blocked, 4,096 sends (AC5) | Pass: AC5 | Pass ×4 |
| 7 | Second consultant → "Already claimed by Priya" (AC2) | Pass: AC2 | Pass ×4 |
| 8 | Take over before the 2 s AI reply → "AI reply cancelled" (AC9) | Pass: AC9 | Pass ×4 |
| 9 | Double-click Take over → 1 assignment, 1 log entry (AC10) | Pass: AC10 | Pass ×4 |
