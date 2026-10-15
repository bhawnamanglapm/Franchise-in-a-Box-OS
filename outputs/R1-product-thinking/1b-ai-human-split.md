# 1b. AI vs Human split: is 76% real?

> **TL;DR.** We mapped all 37 actions across the five modules. Depending on how you count, automation does **68% to 87%** of the work, so "76%" is plausible as a measure of workload. Three things make it misleading as stated:
> - **Not all of it is AI.** Of the 87% of time that's automated, AI models do 54% and ordinary software rules (templates, schedules, formulas, logging) do 34%.
> - **It ignores value.** Humans own every one of the highest-value decisions.
> - **It isn't stable.** It swings 14 points depending on how often humans edit the AI's drafts.
>
> The action map makes 76% plausible but doesn't prove it. Our fix is an audited **Autonomy Rate**, computed from logged events and validated in a pilot against a baseline. It's shown as "AI: X% of work | Humans: 100% of closes" (D-05), with the model-vs-rules split on hover, and always paired with outcome metrics.

## 1. Action map

All 37 user-facing actions are listed in [`ai-human-split.csv`](ai-human-split.csv), which imports straight into the Sheet tab `AI_Human_Split`. [`ai-human-split.xlsx`](ai-human-split.xlsx) is the same data with every formula below already built in, and it's live as a [Google Sheet](https://docs.google.com/spreadsheets/d/1pl8JSEAvlPR1mexlfx0cwiFMPU-B4-QJFga4N31pl1o/edit?usp=sharing). Each action has an owner:

- **AI:** done end to end by AI.
- **AI→H:** AI drafts, a human approves.
- **H:** human only.

Owner says who is accountable. A second column, **engine**, says what kind of automation does the work, so ordinary software isn't counted as AI:
- **model:** an AI model does it (extraction, drafting, conversation, summaries).
- **rules:** fixed software does it (templates, schedules, formulas, logging, rule-based scores).
- **human:** no automation.

| Module | Actions | AI | AI→H | H | Manual hours / brand / month (no AI) | Human hours left with AI |
|---|---|---|---|---|---|---|
| 1 Onboarding | 7 | 4 | 1 | 2 | 1.2 | 0.3 |
| 2 ROI Engine | 7 | 4 | 1 | 2 | 2.8 | 1.0 |
| 3 Collateral Studio | 6 | 5 | 1 | 0 | 16.0 | 1.0 |
| 4 Sales & Marketing Agent | 10 | 9 | 1 | 0 | 334.7 | 2.0 |
| 5 HITL CRM | 7 | 3 | 1 | 3 | 102.0 | 54.6 |
| **Total** | **37** | **25** | **5** | **7** | **456.6** | **58.8** |

**Human-only actions, and why they stay human:**
- **Onboarding:** uploading the files; the go/no-go decision to take a brand on.
- **ROI Engine:** agreeing the fee, royalty and investment with the brand; presenting the model to the founder.
- **CRM:** taking over a flagged chat; running the discovery call; negotiating and signing.

All four actions with the top value weight (5) are human.

**Who does what, by module (from the engine column):**

| Module | AI models | Software rules | Humans |
|---|---|---|---|
| 1 Onboarding | Pre-fill the brand form (founder confirms); extract P&L figures; explain gaps and fixes | Revenue-split chart; Readiness Score v0 (a rule-based rubric, A31) | Upload files; go/no-go on the brand |
| 2 ROI Engine | Draft the Model Card (consultant approves); find comparable benchmarks | 3-year projections and sensitivity (formulas); insights v0 (rule-based, per the R2C plan) | Agree fee, royalty and investment; present to the founder |
| 3 Collateral | Generate deck, brochure, ads and WhatsApp scripts; regenerate; draft the send (human approves) | — | Approve before anything goes out |
| 4 Sales Agent | Qualify on WhatsApp; answer FAQs from approved facts; voice qualification; detect flags; draft ad changes (human approves) | Capture, consent and dedupe; template greeting; email sequence; follow-up nudges; live counts | Approve ad spend changes |
| 5 CRM | Takeover summary; live call notes; suggest deal stage (human confirms) | Interaction timeline | Take over chats; discovery call; negotiate and sign |

