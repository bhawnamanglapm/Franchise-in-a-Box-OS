# Architecture sheet: Franchise-in-a-Box OS

One page to understand how the business, the platform, the Task 2 prototype (Option B) and the submission fit together.
The component register is in [`architecture-components.csv`](architecture-components.csv), which can be imported into Google Sheets.
Every diagram below is also saved as a PNG in [`diagrams/`](diagrams/), ready to paste into the Google Doc.

**Legend:** solid arrow = data or control flow · dotted arrow = supplies facts/config · **[P]** = built in a Task 2 prototype · **[M]** = mocked in the prototypes.

---

## 1. Business context: two funnels, one revenue event

```mermaid
flowchart LR
  subgraph BF["Brand funnel (few, high value)"]
    B1["Brand founder"] --> B2["Onboarding Portal"]
    B2 --> B3["ROI Engine: Model Card + 3-yr ROI"]
    B3 --> B4["Collateral Studio"]
  end
  subgraph FF["Franchisee funnel (many leads, few closes)"]
    F1["Meta Lead Ads"] --> F2["AI Sales Agent: WhatsApp / Voice / Email"]
    F2 --> F3["HITL CRM: consultant"]
    F3 --> F4["Franchisee signed"]
  end
  B3 -. "approved numbers" .-> F2
  B4 -. "creatives + scripts" .-> F1
  B1 -- "setup fee + retainer" --> S["Scale100x revenue"]
  F4 -- "success fee" --> S
```

**Takeaway:** the brand side earns the right to sell. The franchisee side produces both the revenue and the AI leverage.

## 2. Target platform architecture

```mermaid
flowchart TB
  subgraph Client["React + Tailwind app"]
    UI1["Onboarding Portal"]
    UI2["ROI Engine"]
    UI3["Collateral Studio"]
    UI4["Agent Switchboard + Inbox"]
    UI5["HITL CRM"]
    BADGE["Autonomy badge (computed)"]
  end
  subgraph Supabase["Supabase"]
    AUTH["Auth + roles: consultant, manager, brand"]
    DB[("Postgres + RLS")]
    RT["Realtime channels"]
    ST["Storage: decks, P&L"]
    EF["Edge functions"]
  end
  subgraph AI["AI layer"]
    ORCH["Agent orchestrator"]
    RULES["HITL rules engine"]
    LLM["LLM (default chosen in Task 3)"]
    FACTS["Approved facts store"]
  end
  subgraph Ext["External services"]
    META["Meta Lead Ads webhook"]
    BSP["WhatsApp BSP"]
    VOICE["Voice provider"]
    MAIL["Email provider"]
  end
  Client <--> AUTH
  Client <--> DB
  Client <--> RT
  UI1 --> ST
  META --> EF
  BSP <--> EF
  EF --> ORCH
  ORCH --> RULES
  ORCH --> LLM
  FACTS -. "grounding" .-> ORCH
  UI2 -- "approve" --> FACTS
  ORCH --> DB
  RULES -- "flag" --> DB
  DB --> RT
  DB -- "events" --> BADGE
  ORCH --> VOICE
  ORCH --> MAIL
```

## 3. Lead-to-close sequence (also the Task 6A flow)

```mermaid
sequenceDiagram
  autonumber
  participant P as Prospect
  participant M as Meta Lead Ads
  participant E as Ingestion (edge fn)
  participant A as WhatsApp AI agent
  participant R as HITL rules
  participant C as CRM / Consultant
  P->>M: Submits lead form (with consent)
  M->>E: Webhook: lead fields + consent
  E->>E: Validate phone, dedupe, store consent
  E->>A: New lead event
  A->>P: Approved template greeting (within minutes)
  P->>A: Replies (EN / Hindi / Hinglish)
  A->>R: Evaluate message + extracted fields
  alt No trigger
    R-->>A: Continue
    A->>P: Qualify / answer from approved facts
  else Trigger fired
    R-->>C: FLAGGED with reasons + summary
    A->>P: Holding message
    C->>C: Claim (lock) → HUMAN_ACTIVE
    C->>P: Human reply / book discovery call
  end
  C->>C: Deal stage → Won / Lost
```

## 4. Takeover state machine (Task 1c, built in prototype B)

