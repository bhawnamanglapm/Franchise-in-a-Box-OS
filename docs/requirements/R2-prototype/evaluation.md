# R2: Working Prototype (Task 2): evaluation

## What the brief asks
Choose one: A Onboarding Wizard · **B WhatsApp AI Agent Panel** · C ROI Dashboard. The submission must include:
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
**Option B**, built in **Lovable** with GitHub sync; targeted fixes in Claude Code (D-01).
- **Why:** it sits on the revenue path (franchisee funnel), it ties together R1 1c + R3 + R4 #1–2 + R6A, it fits the candidate's lead-to-closure and handoff experience, and it stands out against likely A/C submissions.
- **Logic:** scripted AI replies + deterministic rules. The stretch goal is one live LLM reply using the R3 prompt, attempted only if done before the 2 h freeze (A17).

## Ambiguities and how we resolve them
| Ambiguity | Resolution | Assumption |
|---|---|---|
| "Working": real backend? | Mock data + client-side state; stated openly | A11, A17 |
| Hosting | `*.lovable.app` or Vercel | A15 |
| Brands in mock data | FreshBrew (QSR, from the brief) + one fictional gym brand. No real company names. | New: A26 |

## Risks
| Risk | Likelihood | Mitigation |
|---|---|---|
| Looks like a static chat mock | Medium | Visible state changes, a "Why flagged" card, and a simulate box on the first screen |
| Lovable generates generic light-theme UI | High | The first prompt sets design tokens; check the hex values in the code |
| Scope creep past 2 h | High | Freeze rule; unbuilt items move to the "1 more day" list |
| Stretch LLM goal uses a different provider than R3's choice | Medium | Call the R3 default model, or state the mismatch in the write-up |
| Link breaks after submission | Low | Don't redeploy after submitting; keep the PDF screenshots as backup |

## Effort and priority
- **Estimate:** 2.75 h (2 h build, 0.75 h deploy, test and write-up) · **Priority:** P0 (est. 20% weight)
- **Depends on:** R1 1c (spec), R3 (triggers, prompt), R4 (scope) · **Feeds:** R7 (proof), R8
- **Status:** Not started. The build brief and prompt sequence are written in Phase 5.
