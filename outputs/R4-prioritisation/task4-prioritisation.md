# Task 4. Prioritisation under constraint: 4 features in 3 weeks

> **TL;DR.** In 3 weeks, ship the **WhatsApp AI Agent**, **human takeover with the conversation timeline**, the **Franchise Model Card + 3-year ROI** (the only numbers the agent may quote), and **deal tracking to Won / Lost**. Together they take a lead from first reply to a signed franchisee, which is when Scale100x earns its success fee (A1). Thirteen features wait for Month 2 and six are cut. **For a QSR partner focused on lead generation, the order changes:** qualified-lead tracking by source and a thin Meta Ads Agent move in, and the Model Card and deal tracking move out, because that partner judges Scale100x on qualified leads delivered, not on closures (A24).

## 1. How features are scored

The brief's five modules contain **25 features** (§6 places every one). Each is scored on:

| Criterion | Scale | Question |
|---|---|---|
| Revenue impact | 1–5 | Does it get more qualified franchisees to a signed agreement? |
| Time to value | 1–5 | How soon after shipping does it pay off? (5 = from day 1, 1 = needs data or approvals we don't have) |
| Effort | S = 2, M = 3, L = 5 | Build size for 2 engineers, 1 designer and a PM using AI tools (A7) |

**Score = impact × time to value ÷ effort.** Scores are my pre-discovery judgments, not measured data; each one has a written reason so it can be challenged. The score sets the order. **Cut** uses a second test on top: no decision depends on the feature, or it would mislead without data we don't have.

## 2. Top 4, ranked

| Rank | Feature | Score | 3-week scope | Why it's here |
|---|---|---:|---|---|
| **1** | WhatsApp AI Agent (with lead intake) | 5 × 4 ÷ 3 = **6.7** | Lead Ads webhook → dedupe → consent → greeting template → qualification → answers from approved facts → flags (R3 triggers); basic counts of leads, messages and conversations per brand | It is the step where a lead becomes a conversation, and it carries most of the manual work ([1b](../R1-product-thinking/1b-ai-human-split.md)) |
| **2** | Human takeover + unified timeline | 4 × 5 ÷ 3 = **6.7** | Flag → claim → take over → hand back ([1c](../R1-product-thinking/1c-takeover-spec.md)), the 10-business-minute SLA with escalation (A22), the full timeline at takeover | Without a human closing path the agent produces chats, not signed agreements. It works from day 1, even with humans replying while WhatsApp approvals are pending |
| **3** | Franchise Model Card + 3-year ROI | 4 × 4 ÷ 3 = **5.3** | Editable, labelled assumptions; a consultant approves them and publishes them as the agent's approved facts | Prospects' first serious question is about returns, and the agent may quote only numbers a human approved (A32) |
| **4** | Deal tracking and closure panel | 3 × 4 ÷ 3 = **4.0** | Owner, stage up to Won / Lost, next action and follow-up reminders | It records the success-fee event, so the 3 weeks can be judged on signings, and reminders stop warm leads going cold |

#2 and #3 each pair two items from the brief that are one feature in use: the timeline is the panel a consultant reads at takeover, and the ROI projection is calculated from the Model Card's inputs. Neither half is useful without the other.

Ranks 1 and 2 tie and ship as one slice, as in 1a, where they scored within 0.05 of each other. The agent is listed first because a takeover needs something to take over from.

**Run by hand during the 3 weeks:** a consultant enters the 2 pilot brands' details (A21); decks are shared from a drive; WhatsApp templates are written by hand; calls are booked with a calendar link.

## 3. Month 2

Ordered by score. Each has a stopgap for the first 3 weeks.

| Feature | Score | Why it waits | Stopgap until then |
|---|---:|---|---|
| Live tracking dashboards (beyond basic counts) | 2 × 4 ÷ 3 = 2.7 | Basic counts ship inside #1; dashboards need weeks of data to be worth reading | Counts in the agent panel |
| Ad creatives generator | 2 × 4 ÷ 3 = 2.7 | Designers can make creatives with current tools | Designers in Canva or with Claude |
| WhatsApp scripts generator | 2 × 4 ÷ 3 = 2.7 | Two brands' scripts are quicker to write by hand | Written as part of agent setup |
| Brand Onboarding: 4-step guided flow | 2 × 3 ÷ 3 = 2.0 | The pilot brands are already onboarded (A21); needed from brand #3 | A consultant enters the data |
| Brand details form | 1 × 4 ÷ 2 = 2.0 | Same | Same |
| File uploads (deck, P&L) | 1 × 4 ÷ 2 = 2.0 | Same | A shared drive |
| Email Agent | 2 × 3 ÷ 3 = 2.0 | A second channel only helps once the first one works | WhatsApp only |
| India benchmark comparisons | 2 × 2 ÷ 3 = 1.3 | Useful to prospects, but only with sourced data for each category (A33) | Left out; nothing unsourced is shown |
| Meta Ads Agent | 3 × 2 ÷ 5 = 1.2 | Leads already arrive through Lead Ads forms; optimising spend needs Marketing API access and spend data | The brand's existing ad setup |
| Voice AI Agent | 3 × 2 ÷ 5 = 1.2 | A second channel once WhatsApp works | Consultants call by hand |
| Live call intelligence | 3 × 2 ÷ 5 = 1.2 | Valuable once there is call volume to analyse | Call notes on the timeline |
| Regeneration, download and send workflows | 1 × 3 ÷ 3 = 1.0 | They only matter once the generators exist | — |
| AI Readiness Score | 2 × 1 ÷ 5 = 0.4 | No outcome data to calibrate it yet | Consultant judgment |

## 4. Can be cut

| Feature | Why it's cut | What replaces it | Bring it back if… |
|---|---|---|---|
| Hard-coded "AI: 76%" badge | A vanity number nothing measures (1b) | The **Autonomy Rate**, computed from the action log ([1b §5](../R1-product-thinking/1b-ai-human-split.md#5-the-fix-an-audited-autonomy-rate)) | Never as a fixed number |
| AI insights (Opportunity / Risk / Benchmark) | With no outcome data it would generate confident-sounding guesses about money | The consultant's written note on the Model Card | 50+ franchise outcomes are recorded (proposed threshold) |
| US benchmark comparisons | Irrelevant to an Indian franchisee's decision | India benchmarks in Month 2, once sourced (A33) | Scale100x takes on brands expanding outside India |
| Pitch deck generator | Brands already have decks | Each brand's existing deck | Scale100x onboards 10+ new brands a quarter (proposed threshold) |
| Sales brochure generator | No evidence a brochure moves a prospect to sign | The existing deck + approved WhatsApp templates | Pilot chats show prospects asking for a leave-behind document |
| Revenue split donut chart | Decorative: no decision depends on it | The channel figures in the brand's uploaded P&L | A decision is found that needs channel mix, e.g. a readiness sub-score |

## 5. Scenario: one partner is a QSR focused on lead generation

**Does the order change? Yes.** "Focused on lead generation" is read as: the partner judges Scale100x on **qualified leads delivered**, not on signings (A24). Re-scoring for that goal:

| Feature | Base rank | QSR rank | Why it moves |
|---|---|---|---|
| WhatsApp AI Agent | #1 | **#1** (no change) | It is still what turns a raw lead into a qualified one. Qualification rules are re-set to the partner's lower investment range. |
| Qualified-lead tracking by source | Month 2 | **#2** (5.3) | It *is* the metric the partner judges us on: qualified leads and cost per qualified lead, by ad and source. It has to exist before the Meta Ads Agent can optimise anything. |
| Human takeover + timeline | #2 | **#3** (5.0), higher threshold | Lower ticket and higher volume, so humans take fewer chats: purchase intent (A1) flags only above a score threshold set with the partner. Complaints (A4), legal and money topics (A7) and requests for a person (A6) still always flag. |
| Meta Ads Agent (thin) | Month 2 | **#4** (4.0) | Lead volume and cost now are the outcome. Thin scope: cost per qualified lead by ad set, and budget shifts that a human approves. Marketing API access is applied for on day 1. |
| Franchise Model Card + 3-year ROI | #3 | Month 2 | A qualifying conversation needs a few approved headline facts (investment, fee, royalty), not the full 3-year model. A short consultant-approved fact sheet does the job (A32 still holds). |
| Deal tracking and closure panel | #4 | Month 2 | Closure isn't how this partner measures us. |
| Ad creatives generator | Month 2 | Month 2 (no change) | Fresh creatives matter more in a high-volume funnel, but designers can make them with current tools, as in the base case. |

**What doesn't change:** the agent still quotes only approved numbers, and the takeover path still exists. Only the threshold for routine handoffs rises.

## 6. Feature inventory: where all 25 land

| # | Module | Feature | Base | QSR |
|---|---|---|---|---|
| 1 | Sales Agent | WhatsApp AI Agent | **#1** | **#1** |
| 2 | Sales Agent | HITL takeover | **#2** | **#3** |
| 3 | CRM | Unified interaction timeline | **#2** (bundled) | **#3** (bundled) |
| 4 | ROI Engine | Franchise Model Card | **#3** | Month 2 |
| 5 | ROI Engine | 3-year ROI projections | **#3** (bundled) | Month 2 |
| 6 | CRM | Deal tracking and closure panel | **#4** | Month 2 |
| 7 | Sales Agent | Meta Ads Agent | Month 2 | **#4** |
| 8 | Sales Agent | Voice AI Agent | Month 2 | Month 2 |
| 9 | Sales Agent | Email Agent | Month 2 | Month 2 |
| 10 | Sales Agent | Live tracking (leads, messages, conversations) | Month 2 (basic counts in #1) | **#2** (as qualified leads by source) |
| 11 | Onboarding | 4-step guided flow | Month 2 | Month 2 |
| 12 | Onboarding | Brand details | Month 2 | Month 2 |
| 13 | Onboarding | File uploads | Month 2 | Month 2 |
| 14 | Onboarding | AI Readiness Score | Month 2 | Month 2 |
| 15 | CRM | Live call intelligence | Month 2 | Month 2 |
| 16 | Collateral | Ad creatives | Month 2 | Month 2 |
| 17 | Collateral | WhatsApp scripts | Month 2 | Month 2 |
| 18 | Collateral | Regeneration, download and send | Month 2 | Month 2 |
| 19 | Onboarding | Revenue split donut | Cut | Cut |
| 20 | ROI Engine | US benchmarks | Cut | Cut |
| 21 | ROI Engine | AI insights | Cut | Cut |
| 22 | Collateral | Pitch deck generator | Cut | Cut |
| 23 | Collateral | Sales brochure generator | Cut | Cut |
| 24 | Platform | Hard-coded "AI: 76%" badge | Cut → Autonomy Rate | Cut → Autonomy Rate |
| 25 | ROI Engine | India benchmarks | Month 2 | Month 2 |

## 7. Consistency with Task 1a

The order matches [1a](../R1-product-thinking/1a-prioritisation.md): agent and CRM first, then ROI, with Collateral last. Three differences, each deliberate:

1. **Brand Onboarding drops out of the top 4.** 1a ranked a thin Onboarding 4th for **30 days**. With **3 weeks** there is no room, and the 2 pilot brands are already onboarded (A21), so a consultant enters their data by hand.
2. **Live tracking is split.** 1a's rank 1 included basic counts, and they stay inside #1 here. Full dashboards move to Month 2.
3. **1a's thin CRM is split into two features**, takeover + timeline (#2) and deal tracking (#4), because Task 4 counts features, not modules. Nothing was added or dropped.

1a scored modules with five weighted criteria; this task scores features with impact × time to value ÷ effort. Both put the same modules on top. 1a's day-5 discovery gate still applies: if lead quality is the real problem (H2), the effort inside #1 shifts to qualification; if investor confidence is (H3), the Model Card moves to #2; if brand readiness is (H4), the brand details form replaces deal tracking at #4.

## 8. Prototype vs production

Prototype B ([live](https://fiab-r2b-whatsapp-agent-panel.vercel.app)) demos Module 4 as the brief describes it; this ranking sets the production build order. Where the two touch:

- **Agent Switchboard:** Meta Ads, Voice AI and Email appear as disabled tiles marked "not part of this prototype". In production they are Month 2 (Meta Ads is #4 for the QSR partner).
- **The "AI: 76%" badge (cut)** never appears. The header shows the Autonomy Rate computed live from the action log.
- **Approved facts** in the prototype are labelled illustrative until the financial model (Task 5) supplies approved figures; that stands in for #3.
- **Won / Lost** buttons in the prototype are the thin edge of #4.
- The donut, benchmarks, AI insights and Readiness Score belong to prototypes A and C, which were not built (D-10), so none of the cut features is shown as if it were live.

The draft R3 flag triggers (A1–A8, used in prototype B) cover only #1 and #2, so Task 3's scope matches this ranking.
