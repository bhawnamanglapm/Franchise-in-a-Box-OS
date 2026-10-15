# R2B: WhatsApp AI Agent Panel: detailed tasks

Total estimate: **2.75 h** (Build block, first of the three prototypes, after the decisions are locked).

> **Changed 15 Oct 2026 (D-01 revised):** Claude Code builds the prototype instead of Lovable. "Prompt N" tasks are now build steps done by Claude Code, with you reviewing at each checkpoint. The table below is the original plan; current owners and status are in [`outputs/R2B-whatsapp-agent-panel/tasks-status.md`](../../../outputs/R2B-whatsapp-agent-panel/tasks-status.md).

| # | Task | Output | Est. | Owner | Depends on |
|---|---|---|---|---|---|
| T2B.01 | Write the one-page build brief (screens, components, mock data, interactions, tokens) | Build brief | (Decide block) | Claude | R1 1c, R3 |
| T2B.02 | Write the Lovable prompt sequence: scaffold + tokens → inbox → thread → rules → state machine → panel → states → polish. (Superseded by D-01: built in Claude Code.) | Prompt pack | (Decide block) | Claude | T2B.01 |
| T2B.03 | Create the Lovable project; connect GitHub; open `build-log-template.md` | Project + log | 5 m | You | — |
| T2B.04 | Prompt 1: scaffold, design tokens, shell, nav, badge placeholder. **Check the hex values in the generated code.** | F2B.01 | 15 m | You | T2B.03 |
| T2B.05 | Prompt 2: mock data (10 conversations, 2 brands, EN/HI/Hinglish) + inbox + chips + filter | F2B.03, F2B.06 | 20 m | You | T2B.04 |
| T2B.06 | Prompt 3: conversation thread + system events | F2B.05 | 15 m | You | T2B.05 |
| T2B.07 | Prompt 4: trigger engine (R3 rules as pure functions) + "Why flagged" card | F2B.07, F2B.08 | 20 m | You | T2B.06 |
| T2B.08 | Prompt 5: state machine (reducer) + Take over / Claim / Return + composer rules | F2B.09–F2B.11 | 20 m | You | T2B.07 |
| T2B.09 | Prompt 6: simulate-inbound box + computed autonomy badge + SLA countdown | F2B.12, F2B.02, F2B.04 | 15 m | You | T2B.08 |
| T2B.10 | Prompt 7: takeover panel, 24 h window, opt-out, empty/error states | F2B.13–F2B.17 | 10 m | You | T2B.09 |
| T2B.11 | Log unbuilt items into "1 more day" | Unbuilt list | — | You | — |
| T2B.12 | Stretch, if time allows: live LLM reply via an edge function with the R3 prompt | F2B.19 | 30 m | You | T2B.09 + R3 |
| T2B.13 | Deploy (Lovable publish or Vercel); confirm the public URL | F2B.W1 | 10 m | You | T2B.11 |
| T2B.14 | Run the 9-step test script in incognito (desktop + mobile width) | Test log | 10 m | You | T2B.13 |
| T2B.15 | Fix any test blocker (Claude Code or Lovable); redeploy once | Green test | 10 m | You | T2B.14 |
| T2B.16 | Write up: prompts, what AI got wrong, manual fixes, 1 more day (from the log only) | F2B.W2–W5 | 15 m | You + Claude | T2B.14 |
| T2B.17 | Take 3 screenshots for the doc and PDF backup | F2B.W6 | 5 m | You | T2B.15 |
| T2B.18 | After R5 is done: replace the illustrative facts with R5's approved figures; redeploy | F2B.22 | 10 m | You | R5 Sheet |

## 9-step test script (draft)

Steps 2–9 cover the 1c tests the prototype runs directly: AC1, AC2, AC4, AC5, AC7, AC9 and AC10.
1. Load the URL in incognito. The dark theme renders, hex values are correct, and the badge shows a computed %.
2. Simulate "Mujhe franchise lena hai, budget 40 lakh, agreement bhejo". Expected: FLAGGED; reasons = high intent + deal value; one holding message (AC1).
3. Click Claim. Expected: HUMAN_ACTIVE, AI-paused banner, composer enabled, AI does not reply to the next simulated message.
4. Return to AI without a reason. Expected: blocked. With a reason: AI_ACTIVE (AC4).
5. Simulate "STOP". Expected: OPTED_OUT and all sending disabled (AC7). Then check the layout at 375 px width.
6. In a human-handled chat, paste 4,097 characters. Expected: Send disabled and the counter red; at 4,096 it sends (AC5).
7. On a flagged chat, click "Simulate second consultant", then Claim. Expected: one claim wins; the other sees "Already claimed by Priya" (AC2).
8. In an AI-handled chat, simulate a message and click Take over before the AI reply appears (the mock AI waits 2 s). Expected: no AI reply is shown; the thread says "AI reply cancelled" (AC9).
9. Double-click Take over. Expected: one assignment and one log entry (AC10).
