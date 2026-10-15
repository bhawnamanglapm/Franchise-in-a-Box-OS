# R2C: ROI Dashboard (Task 2, Option C): evaluation

> **Not being built (D-10, revised 15 Oct 2026).** Task 2 says "Choose ONE", and we chose Option B ([R2B](../R2B-whatsapp-agent-panel/evaluation.md)). This folder is kept as the plan written before that decision. Nothing here is a deliverable, and none of its checklists count towards done.

## What the brief asks
Task 2, **Option C: ROI Dashboard**. We build all three options as separate working prototypes (D-10); this folder covers Option C. The brief describes the module it prototypes (ROI Engine) as:
- a **Franchise Model Card**
- **3-year projections**
- **benchmark comparisons** (India + US)
- **AI insights**

The submission must include: live URL · exact prompts used · what AI got wrong · what you fixed manually · what you'd improve with 1 more day.

## What reviewers will actually judge
| Bar | How we meet it |
|---|---|
| The URL works | Tested in incognito on desktop + mobile before submitting (R8) |
| Matches the design system | Same tokens and shell prompt as R2A and R2B: `#0A0A0F`, `#111118`, `#2563EB`, `#10B981`, `#F59E0B`; Inter + mono for numbers |
| The numbers are right | The dashboard uses the **same inputs and formulas as the R5 Sheet**. For the same inputs, the outputs match the Sheet (spot-check 3: payback month, Y1 EBITDA, Y3 cumulative cash) (A32). |
| It's a working tool, not a static chart | Assumptions are editable; the ₹6L/8L/10L toggle and every input recalculate the card, the chart and the sensitivity table live |
| Benchmarks are honest | Every benchmark value has a source and date. Anything not sourced is labelled "illustrative" or left out (A33). **No invented numbers.** |
| "AI insights" are explainable | Rule-based insights tagged Opportunity / Risk / Benchmark; each shows the rule that fired and the values behind it. Optional LLM rewording only; the LLM never generates numbers. |
| Product judgment beyond the brief | "Approve Model Card" locks the numbers and exports approved facts. The WhatsApp agent (R2B) quotes only these facts, which removes a hallucination risk. |

## Decision
Built in **Lovable** with GitHub sync; targeted fixes in Claude Code. Separate project and URL from R2A and R2B (D-10).
- **Logic:** fully client-side. One `computeModel(inputs)` pure function ports the R5 formulas. Defaults are R5's base-case inputs (A11, A32).
- **Built second of the three, right after R5:** the formulas are fresh, and the approved facts feed R2B. R1 ranks ROI Engine #2 for the 30-day release.

## Ambiguities and how we resolve them
| Ambiguity | Resolution | Assumption |
|---|---|---|
| Which brand the card shows | FreshBrew QSR (Task 5 scenario) by default + one fictional gym preset; no real company names | A26 |
| What ₹6L/8L/10L means | Same as R5: monthly gross sales per outlet at steady state; base ₹8L | A3 |
| Where the numbers come from | R5 Assumptions tab is the single source of truth; the dashboard copies its base-case inputs and formulas | A32 |
| "Benchmark comparisons (India + US)" with no data given | Show only sourced values with source + date; otherwise label "illustrative", or show "Source needed" | A33 |
| "AI insights": real AI? | Rule-based v0 insights with the rule shown; an optional LLM call only rewrites the sentence, it never computes numbers | A11, R3 |
| Scale100x's own revenue | Franchisee economics only on this card; the Scale100x 3-year revenue lives in R5 and is linked, not rebuilt | A1 |

## Risks
| Risk | Likelihood | Mitigation |
|---|---|---|
| Dashboard numbers drift from the R5 Sheet | Medium | Port formulas from R5's final version; spot-check 3 values; re-check after any R5 edit |
| Benchmarks look invented | High | Source + date column; "illustrative" label; no unsourced values in the default view |
| Payback calculated differently from R5 (e.g. ignoring ramp-up or the franchise fee) | Medium | Same definition as R5: first month cumulative cash ≥ 0, including capex + franchise fee + working capital |
| Building features R4 cuts (US benchmarks, AI insights) | Medium | The brief defines Option C's contents; the R4 consistency note explains that production priority differs (R4, R8) |
| Lovable generates a generic charts template | High | Reuse the shared Prompt 1; specify the chart types, axes and number formats in the prompt |
| Link breaks after submission | Low | Don't redeploy after submitting; keep PDF screenshots as backup |

## Effort and priority
- **Estimate:** 2.25 h (1.75 h build, 0.5 h deploy, test and write-up) · **Priority:** P0 (a required deliverable under D-10; Task 2 est. 20% weight shared across A/B/C)
- **Depends on:** R5 (final inputs + formulas), A33 benchmark sourcing · **Feeds:** R2B (approved facts), R7 (proof), R8
- **Status:** Not started. Blocked on R5 base case.
