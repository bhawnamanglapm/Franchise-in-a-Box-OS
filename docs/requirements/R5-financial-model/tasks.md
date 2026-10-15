# R5: Financial Model: detailed tasks

Total estimate: **2 h** (block B, after R2).

| # | Task | Output | Est. | Owner | Depends on |
|---|---|---|---|---|---|
| T5.01 | Research input ranges with sources (Indian café-QSR franchise disclosures, industry reports); flag any number that can't be verified | Input table with sources | 20 m | Claude drafts, you verify | A2 |
| T5.02 | Create the Sheet with 7 tabs (Summary, Assumptions, P&L_Y1, Payback, Sensitivity, Scale100x_Rev, Checks) | Skeleton | 5 m | You | — |
| T5.03 | Fill the Assumptions tab: value, unit, range, source, A-ID; blue font for inputs | F5.2 | 15 m | You | T5.01 |
| T5.04 | Build the scenario selector (₹6L/8L/10L) | F5.3 | 5 m | You | T5.03 |
| T5.05 | Build P&L_Y1 M1–M12, all formulas referencing Assumptions | F5.4 | 20 m | You | T5.04 |
| T5.06 | Build Payback: investment, 36-month cash flow, cumulative, `MATCH(TRUE, cumulative>=0, 0)` | F5.5 | 15 m | You | T5.05 |
| T5.07 | Build Sensitivity: the three scenarios side by side (direct formulas, not copy-paste) | F5.6 | 10 m | You | T5.06 |
| T5.08 | Build Scale100x_Rev: Y1–Y3 by stream + portfolio multiplier | F5.7 | 10 m | You | T5.03 |
| T5.09 | Build Summary: KPIs, mini sensitivity, cumulative cash chart | F5.1, F5.10 | 10 m | You | T5.05–T5.08 |
| T5.10 | Integrity pass: run the DoD checklist; spot-check 3 calculations by hand | Checks tab green | 7 m | You + Claude | All |
| T5.11 | Share as anyone-with-link view; test in incognito; write a 3-line TL;DR for the doc | Link + TL;DR | 3 m | You | T5.10 |

## Key formulas (plain language)
- **Monthly revenue (Mn)** = steady-state revenue (selected scenario) × ramp % (Mn)
- **EBITDA (Mn)** = revenue − COGS − rent − staff − utilities − royalty − marketing fee − other opex
- **Initial investment** = capex + franchise fee + working capital
- **Cumulative cash (Mn)** = −initial investment + Σ EBITDA (M1..Mn)
- **Payback month** = first n where cumulative cash ≥ 0 (or "> 36 months" if never)
- **Scale100x revenue (year)** = setup fee (Y1 only) + retainer × 12 + success fee × outlets signed + royalty share × network revenue
