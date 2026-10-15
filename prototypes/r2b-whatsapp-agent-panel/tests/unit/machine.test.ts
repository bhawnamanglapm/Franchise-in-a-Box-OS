// One test block per 1c acceptance criterion that can be proven at the logic level.
// Timing parts ("within 2 s", "within 1 s") are UI/runtime and are checked by the Playwright test.

import { describe, expect, it } from 'vitest'
import { MAX_CHARS } from '../../src/engine/machine'
import { MIN, businessMs, istAt } from '../../src/engine/clock'
import { autonomy } from '../../src/engine/autonomy'
import { advance, aiMsgs, fresh, msgs, must, step, ver } from './helpers'

describe('seed world', () => {
  it('has every state the demo needs, all produced by the engine', () => {
    const w = fresh()
    const s = (id: string) => w.conversations[id].state
    expect(['c1', 'c2', 'c3', 'c4'].map(s)).toEqual(['AI_ACTIVE', 'AI_ACTIVE', 'AI_ACTIVE', 'AI_ACTIVE'])
    expect([s('c5'), s('c6'), s('c7'), s('c8'), s('c9'), s('c10')])
      .toEqual(['FLAGGED', 'FLAGGED', 'ESCALATED', 'HUMAN_ACTIVE', 'CLOSED_WON', 'OPTED_OUT'])
    expect(w.queue).toEqual([])
  })
})

describe('AC1: a matching message flags the conversation with every reason', () => {
  it('lists every rule with its value, sends exactly 1 holding message, then 0 AI messages', () => {
    let w = fresh()
    const before = aiMsgs(w, 'c1').length
    w = must(w, { type: 'inbound', convId: 'c1', text: 'Mere paas 50 lakh hai. Site visit kab kar sakte hain?' })
    const c = w.conversations.c1
    expect(c.state).toBe('FLAGGED')
    expect(c.flags.map((f) => f.rule)).toEqual(['A1', 'A2'])
    expect(c.flags[1].reason).toBe('Stated investment ₹50L, brand threshold ₹40L')
    expect(aiMsgs(w, 'c1').length - before).toBe(1) // the holding message
    expect(aiMsgs(w, 'c1').at(-1)!.text).toMatch(/franchise team/)

    w = must(w, { type: 'inbound', convId: 'c1', text: 'Hello? Koi hai?' })
    w = advance(w, 2 * MIN)
    expect(aiMsgs(w, 'c1').length - before).toBe(1) // still only the holding message
  })
})

describe('AC2: two consultants claim the same flag', () => {
  it('exactly one succeeds, the other is told who claimed it, version +1 exactly', () => {
    let w = fresh()
    const seen = ver(w, 'c5')
    w = must(w, { type: 'claim', convId: 'c5', by: 'priya', seenVersion: seen, requestId: 'claim:c5:priya' })
    const r = step(w, { type: 'claim', convId: 'c5', by: 'neha', seenVersion: seen, requestId: 'claim:c5:neha' })
    expect(r.r).toEqual({ ok: false, code: 409, message: 'Already claimed by Priya at 14:00' })
    expect(r.w).toBe(w) // nothing changed
    expect(ver(w, 'c5')).toBe(seen + 1)
    expect(w.conversations.c5.assignee).toBe('priya')
  })
  it('on ESCALATED only the manager can claim or assign', () => {
    let w = fresh()
    const r = step(w, { type: 'claim', convId: 'c7', by: 'neha', seenVersion: ver(w, 'c7'), requestId: 'x' })
    expect(r.r.ok).toBe(false)
    w = must(w, { type: 'assign', convId: 'c7', by: 'ravi', to: 'neha', seenVersion: ver(w, 'c7'), requestId: 'a' })
    expect(w.conversations.c7.assignee).toBe('neha')
  })
})

