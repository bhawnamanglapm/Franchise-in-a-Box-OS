# R2C: ROI Dashboard: definition of done

## Product
- [ ] Public URL loads in incognito with no login
- [ ] Design tokens match the brief exactly: `#0A0A0F`, `#111118`, `#2563EB`, `#10B981`, `#F59E0B`; Inter + mono for numbers
- [ ] All 4 brief elements are present: Franchise Model Card, 3-year projections, benchmark comparisons (India + US), AI insights
- [ ] **Dashboard numbers equal the R5 Sheet for the same inputs: payback month, Y1 EBITDA, Y3 cumulative cash (spot-check 3) (A32)**
- [ ] Payback uses the same definition as R5 (first month cumulative cash ≥ 0, including capex + franchise fee + working capital)
- [ ] ₹6L/8L/10L toggle and every assumption recalculate card, chart, table and insights live
- [ ] Invalid inputs blocked; "no payback within 36 months" handled without a broken chart
- [ ] Every benchmark value shows source + date, or is labelled "illustrative" (A33). No invented numbers.
- [ ] Every insight shows the rule that fired and its values; labelled rule-based v0
- [ ] Approve + export produces an approved-facts JSON with a timestamp
- [ ] Sample data uses FreshBrew + one fictional brand only; ₹ values throughout
- [ ] Usable at 375 px width
- [ ] All 5 test-script steps pass

## Write-up
- [ ] Exact prompts listed in order (copied from the log, unedited)
- [ ] ≥ 3 specific "what AI got wrong" entries (component + symptom + cause)
- [ ] ≥ 3 manual fixes, each linked to a wrong-entry
- [ ] "1 more day" list maps to feature IDs not yet built
- [ ] Mocked vs real is stated openly: client-side engine, no backend, rule-based insights (A11)
- [ ] Link to the R5 Sheet is stated as the source of truth (A32)
- [ ] If the stretch LLM was built: the model used is stated and matches R3, or the mismatch is explained

## Hygiene
- [ ] Code synced to GitHub
- [ ] No API keys in client code
- [ ] Approved facts JSON handed to R2B (T2B.18)
- [ ] Footer links to the Option A and Option B URLs work
- [ ] No redeploy after submission
