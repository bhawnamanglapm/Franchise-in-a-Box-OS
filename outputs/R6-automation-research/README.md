# Task 6: Automation + Market Research

| Part | File |
|---|---|
| 6A Lead-flow automation (Meta Ads → WhatsApp → CRM → Consultant) | [task6a-lead-flow.md](task6a-lead-flow.md) |
| 6B EV two-wheeler servicing market research | [task6b-ev-servicing.md](task6b-ev-servicing.md) |

## TL;DR, 6A

A new Meta lead gets an approved WhatsApp template within 5 minutes, the Task 3 AI agent qualifies it, and a consultant steps in only at the 8 human-takeover triggers. Tools: Meta Lead Ads → Make → WhatsApp Business Platform → the platform CRM (Google Sheets until it exists). Estimated time saved: **about 274 hours a month per brand, roughly 1.7 consultants**, from Task 1's action table. Every minute figure is an estimate to measure in the pilot. Main risk: WhatsApp template approval and DPDP consent; mitigated by approving templates before launch and storing consent with every lead.

**Designed, not built.** I have not run Make or Zapier in production (A14). The trigger rules and takeover flow are real code in the [Task 2 prototype](../R2B-whatsapp-agent-panel/README.md), with Meta, WhatsApp and the CRM simulated. The same lead flow also exists as a [practice lab](../../practice/lead-flow-automation/README.md): plain Node code and 3 n8n workflows run against fake Meta, WhatsApp and HubSpot APIs, with 23 passing tests. It has not been connected to real accounts.

## TL;DR, 6B

**Go, with conditions.** About 14 lakh electric two-wheelers were sold in FY2026 (+22%), and about 42 lakh over four years. Servicing is worth roughly ₹1,500–2,000 crore a year today (one market report plus my own cross-check; both estimates), and owners complain about service. Start with one multi-brand EV service brand in **Bengaluru**, then Pune and Chennai. Main risk: OEMs control warranty, diagnostics, batteries and parts. Kill criteria are in the file.

## How this was checked

- Every external fact has a link and an access date (17 Oct 2026). Estimates are labelled as estimates.
- 6A's checkpoints are the same triggers as [Task 3](../R3-ai-agent-design/task3-ai-agent-design.md) and the prototype's rules engine. The deal-value threshold uses the ₹32L figure from [Task 5](../R5-financial-model/README.md).
- 6A's time-saved maths uses the rows and volumes in [Task 1's action table](../R1-product-thinking/ai-human-split.csv) (A19, A20, A35).

## Open items

- The lead-flow practice lab was merged on 17 Oct 2026 (D-13). Next step: point it at a Meta test page and a WhatsApp test number.
- City-level EV 2W registrations (Vahan) would firm up the 6B city ranking.
- The DPDP phase dates should be checked against the Gazette notification.
