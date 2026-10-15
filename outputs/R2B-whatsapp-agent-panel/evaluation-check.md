# R2B evaluation: check

Checks [`evaluation.md`](../../docs/requirements/R2B-whatsapp-agent-panel/evaluation.md): what the brief asks, what reviewers judge, the decision, ambiguities and risks. **Last checked: 15 Oct 2026, after the engine step.**

## 1. What the brief asks (5 submission items)

| # | Item | Status | Where |
|---|---|---|---|
| 1 | Live URL | Not started | Deploy after the UI and the 9-step test |
| 2 | Exact prompts used | In progress | [build-log.md](build-log.md), logged verbatim as they happen |
| 3 | What AI got wrong | In progress | build-log.md: 4 entries so far |
| 4 | What you fixed manually | In progress | build-log.md: 4 fixes so far |
| 5 | What you'd improve with 1 more day | Not started | build-log.md "1 more day" table, then the write-up |

## 2. What reviewers judge

| Bar | Status | Evidence / what's missing |
|---|---|---|
| The URL works | Not started | Incognito test on desktop + mobile after deploy (R8) |
| Matches the design system | Partial | Tokens defined; not yet seen on screen or checked in built CSS |
| A real working flow, not a static mock | Logic done | Deterministic trigger engine + 1c state machine, 46 unit tests. The simulate box that lets a reviewer drive it is the next step |
| Specific, technical "what AI got wrong" | On track | 4 real entries, each with component, symptom and cause. None invented |
| Product judgment beyond the brief | Logic done | Hinglish data, 24 h window, claim conflict, opt-out, computed badge, plus agent Error detection and repeat-click de-dup. All tested; none visible yet |

## 3. Decision (changed)

| | Original | Now |
|---|---|---|
| Build tool | Lovable with GitHub sync; fixes in Claude Code | **Claude Code builds it** (Vite + React + TypeScript + Tailwind) in `prototypes/r2b-whatsapp-agent-panel/`, in this repo. Chosen by the person building on 15 Oct 2026 (D-01 revised) |
| Why | — | Lovable couldn't be driven from this session. Code lets the state machine and rules be unit-tested and the 9-step script automated with Playwright |
| Hosting | `*.lovable.app` or Vercel | Vercel (still meets A15) |
| Logic | Scripted replies + deterministic rules; stretch LLM | Unchanged. The stretch LLM (F2B.19) is out of scope for now |
| Link to other prototypes | Facts from R2C; footer to A and C | Unchanged, but blocked until R2C and R2A ship. Facts are labelled placeholders until then |

## 4. Ambiguities

| Ambiguity | Resolution | Status |
|---|---|---|
| "Working": real backend? | Mock data + client-side state, stated openly (A11, A17) | Followed; to be stated in the write-up |
| Hosting | Vercel | Decided |
| Brands in mock data | FreshBrew + fictional IronPulse Fitness (A26) | Done |
| *New:* R3 triggers aren't final | Engine uses the R3 drafts F3.A1–A9; re-synced when R3 is written (D-12) | Open until R3 |
| *New:* What can a consultant do on an ESCALATED chat? | Only the brand manager can claim or assign; a consultant sees why | Decided while building; covered by a test |

## 5. Risks

| Risk | Status now |
|---|---|
| Looks like a static chat mock | Lowered: the engine is real and tested. Still open until the simulate box and visible state changes exist |
| Generic light-theme UI | Changed: no Lovable output. Tokens are set before any screen is built; the hex check still has to be done on the built CSS |
| Scope creep past 2 h | **Realised.** The engine took longer than the 2 h build estimate allows (D-07 says estimates are not cut-offs) |
| Stretch LLM uses a different provider than R3 | Not applicable yet: the stretch isn't being built |
| Agent quotes numbers that differ from C | Open: R2C isn't built. Placeholders are labelled "illustrative" |
| Link breaks after submission | Not applicable yet |

## 6. Effort and status

- **Estimate in evaluation.md:** 2.75 h. **Actual so far:** not timed precisely; the build started at 15:47 IST on 15 Oct 2026.
- **Status:** In progress. Engine done; UI next.
