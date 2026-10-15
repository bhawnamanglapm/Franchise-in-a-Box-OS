# 1a. Prioritisation: what ships in the first 30 days

> **TL;DR.** Ship the lead-to-close slice first: the WhatsApp Sales Agent and a thin CRM, released together, then a thin ROI Engine so the agent has approved numbers to quote. Onboarding comes after that, and Collateral Studio waits. Scale100x is paid when a franchisee signs (A1). Its 20+ existing brands (A21) mean the revenue path can start on day 1, without waiting for the brand-side modules.

## The lens

Scale100x's stated goal is to help brands open **100+ offline outlets a year**. Every one of those outlets is a signed franchisee. Scale100x earns a setup fee and retainer from brands, and a success fee when a franchisee signs (A1). The brand-side modules (Onboarding, ROI, Collateral) **earn the right to sell**. The franchisee-side modules (Sales Agent, CRM) **produce the signed agreements**, and that is also where most of the AI leverage sits: about 73% of all manual work per brand is in the Sales Agent module ([1b](1b-ai-human-split.md)). So every module is ranked by one question: *does it get more qualified franchisees to a signed agreement, faster, across many brands at once?*

## Ranking (decision D-04, confirmed)

Team: 2 full-stack engineers, 1 designer and a PM, using AI tools on React + Supabase (A7). Pilot: 2 existing brands (A21).

| Rank | Module | 30-day scope (what ships) | Why now | Left out until later |
|---|---|---|---|---|
| **1** | AI Sales & Marketing Agent (thin) | WhatsApp AI Agent only: Lead Ads webhook → consent → template greeting → qualification → answers from approved facts → HITL flag and takeover; basic live tracking (counts of leads, messages and conversations per brand) | Leads stop going cold because the reply arrives in minutes; this is where 73% of the work is | Voice and Email agents, Meta Ads optimisation, the full switchboard, live-tracking dashboards beyond basic counts |
| **1** | HITL Sales CRM (thin), shipped as one slice with #1 | Inbox, takeover panel, unified timeline, deal stage up to Won / Lost | Without a human closing path the agent produces chats, not signed agreements | Live call intelligence, forecasting |
| **3** | ROI Engine (thin) | Franchise Model Card + 3-year ROI, approved by a consultant and published as the agent's **approved facts** | Prospects' first serious question is about returns. The agent may only quote numbers a human has approved (A32). | Benchmarks, AI insights |
| **4** | Brand Onboarding (thin) | Brand details form plus file upload; a consultant enters data for the 2 pilot brands | Needed to add brand #3 onwards, but the pilot brands are already onboarded | AI Readiness Score, revenue-split donut |
| **5** | Collateral Studio | Deferred | Existing brands already have decks; designers can make creatives with current tools | Everything |

Modules 1 and 2 share rank 1 on purpose: they ship together as one slice, and neither one produces revenue on its own.

## The dependency trap

The brief lists the modules in brand-journey order: Onboarding → ROI → Collateral → Sales → CRM. Building in that order looks logical, but it means the **first lead isn't handled until three brand-side modules have shipped**. At our capacity (A7) that falls outside the 30-day window. The month would end with polished onboarding screens and no signed franchisees. Reversing the order works because the pilot brands are **already onboarded** (A21). Their data can be entered by hand, while the slice that earns the success fee goes live.

## Day-1 critical path: WhatsApp access

The slice depends on outside approvals that the team can't speed up: WhatsApp Business API access through a BSP, Meta business verification, and approval of the greeting and re-engagement **message templates**. Templates matter because a free-form message can only be sent within 24 hours of the prospect's last message. Outside that window, Meta returns error 131047 and only a template can be sent ([Meta error codes](https://developers.facebook.com/docs/whatsapp/cloud-api/support/error-codes)). **These applications go in on day 1**, in parallel with the build. No lead time is quoted here because none has been verified.

## Day-30 success criteria

These are targets for the 2 pilot brands, to be measured from the event log:

| # | Criterion | Target |
|---|---|---|
| 1 | Pilot brands live on the slice | 2 |
| 2 | Median time to first reply on a new lead | ≤ 5 minutes |
| 3 | Leads that reach a qualification outcome (qualified / not qualified / not now) | ≥ 70% |
| 4 | Discovery calls booked through the agent | ≥ 15 across both brands |
| 5 | Flags claimed within the 10-business-minute SLA (D-06) | ≥ 90% |
| 6 | Agent answers that contradict the approved facts (weekly audit, [1b](1b-ai-human-split.md#audit)) | 0 |

These targets are product goals, not observed data. They are set for the pilot and get recalibrated after it.

## Hand-off
- **R4 (Task 4)** uses this ranking as its consistency baseline. Any change in R4's top 4 must be explained there.
- **R2B (prototype B)** builds the core of rank 1: inbox, flags and takeover.
