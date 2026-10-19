# Franchise-in-a-Box OS: a WhatsApp sales agent that knows when to hand over to a person

[![CI](https://github.com/bhawnamanglapm/Franchise-in-a-Box-OS/actions/workflows/ci.yml/badge.svg)](https://github.com/bhawnamanglapm/Franchise-in-a-Box-OS/actions/workflows/ci.yml)

A take-home for the AI Product Manager / AI Product Builder role at Scale100x.ai. The brief described a five-module
SaaS platform for franchise brands and asked for seven tasks: product thinking, a prototype, AI agent design,
prioritisation, a financial model, automation and market research, and how I work.

**Try the prototype:** https://fiab-r2b-whatsapp-agent-panel.vercel.app (no login, works on a phone).
Pick **Ankit Verma**, click **Hot lead (Hinglish)** under Simulate, then **Claim**.

| | |
|---|---|
| **What it is** | A consultant's inbox for an AI WhatsApp agent. The AI answers franchise prospects from approved facts only. When a message needs a person (buying intent, a big budget, a complaint, a legal or money question), the chat is flagged with the rule that fired, a consultant takes over, and hands it back with a reason. |
| **My role** | Product owner. I framed the problem, made the scope and design decisions, wrote the specs with Claude, and reviewed and tested the build. Claude Code wrote the prototype code. |
| **Status** | Prototype live and tested. All seven tasks have written outputs. The written submission is assembled; the Google Doc and PDF versions, and one Lovable link in Task 7, are still to do. |
| **Not shown** | No real WhatsApp, LLM or CRM connection, no user research, no pilot metrics. See [What is and isn't proven](#what-is-and-isnt-proven). |

## The problem

Scale100x helps Indian retail and franchise brands open many outlets a year. It earns most when a franchisee signs,
not when a dashboard is built. The brief listed five modules with no priority, a headline "AI: 76% | Human: 24%" figure
with no definition, and "human-in-the-loop takeover" as a single line with no behaviour defined.

So I judged every decision by one question: **does it get more qualified franchisees to a signed agreement, faster
and cheaper?** That pointed to the lead-to-close path: a lead comes in, an AI agent qualifies it on WhatsApp, a
consultant steps in at the right moment, and the deal closes.

## Key decisions

| Decision | Why | Trade-off |
|---|---|---|
| **Build the lead-to-close slice first** (WhatsApp agent → human takeover → deal tracking) | It's the revenue path, and the other modules feed it | Brand onboarding and collateral design wait (Task 4 cuts six features and moves 13 to Month 2) |
| **Redefine "76% AI" as an audited Autonomy Rate**, shown as "AI: X% of work, Humans: 100% of closes" | An undefined percentage reads as a vanity number. Counted three ways from my 37-action map, the estimate ranges from 68% to 87% depending on what you count | The figure has to be instrumented and audited, not just displayed |
| **Hand over to a person on 8 measurable triggers**, merged into one flag with every reason | "Escalate when needed" can't be tested. Rules with thresholds can | Rules miss cases a model might catch; low confidence is one of the 8 triggers to cover that |
| **The agent quotes only figures from the financial model** | A sales agent inventing ROI numbers is the biggest trust risk | Fewer questions answered automatically; the rest go to a person |
| **Build one prototype option (B), in Claude Code instead of Lovable** | The brief says "Choose ONE". Code let me unit-test the state machine and automate the 9-step test | Less visual polish than a Lovable build |
| **Default model Claude Sonnet 5.5, fallback OpenAI; DeepSeek excluded** | Two vendors for resilience. DeepSeek stores data in China, which can't be audited for an Indian business under the DPDP Act | Provisional: the choice should be settled by the proposed 40-conversation test set, which has not been run |

Each decision, with its date, is in the [decision log](docs/assumptions-and-decisions.md#decision-log).

## What I delivered

| Task | Output | Headline |
|---|---|---|
| 1. Product thinking | [30-day ranking, AI/human split, takeover spec](outputs/R1-product-thinking/README.md) | A developer-ready takeover spec: 7 states, 9 transitions, a claim time limit, WhatsApp's 24-hour window, opt-out |
| 2. Prototype (Option B) | [Write-up](outputs/R2B-whatsapp-agent-panel/README.md) · [code](prototypes/r2b-whatsapp-agent-panel/) · [live](https://fiab-r2b-whatsapp-agent-panel.vercel.app) | Real state machine and trigger rules; WhatsApp and the AI's replies are simulated |
| 3. AI agent design | [Triggers, system prompt, model choice](outputs/R3-ai-agent-design/task3-ai-agent-design.md) | 8 triggers; a 238-word system prompt; a proposed test set in English, Hindi, Hinglish and Tamil |
| 4. Prioritisation | [Top 4 for 3 weeks](outputs/R4-prioritisation/task4-prioritisation.md) | 25 features scored; how the order changes for a lead-generation-focused QSR partner |
| 5. Financial model | [FreshBrew model](outputs/R5-financial-model/README.md) · [.xlsx](outputs/R5-financial-model/FreshBrew-Financial-Model.xlsx) | At ₹8 lakh monthly sales an outlet pays back in month 29; break-even is about ₹5.5 lakh a month. Built from third-party listings and labelled estimates |
| 6. Automation and research | [Lead-flow design](outputs/R6-automation-research/task6a-lead-flow.md) · [EV servicing research](outputs/R6-automation-research/task6b-ev-servicing.md) · [practice lab](practice/lead-flow-automation/README.md) | The lead flow is designed, not run in production. A practice lab runs it against fake APIs |
| 7. How I work | [Task 7](outputs/R7-how-you-work/task7-how-you-work.md) | Real tools and experience only |
| Submission | [Assembled document](outputs/R8-submission/README.md) | Built by a script that checks every task is present and the prompt word count |

## What is and isn't proven

| Checked | How |
|---|---|
| The takeover state machine, trigger rules, timers and the computed autonomy badge | 52 unit tests, run in CI on every push |
| The 9-step takeover script, through the real UI | Playwright, 4 of 4 runs passed on 16 Oct 2026 (desktop and 375 px, local and live). Re-run on the live site after the 17 Oct redeploy. Run by hand, not in CI |
| The prototype builds | Production build in CI |
| The lead-flow automation logic | 23 tests against fake Meta, WhatsApp and HubSpot APIs, in CI |
| The financial model adds up | 10 automatic checks and 3 hand spot-checks on the Checks tab |
| DPDP Rules timing used in the risk section | Checked 19 Oct 2026 against the government's PIB backgrounder: notified 14 Nov 2025, 18-month phased compliance. The exact Gazette day was not confirmed |

| Not shown | Why it matters |
|---|---|
| A real WhatsApp, LLM or CRM connection | Replies are scripted from approved facts; nothing is sent |
| The 40-conversation model test set | Designed, not run, so the model choice is still provisional |
| User research or a pilot | The time saved (about 274 hours a month per brand) and the autonomy figures are estimates from my action map, to be measured in a pilot |
| FreshBrew's real economics | The model uses third-party listings and estimates, not a franchisor disclosure. Scale100x's pricing isn't public, so its fees are editable assumptions |

## How I built it

I used Claude for analysis, drafting and research synthesis, and Claude Code to build the prototype. I gave the
prompts, reviewed at checkpoints and made the calls. The [prototype write-up](outputs/R2B-whatsapp-agent-panel/README.md#how-it-was-built)
lists every prompt in order, the 15 things the AI got wrong, and which fixes came from me versus from its own test runs.
Two I caught: the first plan built all three prototype options although the brief says "Choose ONE", and a suggested
reply on an escalated chat was signed by the wrong consultant and answered a question the prospect never asked.

## Run it locally

```bash
cd prototypes/r2b-whatsapp-agent-panel
npm ci
npm test          # 52 unit tests
npm run dev       # local prototype
npm run e2e       # 9-step Playwright test (needs browsers: npx playwright install)

cd ../../practice/lead-flow-automation
npm test          # 23 tests against fake APIs, no dependencies
```

## Repository map

```
outputs/      finished deliverables, one folder per task
prototypes/   the Option B app (Vite, React, TypeScript, Tailwind)
practice/     the lead-flow lab against fake APIs
docs/         architecture, assumptions and decisions, per-task requirements, and PLAN.md (the working plan)
brief/        the assignment brief
```

The working plan I followed during the take-home (task order, estimates, definition of done) is in
[docs/PLAN.md](docs/PLAN.md).
