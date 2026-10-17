# R2A: Lovable prompt pack (T2A.03)

Paste these into [Lovable](https://lovable.dev) one at a time, in order. Check the result after each prompt before sending the next.

**Why this exists.** Task 2 is Option B only (D-10). This is a separate, small Lovable build of Prototype A, the Onboarding Wizard. It gives Task 7 a real Lovable link. It is **not** a second Task 2 submission, and all of its data is sample data.

**Sample values.** The FreshBrew investment, fee, royalty, sales and delivery share come from the Task 5 model. Years operating, outlet count, cities and the dine-in/takeaway split are **illustrative** (A26).

---

## Prompt 1: shell and design system

```text
Build a web app called "Franchise-in-a-Box: Brand Onboarding". React + Tailwind, no backend; keep all state in the browser.

Design system (use these exact colours):
- background #0A0A0F, cards #111118, borders #23232D
- text #ECECF1, muted text #8B8B9A
- primary #2563EB, success #10B981, warning #F59E0B, error #EF4444
- font Inter; numbers in a monospace font

Layout: a left sidebar with 5 items (Onboarding, Inbox, Deals, ROI, Settings). Only "Onboarding" is active; the others are disabled, with the tooltip "Not in this demo". The main area holds a 5-step wizard: 1 Brand details, 2 Documents, 3 Revenue split, 4 Readiness score, 5 Review.

Add a stepper at the top: a progress bar and each step's status (done / current / has errors). Back and Next buttons; Next is disabled until the current step is valid. Clicking a completed step jumps back to it.

At 375 px wide the stepper collapses to "Step 2 of 5".
Put a small banner at the top: "Demo with sample data. Nothing is saved to a server."
```

## Prompt 2: Step 1, brand details, and sample data

```text
Step 1 "Brand details" form:
- Brand name (text, required)
- Category (select: QSR, Gym, Fashion retail, EV two-wheeler servicing)
- Years operating (number > 0), outlets operating (number > 0)
- Cities (chip input, at least 1)
- Average monthly sales per outlet in ₹ (number > 0)
- Investment per outlet in ₹ (number > 0)
- Franchise fee in ₹ (number ≥ 0), royalty % (0–100)

Show each error under its field when the user leaves the field. Format ₹ in Indian style (₹8,00,000).

Add a "Load FreshBrew sample" button that fills every step:
- FreshBrew, QSR, 4 years, 6 outlets, cities Gurugram and Delhi
- ₹8,00,000 monthly sales, ₹32,00,000 investment, ₹6,00,000 fee, 6% royalty
- Step 3 channels: dine-in 45%, takeaway 25%, delivery apps 30%

Label the sample "Sample data: sales, investment, fee, royalty and delivery share from the Task 5 model; the rest illustrative".
```

## Prompt 3: Step 2, documents

```text
Step 2 "Documents": two upload slots.
- Pitch deck: PDF or PPTX, max 20 MB
- P&L: CSV, XLSX or PDF, max 10 MB

Each slot supports drag-and-drop and browse, shows a progress bar, and has Remove and Replace.
Reject wrong file types, empty files and files over the limit, each with a specific message (for example "Pitch deck must be PDF or PPTX").

Files stay in the browser; nothing is uploaded.
If a P&L is added, show a yellow note: "Figures from the P&L are AI-extracted in the full product. Please review them in Step 3." The user must tick "I have reviewed the figures" before Next is enabled.

This step is valid when both files are present.
```

## Prompt 4: Step 3, revenue split donut, and Step 4, readiness score

```text
Step 3 "Revenue split": a donut chart of sales by channel. For QSR the channels are dine-in, takeaway and delivery apps; other categories get 3 sensible channels of their own.
Each channel has a number input and a slider. The shares must total 100%; otherwise show a live error and disable Next. The centre label shows monthly sales in ₹. The legend shows each channel's ₹ and %.

Step 4 "Readiness score": an overall score from 0 to 100, the average of 5 sub-scores. Each sub-score is Green (100), Amber (60) or Red (20), and each card shows the rule, the brand's value, the threshold and one "how to improve" line.
1. Unit economics: simple payback months = investment ÷ (monthly sales × 15%). Green ≤ 30, Amber ≤ 48, Red above.
2. Proof of concept: outlets × years. Green ≥ 15, Amber ≥ 5, Red below.
3. Documentation: deck and P&L present and reviewed = Green; one missing = Amber; both missing = Red.
4. Channel concentration: largest channel share. Green ≤ 50%, Amber ≤ 70%, Red above.
5. Franchise terms: fee and royalty both filled, with royalty between 4% and 8% = Green; filled but royalty outside 4–8% = Amber; missing = Red.

Under the score, write: "Draft rubric v0. Thresholds are design choices, to be calibrated on real outcomes."
Changing anything in Steps 1–3 updates the score immediately.
```

## Prompt 5: review, submit, autosave and polish

```text
Step 5 "Review": a read-only summary of every step, with an "Edit" link for each. Submit shows a success screen: "Brand record created" with a record ID like FIB-0001, plus a "Download brand record (JSON)" button.

Autosave the draft to localStorage on every change. On return, show a "Resume your draft?" banner with Resume and Start over; Start over asks for confirmation.

Polish:
- every input has a label, the whole wizard works with the keyboard, and errors are announced next to their field
- empty upload slots explain what to add
- the score card shows "Incomplete" until Steps 1–3 are valid
- footer: "Part of the Franchise-in-a-Box OS assignment" linking to https://github.com/bhawnamanglapm/Franchise-in-a-Box-OS
```

---

## After building

1. Load the FreshBrew sample and click through all 5 steps. With these figures the score should show unit economics Green (payback ≈ 27 months). FreshBrew's actual payback in the Task 5 model is month 29; this rubric is simpler.
2. Try one wrong file type and one channel split that doesn't total 100%. Both should be blocked with a clear message.
3. Publish the app, then put the published link and the Lovable project link in [Task 7](../../../outputs/R7-how-you-work/task7-how-you-work.md), in the Lovable row of the tools table.
4. Note in [the build log template](build-log-template.md) what Lovable got wrong and what you fixed. That is useful evidence for interviews.
