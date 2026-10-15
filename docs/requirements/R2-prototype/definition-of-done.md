# R2: Prototype: definition of done

## Product
- [ ] Public URL loads in incognito with no login
- [ ] Design tokens match the brief exactly: `#0A0A0F`, `#111118`, `#2563EB`, `#10B981`, `#F59E0B`; Inter + mono for data
- [ ] The autonomy badge is computed from data, not hardcoded
- [ ] Simulating a message runs the R3 rules and changes the state visibly, with "Why flagged" reasons
- [ ] State machine: Take over, Claim, Return (with a required reason) and Opt-out work as specified in 1c
- [ ] The AI does not reply while HUMAN_ACTIVE (test step 3)
- [ ] Mock data includes Hinglish and ₹ values, and no real company names except FreshBrew from the brief
- [ ] Usable at 375 px width
- [ ] All 5 test-script steps pass

## Write-up
- [ ] Exact prompts listed in order (copied from the log, unedited)
- [ ] ≥ 3 specific "what AI got wrong" entries (component + symptom + cause)
- [ ] ≥ 3 manual fixes, each linked to a wrong-entry
- [ ] "1 more day" list maps to named 1c acceptance criteria not yet met
- [ ] Mocked vs real is stated openly (A11, A17)
- [ ] If the stretch LLM was built: the model used is stated and matches R3, or the mismatch is explained

## Hygiene
- [ ] Code synced to GitHub
- [ ] No API keys in client code
- [ ] No redeploy after submission
