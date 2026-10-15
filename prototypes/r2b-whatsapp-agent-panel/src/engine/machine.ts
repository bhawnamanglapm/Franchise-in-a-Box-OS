// Takeover state machine: 1c §3 (T1–T9 + agent Active/Paused/Error) as one pure reducer.
// dispatch() never mutates its input. A failed check returns the original world unchanged
// ("If the check fails, nothing changes and the person sees why").

import { BRANDS, MANAGER_OF, USERS } from '../data/brands'
import { APPROVED_FACTS, TEMPLATES } from '../data/approvedFacts'
import { HOLDING, OPT_OUT_CONFIRM, isHinglish, scriptedReply } from './agent'
import { ACTIONS } from './autonomy'
import { NO_REPLY_MS, PRIORITY_MS, SLA_CLAIM_MS, WINDOW_MS, businessMs, fmtTime, isBusinessHours } from './clock'
import { evaluate, isOptIn, isOptOut } from './triggers'
import type { Conversation, ConvState, Result, Sender, TriggerHit, World } from './types'

export const RETURN_REASONS = ['Question answered', 'Not ready, keep nurturing', 'Wrong flag', 'Other'] as const
export const LOSS_REASONS = ['Budget too low', 'Chose another brand', 'Location not available', 'Stopped responding', 'Other'] as const
export const MAX_CHARS = 4096
export const AI_REPLY_DELAY_MS = 2000
export const HEALTH_CHECK_MS = 60_000

export type Command =
  | { type: 'tick' }
  | { type: 'inbound'; convId: string; text: string; aiDelayMs?: number }
  | { type: 'takeOver'; convId: string; by: string; seenVersion: number; requestId: string }
  | { type: 'claim'; convId: string; by: string; seenVersion: number; requestId: string }
  | { type: 'assign'; convId: string; by: string; to: string; seenVersion: number; requestId: string }
  | { type: 'returnToAI'; convId: string; by: string; seenVersion: number; requestId: string; reason: string; note?: string; composerEmpty: boolean }
  | { type: 'resolveFlag'; convId: string; by: string; rule: string }
  | { type: 'send'; convId: string; by: string; text: string }
  | { type: 'sendTemplate'; convId: string; by: string; templateId: string }
  | { type: 'retry'; convId: string; by: string; messageId: string }
  | { type: 'markWon'; convId: string; by: string; seenVersion: number; requestId: string }
  | { type: 'markLost'; convId: string; by: string; seenVersion: number; requestId: string; reason: string }
  | { type: 'pauseAgent'; brandId: string; by: string }
  | { type: 'resumeAgent'; brandId: string; by: string }
  | { type: 'setOutage'; on: boolean }
  | { type: 'failNextAction'; on: boolean }

const STATE_CHANGING = new Set(['takeOver', 'claim', 'assign', 'returnToAI', 'markWon', 'markLost'])

const ok = (note?: string): Result => ({ ok: true, note })
const fail = (code: number, message: string): Result => ({ ok: false, code, message })
const name = (id?: string) => (id ? USERS[id]?.name ?? id : 'someone')

export const OPEN_STATES: ConvState[] = ['AI_ACTIVE', 'FLAGGED', 'ESCALATED', 'HUMAN_ACTIVE']

export function dispatch(world: World, cmd: Command): { world: World; result: Result } {
  const requestId = 'requestId' in cmd ? cmd.requestId : undefined
  // AC10: the same request sent twice is one request. Return the first result; change nothing.
  if (requestId && world.requests[requestId]) return { world, result: world.requests[requestId] }

  // Simulated network/server failure: the conversation keeps its previous state (1c §4).
  if (STATE_CHANGING.has(cmd.type) && world.sim.failNextAction) {
    const msg = cmd.type === 'returnToAI'
      ? "Couldn't hand back. You still own this conversation."
      : "Couldn't take over. Try again."
    return { world: { ...world, sim: { ...world.sim, failNextAction: false } }, result: fail(503, msg) }
  }

  const w: World = structuredClone(world)
  const result = run(w, cmd)
  if (!result.ok) return { world, result }
  if (requestId) w.requests[requestId] = result
  return { world: w, result }
}

function nextId(w: World, prefix: string) {
  w.seq += 1
  return `${prefix}${w.seq}`
}

