# R2B definition of done: check

Ticks every item in [`definition-of-done.md`](../../docs/requirements/R2B-whatsapp-agent-panel/definition-of-done.md). An item is ticked only with evidence. **Last checked: 15 Oct 2026, after the engine step.**

**Result: 2 of 20 ticked.** R2B is not done. Most items need the UI, the 9-step test or the deploy, which haven't happened yet.

## Product

| | Item | Status | Evidence / what's missing |
|---|---|---|---|
| [ ] | Public URL loads in incognito with no login | Not started | Not deployed |
| [ ] | Design tokens match the brief exactly; Inter + mono for data | Partial | Defined in `tailwind.config.js` (faa361a). Not yet checked in the built CSS or seen on screen |
| [ ] | The autonomy badge is computed from data, not hardcoded | Logic done | `autonomy.ts` + test "Autonomy Rate (1b §5)". The badge isn't on screen yet |
| [ ] | Simulating a message runs the R3 rules and changes the state visibly, with "Why flagged" reasons | Logic done | Rules and reasons proven (AC1). "Visibly" needs the UI. The rules are R3 **drafts** (D-12) |
| [ ] | Take over, Claim, Return (reason required) and Opt-out work as specified in 1c | Logic done | Tests AC1–AC11. Buttons not built |
| [ ] | The AI does not reply while HUMAN_ACTIVE (test step 3) | Logic done | Test "9-step test, step 3". Must also pass in the Playwright run |
| [x] | Mock data includes Hinglish and ₹ values, and no real company names except FreshBrew | Done | `data/conversations.ts`: Hinglish chats (c1, c4, c5, c7), ₹ lakh amounts. Brands: FreshBrew (brief) + IronPulse Fitness (fictional, A26). Prospect names are fictional and phones are masked. *Not checked against company registers.* |
| [ ] | Usable at 375 px width | Not started | — |
| [ ] | All 9 test-script steps pass | Not started | Steps 2–9 pass at logic level (unit tests); the Playwright run on the real UI is still to do |
| [ ] | Numbers the agent quotes match the R2C approved Model Card (A32) | Blocked | R2C not built. Placeholders are labelled "illustrative" |
| [ ] | Footer links to the Option A and Option C URLs work | Blocked | R2A and R2C not built |

## Write-up

| | Item | Status | Evidence / what's missing |
|---|---|---|---|
| [ ] | Exact prompts listed in order (copied from the log, unedited) | Partial | Logged verbatim in [build-log.md](build-log.md); write-up not drafted |
| [ ] | ≥ 3 specific "what AI got wrong" entries | Partial | 4 entries in the log; not in the write-up yet |
| [ ] | ≥ 3 manual fixes, each linked to a wrong entry | Partial | 4 fixes in the log, one per entry; not in the write-up yet |
| [ ] | "1 more day" list maps to named 1c acceptance criteria | Not started | — |
| [ ] | Mocked vs real is stated openly (A11, A17) | Not started | Planned for the write-up README |
| [ ] | If the stretch LLM was built: model stated and matches R3 | Not applicable yet | The stretch LLM isn't built |

## Hygiene

| | Item | Status | Evidence / what's missing |
|---|---|---|---|
| [ ] | Code synced to GitHub | Partial | Committed locally (faa361a, 6018a57); not pushed yet |
| [x] | No API keys in client code | Done | Scan of `src/`, `tests/`, `index.html` and `vite.config.ts` for key patterns found nothing (15 Oct). Re-check before submission |
| [ ] | No redeploy after submission | Not applicable yet | Checked at submission |