describe('9-step test, step 3: the AI does not reply while a person handles the chat', () => {
  it('after a claim, new prospect messages queue nothing and send nothing from the AI', () => {
    let w = fresh()
    w = must(w, { type: 'claim', convId: 'c5', by: 'neha', seenVersion: ver(w, 'c5'), requestId: 'c' })
    const before = aiMsgs(w, 'c5').length
    w = must(w, { type: 'inbound', convId: 'c5', text: 'Aur royalty kitni hai?' })
    expect(w.queue).toEqual([])
    w = advance(w, MIN)
    expect(aiMsgs(w, 'c5').length).toBe(before)
    expect(w.conversations.c5.state).toBe('HUMAN_ACTIVE')
  })
})

describe('AC3: an unclaimed flag escalates at 10 business minutes', () => {
  it('escalates at 10 minutes, not before', () => {
    let w = fresh() // c5 was flagged at 13:56
    w = advance(w, 5 * MIN + 59_000)
    expect(w.conversations.c5.state).toBe('FLAGGED')
    w = advance(w, 1000)
    expect(w.conversations.c5.state).toBe('ESCALATED')
  })
  it('a flag raised after hours escalates at 09:10 the next morning at the earliest', () => {
    const t = istAt(fresh().now, 22, 0)
    const nextDay = istAt(t + 12 * 60 * MIN, 9, 10)
    expect(businessMs(t, nextDay)).toBe(10 * MIN)
  })
})

describe('AC4: Return to AI is refused without a reason or with an open legal flag', () => {
  it('makes 0 state changes until both conditions are met', () => {
    let w = fresh()
    w = must(w, { type: 'claim', convId: 'c6', by: 'neha', seenVersion: ver(w, 'c6'), requestId: 'c' })
    const logLen = w.stateLog.length
    const base = { type: 'returnToAI' as const, convId: 'c6', by: 'neha', seenVersion: ver(w, 'c6'), composerEmpty: true }

    expect(step(w, { ...base, requestId: 'r1', reason: '' }).r.ok).toBe(false)
    const open = step(w, { ...base, requestId: 'r2', reason: 'Question answered' })
    expect(open.r).toMatchObject({ ok: false, message: 'Mark every legal / financial flag resolved first.' })
    expect(open.w.stateLog.length).toBe(logLen)

    w = must(w, { type: 'resolveFlag', convId: 'c6', by: 'neha', rule: 'A7' })
    w = must(w, { ...base, requestId: 'r3', reason: 'Question answered' })
    expect(w.conversations.c6.state).toBe('AI_ACTIVE')
    expect(w.stateLog.length).toBe(logLen + 1)
  })
  it('"Other" needs a 5–200 character note; an unsent draft blocks hand-back', () => {
    let w = fresh()
    w = must(w, { type: 'claim', convId: 'c5', by: 'neha', seenVersion: ver(w, 'c5'), requestId: 'c' })
    const base = { type: 'returnToAI' as const, convId: 'c5', by: 'neha', seenVersion: ver(w, 'c5') }
    expect(step(w, { ...base, requestId: '1', reason: 'Other', note: 'ok', composerEmpty: true }).r.ok).toBe(false)
    expect(step(w, { ...base, requestId: '2', reason: 'Wrong flag', composerEmpty: false }).r.ok).toBe(false)
    expect(step(w, { ...base, requestId: '3', reason: 'Other', note: 'Will call back Monday', composerEmpty: true }).r.ok).toBe(true)
  })
})

describe('AC5: 4,096-character limit', () => {
  it('refuses 4,097 and sends 4,096', () => {
    let w = fresh()
    w = must(w, { type: 'takeOver', convId: 'c1', by: 'neha', seenVersion: ver(w, 'c1'), requestId: 't' })
    expect(step(w, { type: 'send', convId: 'c1', by: 'neha', text: 'a'.repeat(MAX_CHARS + 1) }).r.ok).toBe(false)
    expect(step(w, { type: 'send', convId: 'c1', by: 'neha', text: 'a'.repeat(MAX_CHARS) }).r.ok).toBe(true)
  })
})