```mermaid
stateDiagram-v2
  [*] --> AI_ACTIVE
  AI_ACTIVE --> FLAGGED: HITL rule fires (T1)
  AI_ACTIVE --> HUMAN_ACTIVE: Take over (T2)
  FLAGGED --> HUMAN_ACTIVE: Claim, first wins (T3)
  FLAGGED --> ESCALATED: SLA 10 business min (T4)
  ESCALATED --> HUMAN_ACTIVE: Manager assigns (T5)
  HUMAN_ACTIVE --> AI_ACTIVE: Return with reason (T6)
  HUMAN_ACTIVE --> FLAGGED: No human reply 30 min (T7)
  HUMAN_ACTIVE --> CLOSED_WON: Deal won (T8)
  HUMAN_ACTIVE --> CLOSED_LOST: Deal lost (T8)
  AI_ACTIVE --> OPTED_OUT: STOP (T9)
  FLAGGED --> OPTED_OUT: STOP (T9)
  ESCALATED --> OPTED_OUT: STOP (T9)
  HUMAN_ACTIVE --> OPTED_OUT: STOP (T9)
  CLOSED_WON --> [*]
  CLOSED_LOST --> [*]
  OPTED_OUT --> [*]
```

A closed lead who messages again reopens to `AI_ACTIVE` with history kept (edge case 4). This is left out of the diagram for readability.

## 5. Core data model

```mermaid
erDiagram
  BRAND ||--o{ LEAD : owns
  BRAND ||--o{ APPROVED_FACT : publishes
  LEAD ||--|| CONVERSATION : has
  CONVERSATION ||--o{ MESSAGE : contains
  CONVERSATION ||--o{ FLAG : raises
  CONVERSATION ||--o{ STATE_EVENT : logs
  LEAD ||--o| DEAL : becomes
  USER ||--o{ CONVERSATION : "assigned to"
  LEAD ||--o{ CONSENT_RECORD : records
  ACTION_EVENT }o--|| BRAND : "counted for"
  BRAND {
    uuid id
    string name
    string category
  }
  LEAD {
    uuid id
    string phone_e164
    string city
    int investment_inr
    string source_ad_id
  }
  CONVERSATION {
    uuid id
    string state
    int state_version
    datetime window_expires_at
    uuid assignee_id
  }
  MESSAGE {
    uuid id
    string sender
    string body
    string delivery_status
  }
  FLAG {
    uuid id
    string rule_ids
    datetime sla_due_at
  }
  DEAL {
    uuid id
    string stage
    int value_inr
  }
  ACTION_EVENT {
    uuid id
    string action_type
    string actor
    bool ai_draft_edited
    int std_minutes
  }
  CONSENT_RECORD {
    uuid id
    string status
    string text_version
    datetime ts
  }
```

`ACTION_EVENT` feeds the Autonomy Rate (Task 1b). `state_version` provides the optimistic lock for claims.

## 6. Prototype architecture (Task 2, Option B: what's real vs mocked)

```mermaid
flowchart TB
  subgraph PB["B. WhatsApp AI Agent Panel (one public URL)"]
    TOK["Design tokens from the brief [P]"]
    SW["Agent Switchboard: WhatsApp live, Meta/Voice/Email shown, not built [P]"]
    LS["Live counts: leads, messages, chats, needs human [P]"]
    B1["Simulate inbound box [P]"]
    B2["Trigger engine from Task 3 [P]"]
    B3["State machine reducer from 1c [P]"]
    B4["Inbox + thread + Why-flagged + takeover [P]"]
    BG["Computed autonomy badge [P]"]
    MD["Mock data: FreshBrew + fictional gym [M]"]
    FX["Agent facts: illustrative until R5 [M]"]
  end
  R5S["R5 Google Sheet"]
  LLM2["Optional live LLM (stretch)"]
  EXT["Real WhatsApp / Meta / Supabase storage + auth [M]"]
  B1 --> B2 --> B3 --> B4
  B3 --> BG
  B3 --> LS
  MD --> B4
  FX --> B2
  R5S -. "approved figures replace placeholders (A32)" .-> FX
  PB -. "stretch" .-> LLM2
  EXT -. "not connected" .-> PB
```

Prototype B is a Vite app built by Claude Code and hosted on Vercel (D-01). Logic runs in the browser with mock data; there is no backend, and the brief's Supabase is not used (A11). Task 2 says "Choose ONE", so Options A (Onboarding Wizard) and C (ROI Dashboard) are not built (D-10).

### 6.1 WhatsApp AI Agent Panel end to end: who uses it and what's inside

Every box carries the feature IDs from [`R2B features.md`](requirements/R2B-whatsapp-agent-panel/features.md), so each feature can be traced to where it lives.

