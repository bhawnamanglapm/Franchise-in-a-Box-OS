# R2B phases status

Checks each phase in [`phases.md`](../../docs/requirements/R2B-whatsapp-agent-panel/phases.md) against its exit criterion. **Last checked: 15 Oct 2026, after the UI build and the B-only change.**

Phases 2–4 were written for Lovable prompts. With Claude Code building (D-01 revised), the work inside each phase follows the [build brief](build-brief.md), but the exit criteria are unchanged.

| Phase | Exit criterion | Status | Evidence / what's missing |
|---|---|---|---|
| **1. Brief** | Every Must feature has a prompt | Done, changed | Replaced by the approved [build brief](build-brief.md). Entry condition "R3 final" was **not met**: R3 is still a draft, so the engine uses the draft triggers (D-12) |
| **2. Scaffold** | Dark theme matches the brief exactly | Done | Shell on screen; all 5 tokens found in the built CSS |
| **3. Core flow** | A simulated message can flag, claim and return | Built, not yet proven in the UI | Flag and claim seen in the screenshots; return proven in unit tests (AC4). Playwright proves the whole flow next |
| **4. Proof of "working"** | Test steps 2–4 pass | Logic done | Steps 2–4 pass as unit tests. Must pass again through the UI in Playwright |
| **5. Polish / stretch** | Prompt 7 done or skipped | Done (stretch skipped) | Takeover panel, 24 h window, opt-out, agent status, empty/error states built. Stretch LLM skipped (D-08) |
| **6. Ship** | All 9 steps pass in a fresh browser | Not started | Playwright spec, then deploy, then rerun against the live URL |
| **7. Write-up** | F2B.W1–W5 complete | Not started | Build log is the source: 7 prompts, 12 mistakes with "Caught by" and "Fixed by" |
| **8. Link up** | F2B.22 done | Blocked | Waits on R5 (approved figures). Footer links (F2B.21) dropped: Task 2 is Option B only (D-10) |

Added after the brief check (prompt 6): the Agent Switchboard and live tracking (F2B.24, F2B.25), built in phase 5.
