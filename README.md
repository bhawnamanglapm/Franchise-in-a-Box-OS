# Franchise-in-a-Box OS: Scale100x.ai take-home

Take-home assignment for the **AI Product Manager / AI Product Builder** role at Scale100x.ai.
This repo is the working space for the submission: planning, requirement breakdowns, architecture and the code for the Task 2 prototype (Option B).

> **Status:** R1 (Task 1) output done in [`outputs/R1-product-thinking/`](outputs/R1-product-thinking/README.md). R4 (Task 4) done in [`outputs/R4-prioritisation/`](outputs/R4-prioritisation/task4-prioritisation.md). Task 2 is **Option B only** (D-10): the WhatsApp AI Agent Panel is built in [`prototypes/r2b-whatsapp-agent-panel/`](prototypes/r2b-whatsapp-agent-panel/) and live at **https://fiab-r2b-whatsapp-agent-panel.vercel.app**; the 9-step browser test, write-up and the R5 model are next.
> **Time:** ~11 h of focused work estimated. **Quality comes first, and estimates are for planning only, not cut-off points (D-07).** Steps run in the order below; submit as soon as R8 passes, inside the 72 h deadline.

---

## 1. Project brief

Scale100x.ai helps Indian retail and franchise brands (QSR, gyms, fashion, EV, two-wheeler servicing) open 100+ offline outlets a year. Its core product, **Franchise-in-a-Box OS**, is a dark-themed SaaS command center (React + Tailwind + Supabase) with five modules:

1. Brand Onboarding Portal
2. AI Franchise Model & ROI Engine
3. Design AI Agent (Collateral Studio)
4. AI Sales & Marketing Agent (Meta Ads, WhatsApp, Voice, Email, with HITL takeover)
5. HITL Sales CRM & Intelligence

A persistent **"AI: 76% | Human: 24%"** metric is shown across the platform.

The assignment asks for seven tasks, delivered as three links:

| Artefact | Contains | Format |
|---|---|---|
| Written submission | Tasks 1, 3, 4, 6, 7 + the Task 2 write-up | Google Doc (anyone-with-link view) + PDF backup |
| Live prototype | Task 2 Option B: WhatsApp AI Agent Panel | Claude Code build on Vercel, public URL (D-01) |
| Financial model | Task 5 (FreshBrew QSR) | Google Sheets |

Task 2 says "Choose ONE". We build **Option B, the WhatsApp AI Agent Panel** (D-10): it is the revenue path (lead to signed franchisee) and it exercises the 1c takeover spec. Options A and C were planned earlier; their folders stay in the repo, marked "not being built".

The next round is a 60-minute live working session, so every decision here must be defensible and extendable live.

## 2. What we are creating

- **A decision-led written submission** a founder can skim in 10 minutes: an executive summary up front, then each task opening with a 2–3 line TL;DR.
- **One working prototype, Option B: WhatsApp AI Agent Panel.** Deterministic HITL triggers fire on real interactions, a real takeover state machine runs, and the AI/Human split is computed rather than hardcoded. It includes Module 4's Agent Switchboard and live counts of leads, messages and conversations.
- **A founder-friendly FreshBrew model** with all inputs on one Assumptions tab, franchisee economics kept separate from Scale100x revenue, payback, and ₹6L/₹8L/₹10L monthly-revenue sensitivity.
- **One connected system, not seven answers.** The 1c spec (takeover), Task 3 triggers and prompt, Task 4 ranking, prototype B and the 6A checkpoints all describe the same lead-to-close slice. B's agent quotes only figures approved from the R5 model (A32).

## 3. Value proposition

**For the Scale100x founder:** a candidate who turns a loose brief into a working, measurable system: prioritised by revenue, honest about the AI claim, and ready to extend live.

**For the product itself (the lens applied across all tasks):**
> Scale100x makes money when a franchise gets signed, not when a dashboard gets built. Every decision is judged by one question: does it get more qualified franchisees to a signed agreement, faster and cheaper, across many brands at once? Brand-side modules earn the right to sell. Franchisee-side modules (lead capture, AI conversation, human closing) carry the revenue and the AI leverage. The "AI: 76%" figure only matters once it is defined, measured and tied to cost per franchisee.

## 4. Problem solved