describe('AC6: more than 24 h since the prospect last wrote', () => {
  it('blocks free text and allows an approved template', () => {
    const w = fresh() // c8: Pooja last wrote yesterday 11:50
    const free = step(w, { type: 'send', convId: 'c8', by: 'neha', text: 'Hi Pooja, following up' })
    expect(free.r).toMatchObject({ ok: false, code: 422 })
    expect(step(w, { type: 'sendTemplate', convId: 'c8', by: 'neha', templateId: 'follow_up' }).r.ok).toBe(true)
  })
})

describe('AC7: STOP / band karo in any open state', () => {
  it.each([['c2', 'STOP'], ['c5', 'band karo'], ['c8', 'Unsubscribe']])('%s + "%s" → opted out, 0 messages after', (id, text) => {
    let w = fresh()
    w = must(w, { type: 'inbound', convId: id, text })
    const c = w.conversations[id]
    expect(c.state).toBe('OPTED_OUT')
    expect(c.consent).toBe('withdrawn')
    const after = msgs(w, id).filter((m) => m.sender !== 'system').length // includes the one confirmation
    expect(step(w, { type: 'send', convId: id, by: 'neha', text: 'hello' }).r.ok).toBe(false)
    expect(step(w, { type: 'sendTemplate', convId: id, by: 'neha', templateId: 'follow_up' }).r.ok).toBe(false)
    w = advance(w, MIN)
    expect(msgs(w, id).filter((m) => m.sender !== 'system').length).toBe(after)
  })
  it('a queued AI reply is cancelled by the opt-out', () => {
    let w = fresh()
    w = must(w, { type: 'inbound', convId: 'c2', text: 'And the royalty?' })
    expect(w.queue.length).toBe(1)
    w = must(w, { type: 'inbound', convId: 'c2', text: 'stop' })
    expect(w.queue.length).toBe(0)
  })
  it('START opts back in with new consent', () => {
    let w = fresh()
    w = must(w, { type: 'inbound', convId: 'c10', text: 'START' })
    expect(w.conversations.c10.state).toBe('AI_ACTIVE')
    expect(w.conversations.c10.consent).toBe('given')
  })
})

describe('AC8: no human reply in 30 business minutes', () => {
  it('re-flags, and the previous owner gets 2 minutes of first claim', () => {
    let w = fresh()
    w = must(w, { type: 'takeOver', convId: 'c1', by: 'neha', seenVersion: ver(w, 'c1'), requestId: 't' })
    w = must(w, { type: 'inbound', convId: 'c1', text: 'Hello?' })
    w = advance(w, 29 * MIN, 30_000)
    expect(w.conversations.c1.state).toBe('HUMAN_ACTIVE')
    w = advance(w, MIN, 30_000)
    const c = w.conversations.c1
    expect(c.state).toBe('FLAGGED')
    expect(c.flags.map((f) => f.rule)).toContain('NO_REPLY')
    expect(step(w, { type: 'claim', convId: 'c1', by: 'priya', seenVersion: c.version, requestId: 'p' }).r.ok).toBe(false)
    expect(step(w, { type: 'claim', convId: 'c1', by: 'neha', seenVersion: c.version, requestId: 'n' }).r.ok).toBe(true)
  })
})

describe('AC9: a queued AI reply is cancelled by a takeover', () => {
  it('0 AI messages reach the prospect after takeover; the cancelled reply is logged', () => {
    let w = fresh()
    const before = aiMsgs(w, 'c1').length
    w = must(w, { type: 'inbound', convId: 'c1', text: 'Mera budget 30 lakh hai' })
    expect(w.queue.map((q) => q.convId)).toEqual(['c1'])
    w = must(w, { type: 'takeOver', convId: 'c1', by: 'neha', seenVersion: ver(w, 'c1'), requestId: 't' })
    w = advance(w, 10_000)
    expect(aiMsgs(w, 'c1').length).toBe(before)
    expect(w.actions.at(-3)).toMatchObject({ convId: 'c1', status: 'cancelled', actionRow: 24 })
    expect(msgs(w, 'c1').some((m) => m.sender === 'system' && m.text.startsWith('AI reply cancelled'))).toBe(true)
  })
})

