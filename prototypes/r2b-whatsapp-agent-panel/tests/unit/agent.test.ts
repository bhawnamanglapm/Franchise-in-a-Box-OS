import { describe, expect, it } from 'vitest'
import { BRANDS } from '../../src/data/brands'
import { summarise } from '../../src/engine/agent'
import type { Message, TriggerHit } from '../../src/engine/types'

let n = 0
const msg = (sender: Message['sender'], text: string): Message =>
  ({ id: `m${++n}`, convId: 'c1', sender, text, ts: n, status: 'sent' })
const flag = (rule: TriggerHit['rule'], reason: string): TriggerHit =>
  ({ rule, label: rule, reason, compliance: rule === 'A7', resolved: false, at: 0 })

const fb = BRANDS.freshbrew
// Vikram's chat from the seed: a budget, then a request for a person; no question asked.
const vikram = [
  msg('prospect', 'Mera budget 25 lakh hai, Jaipur mein.'),
  msg('ai', 'Aap kab tak start karna chahenge?'),
  msg('prospect', 'Please call me, I want to talk to someone today.'),
]

describe('suggested reply (takeover panel)', () => {
  it('is signed by the sender passed in, never a hard-coded name', () => {
    const s = summarise(vikram, fb, 'Jaipur', 'Vikram Singh', { sender: 'Ravi', flags: [flag('A6', '"talk to someone"')] })
    expect(s.suggestedReply).toContain('main Ravi')
    expect(s.suggestedReply).not.toContain('Neha')
  })

  it('answers why the chat was flagged: a request for a person gets a call time, not the agreement', () => {
    const s = summarise(vikram, fb, 'Jaipur', 'Vikram Singh', { sender: 'Ravi', flags: [flag('A6', '"talk to someone"')] })
    expect(s.suggestedReply).toMatch(/call karun/)
    expect(s.suggestedReply).not.toMatch(/agreement/i)
  })

  it('only thanks the prospect for a question when there was one', () => {
    const none = summarise(vikram, fb, 'Jaipur', 'Vikram Singh', { sender: 'Ravi' })
    expect(none.lastQuestion).toBe('None')
    expect(none.suggestedReply).not.toMatch(/sawaal ke liye shukriya|Thanks for your question/)

    const asked = [msg('prospect', 'What is the agreement term?')]
    const s = summarise(asked, fb, '', 'Anita Rao', { sender: 'Priya', flags: [flag('A1', 'Asked about "agreement"')] })
    expect(s.suggestedReply).toContain('Thanks for your question')
    expect(s.suggestedReply).toContain('this is Priya')
    expect(s.suggestedReply).toContain('the agreement and next steps')
  })

  it('puts a complaint ahead of purchase intent when both fired', () => {
    const h = [msg('prospect', 'This is a scam, send the agreement now')]
    const s = summarise(h, fb, '', 'Kiran Das', {
      sender: 'Neha', flags: [flag('A1', 'Asked about "agreement"'), flag('A4', 'Complaint or abuse word: "scam"')],
    })
    expect(s.suggestedReply).toMatch(/sorry for the trouble/i)
    expect(s.suggestedReply).not.toMatch(/agreement/i)
  })

  it('never promises an answer on a legal or financial topic, only an accurate one later', () => {
    const h = [msg('prospect', 'Is the return guaranteed?')]
    const s = summarise(h, fb, '', 'Sam Paul', { sender: 'Neha', flags: [flag('A7', 'Topic "guaranteed": the AI may not answer this')] })
    expect(s.suggestedReply).toContain('About the guaranteed point, we\'ll give you an accurate, clear answer')
    expect(s.suggestedReply.match(/question/g)?.length ?? 0).toBeLessThanOrEqual(1)
    expect(s.suggestedReply).not.toMatch(/\byes\b|is guaranteed/i)
  })

  it('uses gender-neutral Hindi so any sender fits', () => {
    for (const rule of ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7'] as const) {
      const s = summarise(vikram, fb, 'Jaipur', 'Vikram Singh', { sender: 'Arjun', flags: [flag(rule, '"agreement"')] })
      // First-person verbs that mark the speaker's gender. ("call ho sakti hai" agrees with "call", so it is fine.)
      expect(s.suggestedReply, rule).not.toMatch(/\b(doongi|dungi|karungi|dunga|doonga|karunga)\b|\b(sakti|sakta|rahi|raha) hoon\b/)
    }
  })
})
