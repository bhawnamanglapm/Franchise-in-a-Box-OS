# R2B definition of done: check

Ticks every item in [`definition-of-done.md`](../../docs/requirements/R2B-whatsapp-agent-panel/definition-of-done.md). An item is ticked only with evidence. **Last checked: 15 Oct 2026, after the UI build and the B-only change.**

**Result: 6 of 19 ticked.** R2B is not done. What's left needs the Playwright 9-step run, the deploy, the push and the write-up.

## Product

| | Item | Status | Evidence / what's missing |
|---|---|---|---|
| [ ] | Public URL loads in incognito with no login | Not started | Not deployed |
| [x] | Design tokens match the brief exactly; Inter + mono for data | Done | All 5 tokens found in the built CSS (Tailwind writes some as `rgb()`, so both forms were checked). Inter for text, JetBrains Mono for numbers, seen in the screenshots |
| [x] | The autonomy badge is computed from data, not hardcoded | Done | `autonomy.ts` + test "Autonomy Rate (1b §5)". On screen it moves from 66% to 60% after a claim ([desktop-flagged.png](screenshots/desktop-flagged.png) → [desktop-claimed.png](screenshots/desktop-claimed.png)) |
| [ ] | Simulating a message runs the R3 rules and changes the state visibly, with "Why flagged" reasons | Built, seen | Seen in [desktop-flagged.png](screenshots/desktop-flagged.png). Ticked after the Playwright run. The rules are R3 **drafts** (D-12) |
| [ ] | Take over, Claim, Return (reason required) and Opt-out work as specified in 1c | Built | Tests AC1–AC11; Claim seen on screen. Return and Opt-out not yet driven through the UI |
| [ ] | The AI does not reply while HUMAN_ACTIVE (test step 3) | Logic done | Test "9-step test, step 3". Must also pass in Playwright |
| [x] | Mock data includes Hinglish and ₹ values, and no real company names except FreshBrew | Done | `data/conversations.ts`: Hinglish chats, ₹ lakh amounts. Brands: FreshBrew (brief) + IronPulse Fitness (fictional, A26). Names fictional, phones masked. *Not checked against company registers.* No Devanagari in the seed (not required by this item) |
| [x] | Usable at 375 px width | Done | 4 screenshots at 375 px (inbox, chat, claimed, simulate sheet); page scroll width = 375, no sideways scroll |
| [ ] | All 9 test-script steps pass | Not started | Steps 2–9 pass at logic level; the Playwright run on the real UI is next |
| [x] | Numbers the agent quotes match the R5 figures, or are labelled illustrative in the UI (A32) | Done (illustrative) | Labelled "illustrative" in the UI and footer. Becomes "matches R5" after T2B.18 |

## Write-up

| | Item | Status | Evidence / what's missing |
|---|---|---|---|
| [ ] | Exact prompts listed in order (copied from the log, unedited) | Partial | 7 prompts logged verbatim in [build-log.md](build-log.md); write-up not drafted |
| [ ] | ≥ 3 specific "what AI got wrong" entries | Partial | 12 entries in the log; not in the write-up yet |
| [ ] | ≥ 3 manual fixes, each linked to a wrong entry | Partial | 12 fixes in the log, with "Caught by" and "Fixed by". All code fixes were written by Claude Code; the write-up has to say so |
| [ ] | "1 more day" list maps to named 1c acceptance criteria | Not started | — |
| [ ] | Mocked vs real is stated openly (A11, A17) | Partial | Footer says "Mock data, nothing sent". Write-up section still to do (including: no Supabase) |
| [ ] | If the stretch LLM was built: model stated and matches R3 | Not applicable | The stretch LLM isn't built |

## Hygiene

| | Item | Status | Evidence / what's missing |
|---|---|---|---|
| [ ] | Code synced to GitHub | Partial | Committed locally; not pushed yet |
| [x] | No API keys in client code | Done | Key-pattern scan of `src/`, `tests/`, `index.html` and `vite.config.ts` found nothing (15 Oct). Re-check before submission |
| [ ] | No redeploy after submission | Not applicable yet | Checked at submission |