describe('AC10: repeated and failed requests', () => {
  it('the same Take over sent twice makes 1 assignment and 1 log entry', () => {
    let w = fresh()
    const cmd = { type: 'takeOver' as const, convId: 'c1', by: 'neha', seenVersion: ver(w, 'c1'), requestId: 'takeOver:c1:1' }
    w = must(w, cmd)
    const logLen = w.stateLog.length
    const again = step(w, cmd)
    expect(again.r.ok).toBe(true)
    expect(again.w).toBe(w)
    expect(w.stateLog.length).toBe(logLen)
  })
  it('a failed takeover leaves the previous state; the retry succeeds without duplicates', () => {
    let w = fresh()
    w = must(w, { type: 'failNextAction', on: true })
    const cmd = { type: 'takeOver' as const, convId: 'c1', by: 'neha', seenVersion: ver(w, 'c1'), requestId: 'takeOver:c1:1' }
    const failed = step(w, cmd)
    expect(failed.r).toMatchObject({ ok: false, message: "Couldn't take over. Try again." })
    expect(failed.w.conversations.c1.state).toBe('AI_ACTIVE')
    const logLen = failed.w.stateLog.length
    w = must(failed.w, cmd)
    expect(w.conversations.c1.state).toBe('HUMAN_ACTIVE')
    expect(w.stateLog.length).toBe(logLen + 1)
  })
})

describe('AC11: WhatsApp sends fail (simulated outage)', () => {
  it('agent goes to Error, failed sends are logged as failures and not counted as AI work', () => {
    let w = fresh()
    const before = autonomy(w)
    w = must(w, { type: 'setOutage', on: true })
    w = must(w, { type: 'inbound', convId: 'c2', text: 'What is the royalty?' })
    w = advance(w, 5000)
    expect(w.agents.freshbrew.status).toBe('ERROR')
    expect(aiMsgs(w, 'c2').at(-1)!.status).toBe('failed')
    const after = autonomy(w)
    expect(after.completed).toBe(before.completed)
    expect(after.failed).toBe(before.failed + 1)

    // While in Error, a new message goes straight to a person, with no holding message.
    const c4ai = aiMsgs(w, 'c4').length
    w = must(w, { type: 'inbound', convId: 'c4', text: 'Royalty kitni hai?' })
    expect(w.conversations.c4.state).toBe('FLAGGED')
    expect(w.conversations.c4.flags[0].rule).toBe('AI_OFF')
    expect(aiMsgs(w, 'c4').length).toBe(c4ai)

    // A brand with no send attempts is caught by the health check within 60 s.
    expect(w.agents.ironpulse.status).toBe('ACTIVE')
    w = advance(w, 60_000)
    expect(w.agents.ironpulse.status).toBe('ERROR')

    w = must(w, { type: 'setOutage', on: false })
    w = advance(w, 1000)
    expect(w.agents.freshbrew.status).toBe('ACTIVE')
    expect(w.agents.ironpulse.status).toBe('ACTIVE')
  })
})

describe('agent pause (manager only)', () => {
  it('a consultant cannot pause; the manager can, and new messages go to a person', () => {
    let w = fresh()
    expect(step(w, { type: 'pauseAgent', brandId: 'freshbrew', by: 'neha' }).r.ok).toBe(false)
    w = must(w, { type: 'pauseAgent', brandId: 'freshbrew', by: 'ravi' })
    w = must(w, { type: 'inbound', convId: 'c2', text: 'What is the royalty?' })
    expect(w.conversations.c2.state).toBe('FLAGGED')
    expect(w.conversations.c2.flags[0].reason).toBe('Agent paused by Ravi')
  })
})

describe('Autonomy Rate (1b §5)', () => {
  it('is automation minutes ÷ all completed minutes, and a takeover lowers it', () => {
    let w = fresh()
    const a = autonomy(w)
    expect(a.rate).toBeCloseTo(a.modelShare + a.rulesShare)
    expect(a.rate + a.humanShare).toBeCloseTo(1)
    w = must(w, { type: 'takeOver', convId: 'c1', by: 'neha', seenVersion: ver(w, 'c1'), requestId: 't' })
    expect(autonomy(w).rate).toBeLessThan(a.rate)
  })
})
