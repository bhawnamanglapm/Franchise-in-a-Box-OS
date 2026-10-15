# R5: Financial Model: feature list (sheet structure)

| ID | Tab / feature | Contents | MoSCoW |
|---|---|---|---|
| F5.1 | **Summary** (founder view) | 6 KPIs: payback (months), Y1 franchisee EBITDA, steady-state monthly EBITDA margin, Scale100x revenue Y1/Y2/Y3, outlets signed; a sensitivity mini-table; a cumulative cash chart; a "how to use" note | M |
| F5.2 | **Assumptions** | Every input, in one place: value, unit, low/base/high, source + date, A-ID; inputs in blue font, calculated cells in black | M |
| F5.3 | Scenario selector | Dropdown (₹6L / ₹8L / ₹10L) driving the P&L | M |
| F5.4 | **Monthly P&L, Year 1** | M1–M12: revenue (ramp % × steady-state), COGS, gross margin, rent, staff, utilities, marketing fee, royalty, other opex, EBITDA, cumulative cash | M |
| F5.5 | **Payback** | Initial investment (capex + franchise fee + working capital), monthly cash flow over 36 months, cumulative, payback month via `MATCH`; formula shown in plain language | M |
| F5.6 | **Sensitivity** | Side-by-side ₹6L/8L/10L: Y1 revenue, EBITDA, margin %, payback months. Optional: COGS % or rent ± sensitivity | M |
| F5.7 | **Scale100x 3-Year Revenue** | Per year: outlets signed, setup fee, retainer, success fees, optional royalty share → total; portfolio multiplier (N brands) | M |
| F5.8 | Checks tab | Reconciliation flags (TRUE/FALSE): totals tie out, payback = first cumulative ≥ 0, no hardcodes (manual tick) | S |
| F5.9 | `AI_Human_Split` tab | R1 1b calculation (37 actions) | S |
| F5.10 | Charts | Cumulative cash curve (payback crossing visible); Scale100x revenue stacked by stream | S |
| F5.11 | Named ranges | e.g. `Royalty_Pct`, `Capex`, so formulas read plainly | C |

## Inputs to source (values set in Phase 6, never invented)

| Input | Unit | Needs |
|---|---|---|
| Capex per outlet (fit-out, equipment) | ₹ | Range + source |
| Franchise fee (one-time) | ₹ | Range + source |
| Royalty | % of revenue | Range + source |
| Marketing / brand fund fee | % of revenue | Range + source |
| Rent | ₹/month or % of revenue | Range + source |
| Staff count × cost | ₹/month | Range + source |
| COGS | % of revenue | Range + source |
| Utilities + other opex | ₹/month | Range + source |
| Ramp-up curve | % of steady state, M1–M6 | Stated estimate |
| Working capital | ₹ | Stated estimate |
| Scale100x setup fee, retainer, success fee | ₹ | A1 editable estimate (Scale100x pricing isn't public) |
| FreshBrew outlets signed per month | count | A27 |