function transition(w: World, c: Conversation, to: ConvState, by: string, reason: string) {
  const from = c.state
  c.state = to
  c.version += 1
  w.stateLog.push({ id: nextId(w, 'se'), convId: c.id, from, to, by, reason, ts: w.now, version: c.version })
}

function note(w: World, c: Conversation, text: string) {
  w.messages[c.id].push({ id: nextId(w, 'm'), convId: c.id, sender: 'system', text, ts: w.now, status: 'sent' })
}

function logAction(w: World, c: Conversation, row: number, status: 'completed' | 'failed' | 'cancelled' = 'completed') {
  const a = ACTIONS[row]
  w.actions.push({
    id: nextId(w, 'ae'), brandId: c.brandId, convId: c.id, actionRow: row, actionType: a.type, actor: a.actor,
    aiDraftEdited: false, stdMinutes: a.stdMinutes, status, ts: w.now,
  })
}

/** Sends a message out through WhatsApp (simulated). Returns false when the provider is down. */
function sendOut(w: World, c: Conversation, sender: Sender, text: string, extra: { by?: string; factTopic?: string; template?: boolean } = {}) {
  const delivered = !w.sim.outage
  w.messages[c.id].push({
    id: nextId(w, 'm'), convId: c.id, sender, text, ts: w.now, status: delivered ? 'sent' : 'failed', retries: 0, ...extra,
  })
  if (delivered && sender === 'ai') w.agents[c.brandId].lastSendAt = w.now
  if (!delivered) w.agents[c.brandId].lastFailAt = w.now
  return delivered
}

function cancelQueued(w: World, c: Conversation, why: string) {
  const mine = w.queue.filter((q) => q.convId === c.id)
  if (!mine.length) return
  w.queue = w.queue.filter((q) => q.convId !== c.id)
  for (const q of mine) {
    note(w, c, `AI reply cancelled: ${why}`)
    logAction(w, c, q.actionRow, 'cancelled')
  }
}

function worksOn(userId: string, brandId: string) {
  return USERS[userId]?.brands.includes(brandId) ?? false
}

function lastChange(w: World, c: Conversation) {
  for (let i = w.stateLog.length - 1; i >= 0; i--) if (w.stateLog[i].convId === c.id) return w.stateLog[i]
  return undefined
}

function conflict(w: World, c: Conversation): Result {
  const last = lastChange(w, c)
  if (c.assignee && c.state === 'HUMAN_ACTIVE') {
    return fail(409, `Already claimed by ${name(c.assignee)} at ${fmtTime(last?.ts ?? w.now)}`)
  }
  return fail(409, 'This conversation changed since you opened it. You are now seeing the latest version.')
}

function flag(w: World, c: Conversation, hits: TriggerHit[], holding: boolean) {
  transition(w, c, 'FLAGGED', 'ai', `Flagged: ${hits.map((h) => h.label.toLowerCase()).join(', ')}`)
  c.flags = hits
  c.flaggedAt = w.now
  c.priorityUser = undefined
  c.priorityUntil = undefined
  cancelQueued(w, c, 'conversation flagged for a person')
  logAction(w, c, 29)
  if (holding && !c.holdingSent) {
    const last = w.messages[c.id].filter((m) => m.sender === 'prospect').at(-1)
    const hi = last ? isHinglish(last.text) : false
    const inHours = isBusinessHours(w.now)
    const text = hi ? (inHours ? HOLDING.hi : HOLDING.hiAfter) : inHours ? HOLDING.en : HOLDING.enAfter
    const sent = sendOut(w, c, 'ai', text, { template: true })
    logAction(w, c, 23, sent ? 'completed' : 'failed')
    c.holdingSent = true
  }
}

function optOut(w: World, c: Conversation, text: string) {
  transition(w, c, 'OPTED_OUT', 'prospect', `Prospect sent "${text.trim()}"`)
  c.consent = 'withdrawn'
  cancelQueued(w, c, 'prospect opted out')
  c.flaggedAt = undefined
  c.awaitingSince = undefined
  c.priorityUser = undefined
  const sent = sendOut(w, c, 'ai', OPT_OUT_CONFIRM(BRANDS[c.brandId].name), { template: true })
  logAction(w, c, 28, sent ? 'completed' : 'failed')
  note(w, c, 'Opted out: consent withdrawn. All sending is blocked, templates included.')
}

