# R6: Automation + Market Research (Task 6): evaluation

## What the brief asks
**Part A, Workflow Automation:** "Automate lead flow from Meta Ads → WhatsApp → CRM → Consultant." Include tools used, workflow steps, human checkpoints, a time-saved estimate and one risk.

**Part B, Market Research:** "EV two-wheeler servicing expansion (India)." Include market size + growth (with source), competitors, expansion geography, key risk and a final recommendation.

## What reviewers will actually judge
| Part | Bar |
|---|---|
| 6A | A realistic Indian SMB stack: Meta Lead Ads, WhatsApp Business API via a BSP (e.g. Interakt / WATI / Gupshup), Zapier or Make, a CRM. Human checkpoints placed where they matter. Time saved **shown with maths**. A **real** risk (template approval, DPDP consent, duplicate leads, API limits) with mitigation. |
| 6B | Named, credible, **dated** sources. Competitors specific to **EV two-wheeler servicing** (OEM service networks, multi-brand EV service chains, unorganised garages), not EV makers in general. Geography reasoned on EV penetration, density and Scale100x footprint. A clear go / no-go / go-with-conditions. |

## Ambiguities and how we resolve them
| Ambiguity | Resolution | Assumption |
|---|---|---|
| Built or designed? | **Designed, not built**: the candidate hasn't used Zapier/Make. Stated openly in 6A and in Task 7. | A14 |
| Whose expansion (6B)? | Should Scale100x take on EV 2W servicing brands as a franchise category, and where should they open first? | A9 |
| Which CRM | The platform's own HITL CRM (module 5) as the target, with Google Sheets as an interim sink if needed | New: A29 |
| Human checkpoints | Must equal the R3 triggers (single source of truth) | R3 |

## Risks
| Risk | Mitigation |
|---|---|
| Unsourced or stale market numbers (the biggest red flag) | Claude drafts with URLs + dates; **you verify every number**; anything unverified becomes "estimate" or is cut |
| Generic competitor list | Three named buckets with examples verified to actually offer EV 2W servicing |
| Time-saved figure looks made up | Maths built from A19 volumes and per-step minutes |

## Effort and priority
- **Estimate:** 1 h (6A 0.4 h, 6B 0.6 h) · **Priority:** P1 (est. 15% weight)
- **Depends on:** R3 (checkpoints), A19 (volumes) · **Feeds:** R8
- **Status:** Not started.