```mermaid
flowchart TB
  subgraph PEOPLE["Who uses it"]
    direction LR
    P["Prospect<br/>wants to buy a franchise<br/>(chats on WhatsApp)"]
    C["Consultant<br/>Neha, Priya, Arjun"]
    M["Brand manager<br/>Ravi"]
  end

  subgraph PANEL["WhatsApp AI Agent Panel (what the team sees)"]
    direction LR
    SH["App shell (F2B.01)<br/>dark theme tokens, Inter + mono<br/>5-module nav, only Sales Agent active<br/>footer: mock data, nothing sent"]
    SIM["Simulate box (F2B.12)<br/>plays the prospect,<br/>second consultant (F2B.16),<br/>outage and failed-send toggles"]
    H["Top bar<br/>Agent Switchboard (F2B.24)<br/>agent status, Pause agent (F2B.23)<br/>AI share of work badge (F2B.02)"]
    I["Inbox (F2B.03)<br/>live counts (F2B.25, part of F2B.18)<br/>state chips, Needs human filter<br/>claim timers, red under 2 min (F2B.04)"]
    T["Open chat<br/>thread + system events (F2B.05)<br/>Why flagged + Resolve (F2B.08)<br/>Take over / Claim / Return /<br/>Won / Lost (F2B.10)"]
    TP["Takeover panel (F2B.13)<br/>lead summary, score,<br/>suggested reply"]
    CO["Reply box (F2B.11)<br/>locked unless you own the chat<br/>AI paused banner, n / 4,096<br/>templates after 24 h (F2B.14)"]
  end

  subgraph BRAIN["Logic (runs in the browser)"]
    direction LR
    R["Rule checker (F2B.07)<br/>does this message<br/>need a human?<br/>draft R3 rules"]
    S["Chat state machine (F2B.09)<br/>AI active, flagged, escalated,<br/>human active, won, lost,<br/>opted out (F2B.15)"]
    A["AI agent<br/>scripted replies from facts<br/>queued 2 s, cancelled<br/>on takeover"]
    K["Clock<br/>claim timers,<br/>24 h reply window"]
    U["Autonomy calculator<br/>AI work vs human work"]
    ER["Errors and edge cases (F2B.17)<br/>empty inbox, skeletons,<br/>failed send + Retry,<br/>failed takeover keeps state"]
  end

  subgraph DATA["Data (mock)"]
    direction LR
    D1["2 brands + 4 users<br/>FreshBrew + fictional gym"]
    D2["10 sample chats (F2B.06)<br/>English, Hinglish,<br/>Rs lakh, Tier 1/2 cities"]
    D3["Brand facts + templates (F2B.22)<br/>illustrative until R5 model"]
    D4["Event log"]
  end

  subgraph LATER["Not connected in the prototype"]
    direction LR
    X1["Real WhatsApp + Supabase<br/>database and login (F2B.20)"]
    X2["Meta Ads, Voice, Email agents<br/>(switchboard tiles only)"]
    X4["Live AI model<br/>(F2B.19, stretch)"]
    X5["R5 approved figures<br/>(replace illustrative facts)"]
  end

  R --> S --> A
  K --> S
  S --> U
  S --> ER
  P -- "sends message" --> SIM
  C -- "claims, replies, returns" --> T
  M -- "assigns escalated chats, pauses agents" --> H
  PANEL -- "every click and message" --> BRAIN
  BRAIN -- "new state, replies, counts" --> PANEL
  DATA --> BRAIN
  LATER -. "1 more day / production" .-> PANEL
```

Image: [`diagrams/10-panel-end-to-end.png`](diagrams/10-panel-end-to-end.png). The AI handles routine chats, and the rule checker spots when a person is needed. In the prototype the Simulate box plays the prospect and nothing is sent to real WhatsApp. F2B.21 (cross-prototype footer) is dropped (D-10), so it isn't shown.

### 6.2 WhatsApp AI Agent Panel user journey: one chat, end to end