function run(w: World, cmd: Command): Result {
  if (cmd.type === 'tick') return tick(w)
  if (cmd.type === 'setOutage') {
    w.sim.outage = cmd.on
    w.sim.outageSince = cmd.on ? w.now : undefined
    return ok()
  }
  if (cmd.type === 'failNextAction') {
    w.sim.failNextAction = cmd.on
    return ok()
  }
  if (cmd.type === 'pauseAgent' || cmd.type === 'resumeAgent') {
    if (MANAGER_OF[cmd.brandId] !== cmd.by) return fail(403, 'Only the brand manager can pause or resume the agent.')
    const a = w.agents[cmd.brandId]
    if (cmd.type === 'pauseAgent') {
      if (a.status !== 'ACTIVE') return fail(409, 'The agent is not active.')
      a.status = 'PAUSED'
      for (const c of Object.values(w.conversations)) if (c.brandId === cmd.brandId) cancelQueued(w, c, 'agent paused')
    } else {
      if (a.status !== 'PAUSED') return fail(409, 'The agent is not paused.')
      a.status = 'ACTIVE'
    }
    a.changedBy = cmd.by
    a.changedAt = w.now
    return ok()
  }

  const c = w.conversations[cmd.convId]
  if (!c) return fail(404, 'Conversation not found.')

  switch (cmd.type) {
    case 'inbound':
      return inbound(w, c, cmd.text, cmd.aiDelayMs ?? AI_REPLY_DELAY_MS)

    case 'takeOver': {
      if (!worksOn(cmd.by, c.brandId)) return fail(403, "You don't work on this brand.")
      if (c.version !== cmd.seenVersion || c.state !== 'AI_ACTIVE') return conflict(w, c)
      transition(w, c, 'HUMAN_ACTIVE', cmd.by, `Taken over by ${name(cmd.by)}`)
      c.assignee = cmd.by
      cancelQueued(w, c, `${name(cmd.by)} took over`)
      note(w, c, `AI paused: ${name(cmd.by)} took over`)
      logAction(w, c, 32)
      logAction(w, c, 33)
      return ok()
    }

    case 'claim': {
      if (!worksOn(cmd.by, c.brandId)) return fail(403, "You don't work on this brand.")
      if (c.version !== cmd.seenVersion) return conflict(w, c)
      if (c.state === 'ESCALATED' && USERS[cmd.by].role !== 'manager') {
        return fail(403, `Escalated: only the brand manager (${name(MANAGER_OF[c.brandId])}) can claim or assign it now.`)
      }
      if (c.state !== 'FLAGGED' && c.state !== 'ESCALATED') return conflict(w, c)
      if (c.priorityUser && c.priorityUser !== cmd.by && c.priorityUntil && w.now < c.priorityUntil) {
        return fail(403, `${name(c.priorityUser)} has first claim until ${fmtTime(c.priorityUntil)}.`)
      }
      const waited = c.flaggedAt ? Math.round(businessMs(c.flaggedAt, w.now) / 60000) : 0
      const extra = c.state === 'ESCALATED' && c.escalatedAt ? `, escalated for ${Math.round((w.now - c.escalatedAt) / 60000)} min` : ''
      transition(w, c, 'HUMAN_ACTIVE', cmd.by, `Claimed by ${name(cmd.by)} after ${waited} business min${extra}`)
      c.assignee = cmd.by
      c.flaggedAt = undefined
      c.priorityUser = undefined
      cancelQueued(w, c, `${name(cmd.by)} took over`)
      note(w, c, `Claimed by ${name(cmd.by)}`)
      logAction(w, c, 32)
      logAction(w, c, 33)
      return ok()
    }

    case 'assign': {
      if (MANAGER_OF[c.brandId] !== cmd.by) return fail(403, 'Only the brand manager can assign an escalated conversation.')
      if (!worksOn(cmd.to, c.brandId)) return fail(403, `${name(cmd.to)} doesn't work on this brand.`)
      if (c.version !== cmd.seenVersion || c.state !== 'ESCALATED') return conflict(w, c)
      const mins = c.escalatedAt ? Math.round((w.now - c.escalatedAt) / 60000) : 0
      transition(w, c, 'HUMAN_ACTIVE', cmd.by, `Assigned to ${name(cmd.to)} by ${name(cmd.by)} after ${mins} min escalated`)
      c.assignee = cmd.to
      c.flaggedAt = undefined
      note(w, c, `Assigned to ${name(cmd.to)} by ${name(cmd.by)}`)
      logAction(w, c, 32)
      logAction(w, c, 33)
      return ok()
    }

    case 'returnToAI': {
      if (c.state !== 'HUMAN_ACTIVE' || c.assignee !== cmd.by) {
        return c.version !== cmd.seenVersion ? conflict(w, c) : fail(403, 'Only the assigned consultant can hand back.')
      }
      if (c.version !== cmd.seenVersion) return conflict(w, c)
      if (!(RETURN_REASONS as readonly string[]).includes(cmd.reason)) return fail(422, 'Choose a reason to hand back.')
      const n = (cmd.note ?? '').trim()
      if (cmd.reason === 'Other' && (n.length < 5 || n.length > 200)) return fail(422, 'Describe the reason in 5–200 characters.')
      if (c.flags.some((f) => f.compliance && !f.resolved)) return fail(422, 'Mark every legal / financial flag resolved first.')
      if (!cmd.composerEmpty) return fail(422, 'Send or clear your draft first.')
      transition(w, c, 'AI_ACTIVE', cmd.by, `Returned to AI: ${cmd.reason}${n ? ` (${n})` : ''}`)
      note(w, c, `Returned to AI by ${name(cmd.by)}: ${cmd.reason}`)
      c.assignee = undefined
      c.flags = []
      c.awaitingSince = undefined
      c.holdingSent = false
      return ok()
    }

    case 'resolveFlag': {
      if (c.state !== 'HUMAN_ACTIVE' || c.assignee !== cmd.by) return fail(403, 'Take over first.')
      const f = c.flags.find((x) => x.rule === cmd.rule)
      if (!f) return fail(404, 'Flag not found.')
      f.resolved = true
      note(w, c, `${name(cmd.by)} marked "${f.label}" resolved`)
      return ok()
    }

    case 'send': {
      if (c.state === 'OPTED_OUT') return fail(403, 'Prospect opted out. Nothing can be sent.')
      if (c.state !== 'HUMAN_ACTIVE' || c.assignee !== cmd.by) return fail(403, 'Take over this conversation to reply.')
      const text = cmd.text.trim()
      if (!text) return fail(422, 'The message is empty.')
      if (text.length > MAX_CHARS) return fail(422, `Over ${MAX_CHARS.toLocaleString('en-IN')} characters.`)
      if (w.now - c.lastProspectAt > WINDOW_MS) {
        return fail(422, "More than 24 h since the prospect's last message. Send an approved template.")
      }
      const sent = sendOut(w, c, 'human', text, { by: cmd.by })
      if (sent) c.awaitingSince = undefined
      return ok(sent ? undefined : 'not_delivered')
    }

    case 'sendTemplate': {
      if (c.state === 'OPTED_OUT') return fail(403, 'Prospect opted out. Nothing can be sent, templates included.')
      if (c.state !== 'HUMAN_ACTIVE' || c.assignee !== cmd.by) return fail(403, 'Take over this conversation to reply.')
      const t = TEMPLATES.find((x) => x.id === cmd.templateId)
      if (!t) return fail(422, 'Choose an approved template.')
      const text = t.text.replace('{{name}}', c.prospect.name.split(' ')[0]).replace('{{brand}}', BRANDS[c.brandId].name)
      const sent = sendOut(w, c, 'human', text, { by: cmd.by, template: true })
      if (sent) c.awaitingSince = undefined
      return ok(sent ? undefined : 'not_delivered')
    }

    case 'retry': {
      if (c.state === 'OPTED_OUT') return fail(403, 'Prospect opted out. Nothing can be sent.')
      const m = w.messages[c.id].find((x) => x.id === cmd.messageId)
      if (!m || m.status !== 'failed') return fail(404, 'Nothing to retry.')
      if (w.sim.outage) {
        m.retries = (m.retries ?? 0) + 1
        if (m.retries >= 3 && !c.deliveryProblem) {
          c.deliveryProblem = true
          note(w, c, 'Delivery problem: 3 retries failed')
        }
        return ok('not_delivered')
      }
      m.status = 'sent' // same message id: a retry can never send it twice
      if (m.sender === 'human') c.awaitingSince = undefined
      if (m.sender === 'ai') w.agents[c.brandId].lastSendAt = w.now
      return ok()
    }

    case 'markWon':
    case 'markLost': {
      if (c.state !== 'HUMAN_ACTIVE' || c.assignee !== cmd.by) return fail(403, 'Only the assigned consultant can close the deal.')
      if (c.version !== cmd.seenVersion) return conflict(w, c)
      if (cmd.type === 'markLost') {
        if (!(LOSS_REASONS as readonly string[]).includes(cmd.reason)) return fail(422, 'Choose a loss reason.')
        c.lossReason = cmd.reason
        transition(w, c, 'CLOSED_LOST', cmd.by, `Marked Lost: ${cmd.reason}`)
      } else {
        transition(w, c, 'CLOSED_WON', cmd.by, 'Marked Won')
      }
      c.awaitingSince = undefined
      logAction(w, c, 37)
      return ok()
    }
  }
}

