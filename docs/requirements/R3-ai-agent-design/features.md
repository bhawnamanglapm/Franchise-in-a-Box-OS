# R3: AI Agent Design: feature list

## Part A: HITL triggers

| ID | Trigger | Measurable condition (draft) | Signal | What the human sees on takeover | MoSCoW |
|---|---|---|---|---|---|
| F3.A1 | High purchase intent | Intent classifier = `ready_to_proceed` OR asks for agreement, payment, site visit or meeting | Intent label + keyword set | Intent quote, budget, city, timeline | M |
| F3.A2 | Deal value threshold | Stated investment ≥ the brand's full franchise investment (A10), or ≥ 2 outlets | Extracted entity `investment_inr`, `outlet_count` | Value, ability-to-invest notes | M |
| F3.A3 | Low AI confidence | Confidence < 0.6 on 2 consecutive turns, OR no matching approved fact found | Model confidence + retrieval-hit flag | The unanswered question + the closest facts | M |
| F3.A4 | Negative sentiment | Sentiment score ≤ −0.5, or an abuse/complaint keyword | Sentiment classifier | Sentiment trend, trigger message | M |
| F3.A5 | Repeated failed answers | The same intent asked ≥ 2 times without resolution, or "you didn't answer" | Intent repetition counter | Thread excerpt of the loop | M |
| F3.A6 | Explicit human request | "talk to a person / call me / insaan se baat" (EN/HI/Hinglish list) | Keyword + intent | Immediate claim prompt | M |
| F3.A7 | Legal / financial / compliance | Questions about agreement clauses, refunds, guaranteed returns, loans, GST, or legal disputes | Topic classifier + keyword list | Topic label; AI is blocked from answering | M |
| F3.A8 | Out of scope | Not about franchise buying (job seekers, vendors, customer complaints) | Topic classifier | Suggested routing (HR, vendor, support) | S |
| F3.A9 | Multiple triggers at once | Combine all reasons into one flag | Rule engine | All reasons listed | M |

## Part B: system prompt

| ID | Component | MoSCoW |
|---|---|---|
| F3.B1 | Role and goal (qualify, answer from approved facts, book a consultant call) | M |
| F3.B2 | Audience: Indian franchise prospects; reply in the user's language and script (English / Hindi / Hinglish; regional language → reply in kind or offer English/Hindi) | M |
| F3.B3 | Tone: warm, concise, respectful (aap), WhatsApp-length replies | M |
| F3.B4 | Never: guarantee returns or payback, quote unapproved pricing, give legal or tax advice, collect Aadhaar or PAN in chat | M |
| F3.B5 | Escalation rules mirroring F3.A1–A8, with an exact holding message | M |
| F3.B6 | Response format: ≤ 60 words, one question per message, structured qualification fields emitted as JSON for the system | M |
| F3.B7 | Consent: honour STOP/opt-out immediately | M |
| F3.B8 | Word count shown (150–250) | M |

## Part C: model selection

| ID | Component | MoSCoW |
|---|---|---|
| F3.C1 | Comparison matrix: Claude / OpenAI / Deepseek × Indic quality, tool calling, latency, cost per conversation, data handling | M |
| F3.C2 | Cost-per-conversation maths (tokens × price, with a stated conversation length) | M |
| F3.C3 | Default choice + fallback model | M |
| F3.C4 | Validation test: 40-conversation golden set (draft size) across EN/HI/Hinglish/regional; pass criteria per metric | M |
| F3.C5 | Pass criteria (draft): escalation recall ≥ 95% on trigger cases; 0 forbidden claims; ≥ 95% grounded answers; language match ≥ 95%; p95 latency within budget | M |
| F3.C6 | Re-run cadence (on every prompt or model change) | S |
