# Task 7: How I work

> **Draft: needs owner input before submission.** Text in **[square brackets]** is a placeholder only Bhawna can fill. Facts used below come from the candidate inputs in [`docs/requirements/R7-how-you-work/evaluation.md`](../../docs/requirements/R7-how-you-work/evaluation.md); nothing else about past roles has been added.

## 1. Tools I actually used

| Tool | What I built with it | Proof |
|---|---|---|
| **Claude** | Analysis and writing for Tasks 1, 3, 4 and 6: the AI-vs-human action map, the 8 takeover triggers, the 238-word system prompt, the EV servicing research | This document; [repo](https://github.com/bhawnamanglapm/Franchise-in-a-Box-OS) |
| **Claude Code** | Built and tested the Task 2 prototype (React + TypeScript, 52 unit tests, a 9-step browser test) and the script that builds the Task 5 model | [Live prototype](https://fiab-r2b-whatsapp-agent-panel.vercel.app); [build log](../R2B-whatsapp-agent-panel/build-log.md) |
| **Google Sheets** | The FreshBrew financial model: P&L, payback, sensitivity, Scale100x revenue, 10 automatic checks | [Model](https://docs.google.com/spreadsheets/d/1hvPhC2OA14JhPUtjZFc1rd907xJMpPJtFsQDe7I6YeA/edit) |
| **Lovable** | Not used in this submission: I switched the prototype to Claude Code so its rules could be unit-tested (decision D-01) | **[Add a link to a Lovable project you built]** |

Not claimed: Zapier, Make. Task 6A is a design, not a build.

## 2. Self-rating

**[Confirm or change each rating.]** The proof column is filled from this submission.

| Skill | Rating (1–5) | Proof |
|---|---|---|
| Turning a vague brief into specs | **[ ]** | 35 written assumptions and 12 decisions; the developer-ready takeover spec (Task 1c) |
| AI agent design | **[ ]** | 8 measurable triggers that run as code in the prototype; a 40-conversation test plan (Task 3) |
| Prototyping with AI tools | **[ ]** | Live prototype passing its 9-step test; a log of what the AI got wrong and how it was fixed |
| Financial modelling | **[ ]** | Task 5 model with 10 automatic checks, 3 hand checks and dated sources |
| Building automations hands-on (Zapier / Make) | **[ ] (suggest ≤ 3)** | Designed the flow in 6A but have not run it in production. **[Plan to close the gap, e.g. build the 6A flow in Make on a test page]** |

## 3. From idea to execution (this assignment as the example)

1. **List what's unclear before building.** The brief left the fee model, the ₹6L/8L/10L meaning and the 76% metric open; each went into an assumptions log (A1–A35).
2. **Write a definition of done for each task**, so "finished" is checkable ([`docs/requirements/`](../../docs/requirements/README.md)).
3. **Decide, record, and reverse when needed.** I planned the prototype in Lovable, then moved it to Claude Code so the rules could be tested automatically (D-01, revised 15 Oct 2026).
4. **Build the thinnest version that can be tested.** One prototype (Option B) instead of three (D-10), with real rules and scripted replies.
5. **Check against the definition of done, then fix.** The 9-step test, the model's Checks tab, and one shared set of numbers: the prototype quotes the model's ₹32L base case.

## 4. A complex problem I solved

**[Owner input needed.** Pick PCMS (built 0→1 at Bajaj Finserv) or partner-portal adoption (2% → 45%), then answer:]
- **Situation:** **[what the product was, who used it, what was broken]**
- **Constraint:** **[e.g. regulation, team, timeline]**
- **My role and decision:** **[what you personally decided or built]**
- **Result:** partner-portal adoption from 2% to 45% **[over what period; how measured]**; Heroes Award **[year]**
- **What I'd do differently:** **[one honest learning]**

**Why it matters here:** **[one line linking partner onboarding in lending to onboarding franchise partners: the same funnel of sign-up, qualification, documents and payouts]**

## 5. Working under ambiguity

| What the brief left open | How I resolved it |
|---|---|
| How Scale100x earns money (A1) | Pricing isn't public, so I modelled setup fee + retainer + success fee as editable inputs, all labelled "estimate" |
| What ₹6L / ₹8L / ₹10L means (A3) | Read as monthly sales per outlet; ₹6L a year (about ₹16k a day) can't pay a staffed café. Stated on the model's first tab |
| What "AI: 76%" measures (A5) | Computed it three ways and proposed one auditable definition, the Autonomy Rate, plus a badge that says "Humans: 100% of closes" (D-05) |

**Links:** [GitHub](https://github.com/bhawnamanglapm) · **[LinkedIn]** · **[PMgirlz]**
