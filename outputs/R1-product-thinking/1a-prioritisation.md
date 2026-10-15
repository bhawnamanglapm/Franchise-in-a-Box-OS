# 1a. Prioritisation: what ships in the first 30 days

> **TL;DR.** Ship the WhatsApp Sales Agent and a thin CRM together first, then a thin ROI Engine (so the agent has approved numbers to quote), then thin Onboarding; Collateral Studio waits. The order follows the money: Scale100x is paid when a franchisee signs (A1), and its 20+ existing brands (A21) let that start on day 1. A day-5 discovery gate can change the order if the evidence points elsewhere.

## 1. The lens

Scale100x's stated goal is to help brands open **100+ offline outlets a year**, and every one of those outlets is a signed franchisee. Scale100x earns a setup fee and retainer from brands, and a success fee when a franchisee signs (A1). The modules split into two groups:

- **Brand-side modules (Onboarding, ROI, Collateral)** earn the right to sell.
- **Franchisee-side modules (Sales Agent, CRM)** produce the signed agreements. They are also where most of the AI leverage sits: about 73% of all manual work per brand is in the Sales Agent module ([1b](1b-ai-human-split.md)).

Every module is ranked by one question: *does it get more qualified franchisees to a signed agreement, faster, across many brands at once?* A module doesn't rank higher just because it contains more AI.

## 2. Which bottleneck? Four hypotheses

The brief describes five modules but doesn't say which customer problem hurts most. This ranking rests on hypothesis H1, and discovery tests all four:

