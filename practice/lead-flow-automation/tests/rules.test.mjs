import { test } from 'node:test'
import assert from 'node:assert/strict'
import { classifyReply, normalizePhone, parseBudgetText, pickConsultant, scoreLead, sign, verifySignature, windowOpen } from '../src/rules.mjs'
import { consultants } from '../src/config.mjs'

test('phone numbers normalise to WhatsApp format', () => {
  assert.equal(normalizePhone('+91 98765 43210'), '919876543210')
  assert.equal(normalizePhone('09876543210'), '919876543210')
  assert.equal(normalizePhone('9876543210'), '919876543210')
  assert.equal(normalizePhone('12345'), null)
  assert.equal(normalizePhone('5876543210'), null) // Indian mobiles start 6–9
})

test('signature check accepts the right secret only', () => {
  const body = '{"a":1}'
  assert.ok(verifySignature(body, sign(body, 's1'), 's1'))
  assert.ok(!verifySignature(body, sign(body, 's2'), 's1'))
  assert.ok(!verifySignature(body, undefined, 's1'))
})

test('replies classify into intents', () => {
  assert.equal(classifyReply({ text: { body: 'STOP' } }).intent, 'opt_out')
  assert.equal(classifyReply({ text: { body: 'band karo' } }).intent, 'opt_out')
  assert.equal(classifyReply({ text: { body: 'Please stop by the shop and see the location' } }).intent, 'text')
  assert.equal(classifyReply({ text: { body: 'Can you call me?' } }).intent, 'human')
  assert.equal(classifyReply({ button: { payload: 'welcome_yes', text: 'Yes, tell me more' } }).intent, 'yes')
  assert.equal(classifyReply({ interactive: { button_reply: { id: 'budget_40p', title: '₹40L+' } } }).value.lakh, 45)
  assert.equal(classifyReply({ text: { body: 'around 30 lakh' } }).value.id, 'budget_25_40')
  assert.equal(classifyReply({ interactive: { button_reply: { id: 'time_0_3' } } }).value.months, 3)
})

test('budget text parser handles lakh and crore', () => {
  assert.equal(parseBudgetText('1.2 crore').lakh, 120)
  assert.equal(parseBudgetText('₹20L').id, 'budget_lt25')
  assert.equal(parseBudgetText('no idea'), null)
})

test('scoring', () => {
  assert.equal(scoreLead({ budgetLakh: 45, timelineMonths: 3 }), 'hot')
  assert.equal(scoreLead({ budgetLakh: 30, timelineMonths: 6 }), 'warm')
  assert.equal(scoreLead({ budgetLakh: 30, timelineMonths: 12 }), 'cold')
  assert.equal(scoreLead({ budgetLakh: 15, timelineMonths: 3 }), 'unqualified')
})

test('assignment: city match, then least loaded, skips unavailable and full', () => {
  assert.equal(pickConsultant({ city: 'Pune', consultants, openCounts: {} }).name, 'Neha')
  assert.equal(pickConsultant({ city: 'Jaipur', consultants, openCounts: { 'neha@example.com': 3, 'priya@example.com': 1, 'arjun@example.com': 2 } }).name, 'Priya')
  const nehaAway = consultants.map((c) => (c.name === 'Neha' ? { ...c, available: false } : c))
  assert.notEqual(pickConsultant({ city: 'Pune', consultants: nehaAway, openCounts: {} }).name, 'Neha')
  assert.equal(pickConsultant({ city: 'Pune', consultants, openCounts: { 'neha@example.com': 25 } }).name !== 'Neha', true)
  assert.equal(pickConsultant({ city: 'Pune', consultants: consultants.map((c) => ({ ...c, available: false })), openCounts: {} }), null)
})

test('24-hour window', () => {
  const now = new Date('2026-10-15T12:00:00Z')
  assert.ok(windowOpen('2026-10-15T00:00:00Z', now))
  assert.ok(!windowOpen('2026-10-14T11:59:00Z', now))
  assert.ok(!windowOpen(undefined, now))
})
