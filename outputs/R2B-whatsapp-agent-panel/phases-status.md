# R2B phases status

Checks each phase in [`phases.md`](../../docs/requirements/R2B-whatsapp-agent-panel/phases.md) against its exit criterion. **Last checked: 16 Oct 2026, after the Playwright 9-step run and the write-up.**

Phases 2–4 were written for Lovable prompts. With Claude Code building (D-01 revised), the work inside each phase follows the [build brief](build-brief.md), but the exit criteria are unchanged.

| Phase | Exit criterion | Status | Evidence / what's missing |
|---|---|---|---|
| **1. Brief** | Every Must feature has a prompt | Done, changed | Replaced by the approved [build brief](build-brief.md). Entry condition "R3 final" was not met at the time, so the engine used the draft triggers (D-12). R3 has since been written from the engine's own trigger table, so the two match |
| **2. Scaffold** | Dark theme matches the brief exactly | Done | Shell on screen; all 5 tokens found in the built CSS; Playwright step 1 checks the body colour |
| **3. Core flow** | A simulated message can flag, claim and return | Done | Playwright steps 2–4 drive it through the real UI |
| **4. Proof of "working"** | Test steps 2–4 pass | Done | Pass as unit tests and in Playwright (desktop + 375 px, local + live) |
| **5. Polish / stretch** | Prompt 7 done or skipped | Done (stretch skipped) | Takeover panel, 24 h window, opt-out, agent status, empty/error states built. Stretch LLM skipped; first item on the "1 more day" list |
| **6. Ship** | All 9 steps pass in a fresh browser | Done | Deployed to Vercel; [`nine-step.spec.ts`](../../prototypes/r2b-whatsapp-agent-panel/tests/e2e/nine-step.spec.ts) passes 4 of 4 runs (1440 px and 375 px, local and live), each in a fresh browser profile. No blocker found, so no redeploy was needed for T2B.15 |
| **7. Write-up** | F2B.W1–W5 complete | Done | [README.md](README.md): live URL, 14 prompts verbatim, 15 mistakes, the manual-fix split, "1 more day" mapped to AC1–AC11, 3 screenshots. Source: the [build log](build-log.md) |
| **8. Link up** | F2B.22 done | Done | R5 figures swapped in and redeployed 17 Oct 2026 (T2B.18). Footer links (F2B.21) dropped: Task 2 is Option B only (D-10) |

Added after the brief check (prompt 6): the Agent Switchboard and live tracking (F2B.24, F2B.25), built in phase 5.