| Problem in the brief | How the submission resolves it |
|---|---|
| Five modules, no stated priority | Rank by revenue path and dependency. Ship the lead-to-close slice first (R1, R4). |
| "76% AI" is undefined and reads as a vanity number | Compute it three ways (count 68–81%, time 87%, value 68%; 76.5% for the day-30 slice) and redefine it as an audited **Autonomy Rate** (R1). |
| "HITL takeover" is one line with no behaviour defined | A developer-ready state machine: 7 states, 9 transitions, SLA, 24 h WhatsApp window, opt-out (R1, R2B). |
| FreshBrew has no inputs; ₹6L/8L/10L is ambiguous | Sourced assumption ranges; stated interpretation as **monthly gross sales per outlet** (R5). |
| Scale100x's own revenue model is not public | Stated as an editable assumption: setup fee + retainer + success fee per franchisee (R5). |

## 5. Audience

| Audience | What they need from this repo | Where to look |
|---|---|---|
| **Founder** (speed, ownership, commercial sense) | Key decisions in 10 minutes | Exec summary, §8 Feature list, `docs/architecture.md` |
| **Senior PM** (prioritisation, spec quality, HITL) | Reasoning and the spec | `docs/requirements/R1`, `R3`, `R4` |
| **Operator / finance lead** (P&L, unit economics) | Model logic and assumptions | `docs/requirements/R5`, `R6` |
| **Me (the candidate)** | What to do next, in order | §10 Detailed tasks, each requirement's `tasks.md` |

Platform users assumed throughout (A6): **Scale100x consultants** (primary operators), **brand founders** (portal and reports), **franchise prospects** (WhatsApp, voice, ads and email only).

## 6. Competitor and reference landscape

These are reference points to position the product, not researched claims. Verify any detail before citing it in the submission.

| Category | Examples | Relevance |
|---|---|---|
| Indian franchise consultancies and marketplaces | Franchise India, Francorp | The service Scale100x productises: franchise model design and franchisee sales |
| Franchise management / development software | FranConnect | Franchise-development CRM benchmark for the CRM module |
| Indian sales CRMs | LeadSquared, Zoho CRM, HubSpot | What consultants use today; integration or replacement question |
| WhatsApp Business API providers (BSPs) | Interakt, WATI, Gupshup | Required infrastructure for the WhatsApp agent; template approval constraints |

**Positioning:** consultancies are people-heavy with no software leverage, and CRMs and BSPs are tools with no franchise model. Franchise-in-a-Box OS combines the franchise playbook with AI-run lead qualification and human closing.

## 7. Tools

| Tool | Used for | Real usage? |
|---|---|---|
| Claude | Analysis, drafting, research synthesis, model logic | Yes |
| Claude Code | Repo setup, docs, building prototype B (D-01), targeted fixes | Yes |
| Lovable | Planned for prototypes A and C; not used, since Task 2 is B only (D-10) and B is built in Claude Code (D-01) | No |
| Google Sheets | Financial model (R5), AI/Human split tab (R1) | Yes |
| Google Docs | Written submission (assumed available, A16) | Assumed |
| GitHub | Version control | Yes (this repo) |
| Zapier / Make | **Designed, not built** in 6A. Stated honestly. | No |

Product stack (from the brief): React + Tailwind + Supabase. The prototype uses React + Tailwind with in-browser mock data instead of Supabase (A11). WhatsApp via a BSP (business solution provider). Meta Lead Ads.

## 8. Requirements

Each requirement is evaluated in its own folder under [`docs/requirements/`](docs/requirements/README.md), with: `evaluation.md`, `features.md`, `tasks.md`, `phases.md`, `definition-of-done.md`.