```mermaid
sequenceDiagram
  actor P as Prospect
  participant AI as AI agent
  participant PN as Panel
  actor C as Consultant
  actor M as Manager

  P->>PN: "Hi, FreshBrew franchise kitna ka hai?"
  PN->>PN: Rule checker: no human needed (F2B.07)
  AI->>P: Answers from brand facts after 2 s (F2B.22)
  P->>PN: "Mere paas 45 lakh hai, owner se baat karni hai"
  PN->>PN: Rule fires: budget over limit + asks for a person
  PN->>P: Holding message: "A consultant will reply shortly"
  PN->>C: Chat moves to Needs human with Why flagged and a claim timer (F2B.04, F2B.08)
  alt Consultant claims in time
    C->>PN: Claim, first click wins (F2B.10)
    PN-->>C: A second consultant sees "Already claimed by Priya" (F2B.16)
    Note over AI: AI stays silent while a person has the chat, queued AI reply cancelled (F2B.09)
    PN->>C: Takeover panel: lead summary, score, suggested reply (F2B.13)
    C->>P: Replies personally from the unlocked reply box (F2B.11)
    alt Hand back
      C->>PN: Return to AI, reason required, compliance flags resolved first
      AI->>P: AI continues the chat
    else Close
      C->>PN: Mark Won or Lost
    end
  else Nobody claims in 10 business minutes
    PN->>M: Escalated to manager
    M->>PN: Assigns a consultant
  end
  opt More than 24 h since the prospect's last message
    PN->>C: Reply box switches to the template picker (F2B.14)
  end
  P->>PN: "STOP" or "band karo"
  PN->>PN: Opted out, all sending stops (F2B.15)
  PN->>PN: Badge and live counts update after every step (F2B.02, F2B.25)
```

Image: [`diagrams/11-panel-user-journey.png`](diagrams/11-panel-user-journey.png). A consultant claims a flagged chat and the AI goes quiet. If no one claims it in time, the manager is pulled in. The state names and rules come from the takeover state machine in §4.

### 6.3 WhatsApp AI Agent Panel: from build to submission

The brief asks for five things with the prototype. This shows where each one comes from.

```mermaid
flowchart TD
  A["Option B brief:<br/>WhatsApp AI Agent Panel"] --> B["Build with Claude Code<br/>React + Tailwind, mock data"]
  B --> LOG["Build log<br/>kept while building"]
  B --> T["Test the app<br/>unit tests + 9-step browser test,<br/>desktop and 375 px"]
  T --> D["Deploy to Vercel"]
  T --> SS["Screenshots (F2B.W6)"]

  D --> S1["1. Live URL (F2B.W1)"]
  LOG --> S2["2. Exact prompts used (F2B.W2)"]
  LOG --> S3["3. What AI got wrong (F2B.W3)"]
  LOG --> S4["4. What you fixed manually (F2B.W4)<br/>with who caught and who fixed each"]
  LOG --> S5["5. What you'd improve with 1 more day (F2B.W5)<br/>tied to 1c acceptance criteria"]

  S1 --> W["Write-up README"]
  S2 --> W
  S3 --> W
  S4 --> W
  S5 --> W
  SS --> W
  W --> SUB["Submit"]
```

Image: [`diagrams/12-panel-submission-flow.png`](diagrams/12-panel-submission-flow.png). Items 2–5 come from the build log, which is written during the build, not reconstructed afterwards.

## 7. Delivery plan (requirements → artefacts)

```mermaid
flowchart LR
  L["Phase 0 lens"] --> R1["R1 Task 1"]
  R1 --> R4["R4 Task 4"]
  R4 --> R3["R3 Task 3"]
  R3 --> R2B["R2B Prototype B"]
  L --> R5["R5 Model"]
  R5 -. "approved figures" .-> R2B
  R3 --> R6["R6 Task 6"]
  R2B --> R7["R7 Task 7"]
  R5 --> R7
  R1 --> DOC["Google Doc / PDF"]
  R3 --> DOC
  R4 --> DOC
  R6 --> DOC
  R7 --> DOC
  R2B --> URLB["Prototype URL"]
  R5 --> SHEET["Google Sheet"]
  DOC --> SUB["Submit: 3 links, inside 72 h"]
  URLB --> SUB
  SHEET --> SUB
```

```mermaid
gantt
  title Sprint plan (relative hours, estimates only)
  dateFormat HH:mm
  axisFormat %H:%M
  todayMarker off
  section Decide
  R1 Product thinking        :r1, 00:00, 90m
  R4 Prioritisation          :r4, after r1, 30m
  R3 Agent design            :r3, after r4, 60m
  R2B Build brief + prompts  :rb, after r3, 30m
  section Build
  R2B Build                  :r2, after rb, 120m
  R2B Ship + write-up        :r2s, after r2, 45m
  R5 Model                   :r5, after r2s, 120m
  Swap R5 figures into B     :lk, after r5, 10m
  section Finish
  R6 Automation + research   :r6, after lk, 60m
  R7 How I work              :r7, after r6, 30m
  R8 Assemble + submit       :r8, after r7, 60m
```

The Gantt shows elapsed hours from the moment you start (~11 h in total). Estimates are for planning only; quality comes first, and the work can span more than one day inside the 72 h deadline (D-07). Breaks aren't drawn.