**Counts:** 14 actions are AI-model only, 11 are software rules, 5 are AI drafts with human approval (all model-drafted), and 7 are human only.

**Inputs are estimates, not data.**
- Monthly volumes come from A19: 500 leads, about 150 voice calls, 60 takeovers, 20 discovery calls and 3 signings per brand.
- Standard minutes and the 1–5 value weights come from A20.
- One-off brand set-up actions are spread over a 6-month engagement (A34).

All of these get calibrated in the pilot. The value of this section is the method, not the precise percentages.

## 2. The split, measured three ways

| Method | Formula (Sheet tab `AI_Human_Split`, rows 2–38) | Result |
|---|---|---|
| **Count, strict** (AI only) | `=COUNTIF(D2:D38,"AI")/COUNTA(D2:D38)` | **68%** (25 / 37) |
| **Count, generous** (AI→H credited to AI) | `=(COUNTIF(D2:D38,"AI")+COUNTIF(D2:D38,"AI→H"))/COUNTA(D2:D38)` | **81%** (30 / 37) |
| **Time-weighted** (share of manual minutes done by AI) | `=SUMPRODUCT(E2:E38,F2:F38,G2:G38)/SUMPRODUCT(E2:E38,F2:F38)` | **87%** |
| **Value-weighted** (share of value weight done by AI) | `=SUMPRODUCT(H2:H38,G2:G38)/SUM(H2:H38)` | **68%** |
| Time-weighted, **AI models only** | `=SUMPRODUCT((J2:J38="model")*E2:E38*F2:F38*G2:G38)/SUMPRODUCT(E2:E38,F2:F38)` | **53.6%** |
| Time-weighted, **software rules only** | same, with `"rules"` | **33.5%** |

Columns: D = owner, E = frequency per month, F = manual minutes, G = AI share of the minutes, H = value weight, J = engine.

By value, the 68% splits into 45.7% models and 22.4% rules. The rules share is mostly high-volume Sales Agent plumbing: the email sequence alone is 50 of the 153 hours that rules take over.

### How sensitive the time-weighted number is

| Change to the inputs | Time-weighted AI share | Human hours / brand / month |
|---|---|---|
| Base case | 87.1% | 58.8 |
| Agent conversations take half as long to do by hand | 80.0% | 57.8 |
| Leads halved to 250 a month | 79.4% | 58.8 |
| Takeovers doubled to 120 a month | 83.8% | 78.8 |
| Every AI→H approval saves only 50% | 86.6% | 61.4 |
| **Humans edit 20% of the agent's work** | **72.8%** | **124.1** |
| **Day-30 slice only (D-04): unshipped AI work done by people** | **76.5%** | **89.6** |

Two findings matter most:
- **The human edit rate moves the number more than any volume assumption.** That's why the Autonomy Rate below only credits AI for work no human had to edit.
- **The day-30 slice lands at about 76%.** This assumes the agent's work isn't edited and that consultants and designers still do the onboarding, collateral and ad work by hand. The brief's figure is reachable early, but only as a measured outcome, not a constant.

## 3. Verdict: is 76% AI realistic?

| As a claim about… | Verdict | Why |
|---|---|---|
| **Workload** | **Yes** | 68–87% depending on method; 76.5% for the day-30 slice |
| **Value** | **No, not as stated** | Value-weighted share is 68%. Humans own every top-value decision: go/no-go, terms, discovery call, close. |
| **A live number at launch** | **Only if measured** | It's 76.5% at day 30 and 87% at full build, so it changes as modules ship |
| **"AI" specifically** | **No, not as worded** | AI models do 54% of the time; 34% is ordinary software that any CRM could do. A badge that says "AI" for all of it overstates the AI. |
| **A hardcoded label** | **No** | A 20% edit rate moves it 14 points. A fixed number would be wrong most of the time, and an investor can't audit it. |