| ID | Requirement (brief task) | Weight* | Priority | Exec order | Folder |
|---|---|---|---|---|---|
| R1 | Product Thinking (Task 1) | 15% | P0 | 1 | [R1-product-thinking](docs/requirements/R1-product-thinking/evaluation.md) |
| R4 | Prioritisation Under Constraint (Task 4) | 10% | P1 | 2 | [R4-prioritisation](docs/requirements/R4-prioritisation/evaluation.md) |
| R3 | AI Agent Design (Task 3) | 15% | P0 | 3 | [R3-ai-agent-design](docs/requirements/R3-ai-agent-design/evaluation.md) |
| R2B | Prototype B: WhatsApp AI Agent Panel (Task 2) | 20% | P0 | 4 | [R2B-whatsapp-agent-panel](docs/requirements/R2B-whatsapp-agent-panel/evaluation.md) |
| R5 | Financial Model (Task 5) | 20% | P0 | 5 | [R5-financial-model](docs/requirements/R5-financial-model/evaluation.md) |
| R2C | ~~Prototype C: ROI Dashboard~~ Not built (D-10) | — | — | — | [R2C-roi-dashboard](docs/requirements/R2C-roi-dashboard/evaluation.md) |
| R2A | ~~Prototype A: Onboarding Wizard~~ Not built (D-10) | — | — | — | [R2A-onboarding-wizard](docs/requirements/R2A-onboarding-wizard/evaluation.md) |
| R6 | Automation + Market Research (Task 6) | 15% | P1 | 8 | [R6-automation-research](docs/requirements/R6-automation-research/evaluation.md) |
| R7 | How You Work (Task 7) | 5% | P2 | 9 | [R7-how-you-work](docs/requirements/R7-how-you-work/evaluation.md) |
| R8 | Submission & Assembly (brief's submission rules) | Gate | P0 | 10 | [R8-submission-assembly](docs/requirements/R8-submission-assembly/evaluation.md) |

*Weights are our estimate of reviewer emphasis, used to plan the work. The brief does not publish weights.

**Why this order:** decisions flow forward only.
- R1 sets priorities, and R4 must agree with them.
- R3 defines the triggers and prompt that R2B runs.
- R5 reuses the Phase 0 assumptions, and R5's approved figures replace R2B's illustrative facts (A32).
- R6A reuses R3's checkpoints.
- R7 cites how this assignment's ambiguities were handled.

**Prototype B at a glance:** the brief's design tokens, FreshBrew + fictional gym mock data (A26), the computed autonomy badge, and a Claude Code build on Vercel with one public URL.

## 9. Feature list (summary)

Full lists and MoSCoW tags are in each `features.md`.

| Req | Must-have features |
|---|---|
| R1 | 30-day module ranking · 37-action AI/Human map · 3-way split calculation · Autonomy Rate definition + instrumentation + audit · Takeover dev spec |
| R4 | Top-4 ranked features · Month 2 / Cut lists · QSR lead-gen variation · consistency note vs R1 |
| R3 | 8 measurable HITL triggers · 150–250 word WhatsApp system prompt (counted) · model choice matrix · golden-set validation test |
| R2B | Design-system shell + computed autonomy badge · Agent Switchboard + live counts · inbox with state chips + SLA · conversation view + 24 h window · trigger engine + "Why flagged" · takeover state machine · simulate-inbound box · return-to-AI + opt-out · empty/loading/error states · build log |
| R5 | Summary tab · Assumptions tab · Monthly P&L Y1 · Payback · Sensitivity ₹6L/8L/10L · Scale100x 3-year revenue (+ portfolio view) |
| R6 | 6A lead-flow design with steps, data, checkpoints, time-saved maths, risk · 6B sourced EV 2W servicing research with go/no-go |
| R7 | Real tools with proof · calibrated self-ratings · process · one complex problem · ambiguity handling |
| R8 | Exec summary · TL;DRs · consistency check · founder skim test · link and permission QA |

## 10. Architecture

See **[`docs/architecture.md`](docs/architecture.md)** for the Mermaid diagrams (business funnels, target platform, lead-to-close sequence, takeover state machine, data model, prototype architecture, delivery plan) and **[`docs/architecture-components.csv`](docs/architecture-components.csv)** for a component sheet you can import into Google Sheets.

```mermaid
flowchart LR
  A["Meta Lead Ads"] --> B["Lead ingestion + dedupe"]
  B --> C["WhatsApp AI agent"]
  C --> D{"HITL trigger?"}
  D -- "No" --> C
  D -- "Yes" --> E["Consultant takeover (CRM)"]
  E --> F["Discovery call → agreement"]
  F --> G["Franchisee signed = success fee"]
  H["ROI Engine: approved numbers"] -.-> C
  I["Onboarding: brand data"] -.-> H
```

## 11. Detailed tasks, in priority order

Detailed, numbered tasks live in each requirement's `tasks.md`. Master view:

| # | Task | Req | Est. | Block | Owner |
|---|---|---|---|---|---|
| 1 | Confirm Phase 2 decisions (D-04, D-05, D-06) | R1 | 5 m | Decide | You |
| 2 | Finalise 1a ranking, 1b table + split tab, 1c spec | R1 | 1.5 h | Decide | You + Claude |
| 3 | Rank top 4 features, Month 2 / Cut, QSR variation | R4 | 0.5 h | Decide | You + Claude |
| 4 | Write HITL triggers, system prompt (word-count), model choice, eval | R3 | 1 h | Decide | You + Claude |
| 5 | Write the shared Prompt 1 shell + prototype B build brief and prompts | R2B | (in 4) | Decide | Claude |
| 6 | Build prototype B in Claude Code (D-01); log prompt → error → fix | R2B | 2 h | Build | Claude Code builds, you review |
| 7 | Deploy B, run 9-step test, write Task 2 Option B section | R2B | 0.75 h | Build | You |
| 8 | Build FreshBrew model in Sheets; run integrity checks | R5 | 2 h | Build | You + Claude |
| 9 | ~~Build prototype C~~ Dropped: Task 2 is B only (D-10) | R2C | — | — | — |
| 10 | ~~Build prototype A~~ Dropped: Task 2 is B only (D-10) | R2A | — | — | — |
| 11 | Swap B's illustrative facts for R5's approved figures; redeploy B | R2B | 10 m | Build | You |
| 12 | 6A lead-flow design + diagram | R6 | 0.4 h | Finish | You + Claude |
| 13 | 6B research: verify every number and source | R6 | 0.6 h | Finish | Claude drafts, you verify |
| 14 | Task 7 answers with proof links | R7 | 0.5 h | Finish | You |
| 15 | Assemble doc, exec summary, QA, incognito test of all 3 links, submit | R8 | 1 h | Finish | You |
| 16 | Live-session prep (after submission) | — | 0.5 h | Finish | You + Claude |

**Blocks (take a 10-minute break between them):**
- **Decide:** R1, R4, R3 (~3.5 h)
- **Build:** R2B, R5, facts swap (~5 h)
- **Finish:** R6, R7, R8 (~2.5 h)

Estimates are for planning only. Quality comes first (D-07).

## 12. Definition of done

The submission is done when **all** of the following are true:

- [ ] Every deliverable in the brief is present: 1a, 1b, 1c, 2 (Option B), 3A, 3B, 3C, 4, 5, 6A, 6B, 7 (checked against the R8 completeness table).
- [ ] The Task 2 write-up has: live URL, exact prompts, what AI got wrong, manual fixes, 1 more day.
- [ ] Each requirement's own `definition-of-done.md` is fully ticked (R2A and R2C excluded: not built, D-10).
- [ ] All 3 links open in an incognito window with view access: prototype B, the model and the doc.
- [ ] The system prompt is 150–250 words, and the count is shown.
- [ ] No number appears without a source or a stated assumption ID.
- [ ] R1, R3, R4, R6A and R2B tell one consistent story. Any change between R1 and R4 is explained.
- [ ] R2B's agent quotes only figures approved from the R5 Sheet, or labels them illustrative (A32).
- [ ] The founder skim test passes: the main decisions can be read from headings and TL;DRs alone.
- [ ] Task 7 contains only real tools and real experience. Nothing is invented.
- [ ] Submitted as soon as R8 passes, inside the 72 h deadline.

## 13. Repo map

```
README.md                         ← you are here
docs/
  architecture.md                 ← Mermaid architecture sheet
  architecture-components.csv     ← component sheet (import to Sheets)
  diagrams/                       ← PNG export of every Mermaid diagram
  assumptions-and-decisions.md    ← A1–A35 register + decision log
  requirements/
    README.md                     ← evaluation matrix for R1–R8
    R1-product-thinking/          ← evaluation · features · tasks · phases · definition-of-done
    R2A-onboarding-wizard/        ← not being built (D-10)
    R2B-whatsapp-agent-panel/     ← + build-log-template.md
    R2C-roi-dashboard/            ← not being built (D-10)
    R3-ai-agent-design/
    R4-prioritisation/
    R5-financial-model/
    R6-automation-research/
    R7-how-you-work/
    R8-submission-assembly/
outputs/                          ← finished deliverables, one folder per requirement
  README.md                       ← index and status
  R1-product-thinking/            ← 1a, 1b (+ action-map CSV), 1c
  R2B-whatsapp-agent-panel/       ← Task 2 write-up, build log, screenshots
prototypes/
  r2b-whatsapp-agent-panel/       ← the Option B app (Vite + React + TS + Tailwind)
```

## 14. Open decisions

See [`docs/assumptions-and-decisions.md`](docs/assumptions-and-decisions.md#decision-log). D-04, D-05 and D-06 were confirmed on 15 Oct 2026. D-09 (Task 4 top 4) was confirmed on 16 Oct 2026. Still open, decided inside its requirement: D-08 (default LLM, R3).

D-10 was revised on 15 Oct 2026: Task 2 is Option B only. D-11 (prototype A's revenue split) is no longer needed.
