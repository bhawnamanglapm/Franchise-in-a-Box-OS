# R2C: ROI Dashboard: detailed tasks

Total estimate: **2.25 h** (Build block, second of the three prototypes, after R5).

| # | Task | Output | Est. | Owner | Depends on |
|---|---|---|---|---|---|
| T2C.01 | Export R5 base-case inputs and formula list (inputs, ramp curve, payback definition) into the build brief | Input + formula sheet | 10 m | Claude drafts, you check | R5 done |
| T2C.02 | Source India + US benchmarks (3–5 metrics). Record source + date; mark anything unsourced "illustrative" (A33) | Benchmark table | 15 m | You + Claude | — |
| T2C.03 | Write the insight rules (5–8): condition, tag, message, suggested action | Rule table | 10 m | Claude drafts, you edit | T2C.01 |
| T2C.04 | Write the Lovable prompt sequence: shared shell → engine + card → assumptions + toggle → chart → sensitivity → benchmarks → insights → approve/export + states | Prompt pack | 10 m | Claude | T2C.01–T2C.03 |
| T2C.05 | Create the Lovable project; connect GitHub; open `build-log-template.md` | Project + log | 5 m | You | — |
| T2C.06 | Prompt 1: shared shell, tokens, nav, badge placeholder. **Check the hex values.** | F2C.01 | 10 m | You | T2C.05 |
| T2C.07 | Prompt 2: `computeModel` + Model Card + presets. **Check 3 outputs against R5 before moving on.** | F2C.02, F2C.03, F2C.13 | 25 m | You | T2C.06 |
| T2C.08 | Prompt 3: assumptions panel, validation, ₹6L/8L/10L toggle, reset | F2C.04, F2C.05, F2C.10 | 15 m | You | T2C.07 |
| T2C.09 | Prompt 4: 36-month chart with payback marker; sensitivity table | F2C.06, F2C.07 | 20 m | You | T2C.08 |
| T2C.10 | Prompt 5: India + US benchmark tabs with source + date | F2C.08 | 10 m | You | T2C.02, T2C.09 |
| T2C.11 | Prompt 6: rule-based insights with the rule shown | F2C.09 | 15 m | You | T2C.03, T2C.09 |
| T2C.12 | Prompt 7: Approve + export approved facts, R2A JSON import, empty/error states, badge, 375 px, accessibility, footer + Sheet link | F2C.11, F2C.12, F2C.14–F2C.19 | 15 m | You | T2C.11 |
| T2C.13 | Log unbuilt items into "1 more day" | Unbuilt list | — | You | — |
| T2C.14 | Stretch, if time allows: LLM insight wording via an edge function | F2C.20 | 30 m | You | T2C.11 + R3 |
| T2C.15 | Deploy (Lovable publish or Vercel); confirm the public URL | F2C.W1 | 5 m | You | T2C.13 |
| T2C.16 | Run the 5-point test script in incognito (desktop + 375 px) | Test log | 10 m | You | T2C.15 |
| T2C.17 | Fix any test blocker; redeploy once | Green test | 10 m | You | T2C.16 |
| T2C.18 | Hand off the approved facts JSON to R2B (T2B.18) | Facts file | 5 m | You | T2C.17 |
| T2C.19 | Write up: prompts, what AI got wrong, manual fixes, 1 more day (from the log only) | F2C.W2–W5 | 10 m | You + Claude | T2C.16 |
| T2C.20 | Take 3 screenshots for the doc and PDF backup | F2C.W6 | 5 m | You | T2C.17 |

## 5-point test script (draft)
1. Load the URL in incognito. The dark theme renders with the correct hex values; the FreshBrew card shows with the ₹8L scenario selected.
2. Compare payback month, Y1 EBITDA and Y3 cumulative cash with the R5 Sheet at the same inputs. Expected: all 3 match (rounding to ₹1,000).
3. Switch to ₹6L, then ₹10L. Expected: card, chart, payback marker and sensitivity highlight all update; payback moves in the right direction.
4. Set royalty to 150% and capex to −1. Expected: both blocked with messages. Set revenue so low it never pays back. Expected: "No payback within 36 months" state, no broken chart.
5. Open the benchmark tabs. Every value shows a source + date or the "illustrative" label. Click Approve, then Export. Expected: JSON with the approved values and a timestamp. Then check the layout at 375 px.
