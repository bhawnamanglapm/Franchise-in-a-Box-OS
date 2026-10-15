# R3: AI Agent Design: definition of done

## Part A
- [ ] ≥ 6 triggers (target 8), each with a numeric threshold or a defined classifier/keyword signal
- [ ] Covers: purchase intent, deal value, low confidence, sentiment, repeated failure, explicit human request, legal/financial/compliance, out-of-scope
- [ ] Each trigger states what the human sees on takeover
- [ ] Hindi/Hinglish keyword handling included

## Part B
- [ ] Word count between 150 and 250, **shown in the doc**
- [ ] Contains: role, goal, audience + language handling, tone, never-say list (guaranteed returns, unapproved pricing, legal/tax advice), escalation rules + holding message, response format, opt-out handling
- [ ] No claim in the prompt contradicts R5 or approved-facts grounding

## Part C
- [ ] Default model + fallback named
- [ ] Reasoned on all 5 dimensions: Indic quality, tool calling, latency, cost per conversation (maths shown), data handling
- [ ] Every vendor fact has a dated source; nothing answered from memory
- [ ] Validation test: golden-set size and composition, metrics, numeric pass criteria, re-run trigger

## Overall
- [ ] TL;DR present
- [ ] The trigger table is identical to the R2 rule engine and the R6A checkpoints
