# R2B build log: WhatsApp AI Agent Panel

> Rule: every row is written during the build, at the moment it happens. Nothing is reconstructed or invented. The Task 2B write-up is copied from this log.

## Session info
- **Tools:** Claude Code (Claude Opus 5.5) builds and tests the app; the human gives the prompts and reviews it. Deployed to Vercel.
- **Why not Lovable:** decision D-01 was revised on 15 Oct 2026. The person building chose "Claude Code builds" so the state machine and trigger engine could be unit-tested and the 9-step script automated.
- **Start time:** 2026-10-15 15:47 IST
- **Deployed URL:** https://fiab-r2b-whatsapp-agent-panel.vercel.app (deployed 2026-10-15 18:0x IST; a new Vercel project of its own, separate from the account's existing projects; opens with no login)

## Prompt log (exact prompts, verbatim)

Matches [`build-log-template.md`](../../docs/requirements/R2B-whatsapp-agent-panel/build-log-template.md). One prompt can lead to several mistakes, so "what AI got wrong" and "what I fixed" are in the next table, linked by the prompt number.

| # | Time (IST) | Tool | Exact prompt (verbatim) | What the AI produced | Wrong / fixed entries |
|---|---|---|---|---|---|
| 1 | 15:3x | Claude Code | "let us now work on R2---At first we will work on R2B" | Read the R2B requirement files; flagged that R3 triggers are still drafts and that Lovable can't be driven from this session; asked who should build | — |
| 2 | 15:4x | Claude Code | Choice: "Claude Code builds (Recommended)" + plan approved | Plan ([build-brief.md](build-brief.md)); then the scaffold (faa361a) and the engine with 45 unit tests (6018a57) | 1, 2, 3, 4 |
| 3 | 16:0x | Claude Code | "Are all build log template/definition of done/ evaluation/features/phases and tasks for R2B run and output stored for each separately" | Honest answer: no, only the build log existed. Proposed one status file per requirement doc | — |
| 4 | 16:1x | Claude Code | "yes do it" | One status file per requirement doc; build brief copied into the repo; Lovable text updated in the R2B docs; D-01 revised; a direct test for "AI does not reply while HUMAN_ACTIVE" (46 tests) | — |
| 5 | 16:2x | Claude Code | "are all steps built or just steps written - i want actual prototype now" | Honest answer: only the engine was built, with no screen. Then built the whole UI: store, header + badge + agent strip, nav, inbox, thread, conversation header with dialogs, Why-flagged card, lead summary, composer, simulate panel, toasts, footer, 375 px layout. Screenshots at desktop and 375 px in [screenshots/](screenshots/) | 5, 6, 7, 8 |
| 6 | 16:50 | Claude Code | "Check if its correct-" followed by the full assignment brief, pasted | Compared the build with the brief. Found: Task 2 says "Choose ONE" but the plan built all three options (D-10); Module 4's Agent Switchboard and live tracking of leads, messages and conversations were missing; "what you fixed manually" needed to say who caught and fixed each issue. Asked one question: B only, or all three? | 9, 10 |
| 7 | 16:52 | Claude Code | "r2b" | Task 2 = Option B only. D-10 revised; A and C marked "not being built" (folders kept). Added the Agent Switchboard and live counts; removed the A/C footer text; facts now point to R5; docs and diagrams updated; this log gained the "Caught by" and "Fixed by" columns | 11, 12 |
| 8 | 18:0x | Claude Code | "link of the build", then the five submission items pasted, then choice "Yes, use it (Recommended)" (the Vercel account to deploy under) | Said there was no live URL yet, only localhost; rebuilt `dist` and scanned it for keys | — |
| 9 | 18:0x | Claude Code | "it shld not affect previous project on versel" | Deployed as a brand-new project, `fiab-r2b-whatsapp-agent-panel`, after listing the account's 2 existing projects to confirm no name clash. The built `dist` was deployed from a separate folder, so no existing project was linked or redeployed | 13 |
| 10 | 18:0x | Claude Code | "try now" (after approving the Vercel login in the browser) | Deploy done; checked the live URL with no login (page, JS, CSS and favicon all 200) and screenshotted it at 1440 px and 375 px | — |

