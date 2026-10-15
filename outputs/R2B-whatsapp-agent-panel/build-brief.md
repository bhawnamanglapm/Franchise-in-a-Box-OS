# R2B build brief (task T2B.01)

> This is the build plan approved on 15 Oct 2026, copied unchanged from the planning session so it lives in the repo. It replaces the Lovable build brief and prompt pack (T2B.01, T2B.02), because Claude Code builds the prototype (D-01 revised). Status against it is tracked in [tasks-status.md](tasks-status.md) and [phases-status.md](phases-status.md).

---

## Plan: build Prototype B, the WhatsApp AI Agent Panel (R2B)

## Context
Task 2 asks for a working prototype with a live URL and a write-up covering: the prompts used, what the AI got wrong, what was fixed, and what to do with one more day.
- You chose to build **R2B first**, with **Claude Code building it** instead of Lovable. That changes decision D-01.
- The spec is already written:
  - 1c: states, transitions, error handling, AC1–AC11
  - the R2B features, tasks and definition of done
  - the draft R3 triggers (F3.A1–A9)
- The prototype has to *prove* the 1c spec works. A reviewer types a prospect message, sees it flagged with reasons, takes over, hands back, opts out, and watches the AI share recompute.

**Two dependencies that aren't final yet, and how the plan handles them:**
- **R3 triggers are still drafts.** The flagging engine uses F3.A1–A9 exactly as drafted. When R3 is written, its trigger table is the single source and the engine gets synced to it.
- **FreshBrew numbers.** The brief gives none, and R2C/R5 aren't built. The agent's quotable facts sit in one file. In the UI they're labelled **"Illustrative: replaced by the approved Model Card (R2C)"**, so no number is presented as real. T2B.18 swaps them in later.

## Where it lives and the stack
- **Folder:** `prototypes/r2b-whatsapp-agent-panel/` in this repo, pushed with everything else.
- **Stack:** Vite + React + TypeScript + Tailwind. Everything runs in the browser with mock data (A11, A17).
- **Dependencies:** all free and open source.
  - Runtime: React and Tailwind only.
  - Development: Vitest for unit tests, and Playwright driving your installed Chrome for the 9-step test and screenshots.
- **Deploy:** Vercel, as its own project with the root directory set to the prototype folder.
  - I'll try the Vercel connector first.
  - If it needs a login I can't do, you'd run `npx vercel` once. I'll tell you exactly what to type.

## Files to create
```
prototypes/r2b-whatsapp-agent-panel/
  src/data/        brands.ts (FreshBrew + fictional gym "IronPulse Fitness"),
                   approvedFacts.ts (illustrative, labelled),
                   conversations.ts (10 chats, EN / Hindi / Hinglish, ₹ lakh, Tier 1/2 cities)
  src/engine/      triggers.ts   pure rules F3.A1–A9 → [{rule, reason, value}]
                   machine.ts    reducer: 7 states, T1–T9 + agent Active/Paused/Error,
                                 "Only if" guards, state_version, requestId (repeat click = 1),
                                 queued-AI-reply cancel, log rows
                   agent.ts      scripted replies from approvedFacts; replies queue for 2 s (AC9)
                   clock.ts      business minutes 09:00–21:00 IST; demo speed (1 min → 1 s)
                   autonomy.ts   ACTION_EVENT log → Autonomy Rate + model/rules split,
                                 std minutes taken from outputs/R1-product-thinking/ai-human-split.csv
  src/ui/          Shell (nav: 5 modules, only Sales Agent active), Header (badge + agent status strip),
                   Inbox (chips, "Needs human" filter, SLA countdown), Thread (bubbles + system notes),
                   ConversationHeader (Take over / Claim / Return / Won / Lost), WhyFlagged,
                   TakeoverPanel, Composer (n / 4,096, 24 h template picker, locked states),
                   SimulatePanel (inbound message, "second consultant", "outage", demo speed),
                   Toasts, empty / skeleton / error states, Footer (A and C links: "coming soon")
  tests/           engine unit tests; e2e/nine-step.spec.ts
```
- **Design tokens:** `#0A0A0F` background, `#111118` cards, `#2563EB` accent, `#10B981` success, `#F59E0B` alert; Inter, plus JetBrains Mono for numbers.
- **Phone width (375 px):** a single column that switches between the inbox and the open chat.

## Order of work (each step is a small commit; I show you the result at ★)
1. Scaffold, design tokens and the shell. Check the hex values in the built CSS.
2. Mock data, then the engine (triggers, machine, clock, autonomy) with unit tests covering AC1, AC2, AC4, AC5, AC7, AC9, AC10 and AC11 at the logic level. ★ Show the test results.
3. UI: inbox → thread → header buttons → Why-flagged card → composer → simulate panel → takeover panel → agent status → empty and error states. ★ Show screenshots on desktop and at 375 px.
4. Playwright 9-step test (the script in `docs/requirements/R2B-whatsapp-agent-panel/tasks.md`). It must pass.
5. Deploy to Vercel, then rerun the 9 steps against the live URL in a fresh browser profile. ★ Give you the URL.
6. Write-up, filled in **as I go**, not reconstructed afterwards:
   - `outputs/R2B-whatsapp-agent-panel/build-log.md` records your prompts verbatim and the real mistakes and fixes (component · symptom · cause).
   - `outputs/R2B-whatsapp-agent-panel/README.md` (the Task 2B write-up) covers W1–W5, the mocked-vs-real statement and 3 screenshots.

**Out of scope for now** (goes on the "1 more day" list): the live LLM reply (F2B.19, which needs R3's model choice) and footer links to A and C (they don't exist yet).

## Documents to update
- `docs/assumptions-and-decisions.md`:
  - D-01 revised: built in Claude Code, deployed to Vercel.
  - New note: R2B uses the draft R3 triggers until R3 is final.
- `docs/requirements/R2B-whatsapp-agent-panel/tasks.md` and `phases.md`: Lovable steps become Claude Code steps, and owners change. Tick the definition of done as items pass.
- Root `README.md`: R2B status and live URL. `docs/architecture.md` §6: "Lovable project" becomes "Vite app on Vercel" for B.

## Verification
- `npm run test`: engine unit tests pass.
- `npm run build`: clean build, no TypeScript errors. A grep of the built CSS finds all 5 hex tokens. A grep of the code finds no API keys.
- Playwright runs the 9 steps on desktop and at 375 px width, first locally, then against the live URL with no login.
- I check the screenshots myself (Hinglish text renders, nothing overflows at 375 px).

## Model note
Your rule says building is Sonnet work. The planning is done on Opus, so you can switch with `/model` before I start. The engine and state machine are the tricky part, and Opus is also fine for those.
