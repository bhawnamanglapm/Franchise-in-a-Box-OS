# Assumptions register and decision log

All assumptions are stated openly in the submission. IDs are cited wherever an assumption drives a number or a decision.

## Assumptions

| ID | Area | Assumption | Basis | Used in |
|---|---|---|---|---|
| A1 | Business model | Scale100x earns a one-time setup fee, a monthly retainer, and a success fee per franchisee signed. Values are editable inputs. | Standard consultancy structure. Scale100x's pricing is **not public** (only job postings found). | R1, R5 |
| A2 | FreshBrew | A café-QSR outlet of about 400–700 sq ft in Tier 1/2 Indian cities. Every input gets a range and a source in R5. | The brief gives no inputs | R5 |
| A3 | Sensitivity | ₹6L / ₹8L / ₹10L = **monthly gross sales per outlet**; base case ₹8L | ₹6L a year (about ₹16k a day) can't sustain a staffed QSR | R5 |
| A4 | Task 5 scope | Scale100x 3-year revenue from the FreshBrew engagement as the main view, plus a small portfolio scenario | Confirmed (D-02) | R5 |
| A5 | 76% metric | Undefined in the brief. Computed three ways. Proposed **Autonomy Rate**: time-weighted share of funnel work completed by AI with no human edit. | Brief leaves it open | R1, R2B |
| A6 | Users | Consultants (main operators), brand founders (portal and reports), prospects (WhatsApp, voice, ads, email only) | Inferred from module descriptions | R1, R2B |
| A7 | Capacity | 2 full-stack engineers + 1 designer + PM, using AI tools, building on React + Supabase from close to scratch | Brief gives no team size | R1, R4 |
| A8 | Task 4 unit | A "feature" is a sub-capability inside a module, not a whole module | Makes Task 4 different from 1a | R4 |
| A9 | Task 6B framing | Should Scale100x take on EV two-wheeler servicing brands as a franchise category, and where should those brands open first? | Confirmed (D-03) | R6 |
| A10 | High-value | A deal at contract or payment stage, or a qualified lead whose stated investment covers the full franchise investment | The brief's "high-value actions" is undefined | R3 |
| A11 | Prototype | The Task 2 prototype (B) is a front end with realistic mock data and stateful interactions; logic runs in the browser. No real WhatsApp, database (the brief's Supabase is not used), auth or LLM connection, except the optional stretch goal. Stated in the write-up. | Keeps the build focused on a working flow; stated openly | R2B |
| A12 | Compliance | DPDP Act 2023 consent and WhatsApp template rules apply. The agent never guarantees ROI. DPDP Rules status to be verified before citing. | Absent from the brief | R3, R6 |
| A13 | Sources | Only Scale100x's services list and founder names are publicly sourced (job postings) | Web search, Oct 2026 | All |
| A14 | Tools | Candidate's real tools: Claude, Claude Code, Lovable, Google Sheets | Confirmed by candidate | R2B, R5, R7 |
| A15 | Hosting | A Vercel deploy satisfies "Vercel / Netlify / etc.". The prototype gets one public URL with no login. | Brief wording | R2B |
| A16 | Doc | Google Doc shared as "anyone with the link can view", plus PDF export | Submission rules | R8 |
| A17 | Prototype logic | Every "AI" output is deterministic and explainable: B uses a rule-based trigger engine with scripted replies. An optional live-LLM stretch goal never invents numbers. | Confirmed (D-01, D-10) | R2B |
| A18 | 1c feature | Conversation Takeover chosen over the AI Readiness Score | Takeover is harder to build; Readiness is harder to define. Readiness is not prototyped (D-10). | R1, R2B |
| A19 | Volumes | Per brand per month: 500 leads, about 150 voice calls, 60 takeovers, 20 discovery calls, 3 signed | Illustrative and internally consistent, **not sourced** | R1 |
| A20 | Weights | Standard minutes and 1–5 value weights per action are candidate estimates, to be calibrated in the pilot | Estimate | R1 |
| A21 | Pilot | 30-day release goes to 2 existing brands | Scale100x already has 20+ onboarded brands | R1, R4 |
| A22 | SLA | Flag must be claimed within 10 business minutes; business hours 09:00–21:00 IST | Product choice, not research (D-06, confirmed) | R1, R2B, R3 |
| A23 | WhatsApp rules | 24-hour customer-service window; a free-form send after it fails with error 131047 (send a template instead); 4,096-character text limit. | **Verified** 15 Oct 2026 against Meta's Cloud API error-code page and text-message docs (sources in `outputs/R1-product-thinking/1c-takeover-spec.md`) | R1, R2B |
| A24 | QSR variation | "Focused on lead generation" means the partner judges Scale100x on qualified leads delivered, not on closures | Interpretation of the brief | R4 |
| A25 | Confidence | Low confidence = model/classifier confidence below threshold OR no matching approved fact found | Design choice | R3 |
| A26 | Mock data | FreshBrew (from the brief) + one fictional gym brand; no real company names | Avoid implying real clients | R2B |
| A27 | Roll-out | FreshBrew outlets signed per month is an input with a ramp; it isn't the platform-wide 100+/yr claim | Brief gives no pace | R5 |
| A28 | Tax | Franchisee payback is pre-tax; revenue excludes GST (stated) | Simplicity, stated | R5 |
| A29 | CRM | 6A targets the platform's HITL CRM (module 5); Google Sheets as an interim sink | Brief architecture | R6 |
| A30 | Revenue split | Prototype A's "revenue split" = the brand's revenue by sales channel (QSR: dine-in / takeaway / delivery apps; other categories get their own channel list). It feeds a channel-concentration sub-score. | The brief doesn't define the split. Working default; final call made while building R2A (D-11). | R2A (not built, D-10) |
| A31 | Readiness Score | Rule-based v0 rubric: 5 weighted sub-scores (unit economics, proof of concept, documentation, channel concentration, franchise terms), each Red/Amber/Green with the rule and threshold shown. Thresholds are design choices, to be calibrated on real outcomes. | The brief doesn't define the score | R2A (not built, D-10) |
| A32 | Single source of numbers | Prototype B's agent quotes only figures approved from the R5 Sheet's base case. Done 17 Oct 2026 (T2B.18): FreshBrew's investment, fee, royalty, payback and size come from the R5 base case and are tagged "from R5 model"; training/support and the fictional gym's facts stay labelled "illustrative". | Avoids two different FreshBrew numbers | R2B, R5 |
| A33 | Benchmarks | India + US benchmarks are shown only with a source and date; anything unsourced is labelled "illustrative" or left out | No benchmark data in the brief; no invented numbers | R4 (R2C not built, D-10) |
| A34 | Set-up amortisation | One-off brand set-up actions (onboarding, model, collateral) are spread over a 6-month engagement: frequency 1/6 per month in the action map | Estimate; makes per-brand-per-month hours comparable | R1 |
| A35 | Consultant capacity | One consultant has 160 productive hours a month (8 h × 20 working days) | Estimate | R1 |

## Decision log

| ID | Decision | Status | Date |
|---|---|---|---|
| D-01 | Prototype B (WhatsApp AI Agent Panel) is built by **Claude Code** (Vite + React + TypeScript + Tailwind, in `prototypes/r2b-whatsapp-agent-panel/`) and deployed to Vercel; scripted replies plus a stretch LLM goal. **Revised 15 Oct 2026:** originally Lovable with GitHub sync. Changed so the state machine and rules are unit-tested and the 9-step test is automated, and because Lovable couldn't be driven from the build session. Task 2 = Option B only (D-10). | Confirmed (revised) | 15 Oct 2026 |
| D-02 | Task 5 = FreshBrew main view plus portfolio scenario | Confirmed | Day 0 |
| D-03 | Task 6B framed as Scale100x's go/no-go decision on the category | Confirmed | Day 0 |
| D-04 | 30-day order: Sales Agent + CRM slice → thin ROI → thin Onboarding → Collateral deferred | Confirmed | 15 Oct 2026 |
| D-05 | Badge reframed as "AI: X% of work \| Humans: 100% of closes", where X is the live, audited Autonomy Rate (R1 1b) | Confirmed | 15 Oct 2026 |
| D-06 | Takeover SLA of 10 business minutes, 09:00–21:00 IST | Confirmed | 15 Oct 2026 |
| D-07 | Quality first: time estimates are for planning only, not cut-off points. Submit when R8 passes, inside the 72 h deadline. | Confirmed | Today |
| D-08 | Default LLM for the WhatsApp agent: **Claude Sonnet 5.5**, fallback **OpenAI gpt-6-sol** (second vendor). Provisional: whichever passes the 40-conversation golden set with better scores becomes the default. DeepSeek excluded on data handling (stores data in China). Prices checked 16 Oct 2026; see `outputs/R3-ai-agent-design/task3-ai-agent-design.md`. | Confirmed (provisional on eval) | 16 Oct 2026 |
| D-09 | Final Task 4 top 4: (1) WhatsApp AI Agent, (2) HITL takeover + timeline, (3) Model Card + 3-year ROI, (4) deal tracking and closure. QSR lead-gen variation: qualified-lead tracking by source (#2) and a thin Meta Ads Agent (#4) move in; Model Card + ROI and deal tracking move to Month 2; ad creatives stay Month 2 (consistent with 1a). See `outputs/R4-prioritisation/task4-prioritisation.md`. | Confirmed | 16 Oct 2026 |
| D-10 | Task 2 builds **Option B only** (WhatsApp AI Agent Panel), as the brief says "Choose ONE". **Revised 15 Oct 2026:** previously all three options. R2A and R2C stay in the repo as unbuilt plans, marked "not being built"; nothing was deleted. | Confirmed (revised) | 15 Oct 2026 |
| D-12 | Prototype B is built before R3 is final. Its trigger engine uses the R3 **draft** rules F3.A1–A9 exactly as drafted. When R3 is written, its trigger table is the single source and the engine is re-synced to it. | Confirmed | 15 Oct 2026 |
| D-11 | Prototype A's revenue split = revenue by sales channel (A30) | Not needed: R2A is not being built (D-10) | 15 Oct 2026 |
| D-13 | Merge the lead-flow practice lab (`claude/cool-galileo-d27ncr`) into main as `practice/lead-flow-automation`. It is a working build of the 6A flow against fake APIs (23/23 tests pass); it does not change the 6A claim: nothing is connected to real Meta, WhatsApp or HubSpot accounts | Done | 17 Oct 2026 |
