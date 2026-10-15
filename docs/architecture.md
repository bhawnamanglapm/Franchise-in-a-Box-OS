# Architecture sheet: Franchise-in-a-Box OS

One page to understand how the business, the platform, the three prototypes and the submission fit together.
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

## 6. Prototype architecture (Task 2: three apps, what's real vs mocked)

```mermaid
flowchart TB
  subgraph SH["Shared across A, B, C"]
    TOK["Design tokens + Prompt 1 shell [P]"]
    MD["Mock data: FreshBrew + fictional gym [M]"]
    BG["Computed autonomy badge [P]"]
  end
  subgraph PA["A. Onboarding Wizard (own URL)"]
    A1["4-step stepper + validation [P]"]
    A2["File checks; CSV parsed, PDF/XLSX extraction mocked [P/M]"]
    A3["Revenue-split donut, totals 100% [P]"]
    A4["Readiness Score: rule-based v0 [P]"]
  end
  subgraph PC["C. ROI Dashboard (own URL)"]
    C1["computeModel = R5 formulas [P]"]
    C2["Model Card + 36-month chart + sensitivity [P]"]
    C3["Benchmarks India + US, sourced only [P]"]
    C4["Insights: rule-based v0 [P]"]
    C5["Approve + export facts [P]"]
  end
  subgraph PB["B. WhatsApp AI Agent Panel (own URL)"]
    B1["Simulate inbound box [P]"]
    B2["Trigger engine from Task 3 [P]"]
    B3["State machine reducer from 1c [P]"]
    B4["Inbox + thread + Why-flagged [P]"]
  end
  R5S["R5 Google Sheet"]
  LLM2["Optional live LLM via edge fn (stretch, one per app)"]
  EXT["Real WhatsApp / Meta / Supabase storage + auth [M]"]
  A1 --> A2 --> A3 --> A4
  A4 -. "brand record JSON" .-> C1
  R5S -. "inputs + formulas (A32)" .-> C1
  C1 --> C2
  C1 --> C4
  C2 --> C5
  C5 -. "approved facts JSON" .-> B2
  B1 --> B2 --> B3 --> B4
  SH -.-> PA
  SH -.-> PB
  SH -.-> PC
  PB -. "stretch" .-> LLM2
  EXT -. "not connected" .-> PB
```

Each prototype is a separate Lovable project with its own URL and GitHub sync. Logic runs in the browser. The JSON hand-offs are file exports and imports, not a shared backend (A11). One number set flows through all three: R5 → C → B (A32).

## 7. Delivery plan (requirements → artefacts)

```mermaid
flowchart LR
  L["Phase 0 lens"] --> R1["R1 Task 1"]
  R1 --> R4["R4 Task 4"]
  R4 --> R3["R3 Task 3"]
  R3 --> R2B["R2B Prototype B"]
  L --> R5["R5 Model"]
  R5 --> R2C["R2C Prototype C"]
  R2C -. "approved facts" .-> R2B
  R1 --> R2A["R2A Prototype A"]
  R3 --> R6["R6 Task 6"]
  R2A --> R7["R7 Task 7"]
  R2B --> R7
  R2C --> R7
  R5 --> R7
  R1 --> DOC["Google Doc / PDF"]
  R3 --> DOC
  R4 --> DOC
  R6 --> DOC
  R7 --> DOC
  R2A --> URLA["URL A"]
  R2B --> URLB["URL B"]
  R2C --> URLC["URL C"]
  R5 --> SHEET["Google Sheet"]
  DOC --> SUB["Submit: 5 links, inside 72 h"]
  URLA --> SUB
  URLB --> SUB
  URLC --> SUB
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
  R2C ROI Dashboard          :r2c, after r5, 135m
  R2A Onboarding Wizard      :r2a, after r2c, 120m
  Link-up A/B/C              :lk, after r2a, 10m
  section Finish
  R6 Automation + research   :r6, after lk, 60m
  R7 How I work              :r7, after r6, 30m
  R8 Assemble + submit       :r8, after r7, 60m
```

The Gantt shows elapsed hours from the moment you start (~15 h in total). Estimates are for planning only; quality comes first, and the work can span more than one day inside the 72 h deadline (D-07). Breaks aren't drawn.
