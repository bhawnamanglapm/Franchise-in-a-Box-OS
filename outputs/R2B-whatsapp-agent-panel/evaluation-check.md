# R2B evaluation: check

Checks [`evaluation.md`](../../docs/requirements/R2B-whatsapp-agent-panel/evaluation.md): what the brief asks, what reviewers judge, the decision, ambiguities and risks. **Last checked: 16 Oct 2026, after the Playwright 9-step run and the write-up.**

## 1. What the brief asks (5 submission items)

| # | Item | Status | Where |
|---|---|---|---|
| 1 | Live URL | Done | https://fiab-r2b-whatsapp-agent-panel.vercel.app is public (no login); the 9-step Playwright run passes on it at 1440 px and 375 px |
| 2 | Exact prompts used | Done | [README.md](README.md): 14 prompts, verbatim from [build-log.md](build-log.md) |
| 3 | What AI got wrong | Done | README.md: 7 in detail, 8 summarised; all 15 in the build log |
| 4 | What you fixed manually | Done | README.md: says Claude Code wrote every code fix, and lists what you caught and decided |
| 5 | What you'd improve with 1 more day | Done | README.md: 6 items mapped to 1c acceptance criteria, ~8 h |

## 2. What reviewers judge

| Bar | Status | Evidence / what's missing |
|---|---|---|
| The URL works | Done | 9-step Playwright run in a fresh browser on the live URL, desktop + 375 px |
| Matches the design system | Done | All 5 tokens in the built CSS; dark theme seen in the screenshots |
| A real working flow, not a static mock | Done | All 9 steps pass through the real UI (Playwright, 4 of 4 runs); 52 unit tests |
| Specific, technical "what AI got wrong" | Done | 15 real entries with component, symptom and cause. None invented |
| Product judgment beyond the brief | Built | Hinglish data, 24 h window, claim conflict, opt-out, computed badge, agent Error detection, repeat-click de-dup. Several not yet screenshotted |
| Covers Module 4 as the brief describes it | Built | Agent Switchboard (WhatsApp live; Meta Ads, Voice, Email greyed) and live counts of leads, messages and conversations (F2B.24, F2B.25) |

## 3. Decisions (changed)

| | Original | Now |
|---|---|---|
| Which Task 2 options | All three (A, B, C) | **Option B only.** The brief says "Choose ONE"; you chose B on 15 Oct 2026 (D-10 revised). R2A and R2C folders kept as unbuilt plans |
| Build tool | Lovable with GitHub sync; fixes in Claude Code | **Claude Code builds it** (Vite + React + TypeScript + Tailwind) in `prototypes/r2b-whatsapp-agent-panel/` (D-01 revised) |
| Why Claude Code | — | Lovable couldn't be driven from this session. Code lets the state machine and rules be unit-tested and the 9-step script automated with Playwright |
| Backend | Brief names React + Tailwind + Supabase | No Supabase: mock data and client-side state, stated openly (A11, A17) |
| Hosting | `*.lovable.app` or Vercel | Vercel (meets A15) |
| Logic | Scripted replies + deterministic rules; stretch LLM | Unchanged. The stretch LLM (F2B.19) is out of scope for now |
| Agent's facts | Copied from R2C's Model Card; footer links to A and C | From the R5 financial model base case (A32), tagged "from R5 model"; facts R5 does not cover stay tagged "illustrative". No footer links (F2B.21 dropped) |

## 4. Ambiguities

| Ambiguity | Resolution | Status |
|---|---|---|
| "Working": real backend? | Mock data + client-side state, stated openly (A11, A17) | Followed; footer says so; the write-up has a "Mocked vs real" section |
| Hosting | Vercel | Decided |
| Brands in mock data | FreshBrew + fictional IronPulse Fitness (A26) | Done |
| *New:* R3 triggers aren't final | Engine uses the R3 drafts F3.A1–A9; re-synced when R3 is written (D-12) | Closed: R3 was written from the engine's trigger table, so they match |
| *New:* What can a consultant do on an ESCALATED chat? | Only the brand manager can claim or assign; a consultant sees why | Decided while building; covered by a test |
| *New:* One option or all three? | Option B only (D-10 revised) | Decided by you, 15 Oct |

## 5. Risks

| Risk | Status now |
|---|---|
| Looks like a static chat mock | Closed: the Playwright run drives real state changes through the UI |
| Generic light-theme UI | Closed: tokens checked in the built CSS |
| Scope creep past 2 h | **Realised.** Engine + UI took well over the 2 h estimate (D-07 says estimates are not cut-offs) |
| Stretch LLM uses a different provider than R3 | Not applicable: the stretch isn't being built |
| Agent quotes numbers that differ from the R5 model | Closed (T2B.18). FreshBrew facts match the R5 base case; one file, each fact tagged with its source |
| Link breaks after submission | Not applicable yet |

## 6. Effort and status

- **Estimate in evaluation.md:** 2.75 h. **Actual so far:** not timed precisely; the build started at 15:47 IST and the last logged prompt was at 16:52 IST on 15 Oct 2026. Claude Code work between prompts was not timed.
- **Status:** Done, including T2B.18 (R5 figures swapped in, redeployed and retested 17 Oct 2026). Your review of the write-up remains.
