# Assumptions register and decision log

All assumptions are stated openly in the submission. IDs are cited wherever an assumption drives a number or a decision.

## Assumptions

| ID | Area | Assumption | Basis | Used in |
|---|---|---|---|---|
| A1 | Business model | Scale100x earns a one-time setup fee, a monthly retainer, and a success fee per franchisee signed. Values are editable inputs. | Standard consultancy structure. Scale100x's pricing is **not public** (only job postings found). | R1, R5 |
| A2 | FreshBrew | A café-QSR outlet of about 400–700 sq ft in Tier 1/2 Indian cities. Every input gets a range and a source in R5. | The brief gives no inputs | R5 |
| A3 | Sensitivity | ₹6L / ₹8L / ₹10L = **monthly gross sales per outlet**; base case ₹8L | ₹6L a year (about ₹16k a day) can't sustain a staffed QSR | R5 |
| A4 | Task 5 scope | Scale100x 3-year revenue from the FreshBrew engagement as the main view, plus a small portfolio scenario | Confirmed (D-02) | R5 |
| A5 | 76% metric | Undefined in the brief. Computed three ways. Proposed **Autonomy Rate**: time-weighted share of funnel work completed by AI with no human edit. | Brief leaves it open | R1, R2 |
| A6 | Users | Consultants (main operators), brand founders (portal and reports), prospects (WhatsApp, voice, ads, email only) | Inferred from module descriptions | R1, R2 |
| A7 | Capacity | 2 full-stack engineers + 1 designer + PM, using AI tools, building on React + Supabase from close to scratch | Brief gives no team size | R1, R4 |
| A8 | Task 4 unit | A "feature" is a sub-capability inside a module, not a whole module | Makes Task 4 different from 1a | R4 |
| A9 | Task 6B framing | Should Scale100x take on EV two-wheeler servicing brands as a franchise category, and where should those brands open first? | Confirmed (D-03) | R6 |
| A10 | High-value | A deal at contract or payment stage, or a qualified lead whose stated investment covers the full franchise investment | The brief's "high-value actions" is undefined | R3 |
| A11 | Prototype | Front end with realistic mock data and stateful interactions. No real WhatsApp or LLM connection, except the optional stretch goal. | 2–3 h build budget | R2 |
| A12 | Compliance | DPDP Act 2023 consent and WhatsApp template rules apply. The agent never guarantees ROI. DPDP Rules status to be verified before citing. | Absent from the brief | R3, R6 |
| A13 | Sources | Only Scale100x's services list and founder names are publicly sourced (job postings) | Web search, Oct 2026 | All |
| A14 | Tools | Candidate's real tools: Claude, Claude Code, Lovable, Google Sheets | Confirmed by candidate | R2, R5, R7 |
| A15 | Hosting | A `*.lovable.app` URL or a Vercel deploy both satisfy "Vercel / Netlify / etc." | Brief wording | R2 |
| A16 | Doc | Google Doc shared as "anyone with the link can view", plus PDF export | Submission rules | R8 |
| A17 | Prototype logic | Deterministic trigger engine and scripted AI replies. Optional 30-minute live LLM stretch goal. | Confirmed (D-01) | R2 |
| A18 | 1c feature | Conversation Takeover chosen over the AI Readiness Score | Takeover is harder to build; Readiness is harder to define | R1, R2 |
| A19 | Volumes | Per brand per month: 500 leads, about 150 voice calls, 60 takeovers, 20 discovery calls, 3 signed | Illustrative and internally consistent, **not sourced** | R1 |
| A20 | Weights | Standard minutes and 1–5 value weights per action are candidate estimates, to be calibrated in the pilot | Estimate | R1 |
| A21 | Pilot | 30-day release goes to 2 existing brands | Scale100x already has 20+ onboarded brands | R1, R4 |
| A22 | SLA | Flag must be claimed within 10 business minutes; business hours 09:00–21:00 IST | Product choice, not research (pending D-06) | R1, R2, R3 |
| A23 | WhatsApp rules | 24-hour customer-service window and a 4,096-character text limit. Error code 131047 to be verified against current Meta docs. | Meta platform rules | R1, R2 |
| A24 | QSR variation | "Focused on lead generation" means the partner judges Scale100x on qualified leads delivered, not on closures | Interpretation of the brief | R4 |
| A25 | Confidence | Low confidence = model/classifier confidence below threshold OR no matching approved fact found | Design choice | R3 |
| A26 | Mock data | FreshBrew (from the brief) + one fictional gym brand; no real company names | Avoid implying real clients | R2 |
| A27 | Roll-out | FreshBrew outlets signed per month is an input with a ramp; it isn't the platform-wide 100+/yr claim | Brief gives no pace | R5 |
| A28 | Tax | Franchisee payback is pre-tax; revenue excludes GST (stated) | Simplicity, stated | R5 |
| A29 | CRM | 6A targets the platform's HITL CRM (module 5); Google Sheets as an interim sink | Brief architecture | R6 |

## Decision log

| ID | Decision | Status | Date |
|---|---|---|---|
| D-01 | Task 2 = Option B (WhatsApp AI Agent Panel), built in Lovable with GitHub sync; scripted replies plus a stretch LLM goal | Confirmed | Day 0 |
| D-02 | Task 5 = FreshBrew main view plus portfolio scenario | Confirmed | Day 0 |
| D-03 | Task 6B framed as Scale100x's go/no-go decision on the category | Confirmed | Day 0 |
| D-04 | 30-day order: Sales Agent + CRM slice → thin ROI → thin Onboarding → Collateral deferred | **Proposed, awaiting confirmation** | — |
| D-05 | Badge reframed as "AI: 76% of work \| Humans: 100% of closes", computed live | **Proposed, awaiting confirmation** | — |
| D-06 | Takeover SLA of 10 business minutes, 09:00–21:00 IST | **Proposed, awaiting confirmation** | — |
| D-07 | 72-hour clock start time (sets the submit time) | **Open, needs input** | — |
| D-08 | Default LLM for the WhatsApp agent | Open, decided in R3 | — |
| D-09 | Final Task 4 top 4 | Open, decided in R4 | — |
