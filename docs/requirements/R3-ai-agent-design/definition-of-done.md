# R3: AI Agent Design: definition of done

## Part A
- [x] ≥ 6 triggers (target 8), each with a numeric threshold or a defined classifier/keyword signal
- [x] Covers: purchase intent, deal value, low confidence, sentiment, repeated failure, explicit human request, legal/financial/compliance, out-of-scope
- [x] Each trigger states what the human sees on takeover
- [x] Hindi/Hinglish keyword handling included

## Part B
- [x] Word count between 150 and 250, **shown in the doc**
- [x] Contains: role, goal, audience + language handling, tone, never-say list (guaranteed returns, unapproved pricing, legal/tax advice), escalation rules + holding message, response format, opt-out handling
- [x] No claim in the prompt contradicts R5 or approved-facts grounding

## Part C
- [x] Default model + fallback named
- [x] Reasoned on all 5 dimensions: Indic quality, tool calling, latency, cost per conversation (maths shown), data handling
- [x] Every vendor fact has a dated source; nothing answered from memory
- [x] Validation test: golden-set size and composition, metrics, numeric pass criteria, re-run trigger

## Overall
- [x] TL;DR present
- [x] The trigger table is identical to the R2B rule engine and the R6A checkpoints

Checked 16 Oct 2026 against `outputs/R3-ai-agent-design/task3-ai-agent-design.md`: prompt counted by script (238 words); every keyword in `triggers.ts` appears in the Part A table. The R6A cross-check is pending until R6A exists. Model latency has no published figures, so it is measured in the golden set against a stated target.
