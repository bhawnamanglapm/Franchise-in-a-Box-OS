# R2A: Onboarding Wizard: definition of done

## Product
- [ ] Public URL loads in incognito with no login
- [ ] Design tokens match the brief exactly: `#0A0A0F`, `#111118`, `#2563EB`, `#10B981`, `#F59E0B`; Inter + mono for data
- [ ] All 4 brief elements are present: brand details, file uploads (deck + P&L), revenue split donut, AI Readiness Score with RAG sub-scores
- [ ] Next is blocked on invalid steps; errors appear next to the field
- [ ] Uploads reject wrong type, empty and over-limit files with specific messages
- [ ] The donut must total 100% before continuing
- [ ] The Readiness Score is computed from the inputs (not hardcoded); every sub-score shows its rule, value and threshold; it's labelled rule-based v0 (A31)
- [ ] Changing an input changes the affected sub-score (test step 5)
- [ ] The draft survives a page refresh
- [ ] Sample data uses FreshBrew + one fictional brand only; ₹ values throughout
- [ ] Usable at 375 px width
- [ ] All 5 test-script steps pass

## Write-up
- [ ] Exact prompts listed in order (copied from the log, unedited)
- [ ] ≥ 3 specific "what AI got wrong" entries (component + symptom + cause)
- [ ] ≥ 3 manual fixes, each linked to a wrong-entry
- [ ] "1 more day" list maps to feature IDs not yet built
- [ ] Mocked vs real is stated openly: no storage, mocked XLSX/PDF extraction (A11)
- [ ] The revenue-split interpretation (A30 / D-11) and the rubric thresholds (A31) are stated
- [ ] If the stretch LLM was built: the model used is stated and matches R3, or the mismatch is explained

## Hygiene
- [ ] Code synced to GitHub
- [ ] No API keys in client code
- [ ] Footer links to the Option B and Option C URLs work
- [ ] No redeploy after submission
