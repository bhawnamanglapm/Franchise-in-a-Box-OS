# R2B build log: WhatsApp AI Agent Panel

> Rule: every row is written during the build, at the moment it happens. Nothing is reconstructed or invented. The Task 2B write-up is copied from this log.

## Session info
- **Tools:** Claude Code (Claude Opus 5.5) builds and tests the app; the human gives the prompts and reviews it. Deployed to Vercel.
- **Why not Lovable:** decision D-01 was revised on 15 Oct 2026. The person building chose "Claude Code builds" so the state machine and trigger engine could be unit-tested and the 9-step script automated.
- **Start time:** 2026-10-15 15:47 IST
- **Deployed URL:** (filled in at deploy)

## Prompt log (exact prompts, verbatim)

Matches [`build-log-template.md`](../../docs/requirements/R2B-whatsapp-agent-panel/build-log-template.md). One prompt can lead to several mistakes, so "what AI got wrong" and "what I fixed" are in the next table, linked by the prompt number.

| # | Time (IST) | Tool | Exact prompt (verbatim) | What the AI produced | Wrong / fixed entries |
|---|---|---|---|---|---|
| 1 | 15:3x | Claude Code | "let us now work on R2---At first we will work on R2B" | Read the R2B requirement files; flagged that R3 triggers are still drafts and that Lovable can't be driven from this session; asked who should build | — |
| 2 | 15:4x | Claude Code | Choice: "Claude Code builds (Recommended)" + plan approved | Plan ([build-brief.md](build-brief.md)); then the scaffold (faa361a) and the engine with 45 unit tests (6018a57) | 1, 2, 3, 4 |
| 3 | 16:0x | Claude Code | "Are all build log template/definition of done/ evaluation/features/phases and tasks for R2B run and output stored for each separately" | Honest answer: no, only the build log existed. Proposed one status file per requirement doc | — |
| 4 | 16:1x | Claude Code | "yes do it" | One status file per requirement doc; build brief copied into the repo; Lovable text updated in the R2B docs; D-01 revised; a direct test for "AI does not reply while HUMAN_ACTIVE" (46 tests) | — |

## What the AI got wrong, and what was fixed

| # | Component | Symptom | Cause | Fix (how) | Time lost |
|---|---|---|---|---|---|
| 1 | Seed data (`conversations.ts`) | First test run: 22 of 45 tests failed. The seed replay threw at "yesterday 11:55": Neha's Take over on Pooja's chat was refused with a 409 | The seed message I wrote, "What is the process?", is a question no approved fact answers, so the engine correctly fired A3 (low confidence) and the chat was FLAGGED. Take over only works from AI_ACTIVE (T2). The engine was right; my seed script was wrong | Changed the message to one the facts answer ("What is the total investment?"). Because the seed is replayed through the engine, a wrong seed fails loudly instead of creating impossible state | 1 extra test run |
| 2 | State machine: agent Active → Error (`machine.ts`) | AC11 test failed: no AI message was marked "failed" during the outage | I made Error a pure function of the outage switch, so the next tick set Error **and cancelled the queued reply before any send was attempted**. No failed send was ever logged, but AC11 requires failed sends to be logged as failures | Error is now *detected*: by the first failed send for that brand, or by the 60 s health check if nothing was sent (AC11 "within 60 s"). Added `lastFailAt` and `outageSince` | 2 extra test runs |
| 3 | Unit test (AC11) | After fix 2, the test expected an IronPulse chat to skip the AI, but it got an AI reply | Test mistake: the failed send was on FreshBrew, so only FreshBrew had detected the outage. IronPulse correctly stayed Active until its own health check | Test now uses a FreshBrew chat, and a new assertion checks IronPulse reaches Error at 60 s and both recover when the outage ends | 1 extra test run |
| 4 | Config (`tsconfig.json`) | `tsc` error: `Property 'at' does not exist on type 'Message[]'` (tests passed because Vitest doesn't type-check) | The target lib was ES2020; `Array.prototype.at` is ES2022 | Target and lib → ES2022; unit tests added to the type-check | 1 run |

## Things to watch for (from the template)

| Watch item | Status |
|---|---|
| Design tokens replaced with Tailwind defaults | Tokens set in `tailwind.config.js`; to be checked in the built CSS |
| State held in several components and drifting apart | Avoided by design: one pure reducer (`machine.ts`) holds all state |
| Trigger rules hardcoded per conversation | Avoided: rules run on every inbound message; the seed itself is replayed through them (entry 1 is proof) |
| AI still "replies" in HUMAN_ACTIVE | Unit test "9-step test, step 3" passes; to be checked in Playwright |
| Hindi or Devanagari text breaking layout or fonts | Not checked yet (no UI) |
| Timers (SLA, 24 h) not cleared on state change | In code: Claim clears the SLA clock (`flaggedAt`) and hand-back clears the no-reply clock (`awaitingSince`). AC3 and AC8 test that the clocks fire; **no test yet proves they are cleared** |
| Mobile layout overflow | Not checked yet (no UI) |

## Unbuilt items → "1 more day"

| Item | Linked 1c acceptance criterion | Est. |
|---|---|---|
