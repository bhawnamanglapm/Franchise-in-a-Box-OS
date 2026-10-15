# R2B definition of done: check

Ticks every item in [`definition-of-done.md`](../../docs/requirements/R2B-whatsapp-agent-panel/definition-of-done.md). An item is ticked only with evidence. **Last checked: 16 Oct 2026, after the Playwright 9-step run and the write-up.**

**Result: all 17 applicable checklist items ticked.** Still to do outside the checklist: your review of the write-up and a final look at the live URL. Two items are not applicable (no stretch LLM; nothing submitted yet). One item is ticked on the "labelled illustrative" branch and changes to "matches R5" after T2B.18.

"Playwright" below means [`nine-step.spec.ts`](../../prototypes/r2b-whatsapp-agent-panel/tests/e2e/nine-step.spec.ts), 4 of 4 runs passing on 16 Oct 2026 (1440 px and 375 px, local build and live URL, each in a fresh browser profile).

## Product

| | Item | Status | Evidence |
|---|---|---|---|
| [x] | Public URL loads in incognito with no login | Done | https://fiab-r2b-whatsapp-agent-panel.vercel.app; Playwright's fresh profile is the same as incognito (no cookies, no storage) |
| [x] | Design tokens match the brief exactly; Inter + mono for data | Done | All 5 tokens found in the built CSS (hex or `rgb()` form). Playwright step 1 checks the body is `rgb(10, 10, 15)` |
| [x] | The autonomy badge is computed from data, not hardcoded | Done | `autonomy.ts` + test "Autonomy Rate (1b §5)". In the Playwright screenshots it moves from 67% to 61% after a claim |
| [x] | Simulating a message runs the R3 rules and changes the state visibly, with "Why flagged" reasons | Done | Playwright step 2: A1 + A2 shown with their values. R3 was written from the same trigger table (D-12) |
| [x] | Take over, Claim, Return (reason required) and Opt-out work as specified in 1c | Done | Playwright steps 3–9; unit tests AC1–AC11 |
| [x] | The AI does not reply while HUMAN_ACTIVE (test step 3) | Done | Playwright step 3: 0 new AI messages 2.6 s after a prospect message |
| [x] | Mock data includes Hinglish and ₹ values, and no real company names except FreshBrew | Done | Hinglish chats, ₹ lakh amounts. Brands: FreshBrew (brief) + IronPulse Fitness (fictional, A26). Names fictional, phones masked. *Not checked against company registers.* No Devanagari in the seed (on the "1 more day" list) |
| [x] | Usable at 375 px width | Done | Playwright runs the whole script at 375 px and asserts the page is no wider than 375 px |
| [x] | All 9 test-script steps pass | Done | Playwright, 4 of 4 runs |
| [x] | Numbers the agent quotes match the R5 figures, or are labelled illustrative in the UI (A32) | Done (illustrative) | Labelled "illustrative" in the UI and footer. Becomes "matches R5" after T2B.18 |

## Write-up

| | Item | Status | Evidence |
|---|---|---|---|
| [x] | Exact prompts listed in order (copied from the log, unedited) | Done | 14 prompts in [README.md](README.md), copied from [build-log.md](build-log.md) |
| [x] | ≥ 3 specific "what AI got wrong" entries | Done | 7 in detail plus 8 summarised; all 15 in the build log with component, symptom and cause |
| [x] | ≥ 3 manual fixes, each linked to a wrong entry | Done | 4 rows, each with its log number. The write-up says plainly that Claude Code wrote every code fix |
| [x] | "1 more day" list maps to named 1c acceptance criteria | Done | 6 items mapped to AC1, AC3, AC6, AC7, AC8, AC9, AC11 (~8 h); the backend for AC2/AC10 noted as beyond a day |
| [x] | Mocked vs real is stated openly (A11, A17) | Done | Its own section in the write-up; footer on screen says "Mock data … Nothing is sent to WhatsApp" |
| — | If the stretch LLM was built: model stated and matches R3 | Not applicable | Not built |
| [ ] | *(Not in the checklist, but needed)* Your review of the write-up | Pending | Drafted by Claude Code |

## Hygiene

| | Item | Status | Evidence |
|---|---|---|---|
| [x] | Code synced to GitHub | Done | Pushed to `main` with this commit |
| [x] | No API keys in client code | Done | Key-pattern scan of `src/`, `tests/`, `index.html`, both configs and `dist/` found nothing (16 Oct) |
| — | No redeploy after submission | Not applicable yet | Checked at submission. One planned redeploy before submission: the R5 facts (T2B.18) |
