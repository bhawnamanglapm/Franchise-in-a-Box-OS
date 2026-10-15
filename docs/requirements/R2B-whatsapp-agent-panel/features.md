# R2B: WhatsApp AI Agent Panel: feature list

MoSCoW against a **2-hour build estimate**. Anything not built moves to "1 more day".

## Screens and features

| ID | Feature | Description | MoSCoW | Maps to |
|---|---|---|---|---|
| F2B.01 | App shell + design tokens | Dark theme with the exact brief hex values; Inter + mono for numbers; left nav showing 5 modules (only "Sales Agent" active); shared shell prompt with R2A and R2C | M | Brief design system |
| F2B.02 | Computed autonomy badge | Persistent header badge "AI: X% of work \| Humans: 100% of closes", **computed** from mock event log; tooltip explains the definition | M | R1 1b, D-05 |
| F2B.03 | Inbox list | 8–10 conversations; state chip (AI blue / Flagged amber / Human green / Closed grey); brand tag; last message preview; filter "Needs human" | M | 1c UI |
| F2B.04 | SLA countdown | Flagged items sorted by time remaining; turns red < 2 min | M | A22 |
| F2B.05 | Conversation thread | WhatsApp-style bubbles; prospect, AI, human, and system events (e.g. "Flagged: high intent") inline | M | 1c |
| F2B.06 | Realistic mock data | EN / Hindi / Hinglish messages; investment ranges in ₹ lakh; Tier 1/2 cities; 2 brands | M | A26 |
| F2B.07 | Trigger engine | Deterministic rules from R3 (keywords, investment threshold, repeat counter, sentiment keywords) run on each inbound message | M | R3 Part A |
| F2B.08 | "Why flagged" card | Lists the rule names and the values that fired | M | 1c |
| F2B.09 | Takeover state machine | States AI_ACTIVE → FLAGGED → HUMAN_ACTIVE → RETURNED / CLOSED / OPTED_OUT, with guards | M | 1c transitions |
| F2B.10 | Take over / Claim / Return to AI buttons | Return requires a reason (dropdown); compliance flags require "Resolved" | M | T2, T3, T6 |
| F2B.11 | Composer rules | Disabled in AI_ACTIVE; "AI paused" banner in HUMAN_ACTIVE | M | 1c composer |
| F2B.12 | Simulate inbound message box | Reviewer types a prospect message; rules evaluate; state updates live | M | Proves "working" |
| F2B.13 | Takeover panel | 5-bullet summary (budget, city, timeline, objections, last question), lead score, suggested reply | S | 1c |
| F2B.14 | 24 h window indicator | Countdown; past 24 h the composer switches to a template picker | S | A23 |
| F2B.15 | Opt-out | "STOP" / "band karo" → OPTED_OUT, all sending blocked | S | T9 |
| F2B.16 | Claim conflict demo | "Simulate second consultant" → toast "Claimed by Priya" | C | AC #2 |
| F2B.17 | Empty / loading / error states | Empty queue copy, skeletons, failed send with Retry | S | 1c |
| F2B.18 | Metrics strip | Active chats, flagged, in SLA %, takeovers today, autonomy % | C | R1 |
| F2B.19 | Stretch: live LLM reply | One edge-function call using the R3 prompt for AI replies; falls back to scripted | C | R3 Part B |
| F2B.20 | Real WhatsApp / Supabase backend | — | W | 1 more day |
| F2B.21 | Cross-prototype footer | Links to the Option A and Option C URLs; same shell as R2A and R2C | S | D-10 |
| F2B.22 | Approved facts from R2C | The agent's quotable numbers (investment, fee, royalty, payback range) are copied from the R2C approved Model Card | S | A32 |

## Write-up components (required by the brief)

| ID | Component | MoSCoW |
|---|---|---|
| F2B.W1 | Live URL | M |
| F2B.W2 | Exact prompts used, in order (copied from the build log) | M |
| F2B.W3 | What AI got wrong: specific and technical (from the log) | M |
| F2B.W4 | What I fixed manually (from the log) | M |
| F2B.W5 | 1 more day improvements, tied to the 1c spec and its acceptance criteria | M |
| F2B.W6 | 3 screenshots + a 60-second Loom (optional backup) | C |
