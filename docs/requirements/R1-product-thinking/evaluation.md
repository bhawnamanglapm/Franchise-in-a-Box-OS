# R1: Product Thinking (Task 1): evaluation

## What the brief asks (verbatim scope)
- **1a Prioritisation:** "Which modules would you ship first (within 30 days) and why?"
- **1b AI vs Human Split:** "Map all actions → AI vs Human. Is 76% AI realistic? How would you improve this metric for investor credibility?"
- **1c Spec Clarity:** "Pick one unclear feature and rewrite it as a developer-ready specification, including: UI behavior, State transitions, Error handling, Success criteria."

## What reviewers will actually judge
| Panel member | Bar |
|---|---|
| Founder | Is the ranking tied to revenue (brands signed, outlets opened), not to ease of building? |
| Senior PM | Does 1b question *how* 76% is measured and who audits it? Could an engineer build 1c without asking a single question? |
| Operator | Do the volumes and hours behind the split hold up? Does the split translate into consultant capacity? |

## Ambiguities and how we resolve them
| Ambiguity | Resolution | Assumption |
|---|---|---|
| Team size for "30 days" | 2 engineers + 1 designer + PM, using AI tools | A7 |
| What 76% is measured by | Computed three ways: count 68% strict / 81% generous, time 87%, value 68%; day-30 slice 76.5% | A5, A19, A20, A34 |
| Who the users are | Consultants, brand founders, prospects | A6 |
| Which feature is "unclear" | Conversation Takeover. The brief says only "Includes HITL takeover". | A18 |

## Position taken (draft complete, see Phase 2 in chat)
- **1a:** (1) Sales Agent, thin, and (2) CRM, thin, ship as one lead-to-close slice → (3) thin ROI Engine (approved numbers for the agent) → (4) thin Onboarding → (5) Collateral Studio deferred. Existing brands let revenue work start on day 1.
- **1b:** 76% is plausible for workload (68–87%) but not for value (68%), and a 20% human edit rate moves it 14 points. Redefine as an audited **Autonomy Rate**; show it with cost per signed franchisee and human hours per signed franchisee.
- **1c:** Takeover spec with 7 states, 9 transitions, SLA, 24 h window, opt-out, and measurable acceptance criteria.

## Risks
| Risk | Likelihood | Mitigation |
|---|---|---|
| Putting Onboarding at #4 reads as dismissing the founder's flow | Medium | Show the dependency trap: the onboarding-first path delays the first lead to about day 60 |
| Split inputs look invented | High | Label A19/A20 as estimates to calibrate. Publish the calculation tab. |
| Badge reframe reads as contrarian | Medium | Offer the safe variant: keep the format, change only the definition (D-05) |

## Effort and priority
- **Estimate:** 1.5 h (mostly done in Phase 2; remaining work is finalising and formatting)
- **Priority:** P0. Every downstream requirement depends on it.
- **Dependencies:** Phase 0 lens. **Feeds:** R4, R3, R2B (1c spec), R2A (1b onboarding actions).
- **Status:** Output written to `outputs/R1-product-thinking/`. D-04, D-05, D-06 confirmed; A23 verified. Remaining: import the CSV into the Sheet tab (T1.04–T1.05).
