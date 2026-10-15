# R2B phases status

Checks each phase in [`phases.md`](../../docs/requirements/R2B-whatsapp-agent-panel/phases.md) against its exit criterion. **Last checked: 15 Oct 2026, after the engine step.**

Phases 2–4 were written for Lovable prompts. With Claude Code building (D-01 revised), the work inside each phase follows the [build brief](build-brief.md), but the exit criteria are unchanged.

| Phase | Exit criterion | Status | Evidence / what's missing |
|---|---|---|---|
| **1. Brief** | Every Must feature has a prompt | Done, changed | Replaced by the approved [build brief](build-brief.md), which covers every Must feature. Entry condition "R3 final" was **not met**: R3 is still a draft, so the engine uses the draft triggers (D-12) |
| **2. Scaffold** | Dark theme matches the brief exactly | Partial | Project and tokens set up (faa361a). The shell isn't built and the hex values haven't been checked on screen |
| **3. Core flow** | A simulated message can flag, claim and return | Logic done | Proven in unit tests (AC1, AC2, AC4). Inbox, thread and buttons not built |
| **4. Proof of "working"** | Test steps 2–4 pass | Logic done | Steps 2–4 pass as unit tests. Must pass again through the UI in Playwright |
| **5. Polish / stretch** | Prompt 7 done or skipped | Not started | Stretch LLM out of scope for now |
| **6. Ship** | All 9 steps pass in incognito | Not started | — |
| **7. Write-up** | F2B.W1–W5 complete | Not started | Build log being kept as the source |
| **8. Link up** | F2B.21–F2B.22 done | Blocked | Waits on R2C and R2A |

Work done ahead of its phase: the engine for the takeover panel, 24 h window, opt-out and agent status (phase 5 items) is already built and tested, because it is part of the same state machine.
