# R2B features status

Checks every feature in [`features.md`](../../docs/requirements/R2B-whatsapp-agent-panel/features.md) against what is built. Updated as the build goes. **Last checked: 15 Oct 2026, after the UI build and the B-only change (46 unit tests passing; commits 8b30977, 5c2b7a4, da0463c). Updated after the suggested-reply fix: 52 tests. Updated 16 Oct 2026 after the Playwright 9-step run (4 of 4 pass) and the write-up.**

**Status key:** **Built** = on screen; the logic is unit-tested where noted · **Seen** = also visible in the [screenshots](screenshots/) · **Partial** = some of it built · **Not started** · **Blocked** = waits on another requirement · **Dropped** / **Won't** = out of scope by decision. **Tested** = driven through the real UI by the 9-step Playwright run (desktop + 375 px, local + live).

**Summary:** 19 features are built, and 14 of them are visible in the screenshots. 2 are partial (mock data has no Devanagari chat; the metrics strip lacks SLA % and takeovers today), 1 waits on R5 (approved facts), and the cross-prototype footer is dropped (D-10). The 9-step Playwright run passes 4 of 4 runs; the features it drives are marked **Tested**. All six write-up items are done.

## Screens and features

| ID | Feature | MoSCoW | Status | Evidence / what's missing |
|---|---|---|---|---|
| F2B.01 | App shell + design tokens | M | Built, Seen | Nav with the 5 modules (only Sales Agent active), header, footer. All 5 hex tokens found in the built CSS (hex or `rgb()` form); Inter + JetBrains Mono for numbers |
| F2B.02 | Computed autonomy badge | M | Built, Seen | "AI: 66% of work \| Humans: 100% of closes", computed from the event log; falls to 60% after a claim (desktop screenshots). Tooltip shows the model / rules / human split. Test "Autonomy Rate (1b §5)" |
| F2B.03 | Inbox list | M | Built, Seen | 10 chats, state chips, brand tags, previews, filters All / Needs human / Mine with counts |
| F2B.04 | SLA countdown | M | Built, Seen | "6:00 to claim" chips; FLAGGED sorted by time left; red under 2 min and "SLA missed" (styling in code, not yet in a screenshot). Test AC3 |
| F2B.05 | Conversation thread | M | Built, Seen | Bubbles for prospect / AI / human, system pills ("Claimed by Neha"), Today / Yesterday separators, "Not delivered" + Retry |
| F2B.06 | Realistic mock data | M | Partial | EN + Hinglish, ₹ lakh, Tier 1/2 cities, 2 brands, masked phones. **Gap:** no Devanagari Hindi in the seed chats. A Devanagari message is one click away in Simulate ("Hindi" example) but not yet screenshotted |
| F2B.07 | Trigger engine | M | Built, Tested | Rules F3.A1–A8 on every inbound message, 23 tests. R3 was written from this trigger table, so they match (D-12) |
| F2B.08 | "Why flagged" card | M | Built, Seen | Rule code, label and the actual value ("Stated investment ₹45L, brand threshold ₹40L"); Resolve button for compliance flags |
| F2B.09 | Takeover state machine | M | Built, Tested | 7 states, T1–T9, guards, `state_version` 409, requestId de-dup, queued-reply cancel. Tests AC1–AC11 |
| F2B.10 | Take over / Claim / Return buttons | M | Built, Seen, Tested | Claim, Return to AI, Won, Lost seen. Return dialog lists what blocks it (no reason, open compliance flag, unsent draft); not yet screenshotted |
| F2B.11 | Composer rules | M | Built, Seen, Tested | Locked unless you own the chat; "AI paused" banner; "204 / 4,096" counter; Send disabled over the limit (AC5) |
| F2B.12 | Simulate inbound message box | M | Built, Seen | Side column on desktop, bottom sheet on phones; 8 example messages; outage / fail-next / second-consultant toggles; Reset |
| F2B.13 | Takeover panel | S | Built, Seen | Lead summary (budget, city, timeline, objections, last question), score bar, suggested reply + "Use reply". Suggested reply fixed after live testing (build log #14): signed by the real sender, written for the rule that fired, gender-neutral Hindi; 6 unit tests. **Budget, timeline and score fields still have no direct test** |
| F2B.14 | 24 h window indicator | S | Built, Seen | "Reply window 23h 55m left" in the chat header (seen). Template picker after 24 h is built (test AC6) but not yet screenshotted |
| F2B.15 | Opt-out | S | Built, Seen, Tested | STOP / band karo / बंद करो → OPTED_OUT, composer locked in red; START opts back in (test AC7). Screenshot at 375 px: [e2e-phone-375-opted-out.png](screenshots/e2e-phone-375-opted-out.png) |
| F2B.16 | Claim conflict demo | S | Built, Tested | "Second consultant" toggle in Simulate → Priya claims first → toast "Already claimed by Priya" (test AC2; Playwright step 7). Not screenshotted |
| F2B.17 | Empty / loading / error states | S | Built | Skeleton rows, empty-filter copy, failed send + Retry, error boundary with Reset, error toasts. Not yet screenshotted |
| F2B.23 | Agent status strip | S | Built, Seen | Per-brand Active / Paused / Error with last send; only the manager (Ravi) can pause |
| F2B.24 | Agent Switchboard | M | Built, Seen | Header row: WhatsApp AI live; Meta Ads, Voice AI, Email greyed "not part of this prototype" (da0463c) |
| F2B.25 | Live tracking | M | Built, Seen | Leads 10 · Messages today 22 · Active chats 8 · Needs human 3, recomputed every tick (da0463c) |
| F2B.18 | Metrics strip | C | Partial | Covered in part by F2B.25 (active chats, needs human) and the badge (autonomy %). "In SLA %" and "takeovers today" not shown |
| F2B.19 | Stretch: live LLM reply | C | Not started | Needs R3's model choice (D-08). On the "1 more day" list |
| F2B.20 | Real WhatsApp / Supabase backend | W | Won't | By design (A11, A17). The footer says data is mocked and nothing is sent |
| F2B.21 | Cross-prototype footer | — | Dropped | Task 2 is Option B only (D-10). The footer now states the scope instead |
| F2B.22 | Approved facts from R5 | S | Blocked | Waits on R5. `data/approvedFacts.ts` holds **illustrative placeholders**, labelled in the UI ("illustrative" tag on fact-based replies, footer note) (A32, T2B.18) |

## Write-up components

| ID | Component | MoSCoW | Status | Evidence / what's missing |
|---|---|---|---|---|
| F2B.W1 | Live URL | M | Done | https://fiab-r2b-whatsapp-agent-panel.vercel.app, a new Vercel project (existing projects untouched); no login; the 9-step Playwright run passes on it at 1440 px and 375 px |
| F2B.W2 | Exact prompts used, in order | M | Done | 14 prompts in the [write-up](README.md), copied from [build-log.md](build-log.md) |
| F2B.W3 | What AI got wrong | M | Done | 15 entries in the build log; 7 in detail in the write-up, the rest summarised |
| F2B.W4 | What I fixed manually | M | Done | Write-up says plainly that Claude Code wrote every code fix; lists what you caught and decided, linked to log entries |
| F2B.W5 | 1 more day improvements | M | Done | 6 items mapped to 1c AC1, AC3, AC6, AC7, AC8, AC9, AC11, ~8 h |
| F2B.W6 | 3 screenshots + optional Loom | C | Done (no Loom) | 3 Playwright screenshots in the write-up; no Loom recorded |
