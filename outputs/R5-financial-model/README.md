# Task 5: FreshBrew Financial Model

**Live model (Google Sheet):** https://docs.google.com/spreadsheets/d/1hvPhC2OA14JhPUtjZFc1rd907xJMpPJtFsQDe7I6YeA/edit
**Offline copy:** [FreshBrew-Financial-Model.xlsx](FreshBrew-Financial-Model.xlsx) (same formulas; rebuilt by [build_model.py](build_model.py))

## TL;DR

1. At ₹8 lakh of monthly sales, a FreshBrew outlet costs **₹32 lakh** to open and pays back in **month 29**. At ₹10 lakh it pays back in month 17; at ₹6 lakh it does not pay back within 3 years.
2. The outlet makes money only above about **₹5.5 lakh a month** in sales. ₹6 lakh is barely above that line, so the brand should qualify locations on expected sales, not on fee income.
3. From one FreshBrew-like brand, Scale100x would earn about **₹203 lakh over 3 years** (₹59L, ₹72L, ₹72L). Most of it is success fees on outlets signed, so that is the number to watch.

Every figure below is a model output from labelled inputs. Scale100x pricing is not public, so all Scale100x fees are estimates you can change on the Assumptions tab.

## How to read it

- **₹6L / ₹8L / ₹10L** means steady-state **monthly gross sales per outlet, excluding GST** (assumption A3). The model ramps up to that level over months 1–6 (60%, 70%, 80%, 90%, 95%, 100%).
- Money is in **₹ lakh** (₹1 lakh = ₹100,000). Payback is **pre-tax** (A28).
- **Blue cells** on the Assumptions tab are inputs. Everything else is a formula. Change the scenario dropdown (6 / 8 / 10) and every tab updates.

| Tab | What it answers |
|---|---|
| Summary | Payback, profit and Scale100x revenue in one view, with two charts |
| Assumptions | Every input, its range, its source or "estimate", and its assumption ID |
| P&L_Y1 | Monthly P&L for months 1–12, plus a Year 1 total |
| Payback | Cumulative cash for 36 months, for the selected case and for ₹6L / ₹8L / ₹10L |
| Sensitivity | The three sales cases side by side |
| Scale100x_Rev | Scale100x's own revenue, Years 1–3, kept separate from the franchisee's numbers |
| Checks | 10 automatic checks plus 3 hand spot-checks |

## Results

**Franchisee (one outlet)**

| | ₹6L / month | **₹8L / month (base)** | ₹10L / month |
|---|---|---|---|
| Steady-state EBITDA per month | ₹0.24L | **₹1.29L** | ₹2.34L |
| EBITDA margin | 4.1% | **16.2%** | 23.4% |
| Year 1 EBITDA | −₹0.37L | **₹11.10L** | ₹22.58L |
| Payback | not within 36 months | **month 29** | month 17 |
| Cumulative cash at month 36 | −₹26.52L | **₹10.11L** | ₹46.74L |

Base case: investment ₹32L (fit-out and equipment ₹24L + franchise fee ₹6L + working capital ₹2L). Year 1 sales ₹87.6L. Variable costs 47.6% of sales; fixed costs ₹2.90L a month; break-even sales ₹5.53L a month.

**Scale100x (one brand)**

| | Year 1 | Year 2 | Year 3 | 3 years |
|---|---|---|---|---|
| Revenue (₹ lakh) | 59 | 72 | 72 | **203** |
| Outlets signed | 24 | 36 | 36 | 96 |

Portfolio view (5 brands like FreshBrew, A4): about ₹1,015 lakh over 3 years. This is a scenario, not a forecast.

## Inputs and where they come from

All four sources are third-party listings or trade articles, not franchisor disclosures. All were accessed 17 Oct 2026.

