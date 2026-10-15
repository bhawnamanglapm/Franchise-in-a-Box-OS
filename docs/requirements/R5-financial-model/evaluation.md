# R5: Financial Model, FreshBrew QSR (Task 5): evaluation

## What the brief asks
"Scenario: FreshBrew QSR. Build a model including:"
- Monthly P&L (Year 1)
- Payback period
- 3-year projections (**Scale100x revenue**)
- Sensitivity analysis (₹6L / ₹8L / ₹10L revenue)
- Assumptions tab

Output: a Google Sheets / Excel link with a clean, founder-friendly structure.

## What reviewers will actually judge (operator / finance lead)
- **Inputs are sourced and stated:** capex, franchise fee, royalty %, rent, staff, COGS, ramp-up
- **₹6L/8L/10L is interpreted correctly, and the interpretation is stated**
- **Franchisee economics are separate from Scale100x's own revenue** (fees, retainers, success fees)
- **Payback is calculated correctly** and matches the cumulative cash-flow curve
- **Founder-friendly:** one summary view, all inputs in one place, no hardcoded numbers inside formulas
- **They will spot-check at least 3 calculations**

## Ambiguities and how we resolve them
| Ambiguity | Resolution | Assumption |
|---|---|---|
| No FreshBrew inputs | Café-QSR, 400–700 sq ft, Tier 1/2; every input gets a low/base/high range and a source | A2 |
| ₹6L/8L/10L | Monthly gross sales per outlet at steady state; base ₹8L | A3 |
| Scale100x revenue model | Setup fee + monthly retainer + success fee per franchisee signed (+ optional royalty share, default 0) | A1 |
| Scope | FreshBrew engagement + portfolio scenario (N brands) | A4 |
| Outlet roll-out pace | Outlets signed per month for FreshBrew as an input (ramping); not the platform's 100+/yr claim | New: A27 |
| Tax | Pre-tax payback for the franchisee; GST excluded from revenue (stated) | New: A28 |

## Risks
| Risk | Mitigation |
|---|---|
| Invented-looking inputs | A source column with name + date; unsourced inputs flagged "estimate" in amber |
| Payback error (e.g. ignoring ramp-up or the franchise fee) | Payback = first month cumulative cash ≥ 0, including capex + franchise fee; cross-checked against a chart |
| Formula hardcodes | Integrity checklist (DoD) + a Sheets formula audit |
| Time overrun | Base case + sensitivity first; portfolio view is optional at 1.75 h |

## Effort and priority
- **Estimate:** 2 h · **Priority:** P0 (est. 20% weight) · **Depends on:** A1–A4 · **Feeds:** R2B (approved figures, A32), R8, live session
- **Status:** Not started. Input research happens in Phase 6.
