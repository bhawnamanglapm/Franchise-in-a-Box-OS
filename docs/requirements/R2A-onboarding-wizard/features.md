# R2A: Onboarding Wizard: feature list

MoSCoW against a **1.5-hour build estimate**. Anything not built moves to "1 more day".

## Screens and features

| ID | Feature | Description | MoSCoW | Maps to |
|---|---|---|---|---|
| F2A.01 | App shell + design tokens | Shared Prompt 1 with R2B and R2C: dark theme with the exact brief hex values; Inter + mono for numbers; left nav showing 5 modules ("Onboarding" active) | M | Brief design system |
| F2A.02 | Stepper | 4 steps + Review; progress bar; step status (done / current / error); Back and Next; Next disabled until the step is valid; click a completed step to jump back | M | Brief: 4-step flow |
| F2A.03 | Step 1: Brand details | Brand name, category (QSR / Gym / Fashion retail / EV / Two-wheeler servicing), years operating, outlets operating, cities (chips), avg monthly revenue per outlet (₹), investment per outlet (₹), franchise fee (₹), royalty (%). Inline validation: required fields, numbers > 0, royalty 0–100%. | M | Brief: brand details |
| F2A.04 | Step 2: File uploads | Two slots: pitch deck (PDF / PPTX) and P&L (CSV / XLSX / PDF). Drag-and-drop + browse; per-file progress; remove / replace. Rejects wrong type, empty files and files over the size limit with a specific message. | M | Brief: file uploads |
| F2A.05 | P&L extraction | CSV in the published template is parsed for real into channel revenue. XLSX / PDF: mocked extraction fills values tagged "AI-extracted, please review". The consultant must tick "Reviewed" to continue. | S | R1 1b (AI → human review) |
| F2A.06 | Step 3: Revenue split donut | Channel segments (A30) prefilled from the P&L or entered manually; number inputs + sliders; must total 100% (live error otherwise); centre label shows total ₹/month; legend with ₹ and % | M | Brief: donut chart |
| F2A.07 | Step 4: AI Readiness Score | Overall 0–100 + 5 Red/Amber/Green sub-scores (draft rubric, A31): **unit economics** (implied payback from Step 1 inputs), **proof of concept** (outlets × years), **documentation** (deck + P&L present and reviewed), **channel concentration** (largest channel share from Step 3), **franchise terms** (fee and royalty completeness and consistency). Each shows the rule, the value, the threshold and one "how to improve" line. | M | Brief: AI Readiness Score |
| F2A.08 | Live recalculation | Changing any input in Steps 1–3 updates the score and the donut immediately | M | Proves "working" |
| F2A.09 | Review & submit | Read-only summary of all steps with "Edit" links; Submit → success screen "Brand record created" with the record ID | M | Flow completion |
| F2A.10 | Brand record export | Download the brand record as JSON (fields match the R2C assumptions panel) | S | Hand-off to R2C |
| F2A.11 | Sample data | "Load FreshBrew sample" and "Load gym sample" buttons prefill every step | M | Reviewer speed; A26 |
| F2A.12 | Draft autosave | Saves to browser storage on each change; "Resume draft" banner on return; "Start over" with confirm | S | Real onboarding behaviour |
| F2A.13 | Empty / loading / error states | Empty upload slots with guidance; upload progress and skeletons; simulated upload failure with Retry; score shown as "incomplete" until Steps 1–3 are valid | S | Error handling |
| F2A.14 | Computed autonomy badge | Same badge component as R2B, computed from this module's mock action events (AI-extracted vs human-entered fields) | S | R1 1b, D-05 |
| F2A.15 | Mobile layout | Usable at 375 px; stepper collapses to "Step 2 of 4" | M | Quality bar |
| F2A.16 | Accessibility basics | Labelled inputs, keyboard navigation, errors announced next to fields | S | Quality bar |
| F2A.17 | Cross-prototype footer | Links to the Option B and Option C URLs | S | D-10 |
| F2A.18 | Stretch: live LLM P&L extraction | One edge-function call that extracts channel revenue from a PDF P&L; falls back to the mock | C | R3 model choice |
| F2A.19 | Real Supabase storage + auth | — | W | 1 more day |

## Write-up components (required by the brief)

| ID | Component | MoSCoW |
|---|---|---|
| F2A.W1 | Live URL | M |
| F2A.W2 | Exact prompts used, in order (copied from the build log) | M |
| F2A.W3 | What AI got wrong: specific and technical (from the log) | M |
| F2A.W4 | What I fixed manually (from the log) | M |
| F2A.W5 | 1 more day improvements, each tied to a feature ID above | M |
| F2A.W6 | 3 screenshots (+ optional 60-second Loom) | C |