| ID | Source | Used for |
|---|---|---|
| S1 | FranchiseBazar, [Top Cafe Franchises Between 30 To 50 Lakhs in India 2026](https://franchisebazar.com/blog/top-cafe-franchises-between-30-to-50-lakhs-in-india-2026) (24 Jun 2026) | Investment range, fee (₹5–10L), royalty (5–8%), outlet size |
| S2 | FranchiseBazar, [Best Chai Franchise Business in India](https://www.franchisebazar.com/blog/best-chai-franchise-business-in-india-costs-roi-opportunities) (Aug 2026) | Lower-end investment (₹14–30L), royalty (4–6%) |
| S3 | Restaurant India, [Can Restaurants Stay Profitable With Rising Rentals?](https://www.restaurantindia.in/article/can-restaurants-stay-profitable-with-rising-rentals.16725) (14 Jul 2026) | Cost ratios: rent 10–12%, food 28–35%, staff 18–25%, utilities 4–7%, marketing 2–5% |
| S4 | Petpooja, [Free Restaurant P&L Template](https://blog.petpooja.com/templates-checklist/restaurant-pl-statement-template/) (updated May 2026) | Food and labour ranges, delivery-app commission 22–25%. The page calls its ratios "directional" |

| Input | Base value | Range tested | Basis |
|---|---|---|---|
| Monthly sales at steady state | ₹8L | ₹6–10L | Brief (A3) |
| Outlet size | 600 sq ft | 400–700 | S1 (A2) |
| Fit-out and equipment | ₹24L | ₹15–40L | **Estimate**, derived from S1/S2 totals less fee and working capital |
| Franchise fee | ₹6L | ₹5–10L | S1 |
| Working capital | ₹2L | ₹1–4L | **Estimate** |
| Ramp-up, months 1–6 | 60% → 100% | — | **Estimate** |
| Food, beverage, packaging | 30% of sales | 28–35% | S3, S4 |
| Delivery share of sales | 30% | 20–40% | **Estimate** |
| Delivery-app commission | 22% of delivery sales | 22–25% | S4 |
| Royalty | 6% of sales | 4–8% | S1, S2 |
| Marketing fund | 2% of sales | 2–5% | S3 |
| Other variable costs | 3% of sales | 2–5% | **Estimate** |
| Rent | ₹0.90L / month | — | 11% of ₹8L, inside S3's 10–12% |
| Staff | ₹1.60L / month | — | 20% of ₹8L, inside S3/S4 ranges |
| Utilities | ₹0.40L / month | — | 5% of ₹8L, inside S3's 4–7% |
| Scale100x setup fee | ₹5L, Year 1 | ₹2–10L | **Estimate**, pricing not public (A1) |
| Scale100x retainer | ₹1.5L / month | ₹1–3L | **Estimate** (A1) |
| Scale100x success fee | 25% of franchise fee per outlet signed | 15–50% | **Estimate** (A1) |
| Royalty share to Scale100x | 0% (off) | 0–20% | **Estimate** (A1) |
| Outlets signed, Y1 / Y2 / Y3 | 24 / 36 / 36 | — | **Estimate**, about 3 a month (A19, A27) |

Rent, staff and utilities are fixed rupee amounts, not percentages, so a weaker outlet carries the same fixed costs. That is why ₹6L performs so much worse than ₹8L.

## How the numbers were checked

- **Google Sheets recalculated the model itself.** Its results match an independent Python calculation (`python build_model.py --expect`) on every figure in the Results tables.
- **Checks tab:** all 10 automatic checks show TRUE, and "All checks pass" is TRUE. They include: P&L lines sum to EBITDA every month; investment = fit-out + fee + working capital; payback month is the first month where cumulative cash turns positive; Scale100x streams sum to the yearly totals; Year 1 EBITDA from the P&L equals Year 1 EBITDA from the Payback tab (two separate routes).
- **3 hand spot-checks**, worked outside the sheet and compared on the Checks tab:
  1. Month-1 sales = ₹8L × 60% = ₹4.80L
  2. Steady-state monthly EBITDA = ₹8L × (1 − 47.6%) − ₹2.90L = ₹1.292L
  3. Scale100x Year 1 revenue = ₹5L setup + 12 × ₹1.5L retainer + 24 outlets × (25% × ₹6L) = ₹59L
- **Scenario switch tested in the Sheet:** setting the dropdown to 10 gives payback in month 17 with all checks still TRUE. It was set back to 8.

## Rebuild

```bash
pip install openpyxl
python build_model.py            # writes FreshBrew-Financial-Model.xlsx
python build_model.py --expect   # prints the independent Python results to compare
```

The Google Sheet was made by uploading this .xlsx to Google Drive (converted to Sheets). Charts and the scenario dropdown carried over.

## Definition of done

| Item | Status |
|---|---|
| Monthly P&L Year 1; payback; Scale100x 3-year revenue (separate); ₹6L/8L/10L sensitivity; Assumptions tab | Done |
| Inputs only on Assumptions; no hard-coded numbers in formulas | Done (the Checks tab notes the few constants: month index, 0/1) |
| Every input sourced and dated, or labelled estimate with an assumption ID | Done |
| ₹6L/8L/10L meaning stated on Summary and Assumptions | Done |
| Payback month matches the cumulative-cash curve | Done (automatic check) |
| Investment = fit-out + fee + working capital | Done (automatic check) |
| Checks tab all TRUE; 3 hand spot-checks | Done |
| GST and tax treatment stated (A28) | Done: ex-GST sales, pre-tax payback |
| Summary answers payback, profit, Scale100x revenue in one view; blue inputs; units on every row | Done |
| Shared as "anyone with the link can view", opens in incognito | **Owner action.** The Sheet is private to the owner until they change sharing and test it in an incognito window |
| 3-line TL;DR with the link | Done (above; R8 copies it into the submission doc) |
| Base-case figures handed to the R2B prototype (A32) | See [R2B write-up](../R2B-whatsapp-agent-panel/README.md), task T2B.18 |

## Limits

- No franchisor disclosure for FreshBrew exists; the brief gives none. Inputs are ranges from comparable café and chai brands.
- No taxes, depreciation, loan interest or sales growth after ramp-up are modelled.
- Scale100x's real pricing is unknown. Every Scale100x fee here is an editable estimate.
