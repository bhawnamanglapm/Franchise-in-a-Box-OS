# R2A: Onboarding Wizard (Task 2, Option A): evaluation

> **Not being built (D-10, revised 15 Oct 2026).** Task 2 says "Choose ONE", and we chose Option B ([R2B](../R2B-whatsapp-agent-panel/evaluation.md)). This folder is kept as the plan written before that decision. Nothing here is a deliverable, and none of its checklists count towards done.

## What the brief asks
Task 2, **Option A: Onboarding Wizard**. We build all three options as separate working prototypes (D-10); this folder covers Option A. The brief describes the module it prototypes (Brand Onboarding Portal) as:
- a **4-step guided flow** with
- **brand details**
- **file uploads** (pitch decks, P&L)
- a **revenue split visualisation** (donut chart)
- an **AI Readiness Score** with Red / Amber / Green sub-scores

The submission must include: live URL · exact prompts used · what AI got wrong · what you fixed manually · what you'd improve with 1 more day.

## What reviewers will actually judge
| Bar | How we meet it |
|---|---|
| The URL works | Tested in incognito on desktop + mobile before submitting (R8) |
| Matches the design system | Same tokens and shell prompt as R2B and R2C: `#0A0A0F`, `#111118`, `#2563EB`, `#10B981`, `#F59E0B`; Inter + mono for data |
| A real working flow, not a static form | Per-step validation that blocks Next, real file-type and size checks, a donut that recalculates and must total 100%, and a Readiness Score that is **computed from the inputs** and changes when they change |
| The Readiness Score is explainable | Every sub-score shows the rule, the input value and the threshold, plus one "how to improve" line. Labelled rule-based v0, not ML (A31). |
| Specific, technical "what AI got wrong" | A real build log filled in while building. **Never fabricated.** |
| Product judgment beyond the brief | Draft autosave and resume, a sample-data button for reviewers, "AI-extracted, please review" flags on parsed P&L values, and a brand-record export that the ROI Dashboard (R2C) can use |

## Decision
Built in **Lovable** with GitHub sync; targeted fixes in Claude Code. Separate project and URL from R2B and R2C (D-10).
- **Logic:** fully client-side. File contents stay in the browser. CSV P&L files are parsed for real. XLSX and PDF extraction is mocked with prefilled values flagged for human review (A11).
- **Built third of the three:** R1 ranks Onboarding #4 for the 30-day release, so this prototype comes after B and C. It is still built to the same quality bar.

## Ambiguities and how we resolve them
| Ambiguity | Resolution | Assumption |
|---|---|---|
| What the "revenue split" splits | Revenue by sales channel (dine-in / takeaway / delivery apps; other categories get their own channel list). It shows channel dependency, which feeds a Readiness sub-score. Working default; final call made while building (D-11). | A30 |
| How the "AI Readiness Score" is computed | Rule-based v0 rubric with 5 weighted sub-scores. Thresholds are design choices stated in the UI, to be calibrated on real outcomes later. | A31 |
| What the 4 steps are | 1 Brand details → 2 File uploads → 3 Revenue split → 4 Readiness Score, then Review & submit | Brief order |
| "Working": real backend? | No Supabase storage or auth; files and the draft stay in the browser; stated openly | A11 |
| Brands in sample data | FreshBrew (from the brief) + one fictional gym brand. No real company names. | A26 |

## Risks
| Risk | Likelihood | Mitigation |
|---|---|---|
| Looks like a plain form | Medium | The score and donut react live to inputs; validation is visible; the success screen shows the brand record |
| The score reads as a made-up number | High | Show each rule and threshold; label it v0; link it to R1 1b (AI drafts, consultant confirms) |
| Building a feature R4 cuts (the donut) | Medium | The brief defines Option A's contents; the R4 consistency note explains that production priority differs (R4, R8) |
| File upload behaves differently across browsers | Medium | Test Chrome + mobile Safari width; accept-list by extension and MIME type |
| Lovable generates generic light-theme UI | High | Reuse the shared Prompt 1; check hex values in the code |
| Link breaks after submission | Low | Don't redeploy after submitting; keep PDF screenshots as backup |

## Effort and priority
- **Estimate:** 2 h (1.5 h build, 0.5 h deploy, test and write-up) · **Priority:** P0 (a required deliverable under D-10; Task 2 est. 20% weight shared across A/B/C)
- **Depends on:** R1 1b (onboarding actions for the badge), R5 (input fields match the R2C/R5 assumptions) · **Feeds:** R2C (brand record), R7 (proof), R8
- **Status:** Not started. D-11 is decided during the build (T2A.01).
