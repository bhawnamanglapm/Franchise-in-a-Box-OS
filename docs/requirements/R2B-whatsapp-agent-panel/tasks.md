# R2B: WhatsApp AI Agent Panel: detailed tasks

Total estimate: **2.75 h** (Build block, first of the three prototypes, after the decisions are locked).

| # | Task | Output | Est. | Owner | Depends on |
|---|---|---|---|---|---|
| T2B.01 | Write the one-page build brief (screens, components, mock data, interactions, tokens) | Build brief | (Decide block) | Claude | R1 1c, R3 |
| T2B.02 | Write the Lovable prompt sequence: scaffold + tokens → inbox → thread → rules → state machine → panel → states → polish. Prompt 1 is the shared shell used by R2A and R2C too. | Prompt pack | (Decide block) | Claude | T2B.01 |
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
| T2B.14 | Run the 5-point test script in incognito (desktop + mobile width) | Test log | 10 m | You | T2B.13 |
| T2B.15 | Fix any test blocker (Claude Code or Lovable); redeploy once | Green test | 10 m | You | T2B.14 |
| T2B.16 | Write up: prompts, what AI got wrong, manual fixes, 1 more day (from the log only) | F2B.W2–W5 | 15 m | You + Claude | T2B.14 |
| T2B.17 | Take 3 screenshots for the doc and PDF backup | F2B.W6 | 5 m | You | T2B.15 |
| T2B.18 | After R2C ships: copy its approved Model Card facts into the mock facts; add footer links to A and C | F2B.21, F2B.22 | 10 m | You | R2C, R2A URLs |

## 5-point test script (draft)
1. Load the URL in incognito. The dark theme renders, hex values are correct, and the badge shows a computed %.
2. Simulate "Mujhe franchise lena hai, budget 40 lakh, agreement bhejo". Expected: FLAGGED; reasons = high intent + deal value.
3. Click Claim. Expected: HUMAN_ACTIVE, AI-paused banner, composer enabled, AI does not reply to the next simulated message.
4. Return to AI without a reason. Expected: blocked. With a reason: AI_ACTIVE.
5. Simulate "STOP". Expected: OPTED_OUT and all sending disabled. Then check the layout at 375 px width.
