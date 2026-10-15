# R2: Prototype: detailed tasks

Total estimate: **2.75 h** (block B, first thing after the decisions are locked). The 2 h build freeze applies to T2.04–T2.11.

| # | Task | Output | Est. | Owner | Depends on |
|---|---|---|---|---|---|
| T2.01 | Write the one-page build brief (screens, components, mock data, interactions, tokens) | Build brief | (block A) | Claude | R1 1c, R3 |
| T2.02 | Write the Lovable prompt sequence: scaffold + tokens → inbox → thread → rules → state machine → panel → states → polish | Prompt pack | (block A) | Claude | T2.01 |
| T2.03 | Create the Lovable project; connect GitHub; open `build-log-template.md` | Project + log | 5 m | You | — |
| T2.04 | Prompt 1: scaffold, design tokens, shell, nav, badge placeholder. **Check the hex values in the generated code.** | F2.01 | 15 m | You | T2.03 |
| T2.05 | Prompt 2: mock data (10 conversations, 2 brands, EN/HI/Hinglish) + inbox + chips + filter | F2.03, F2.06 | 20 m | You | T2.04 |
| T2.06 | Prompt 3: conversation thread + system events | F2.05 | 15 m | You | T2.05 |
| T2.07 | Prompt 4: trigger engine (R3 rules as pure functions) + "Why flagged" card | F2.07, F2.08 | 20 m | You | T2.06 |
| T2.08 | Prompt 5: state machine (reducer) + Take over / Claim / Return + composer rules | F2.09–F2.11 | 20 m | You | T2.07 |
| T2.09 | Prompt 6: simulate-inbound box + computed autonomy badge + SLA countdown | F2.12, F2.02, F2.04 | 15 m | You | T2.08 |
| T2.10 | Prompt 7 (if time remains): takeover panel, 24 h window, opt-out, empty/error states | F2.13–F2.17 | 10 m | You | T2.09 |
| T2.11 | **Freeze at 2 h.** Log unbuilt items into "1 more day" | Scope frozen | — | You | — |
| T2.12 | Stretch only if done before the freeze: live LLM reply via an edge function with the R3 prompt | F2.19 | 30 m | You | T2.09 + R3 |
| T2.13 | Deploy (Lovable publish or Vercel); confirm the public URL | F2.W1 | 10 m | You | T2.11 |
| T2.14 | Run the 5-point test script in incognito (desktop + mobile width) | Test log | 10 m | You | T2.13 |
| T2.15 | Fix any test blocker (Claude Code or Lovable); redeploy once | Green test | 10 m | You | T2.14 |
| T2.16 | Write up: prompts, what AI got wrong, manual fixes, 1 more day (from the log only) | F2.W2–W5 | 15 m | You + Claude | T2.14 |
| T2.17 | Take 3 screenshots for the doc and PDF backup | F2.W6 | 5 m | You | T2.15 |

## 5-point test script (draft)
1. Load the URL in incognito. The dark theme renders, hex values are correct, and the badge shows a computed %.
2. Simulate "Mujhe franchise lena hai, budget 40 lakh, agreement bhejo". Expected: FLAGGED; reasons = high intent + deal value.
3. Click Claim. Expected: HUMAN_ACTIVE, AI-paused banner, composer enabled, AI does not reply to the next simulated message.
4. Return to AI without a reason. Expected: blocked. With a reason: AI_ACTIVE.
5. Simulate "STOP". Expected: OPTED_OUT and all sending disabled. Then check the layout at 375 px width.