function inbound(w: World, c: Conversation, text: string, aiDelayMs: number): Result {
  w.messages[c.id].push({ id: nextId(w, 'm'), convId: c.id, sender: 'prospect', text, ts: w.now, status: 'sent' })
  c.lastProspectAt = w.now

  if (c.state === 'OPTED_OUT') {
    if (isOptIn(text)) {
      c.consent = 'given'
      transition(w, c, 'AI_ACTIVE', 'prospect', 'Prospect sent "START": new consent recorded')
      note(w, c, 'Opted back in: new consent recorded')
      c.flags = []
      c.assignee = undefined
      c.holdingSent = false
    }
    return ok()
  }

  if (isOptOut(text)) {
    optOut(w, c, text)
    return ok()
  }

  if (c.state === 'CLOSED_WON' || c.state === 'CLOSED_LOST') {
    c.previousOutcome = c.state
    transition(w, c, 'AI_ACTIVE', 'system', 'Closed lead wrote again: new cycle')
    note(w, c, `New enquiry. Previous outcome: ${c.previousOutcome === 'CLOSED_WON' ? 'Won' : 'Lost'}`)
    c.flags = []
    c.assignee = undefined
    c.holdingSent = false
  }

  const brand = BRANDS[c.brandId]
  const facts = APPROVED_FACTS[c.brandId] ?? []
  const ev = evaluate(text, { brand, facts, topicAsks: c.topicAsks, now: w.now })
  if (ev.fact) c.topicAsks[ev.fact.topic] = (c.topicAsks[ev.fact.topic] ?? 0) + 1

  if (c.state === 'AI_ACTIVE') {
    const agent = w.agents[c.brandId]
    if (agent.status !== 'ACTIVE') {
      // Edge case 9: AI paused or in Error → straight to a person. In Error, not even the holding message.
      const hit: TriggerHit = {
        rule: 'AI_OFF', label: 'AI off for brand', compliance: false, resolved: false, at: w.now,
        reason: agent.status === 'PAUSED' ? `Agent paused by ${name(agent.changedBy)}` : 'Agent in Error: messages not sending',
      }
      flag(w, c, [hit, ...ev.hits], agent.status === 'PAUSED')
      return ok()
    }
    if (ev.hits.length) {
      flag(w, c, ev.hits, true)
      return ok()
    }
    const reply = scriptedReply(text, brand, ev.fact, w.messages[c.id].slice(0, -1))
    w.queue.push({ id: nextId(w, 'q'), convId: c.id, dueAt: w.now + aiDelayMs, ...reply })
    return ok()
  }

  if (c.state === 'FLAGGED' || c.state === 'ESCALATED') {
    // No second holding message, clock not restarted; the Why-flagged card gains any new reasons.
    const fresh = ev.hits.filter((h) => !c.flags.some((f) => f.rule === h.rule))
    if (fresh.length) {
      c.flags.push(...fresh)
      note(w, c, `More reasons: ${fresh.map((h) => h.label.toLowerCase()).join(', ')}`)
    }
    return ok()
  }

  if (c.state === 'HUMAN_ACTIVE') {
    if (!c.awaitingSince) c.awaitingSince = w.now
    const fresh = ev.hits.filter((h) => !c.flags.some((f) => f.rule === h.rule))
    c.flags.push(...fresh)
  }
  return ok()
}

