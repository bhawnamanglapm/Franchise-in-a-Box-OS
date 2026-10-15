# R5: Financial Model: definition of done

## Coverage (the brief)
- [ ] Monthly P&L for Year 1 (M1–M12)
- [ ] Payback period, in months
- [ ] Scale100x 3-year revenue (Y1–Y3), shown separately from franchisee economics
- [ ] Sensitivity at ₹6L / ₹8L / ₹10L
- [ ] Assumptions tab

## Integrity
- [ ] Every input lives only on the Assumptions tab
- [ ] No hardcoded numbers inside formulas (except 0/1 constants and month index)
- [ ] Every input has a source + date, or is labelled "estimate" with an A-ID
- [ ] The ₹6L/8L/10L interpretation (monthly gross sales per outlet) is stated on Summary and Assumptions
- [ ] Payback month equals the month where the cumulative cash curve crosses 0 (checked against the chart)
- [ ] Initial investment includes capex + franchise fee + working capital
- [ ] P&L line items sum to EBITDA in every month (Checks tab TRUE)
- [ ] Scale100x revenue streams sum to the yearly totals (Checks tab TRUE)
- [ ] 3 calculations spot-checked by hand; noted in Checks
- [ ] GST/tax treatment stated (A28)

## Usability
- [ ] The Summary tab answers "payback, profit, Scale100x revenue" in one view
- [ ] Inputs in blue, calculations in black; units on every row
- [ ] Shared as "anyone with the link can view"; opens in incognito
- [ ] 3-line TL;DR in the written doc, with the link

## Hand-off
- [ ] Approved base-case figures handed to R2B (investment, fee, royalty, payback range), replacing its illustrative facts (A32)
