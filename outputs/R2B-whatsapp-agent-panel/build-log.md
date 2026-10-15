# R2B build log: WhatsApp AI Agent Panel

> Rule: every row is written during the build, at the moment it happens. Nothing is reconstructed or invented. The Task 2B write-up is copied from this log.

## Session info
- **Tools:** Claude Code (Claude Opus 5.5) builds and tests the app; the human gives the prompts and reviews it. Deployed to Vercel.
- **Why not Lovable:** decision D-01 was revised on 15 Oct 2026. The person building chose "Claude Code builds" so the state machine and trigger engine could be unit-tested and the 9-step script automated.
- **Start time:** 2026-10-15 15:47 IST
- **Deployed URL:** (filled in at deploy)

## Prompt log (exact prompts, verbatim)

| # | Time (IST) | Exact prompt | What the AI produced |
|---|---|---|---|
| 1 | 15:3x | "let us now work on R2---At first we will work on R2B" | Read the R2B requirement files; flagged that R3 triggers are still drafts and that Lovable can't be driven from this session; asked who should build |
| 2 | 15:4x | Choice: "Claude Code builds (Recommended)" + plan approved | Plan: Vite + React + TS + Tailwind in `prototypes/r2b-whatsapp-agent-panel/`, engine with unit tests, Playwright 9-step test, Vercel deploy |

## What the AI got wrong, and what was fixed

| # | Component | Symptom | Cause | Fix (how) | Time lost |
|---|---|---|---|---|---|
| 1 | Seed data (`conversations.ts`) | First test run: 22 of 45 tests failed. The seed replay threw at "yesterday 11:55": Neha's Take over on Pooja's chat was refused with a 409 | The seed message I wrote, "What is the process?", is a question no approved fact answers, so the engine correctly fired A3 (low confidence) and the chat was FLAGGED. Take over only works from AI_ACTIVE (T2). The engine was right; my seed script was wrong | Changed the message to one the facts answer ("What is the total investment?"). Because the seed is replayed through the engine, a wrong seed fails loudly instead of creating impossible state | 1 extra test run |
| 2 | State machine: agent Active → Error (`machine.ts`) | AC11 test failed: no AI message was marked "failed" during the outage | I made Error a pure function of the outage switch, so the next tick set Error **and cancelled the queued reply before any send was attempted**. No failed send was ever logged, but AC11 requires failed sends to be logged as failures | Error is now *detected*: by the first failed send for that brand, or by the 60 s health check if nothing was sent (AC11 "within 60 s"). Added `lastFailAt` and `outageSince` | 2 extra test runs |
| 3 | Unit test (AC11) | After fix 2, the test expected an IronPulse chat to skip the AI, but it got an AI reply | Test mistake: the failed send was on FreshBrew, so only FreshBrew had detected the outage. IronPulse correctly stayed Active until its own health check | Test now uses a FreshBrew chat, and a new assertion checks IronPulse reaches Error at 60 s and both recover when the outage ends | 1 extra test run |
| 4 | Config (`tsconfig.json`) | `tsc` error: `Property 'at' does not exist on type 'Message[]'` (tests passed because Vitest doesn't type-check) | The target lib was ES2020; `Array.prototype.at` is ES2022 | Target and lib → ES2022; unit tests added to the type-check | 1 run |

## Unbuilt items → "1 more day"

| Item | Linked 1c acceptance criterion | Est. |
|---|---|---|
