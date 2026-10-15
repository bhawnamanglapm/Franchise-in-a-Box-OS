# R3: AI Agent Design (Task 3): evaluation

## What the brief asks
- **Part A, HITL Logic:** "Define at least 6 clear triggers for human takeover."
- **Part B, System Prompt:** "Write a 150–250 word production-ready prompt."
- **Part C, Model Selection:** choose between Claude, OpenAI or Deepseek, and explain "your default choice" and "one key validation test".

## What reviewers will actually judge
| Part | Bar |
|---|---|
| A | Triggers are **measurable** (threshold, signal, intent), not "when the customer is upset". They cover commercial intent, deal value, low confidence, sentiment, repeated failure, explicit human request, legal/financial/compliance, and out-of-scope. |
| B | Production-grade: role, goal, audience (Indian franchise prospects, Hinglish and regional handling), tone, forbidden claims (no guaranteed ROI, no unapproved pricing), escalation rules, output format. **Word count 150–250, shown.** |
| C | Reasoned on Indic language quality, tool calling, latency, cost per conversation and data handling. The validation test is a real eval (a fixed golden set with pass criteria), not "try it and see". |

## Ambiguities and how we resolve them
| Ambiguity | Resolution | Assumption |
|---|---|---|
| Which agent the prompt is for | The WhatsApp AI Agent (matches R2 and R4 #1) | D-01 |
| "High-value" | Stated investment ≥ the brand's full franchise investment, or deal at contract/payment stage | A10 |
| Confidence signal | Classifier/self-reported confidence plus a retrieval-hit check against approved facts | New: A25 |
| Data residency | Note DPDP Act obligations. No claim about a vendor's region unless verified. | A12 |

## Position (to finalise in Phase 4)
- **8 triggers**, each with condition, signal, and what the human sees. The same rules power the R2 trigger engine.
- **The prompt** is written for the WhatsApp agent and grounded only in approved facts from the ROI Engine (R4 #3).
- **Model choice** is decided with current, verified facts (pricing, Indic quality, tool use) at the time of writing. **Not answered from memory.** The validation test is a golden set of real-style conversations (English, Hindi, Hinglish, one regional language) scored on escalation accuracy, factual grounding, forbidden-claim rate, language match, and latency.

## Risks
| Risk | Mitigation |
|---|---|
| Prompt outside 150–250 words | Count it with a script; show the count in the doc |
| Model claims go stale or are wrong | Verify pricing and capabilities against vendor docs on the day; cite the date |
| Triggers drift from the prototype | One trigger table is the single source for R2 and R6A |

## Effort and priority
- **Estimate:** 1 h · **Priority:** P0 · **Depends on:** R1 (1c states), R4 (agent scope) · **Feeds:** R2, R6A
- **Status:** Not started. D-08 is open.
