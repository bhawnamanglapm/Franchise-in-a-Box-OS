# R2B features status

Checks every feature in [`features.md`](../../docs/requirements/R2B-whatsapp-agent-panel/features.md) against what is built. Updated as the build goes. **Last checked: 15 Oct 2026, after the engine step (46 unit tests passing).**

**Status key:** **Done** = built and proven · **Logic done** = engine built and unit-tested, no screen yet · **Partial** = some of it built · **Not started** · **Blocked** = waits on another requirement · **Won't** = out of scope by design

**Summary:** the engine behind 13 features is built and tested. No feature is visible yet, because the UI is the next step. 2 features are blocked on R2C and R2A.

## Screens and features

| ID | Feature | MoSCoW | Status | Evidence / what's missing |
|---|---|---|---|---|
| F2B.01 | App shell + design tokens | M | Partial | All 5 hex tokens + Inter / JetBrains Mono are in `tailwind.config.js` (commit faa361a). Still missing: the shell, the nav, and a check of the hex values in the built CSS |
| F2B.02 | Computed autonomy badge | M | Logic done | `engine/autonomy.ts` computes it from the ACTION_EVENT log with std minutes from `ai-human-split.csv`. Test "Autonomy Rate (1b §5)" proves it is computed and drops after a takeover. Badge + tooltip UI not built |
| F2B.03 | Inbox list | M | Not started | — |
| F2B.04 | SLA countdown | M | Logic done | `claimTimeLeft()` in `machine.ts`. Test AC3 proves escalation at exactly 10 business minutes, and 09:10 for after-hours flags. Countdown chip and red-under-2-min styling not built |
| F2B.05 | Conversation thread | M | Logic done | The engine writes system events into the thread ("AI paused: Neha took over", "AI reply cancelled: …", "Escalated to Ravi…"). Bubbles not built |
| F2B.06 | Realistic mock data | M | Partial | `data/conversations.ts`: 10 chats, 2 brands, EN + Hinglish, ₹ lakh, Tier 1/2 cities, masked phones, replayed through the engine. **Gap:** no message in Devanagari Hindi yet (the trigger tests cover `बंद करो`, but the seed has none) |
| F2B.07 | Trigger engine | M | Logic done | `engine/triggers.ts`: rules F3.A1–A8 run on every inbound message. 23 tests. Uses the **draft** R3 rules (see D-12) |
| F2B.08 | "Why flagged" card | M | Logic done | Every hit carries rule, label and the actual value (e.g. "Stated investment ₹50L, brand threshold ₹40L"); test AC1. Card not built |
| F2B.09 | Takeover state machine | M | Logic done | `engine/machine.ts`: 7 states, T1–T9, "Only if" guards, `state_version` 409, requestId de-dup, queued reply cancel. Tests AC1–AC11 |
| F2B.10 | Take over / Claim / Return buttons | M | Logic done | Commands and guards exist: Return needs a reason, A7 must be resolved, the draft must be empty (test AC4). Buttons not built |
| F2B.11 | Composer rules | M | Logic done | Send is refused unless the person owns the chat; 4,096 limit (AC5). "AI paused" banner and disabled composer not built |
| F2B.12 | Simulate inbound message box | M | Logic done | The `inbound` command runs the rules and the state machine. Box not built |
| F2B.13 | Takeover panel | S | Partial | `summarise()` in `engine/agent.ts` gives budget, city, timeline, objections, last question, score, suggested reply. **Not unit-tested yet.** Panel not built |
| F2B.14 | 24 h window indicator | S | Logic done | Free text refused after 24 h, template allowed (test AC6); `windowLeft()` for the countdown. Indicator and template picker not built |
| F2B.15 | Opt-out | S | Logic done | STOP / band karo / Unsubscribe from any open state; every send blocked; START opts back in (test AC7). UI not built |
| F2B.16 | Claim conflict demo | S | Logic done | Test AC2: the second claim gets "Already claimed by Priya at 14:00". "Simulate second consultant" button not built |
| F2B.17 | Empty / loading / error states | S | Partial | Engine: failed send + retry without duplicates, failed takeover keeps the previous state (AC10, AC11). Empty, skeleton and error UI not built |
| F2B.23 | Agent status strip | S | Logic done | Active / Paused / Error with auto-detection and recovery; only the manager can pause (tests AC11 + "agent pause"). Strip not built |
| F2B.18 | Metrics strip | C | Not started | — |
| F2B.19 | Stretch: live LLM reply | C | Not started | Out of scope for now (needs R3's model choice, D-08). Goes on the "1 more day" list unless time allows |
| F2B.20 | Real WhatsApp / Supabase backend | W | Won't | By design (A11, A17) |
| F2B.21 | Cross-prototype footer | S | Blocked | R2A and R2C don't exist yet. Plan: "coming soon" links until they ship (T2B.18) |
| F2B.22 | Approved facts from R2C | S | Blocked | R2C not built. `data/approvedFacts.ts` holds **illustrative placeholders**, labelled in the file and to be labelled in the UI (A32) |

## Write-up components

| ID | Component | MoSCoW | Status | Evidence / what's missing |
|---|---|---|---|---|
| F2B.W1 | Live URL | M | Not started | Deploy comes after the UI and the 9-step test |
| F2B.W2 | Exact prompts used, in order | M | Partial | Recorded verbatim in [build-log.md](build-log.md) as they happen |
| F2B.W3 | What AI got wrong | M | Partial | 4 real entries in the build log so far (component, symptom, cause) |
| F2B.W4 | What I fixed manually | M | Partial | Each of the 4 entries has its fix. Write-up not drafted |
| F2B.W5 | 1 more day improvements | M | Not started | The list fills in as items are left unbuilt |
| F2B.W6 | 3 screenshots + optional Loom | C | Not started | Screenshots come at the UI checkpoint |
