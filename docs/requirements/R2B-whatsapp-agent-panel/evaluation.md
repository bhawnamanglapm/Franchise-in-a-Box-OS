# R2B: WhatsApp AI Agent Panel (Task 2, Option B): evaluation

## What the brief asks
Task 2 lists three options: A Onboarding Wizard · **B WhatsApp AI Agent Panel** · C ROI Dashboard. We build **all three as separate working prototypes** (D-10); this folder covers **Option B**. Each prototype's submission must include:
1. Live URL (Vercel / Netlify / etc.)
2. Exact prompts used
3. What AI got wrong
4. What you fixed manually
5. What you'd improve with 1 more day

## What reviewers will actually judge
| Bar | How we meet it |
|---|---|
| The URL works | Tested in incognito on desktop + mobile before submitting (R8) |
| Matches the design system | Tokens: `#0A0A0F` background, `#111118` cards, `#2563EB` accent, `#10B981` success, `#F59E0B` alert; Inter + a mono font for data |
| A real working flow, not a static mock | Deterministic trigger engine + a takeover state machine (from 1c) + a "simulate inbound message" box the reviewer can use |
| Specific, technical "what AI got wrong" | A real build log filled in while building (template in this folder). **Never fabricated.** |
| Product judgment beyond the brief | Realistic Hinglish mock data, the 24 h window, claim conflict, opt-out, a computed autonomy badge |

## Decision
**Option B**, built by **Claude Code** as a Vite + React + TypeScript + Tailwind app in `prototypes/r2b-whatsapp-agent-panel/`, deployed to Vercel (D-01, revised 15 Oct 2026). *Originally Lovable with GitHub sync; changed so the state machine and rules can be unit-tested and the 9-step script automated, and because Lovable couldn't be driven from the build session.*
- **Why it is built first of the three:** it sits on the revenue path (franchisee funnel), it ties together R1 1c + R3 + R4 #1–2 + R6A, and it fits the candidate's lead-to-closure and handoff experience.
- **Logic:** scripted AI replies + deterministic rules. The stretch goal is one live LLM reply using the R3 prompt, attempted only if time allows (A17).
- **Link to the rest of the submission:** the facts the agent quotes come from the R5 financial model (A32). Until R5 is built they are labelled "illustrative" in the UI. Task 2 is Option B only (D-10), so there are no other prototypes to link.

## Ambiguities and how we resolve them
| Ambiguity | Resolution | Assumption |
|---|---|---|
| "Working": real backend? | Mock data + client-side state; stated openly | A11, A17 |
| Hosting | Vercel (originally `*.lovable.app` or Vercel) | A15 |
| Brands in mock data | FreshBrew (QSR, from the brief) + one fictional gym brand. No real company names. | A26 |

## Risks
| Risk | Likelihood | Mitigation |
|---|---|---|
| Looks like a static chat mock | Medium | Visible state changes, a "Why flagged" card, and a simulate box on the first screen |
| Generic light-theme UI | Medium | Tokens are set in the Tailwind config before any screen is built; check the hex values in the built CSS |
| Scope creep past 2 h | High | Build Must features first (MoSCoW); unbuilt items move to the "1 more day" list |
| Stretch LLM goal uses a different provider than R3's choice | Medium | Call the R3 default model, or state the mismatch in the write-up |
| Agent quotes numbers that differ from the R5 model | Medium | Facts live in one file, labelled illustrative until replaced by R5's approved figures (A32, T2B.18) |
| Link breaks after submission | Low | Don't redeploy after submitting; keep the PDF screenshots as backup |

## Effort and priority
- **Estimate:** 2.75 h (2 h build, 0.75 h deploy, test and write-up) · **Priority:** P0 (Task 2 est. 20% weight, shared across A/B/C)
- **Depends on:** R1 1c (spec), R3 (triggers, prompt), R4 (scope) · **Feeds:** R7 (proof), R8
- **Status:** In progress. Live status: [`outputs/R2B-whatsapp-agent-panel/`](../../../outputs/R2B-whatsapp-agent-panel/). Built before R3 is final, using the draft R3 triggers (D-12).