### Testing the brief's own claims

| The brief says… | What the action map shows | Holds? |
|---|---|---|
| "AI-driven automation (70–80%)" | 68–87% depending on the method; 76.5% for the day-30 slice. AI models alone: 54% of time. | **Yes for automation; no for "AI-driven".** The range holds only if templates, schedules and formulas count as AI. |
| "Human intervention only for high-value actions" | 6 of the 7 human-only actions have value weight 4–5. The exception is uploading the deck and P&L (row 2, weight 1), which only the founder can do because only they hold the files. Humans also approve 5 AI drafts, and 2 of those are low-value (brand details form, deal stage, both weight 2). | **Almost.** The upload can shrink (pull files from a shared drive) but not disappear. The 2 low-value approvals should become AI-only once the audit shows the drafts are accurate. |
| "AI: 76% \| Human: 24%" | Human share is 13% of the time, 32% of the value and 32% of the actions (strict count), so "24%" doesn't match any single measure. And 93% of the remaining human hours (54.6 of 58.8) are in the CRM: takeovers, discovery calls and closing. | **No.** "Human: 24%" presents people as overhead to squeeze, when their hours are where the revenue event happens. That's why the badge becomes "Humans: 100% of closes" (D-05). |

## 4. What this means commercially: consultant capacity

Without AI, one brand needs about **457 hours of work a month**. With AI, about **59 human hours** remain, almost all of them in CRM: takeovers, discovery calls and closing. At 160 productive hours per consultant per month (A35):

- **Without AI:** about **0.35 brands per consultant**, roughly 3 people per brand.
- **With AI:** about **2.7 brands per consultant**, about 8× the leverage.
- **If humans edit 20% of the agent's work:** about **1.3 brands per consultant**.

This is the investor story, not the percentage. Leverage is measured in brands per consultant and hours per signed franchisee: about **20 human hours** per signing with AI versus about **152** without (59 h and 457 h ÷ 3 signings).

## 5. The fix: an audited Autonomy Rate

### Definition (A5)
**Autonomy Rate** = the share of standard minutes of funnel work completed by AI **with no human edit**, per brand, over a rolling 28 days.

`Autonomy Rate = Σ std_minutes(AI actions, not edited) ÷ Σ std_minutes(all actions)`

### Three numbers, kept apart
The word "automation" covers three different measures. They're never mixed in one figure:

| Measure | Formula | Answers | Used for |
|---|---|---|---|
| **A. Autonomy Rate** (the badge) | AI-completed std minutes, unedited ÷ all std minutes in scope | How much of the whole workload runs without people? | The badge X |
| **B. Success rate on eligible work** | AI completions that pass the audit ÷ AI attempts | When AI is allowed to act, how often is it right? | Deciding which actions may run unapproved |
| **C. Human time saved** | (baseline human minutes − human minutes now) ÷ baseline | Did people actually get time back? | The capacity story in §4 |

In this model, A and C come out equal (87%) because the human minutes are derived from the same table. In the pilot they will differ: reviews, rework and corrections add human minutes that A doesn't see. That's why C is measured against a real baseline, not computed from the table.

### Unedited-approval rule
- An **AI** action counts as AI.
- An **AI→H** action counts as AI only if the human approves it **unchanged**.
- If the human edits it, rejects it or rewrites it, it counts as human.
- A conversation that gets flagged counts the takeover minutes as human.
- An AI action that fails the weekly audit (wrong answer, missed escalation) counts as human, because someone had to fix it.

### Event schema
Every action writes one `ACTION_EVENT`, which matches the data model in `docs/architecture.md` §5:

