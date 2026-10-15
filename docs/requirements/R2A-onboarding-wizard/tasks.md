# R2A: Onboarding Wizard: detailed tasks

Total estimate: **2 h** (Build block, third of the three prototypes, after R2C).

| # | Task | Output | Est. | Owner | Depends on |
|---|---|---|---|---|---|
| T2A.01 | Decide D-11 (what the revenue split splits) while writing the build brief; log the choice and the reason | Decision log updated | 2 m | You | — |
| T2A.02 | Write the one-page build brief: steps, fields and validation rules, file rules, donut channels, Readiness rubric (rules + thresholds), sample data | Build brief | 15 m | Claude drafts, you edit | T2A.01, R1 1b, R5 inputs |
| T2A.03 | Write the Lovable prompt sequence: shared shell → stepper + Step 1 → Step 2 uploads → Step 3 donut → Step 4 score → review + submit → states + polish | Prompt pack | 10 m | Claude | T2A.02 |
| T2A.04 | Create the Lovable project; connect GitHub; open `build-log-template.md` | Project + log | 5 m | You | — |
| T2A.05 | Prompt 1: shared shell, tokens, nav, badge placeholder. **Check the hex values.** | F2A.01 | 10 m | You | T2A.04 |
| T2A.06 | Prompt 2: stepper + Step 1 form with validation + sample-data buttons | F2A.02, F2A.03, F2A.11 | 15 m | You | T2A.05 |
| T2A.07 | Prompt 3: Step 2 uploads (type, size, empty checks; progress; remove / replace) + P&L extraction (CSV real, others mocked + review tick) | F2A.04, F2A.05 | 20 m | You | T2A.06 |
| T2A.08 | Prompt 4: Step 3 donut with inputs, sliders and the 100% rule | F2A.06 | 15 m | You | T2A.07 |
| T2A.09 | Prompt 5: Step 4 Readiness Score as a pure function of the inputs; RAG sub-score cards with rule, value, threshold, how-to-improve | F2A.07, F2A.08 | 20 m | You | T2A.08 |
| T2A.10 | Prompt 6: review & submit, success screen, JSON export, draft autosave | F2A.09, F2A.10, F2A.12 | 10 m | You | T2A.09 |
| T2A.11 | Prompt 7: empty / loading / error states, computed badge, 375 px layout, accessibility, footer links | F2A.13–F2A.17 | 10 m | You | T2A.10 |
| T2A.12 | Log unbuilt items into "1 more day" | Unbuilt list | — | You | — |
| T2A.13 | Stretch, if time allows: live LLM PDF extraction via an edge function | F2A.18 | 30 m | You | T2A.07 + R3 |
| T2A.14 | Deploy (Lovable publish or Vercel); confirm the public URL | F2A.W1 | 5 m | You | T2A.12 |
| T2A.15 | Run the 5-point test script in incognito (desktop + 375 px) | Test log | 10 m | You | T2A.14 |
| T2A.16 | Fix any test blocker; redeploy once | Green test | 10 m | You | T2A.15 |
| T2A.17 | Write up: prompts, what AI got wrong, manual fixes, 1 more day (from the log only) | F2A.W2–W5 | 10 m | You + Claude | T2A.15 |
| T2A.18 | Take 3 screenshots for the doc and PDF backup | F2A.W6 | 5 m | You | T2A.16 |

## 5-point test script (draft)
1. Load the URL in incognito. The dark theme renders with the correct hex values; Step 1 shows and Next is disabled.
2. Click Next with required fields empty. Expected: inline errors, no navigation. Click "Load FreshBrew sample". Expected: all fields filled, Next enabled.
3. Upload a `.exe` and an over-limit file. Expected: both rejected with specific messages. Upload a valid PDF deck and the CSV P&L. Expected: progress, then channel revenue filled and tagged "please review"; Next blocked until "Reviewed" is ticked.
4. In Step 3, set channels that total 90%. Expected: error, Next blocked. Fix to 100%. Expected: donut updates.
5. In Step 4, the score shows 5 RAG sub-scores with reasons. Go back, change the royalty or a channel share. Expected: the affected sub-score changes. Refresh mid-flow. Expected: "Resume draft" restores the state. Then check the layout at 375 px.