function tick(w: World): Result {
  // 1. Queued AI replies: re-check just before sending (1c §4, AC9).
  const due = w.queue.filter((q) => q.dueAt <= w.now)
  if (due.length) {
    w.queue = w.queue.filter((q) => q.dueAt > w.now)
    for (const q of due) {
      const c = w.conversations[q.convId]
      const agent = w.agents[c.brandId]
      if (c.state !== 'AI_ACTIVE') {
        note(w, c, `AI reply cancelled: conversation is no longer with the AI`)
        logAction(w, c, q.actionRow, 'cancelled')
        continue
      }
      if (agent.status !== 'ACTIVE') {
        note(w, c, `AI reply cancelled: agent ${agent.status === 'PAUSED' ? 'paused' : 'in Error'}`)
        logAction(w, c, q.actionRow, 'cancelled')
        continue
      }
      const sent = sendOut(w, c, 'ai', q.text, { factTopic: q.factTopic })
      logAction(w, c, q.actionRow, sent ? 'completed' : 'failed')
    }
  }

  // 2. Provider health → agent status (automatic transitions). Error is detected, not assumed:
  //    a send failed during the outage, or the 60 s health check has failed (AC11: "within 60 s").
  for (const [brandId, a] of Object.entries(w.agents)) {
    const since = w.sim.outageSince ?? w.now
    const sendFailed = a.lastFailAt !== undefined && a.lastFailAt >= since
    if (w.sim.outage && a.status === 'ACTIVE' && (sendFailed || w.now - since >= HEALTH_CHECK_MS)) {
      a.status = 'ERROR'
      a.errorSince = w.now
      a.lastError = sendFailed ? 'WhatsApp send failed: provider connection is down' : 'Health check failed: WhatsApp provider unreachable'
      a.changedBy = 'system'
      a.changedAt = w.now
      for (const c of Object.values(w.conversations)) if (c.brandId === brandId) cancelQueued(w, c, 'agent in Error')
    } else if (!w.sim.outage && a.status === 'ERROR') {
      a.status = 'ACTIVE'
      a.lastError = `Recovered at ${fmtTime(w.now)} (down since ${fmtTime(a.errorSince ?? w.now)})`
      a.changedBy = 'system'
      a.changedAt = w.now
    }
  }

  // 3. Clocks: T4 escalation and T7 no-human-reply.
  for (const c of Object.values(w.conversations)) {
    if (c.state === 'FLAGGED' && c.flaggedAt !== undefined && businessMs(c.flaggedAt, w.now) >= SLA_CLAIM_MS) {
      transition(w, c, 'ESCALATED', 'system', `Not claimed in 10 business minutes: ${name(MANAGER_OF[c.brandId])} alerted`)
      c.escalatedAt = w.now
      note(w, c, `Escalated to ${name(MANAGER_OF[c.brandId])} (manager): in-app and email alert sent`)
    } else if (c.state === 'HUMAN_ACTIVE' && c.awaitingSince !== undefined && businessMs(c.awaitingSince, w.now) >= NO_REPLY_MS) {
      const prev = c.assignee
      transition(w, c, 'FLAGGED', 'system', 'No human reply in 30 business minutes')
      c.flags.push({ rule: 'NO_REPLY', label: 'No human reply', reason: `${name(prev)} hasn't replied for 30 business minutes`, compliance: false, resolved: false, at: w.now })
      c.flaggedAt = w.now
      c.priorityUser = prev
      c.priorityUntil = w.now + PRIORITY_MS
      c.assignee = undefined
      c.awaitingSince = undefined
      note(w, c, `Re-flagged: no human reply. ${name(prev)} has first claim for 2 minutes.`)
    }
  }
  return ok()
}

/** Time left to claim (business ms), for the countdown chip. */
export function claimTimeLeft(c: Conversation, now: number): number | undefined {
  if (c.state !== 'FLAGGED' || c.flaggedAt === undefined) return undefined
  return SLA_CLAIM_MS - businessMs(c.flaggedAt, now)
}

export function windowLeft(c: Conversation, now: number): number {
  return WINDOW_MS - (now - c.lastProspectAt)
}
