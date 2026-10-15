// Shared types. State names and transitions follow outputs/R1-product-thinking/1c-takeover-spec.md §3.

export type ConvState =
  | 'AI_ACTIVE'
  | 'FLAGGED'
  | 'ESCALATED'
  | 'HUMAN_ACTIVE'
  | 'CLOSED_WON'
  | 'CLOSED_LOST'
  | 'OPTED_OUT'

export type AgentStatus = 'ACTIVE' | 'PAUSED' | 'ERROR'

export type Role = 'consultant' | 'manager'

export interface User {
  id: string
  name: string
  role: Role
  brands: string[]
}

export interface Brand {
  id: string
  name: string
  category: string
  /** A2 threshold: the brand's full franchise investment, in ₹ lakh (illustrative until R2C approves it). */
  fullInvestmentLakh: number
}

/** Draft triggers from docs/requirements/R3-ai-agent-design/features.md (F3.A1–A9). */
export type TriggerId = 'A1' | 'A2' | 'A3' | 'A4' | 'A5' | 'A6' | 'A7' | 'A8' | 'NO_REPLY' | 'AI_OFF'

export interface TriggerHit {
  rule: TriggerId
  label: string
  /** Plain-words reason with the actual value, e.g. "Stated investment ₹45L, brand threshold ₹40L". */
  reason: string
  /** Legal / financial / compliance flags must be marked resolved before Return to AI (T6). */
  compliance: boolean
  resolved: boolean
  at: number
}

export type Sender = 'prospect' | 'ai' | 'human' | 'system'

export type MessageStatus = 'sent' | 'failed' | 'cancelled'

export interface Message {
  id: string
  convId: string
  sender: Sender
  text: string
  ts: number
  status: MessageStatus
  by?: string
  /** Approved-fact topic an AI answer came from (shown as a tag on the bubble). */
  factTopic?: string
  template?: boolean
  retries?: number
}

export interface Prospect {
  name: string
  phone: string
  city: string
}

export interface Conversation {
  id: string
  brandId: string
  prospect: Prospect
  state: ConvState
  /** state_version: +1 on every state change; every state-changing button sends the version it saw. */
  version: number
  assignee?: string
  flags: TriggerHit[]
  flaggedAt?: number
  /** For T7 re-flags: the previous owner gets the first 2 minutes to claim it back. */
  priorityUser?: string
  priorityUntil?: number
  escalatedAt?: number
  lastProspectAt: number
  /** HUMAN_ACTIVE: when the oldest unanswered prospect message arrived (T7 clock). */
  awaitingSince?: number
  holdingSent: boolean
  consent: 'given' | 'withdrawn'
  lowConfidenceStreak: number
  topicAsks: Record<string, number>
  lossReason?: string
  previousOutcome?: 'CLOSED_WON' | 'CLOSED_LOST'
  deliveryProblem?: boolean
}

export interface StateEvent {
  id: string
  convId: string
  from: ConvState
  to: ConvState
  by: string
  reason: string
  ts: number
  version: number
}

/** ACTION_EVENT, as in R1 1b §5. */
export interface ActionEvent {
  id: string
  brandId: string
  convId?: string
  actionRow: number
  actionType: string
  actor: 'ai_model' | 'software' | 'human'
  aiDraftEdited: boolean
  stdMinutes: number
  status: 'completed' | 'failed' | 'cancelled'
  ts: number
}

export interface QueuedReply {
  id: string
  convId: string
  dueAt: number
  text: string
  factTopic?: string
  actionRow: number
}

export interface AgentInfo {
  status: AgentStatus
  lastSendAt?: number
  lastError?: string
  changedBy?: string
  changedAt?: number
  errorSince?: number
  /** Last time a send for this brand failed (drives the Active → Error check). */
  lastFailAt?: number
}

export interface World {
  now: number
  conversations: Record<string, Conversation>
  order: string[]
  messages: Record<string, Message[]>
  stateLog: StateEvent[]
  actions: ActionEvent[]
  queue: QueuedReply[]
  agents: Record<string, AgentInfo>
  /** outageSince: when the simulated provider outage began (health check reports it after 60 s). */
  sim: { outage: boolean; outageSince?: number; failNextAction: boolean }
  /** requestId → result, so a repeated click is the same request (AC10). */
  requests: Record<string, Result>
  seq: number
}

export type Result = { ok: true; note?: string } | { ok: false; code: number; message: string }