| # | Hypothesis | What it would look like in the data | Module it would promote |
|---|---|---|---|
| **H1** | **Lead handling:** leads get slow replies or no follow-up | Long time to first reply; leads with no second touch; conversion falls with reply delay | Sales Agent + CRM (current #1) |
| H2 | **Lead quality:** ads attract people who can't or won't invest | Many replies, few qualify; low-budget or wrong-city leads dominate | Qualification rules and lead-source analysis inside the Sales Agent |
| H3 | **Investor confidence:** prospects stall at the numbers | Drop-off after the investment or payback conversation; repeated ROI questions | ROI Engine moves to #1 alongside the agent |
| H4 | **Brand readiness:** brands lack the facts and documents to sell | Consultants can't answer basic questions; missing P&L or FAQs | Onboarding moves above ROI |

**H1 is the working bet, for two reasons:**
- The money is earned at signing, and leads go cold within hours, not days.
- The 1b action map puts most of the manual work in the conversation itself.

That is a model of the work, not observed pain. It still has to be confirmed with funnel data.

## 3. How the modules are scored

| Criterion | Weight | Question |
|---|---:|---|
| Business impact | 30% | Does it move franchisees closer to signing? |
| Customer pain | 25% | Does it fix a frequent, costly problem? |
| 30-day feasibility | 20% | Can a useful, testable version ship in 30 days with this team (A7)? |
| Dependency leverage | 15% | Do other modules need it? |
| Evidence confidence | 10% | How much evidence backs the need today? |

These weights are proposed decision weights, not measured results. The scores below (1–5) are pre-discovery judgments. Each comes with a written reason so it can be challenged, and all of them are re-scored after day 5.

| Module (thin scope) | Impact | Pain | Feasibility | Leverage | Evidence | **Weighted** |
|---|---:|---:|---:|---:|---:|---:|
| HITL Sales CRM | 4 | 4 | 4 | 4 | 3 | **3.90** |
| AI Sales & Marketing Agent | 5 | 4 | 3 | 3 | 3 | **3.85** |
| Franchise Model & ROI Engine | 3 | 3 | 4 | 4 | 2 | **3.25** |
| Brand Onboarding | 2 | 2 | 5 | 4 | 2 | **2.90** |
| Collateral Studio | 2 | 2 | 3 | 1 | 2 | **2.05** |

**Reasons for the scores that matter most:**
- **Sales Agent impact 5:** it is the step where a lead becomes a conversation.
- **Sales Agent feasibility 3:** Meta approvals are outside the team's control (§6).
- **CRM leverage 4:** the agent's takeover and audit both depend on its timeline.
- **ROI leverage 4:** its approved Model Card is the only source of numbers the agent may quote (A32).
- **Onboarding impact 2:** the pilot brands are already onboarded (A21).
- **Collateral leverage 1:** no other module needs it to work.

The CRM and the Agent score within 0.05 of each other, which is why they share rank 1 and ship as one slice.

## 4. Ranking (decision D-04, confirmed)

Team: 2 full-stack engineers, 1 designer and a PM, using AI tools on React + Supabase (A7). Pilot: 2 existing brands (A21).

| Rank | Module | 30-day scope (what ships) | Why now | Left out until later |
|---|---|---|---|---|
| **1** | AI Sales & Marketing Agent (thin) | WhatsApp AI Agent only: Lead Ads webhook → dedupe by phone number → consent → template greeting → qualification → answers from approved facts → HITL flag and takeover; basic live tracking (counts of leads, messages and conversations per brand) | Leads stop going cold because the reply arrives in minutes; this is where 73% of the work is | Voice and Email agents, Meta Ads optimisation, the full switchboard, live-tracking dashboards beyond basic counts |
| **1** | HITL Sales CRM (thin), shipped as one slice with the agent | Inbox, owner per lead, unified timeline, next action with follow-up reminders, takeover panel, deal stage up to Won / Lost | Without a human closing path the agent produces chats, not signed agreements | Live call intelligence, forecasting |
| **3** | ROI Engine (thin) | Franchise Model Card + 3-year ROI with editable, labelled assumptions, approved by a consultant and published as the agent's **approved facts** | Prospects' first serious question is about returns. The agent may only quote numbers a human has approved (A32). | Benchmarks (shown only when sourced, A33), AI insights |
| **4** | Brand Onboarding (thin) | Brand details form, file upload, required-field checks; a consultant enters data for the 2 pilot brands | Needed to add brand #3 onwards, but the pilot brands are already onboarded | AI Readiness Score, revenue-split donut |
| **5** | Collateral Studio | Deferred: the pilot uses each brand's existing deck plus a small set of approved WhatsApp templates | Existing brands already have decks; designers can make creatives with current tools | Everything |

**Why ROI ranks above Onboarding.** A reasonable case can be made for the opposite order, because the agent needs approved brand information to answer well (H4). The two modules split that information differently:
- **Onboarding** holds brand details (name, category, cities). For the 2 pilot brands, a consultant can type these in.
- **ROI** holds the information prospects actually press on: investment, fee, royalty, payback. That is the part that has to be right and approved.

So ROI is the module that unblocks good answers. If discovery finds the pilot brands' basic facts are missing or inconsistent (H4), the two swap places.

**Reuse before build:** scheduling uses a calendar-booking link, and reminders use the CRM's own task list. The team doesn't build email or calendar tools in the first 30 days.

## 5. The dependency trap

The brief lists the modules in brand-journey order: Onboarding → ROI → Collateral → Sales → CRM. Building in that order looks logical, but it means the **first lead isn't handled until three brand-side modules have shipped**. At our capacity (A7) that falls outside the 30-day window, and the month would end with polished onboarding screens and no signed franchisees.

Reversing the order works because the pilot brands are **already onboarded** (A21). Their data can be entered by hand while the slice that earns the success fee goes live.

## 6. Day-1 critical path: WhatsApp access

The slice depends on outside approvals that the team can't speed up:
- WhatsApp Business API access through a BSP
- Meta business verification
- approval of the greeting and re-engagement **message templates**

Templates matter because a free-form message can only be sent within 24 hours of the prospect's last message. Outside that window, Meta returns error 131047 and only a template can be sent ([Meta error codes](https://developers.facebook.com/docs/whatsapp/cloud-api/support/error-codes)).

**These applications go in on day 1**, in parallel with discovery and the build. No lead time is quoted here because none has been verified. The fallback if approval is late: run the pilot on the CRM with consultants replying by hand, and switch on the agent once access lands. The CRM work isn't wasted either way.

## 7. The 30-day roadmap

| Days | Work | Exit gate |
|---|---|---|
| **1–5: Discover, and start the no-regret work** | **Discovery:** interview the pilot brands' sales consultants; pull whatever funnel data exists (lead volume, time to first reply, lead → call → signing); map the current lead lifecycle and where leads drop. **No-regret work** (needed under all four hypotheses): submit the BSP and template applications; build the CRM data model and the `ACTION_EVENT` log ([1b §5](1b-ai-human-split.md#5-the-fix-an-audited-autonomy-rate)); enter the pilot brands' data. | **Decision gate (day 5):** which hypothesis does the evidence support? Re-score §3, confirm or change the ranking, and record baselines for the §8 metrics. |
| **6–12: Workflow foundation** | Lead intake from Lead Ads, dedupe, owner and status, CRM timeline, follow-up reminders, access control, error handling | A test lead flows end to end with a human replying |
| **13–21: AI assistance and handoffs** | Agent qualification and answers grounded in approved facts; low-confidence and off-topic handling; flag → takeover (the [1c](1c-takeover-spec.md) state machine); thin ROI Model Card published as approved facts | The 1c acceptance tests AC1–AC11 pass on a scripted test set |
| **22–26: Pilot** | Go live on the 2 pilot brands; run the first weekly audit ([1b](1b-ai-human-split.md#audit)); fix defects; thin Onboarding form in parallel (it isn't on the pilot's critical path) | 0 wrong answers in the audit; flags are being claimed |
| **27–30: Measure and decide** | Compare against the day-5 baselines; review the audit, adoption and time saved | Decide what comes next: add a channel, deepen the CRM, or promote ROI |

**What changes at the day-5 gate:**
- **H1 confirmed:** keep the plan.
- **H2 (lead quality):** keep the slice, but move effort from answering to qualifying, with stricter qualification rules and reporting by lead source. A faster reply to the wrong lead doesn't help.
- **H3 (investor confidence):** pull the ROI Model Card into days 6–12 and make it the agent's first answer about returns.
- **H4 (brand readiness):** swap Onboarding and ROI, and make required brand facts a go-live check.

## 8. Day-30 success criteria

These are targets for the 2 pilot brands, measured from the event log. They are product goals, not observed data. If the day-5 gate produces a real baseline, each target is re-set against it.

| # | Criterion | Target |
|---|---|---|
| 1 | Pilot brands live on the slice | 2 |
| 2 | Median time to first **meaningful** reply on a new lead | ≤ 5 minutes |
| 3 | Leads that reach a qualification outcome (qualified / not qualified / not now) | ≥ 70% |
| 4 | Discovery calls booked through the agent | ≥ 15 across both brands |
| 5 | Flags claimed within the 10-business-minute SLA (D-06) | ≥ 90% |
| 6 | Agent answers that contradict the approved facts (weekly audit, [1b](1b-ai-human-split.md#audit)) | 0 |

A **meaningful reply** answers the lead's question or asks a qualification question. A plain acknowledgement ("Thanks, we'll be in touch") doesn't count toward criterion 2, even if it's instant.

**Also tracked from day 1, without targets until there's a baseline:**
- follow-ups completed on time
- duplicate lead records
- missed escalations (from the audit)
- consultant hours per lead, which tests the 1b capacity model

## 9. How the team uses AI to deliver this

The team uses AI to build faster, in three parallel workstreams that share one data model and integrate daily:
- **Workstream 1:** inbox and CRM UI.
- **Workstream 2:** webhook, data and agent.
- **Workstream 3:** the test set, which is a script of realistic WhatsApp conversations for each pilot brand, used to score the agent's answers.

The aim is a working end-to-end slice inside the first week. Speed of writing code isn't the constraint, though. The things that take real time are Meta approvals, permissions, data quality and the human handoff. Those are proven by the pilot and the audit, not by how fast the code was written.

## 10. Risks and mitigations

| Risk | Mitigation |
|---|---|
| H1 is wrong: lead handling isn't the main bottleneck | Day-5 gate with pre-agreed switches (§7); days 1–5 do only work that every hypothesis needs |
| Meta approvals are slow | Apply on day 1; run the pilot on the CRM with human replies until access lands (§6) |
| The agent gives a wrong answer about money | The agent quotes only approved facts (A32); uncertain or off-script questions get flagged to a human; weekly audit with a 0% threshold |
| Flags aren't picked up in time | 10-business-minute SLA with escalation (1c); criterion 5 tracks it |
| Pilot brands' lead data is hard to get | Use a scripted test set for the build, and real leads only once the webhook is live |
| Consultants don't adopt the inbox | Involve them in discovery; the takeover panel replaces their WhatsApp phone, so they don't enter data twice |
| ROI numbers read as a promise | Assumptions are labelled and editable; benchmarks are shown only when sourced (A33); no guaranteed returns |
| AI-written code ships defects | Code review, automated tests on the takeover state machine, and the 1c acceptance tests as the release gate |
| Scope grows past 30 days | Everything outside the §4 thin scope goes to the "later" column; nothing joins it without something else leaving |

## Hand-off
- **R4 (Task 4)** uses this ranking and the §3 scores as its consistency baseline. Any change in R4's top 4 must be explained there.
- **R2B (prototype B)** builds the core of rank 1: inbox, flags and takeover.
- **R7 (Task 7)** can reuse §9 as part of "how you work".