| Field | Type | Notes |
|---|---|---|
| `id` | uuid | |
| `brand_id` | uuid | Rate is computed per brand, then rolled up |
| `action_type` | enum (37 values) | Matches `ai-human-split.csv` |
| `actor` | `ai_model` \| `software` \| `human` | Who completed it. Splitting AI models from software keeps the badge honest. |
| `ai_draft_edited` | bool | True if a human changed an AI draft before it went out |
| `approved_by` | uuid, nullable | For AI→H actions |
| `std_minutes` | int | Looked up from a **versioned** standard-minutes table, never typed in by hand |
| `std_minutes_version` | string | So a past rate can be recomputed after a recalibration |
| `conversation_id` | uuid, nullable | Links to the audit sample |
| `ts` | timestamptz | |

### Audit
- **Weekly sample:** a lead consultant reviews **50 randomly sampled AI-handled conversations** across the live brands against a fixed rubric.
- **Two error rates are published next to the badge:**
  - **Missed-escalation rate:** a conversation should have been flagged and wasn't.
  - **Wrong-answer rate:** the agent said something that isn't in the approved facts.
- **Thresholds:** if missed escalations go above 5% or wrong answers above 0% in a week, the badge shows "under review" until the prompt or rules are fixed. These are proposed product thresholds, to be set with the founder.
- **Recalibration:** standard minutes are recalibrated each quarter from timed samples in the pilot (A20). Each change gets a new version.

### Investor view
The badge keeps the brief's format but changes what it means (D-05):

> **AI: X% of work | Humans: 100% of closes**

X is the live Autonomy Rate. Hovering over it shows the definition, the split between AI models and software rules, the audit date and the two error rates. Next to it go three outcome metrics, so autonomy is never shown alone:

1. **Human hours per signed franchisee:** modelled at about 20 h, versus about 152 h without AI.
2. **Cost per signed franchisee:** ad spend + AI cost + human hours × loaded hourly cost, divided by signings. The inputs come from the pilot; no number is claimed here.
3. **Speed to lead:** median minutes to first meaningful reply (not a plain acknowledgement). The target is ≤ 5 ([1a](1a-prioritisation.md#8-day-30-success-criteria)).

## 6. Validating 76%: the pilot plan

76% is treated as a hypothesis to test, not a capability to claim. The pilot is the 2 brands in the day-30 slice ([1a §7](1a-prioritisation.md#7-the-30-day-roadmap)).

1. **Baseline first (days 1–5).** For each in-scope action: how many instances a month, how long a person takes now, error and rework rates, and what the brand's existing tools already automate. Existing automation is counted as the baseline, never as new AI.
2. **Log every instance.** Every action writes an `ACTION_EVENT`: attempted, completed, escalated, failed, edited.
3. **Count only successes.** An AI action counts only if it's unedited and passes the audit (see the rule above). A fast reply with a wrong fact is a failure, not automation.
4. **Report with the fine print.** Each published rate states the period, the brands, which actions were in scope, what was excluded, and the audit results. Model and rules shares are always shown separately.
5. **Expand by evidence.** An action moves from AI→H to AI only when its success rate (measure B) stays above the agreed bar for 4 consecutive weekly audits. The bar is a proposal to agree with the founder.

**Guardrails during the pilot:**
- wrong money or commercial claims (target 0)
- missed escalations (≤ 5%)
- duplicate leads
- messages sent without consent

Any breach pauses the badge ("under review").

## New assumptions introduced here
- **A34:** One-off brand set-up actions (onboarding, model, collateral) are spread over a 6-month engagement, which is a frequency of 1/6 per month.
- **A35:** One consultant has 160 productive hours a month (8 h × 20 working days). This is an estimate.

## Hand-off
- **R2A, R2B and R2C** each show the badge, computed from their own mock `ACTION_EVENT` log using the rule above, with the model-vs-rules split on hover.
- **R8** puts the verdict and the capacity line in the executive summary.