## What the AI got wrong, and what was fixed

"Caught by" and "Fixed by" are recorded so the write-up's "What you fixed manually" is honest. Claude Code wrote every code fix. The person building caught issues by asking questions (prompts 3, 5 and 6) and made the scope decision (prompt 7).

| # | Component | Symptom | Cause | Fix (how) | Caught by | Fixed by | Time lost |
|---|---|---|---|---|---|---|---|
| 1 | Seed data (`conversations.ts`) | First test run: 22 of 45 tests failed. The seed replay threw at "yesterday 11:55": Neha's Take over on Pooja's chat was refused with a 409 | The seed message I wrote, "What is the process?", is a question no approved fact answers, so the engine correctly fired A3 (low confidence) and the chat was FLAGGED. Take over only works from AI_ACTIVE (T2). The engine was right; my seed script was wrong | Changed the message to one the facts answer ("What is the total investment?"). Because the seed is replayed through the engine, a wrong seed fails loudly instead of creating impossible state | Claude Code's unit-test run | Claude Code | 1 extra test run |
| 2 | State machine: agent Active → Error (`machine.ts`) | AC11 test failed: no AI message was marked "failed" during the outage | I made Error a pure function of the outage switch, so the next tick set Error **and cancelled the queued reply before any send was attempted**. No failed send was ever logged, but AC11 requires failed sends to be logged as failures | Error is now *detected*: by the first failed send for that brand, or by the 60 s health check if nothing was sent (AC11 "within 60 s"). Added `lastFailAt` and `outageSince` | Claude Code's unit-test run (AC11) | Claude Code | 2 extra test runs |
| 3 | Unit test (AC11) | After fix 2, the test expected an IronPulse chat to skip the AI, but it got an AI reply | Test mistake: the failed send was on FreshBrew, so only FreshBrew had detected the outage. IronPulse correctly stayed Active until its own health check | Test now uses a FreshBrew chat, and a new assertion checks IronPulse reaches Error at 60 s and both recover when the outage ends | Claude Code's unit-test run | Claude Code | 1 extra test run |
| 4 | Config (`tsconfig.json`) | `tsc` error: `Property 'at' does not exist on type 'Message[]'` (tests passed because Vitest doesn't type-check) | The target lib was ES2020; `Array.prototype.at` is ES2022 | Target and lib → ES2022; unit tests added to the type-check | Claude Code's type-check (tsc) | Claude Code | 1 run |
| 5 | Layout (`App.tsx`) | Screenshot script timed out clicking "Use reply": Playwright found **2** elements with that test id, and the first was invisible | I rendered the Why-flagged and Lead-summary cards twice: in the desktop side column and in the phone "details" drawer, hiding one with CSS. Every test id inside them was duplicated, which would also have broken the 9-step test | Cards now render in one place only, chosen by a `matchMedia('(min-width: 1280px)')` hook. CSS hiding is no longer used for components with test ids | Claude Code's screenshot script | Claude Code | 1 rerun |
| 6 | Phone layout (375 px) | First 375 px screenshot: header, two agent rows and a 5-line footer took ~45% of the screen; the chat had ~180 px. With the details drawer open, the composer was pushed off the bottom | I sized the layout for desktop and only checked that nothing overflowed sideways | Phone-only compact agent pills (one row; Pause hidden for consultants, who can't use it), a one-line footer, details drawer capped at 32vh, chat column clipped, action buttons on their own row | Claude Code, reviewing its own 375 px screenshot | Claude Code | 2 reruns |
| 7 | Static files | Browser console: one 404 on load | No favicon in `public/`, so the browser asked for `/favicon.ico` | Added `public/favicon.svg` and linked it. Console now has 0 errors | Claude Code's screenshot script (console log) | Claude Code | 1 rerun |
| 8 | Screenshot script | Click on `text=Close` timed out | The selector matched more than one element | Gave the sheet's button `data-testid="close-sim"` | Claude Code's screenshot script | Claude Code | 1 rerun |
| 9 | Scope (plan and decision D-10) | The plan built all three Task 2 options, each with its own URL and write-up. The pasted brief says "Choose ONE" | D-10 recorded the earlier working version of the brief, which asked for all three. Nobody re-checked it against the brief text before the build | You chose Option B only ("r2b"). D-10 revised; R2A and R2C folders kept and marked "not being built"; the "Prototype B of 3" and A/C "coming soon" footer text removed | You asked "Check if its correct"; Claude Code's comparison with the brief found it | You decided; Claude Code edited | — |
| 10 | Feature coverage (header, inbox) | Module 4 in the brief lists an Agent Switchboard (Meta Ads, WhatsApp, Voice, Email agents) and live tracking of leads, messages and conversations. Neither was on screen | The build brief was written from the R2B feature list, which didn't include them. The brief's module description was not re-read before building | Added a switchboard row (WhatsApp AI live; the other three shown but greyed, "not part of this prototype") and a live-counts row (leads, messages today with the AI share, active chats, needs human), recomputed on every tick. Logged as F2B.24 and F2B.25 | You asked "Check if its correct"; Claude Code's comparison with the brief found it | Claude Code | 1 build + 1 screenshot rerun |
| 11 | Live counts (`Inbox.tsx`) | At desktop width the stat labels were cut off: "MESSAGE…", "ACTIVE C…", "NEEDS HU…" | Labels were set to truncate in a 320 px column split four ways | Labels wrap onto two lines instead of truncating | Claude Code, reviewing its own desktop screenshot | Claude Code | 1 rerun |
| 12 | Brand-facts label (`approvedFacts.ts`) | Footer still said facts would be "replaced by the approved Model Card (R2C)" after R2C was dropped | The label was written when C was meant to supply B's facts (A32, before the revision) | Label and code comments now point to the R5 financial model; A32 revised | Claude Code, reviewing its own desktop screenshot | Claude Code | 1 rerun |
| 13 | Deploy | The Vercel connector refused to list or create projects: "403 forbidden … scope pehchan-the-traveller". The Vercel CLI on this machine was not logged in | The connector's token had no access to the account's team scope. This was a tooling problem, not a code bug | Switched to the Vercel CLI: you approved a device login in the browser, then the built files were deployed under a new project name | Claude Code (the deploy call failed) | You approved the login; Claude Code deployed | ~5 min |

## Things to watch for (from the template)

| Watch item | Status |
|---|---|
| Design tokens replaced with Tailwind defaults | **Checked in the built CSS.** `#0A0A0F` (hex + `rgb(10 10 15)`), `#111118` as `rgb(17 17 24)`, `#2563EB`, `#10B981`, `#F59E0B` all present. Tailwind writes most colours as `rgb()`, so a plain hex grep misses `#111118`; grep both forms |
| State held in several components and drifting apart | Avoided by design: one pure reducer (`machine.ts`) holds all state |
| Trigger rules hardcoded per conversation | Avoided: rules run on every inbound message; the seed itself is replayed through them (entry 1 is proof) |
| AI still "replies" in HUMAN_ACTIVE | Unit test "9-step test, step 3" passes; to be checked in Playwright |
| Hindi or Devanagari text breaking layout or fonts | Hinglish renders in the screenshots. A Devanagari example ("Hindi" chip in Simulate) exists; not yet screenshotted |
| Timers (SLA, 24 h) not cleared on state change | In code: Claim clears the SLA clock (`flaggedAt`) and hand-back clears the no-reply clock (`awaitingSince`). AC3 and AC8 test that the clocks fire; **no test yet proves they are cleared** |
| Mobile layout overflow | Checked at 375 px: page scroll width = 375 (no sideways scroll). Vertical space was the real problem (entry 6) |

## Unbuilt items → "1 more day"

| Item | Linked 1c acceptance criterion | Est. |
|---|---|---|
