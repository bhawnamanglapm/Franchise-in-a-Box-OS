// End-to-end: fake ad lead → real flow code → fake WhatsApp + HubSpot. One test per practice exercise.
import { test, before, after, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { startStack, lead, RAHUL } from './helpers.mjs'

let S
before(async () => { S = await startStack() })
after(() => S.close())
beforeEach(async () => { await S.reset(); await S.setClock('2026-10-15T05:00:00Z') })

const contactOf = (state, phone) => Object.values(state.contacts).find((c) => c.properties.phone === phone)
const sentTo = (state, to) => state.sent.filter((m) => m.to === to)

async function qualify(budget = 'budget_40p', timeline = 'time_0_3') {
  await S.api('/_test/lead', lead())
  await S.api('/_test/whatsapp', { from: RAHUL, template_button: 'welcome_yes', button_title: 'Yes, tell me more' })
  await S.api('/_test/whatsapp', { from: RAHUL, button_id: budget })
  return S.api('/_test/whatsapp', { from: RAHUL, button_id: timeline })
}

test('Ex1 happy path: lead → welcome template → qualify → HubSpot owner + task → consultant alerted', async () => {
  const r = await S.api('/_test/lead', lead())
  assert.equal(r.flow.body[0].result, 'welcomed')
  let st = await S.inspect()
  assert.equal(sentTo(st, RAHUL)[0].payload.template.name, 'lead_welcome')

  const last = await qualify()
  assert.equal(last.flow.body[0].result, 'qualified_and_handed_off')
  assert.equal(last.flow.body[0].consultant, 'Neha') // Pune → Neha
  st = await S.inspect()
  const c = contactOf(st, RAHUL).properties
  assert.equal(c.hubspot_owner_id, '101')
  assert.equal(c.fib_lead_score, 'hot')
  assert.equal(c.lifecyclestage, 'salesqualifiedlead')
  assert.equal(c.hs_lead_status, 'OPEN')
  assert.equal(st.tasks.length, 1)
  assert.match(st.tasks[0].properties.hs_task_subject, /^\[HOT\]/)
  assert.equal(st.tasks[0].properties.hs_timestamp, '2026-10-15T05:15:00.000Z') // hot = 15 min
  assert.equal(sentTo(st, '919800000001')[0].payload.template.name, 'consultant_new_lead')
  assert.match(sentTo(st, RAHUL).at(-1).payload.text.body, /Neha/)
})

test('Ex2 duplicate webhook delivery creates one contact and one welcome', async () => {
  const r = await S.api('/_test/lead', { ...lead(), deliver_twice: true })
  assert.equal(r.flow[1].body[0].result, 'duplicate_event_ignored')
  const st = await S.inspect()
  assert.equal(Object.keys(st.contacts).length, 1)
  assert.equal(sentTo(st, RAHUL).length, 1)
})

test('Ex2b same person, second form: contact updated, not duplicated', async () => {
  await S.api('/_test/lead', lead())
  await S.api('/_test/lead', lead({ city: 'Mumbai' }))
  const st = await S.inspect()
  assert.equal(Object.keys(st.contacts).length, 1)
  assert.equal(contactOf(st, RAHUL).properties.city, 'Mumbai')
})

test('Ex3 no WhatsApp consent: no message, consultant gets a call task', async () => {
  const r = await S.api('/_test/lead', lead({ whatsapp_consent: 'No' }))
  assert.equal(r.flow.body[0].result, 'no_consent_routed_to_consultant')
  const st = await S.inspect()
  assert.equal(sentTo(st, RAHUL).length, 0)
  assert.equal(st.tasks.length, 1)
  assert.equal(contactOf(st, RAHUL).properties.fib_qual_step, 'no_consent')
})

test('Ex4 STOP opts out, later messages are ignored, START resumes', async () => {
  await S.api('/_test/lead', lead())
  const r = await S.api('/_test/whatsapp', { from: RAHUL, text: 'STOP' })
  assert.equal(r.flow.body[0].result, 'opted_out')
  const r2 = await S.api('/_test/whatsapp', { from: RAHUL, text: 'hello?' })
  assert.equal(r2.flow.body[0].result, 'ignored_opted_out')
  let st = await S.inspect()
  assert.equal(sentTo(st, RAHUL).length, 2) // welcome + STOP confirmation, nothing else
  const r3 = await S.api('/_test/whatsapp', { from: RAHUL, text: 'START' })
  assert.equal(r3.flow.body[0].result, 'opted_back_in')
  st = await S.inspect()
  assert.equal(sentTo(st, RAHUL).at(-1).type, 'interactive')
})

test('Ex5 budget under minimum: unqualified, polite close, not assigned', async () => {
  await S.api('/_test/lead', lead())
  await S.api('/_test/whatsapp', { from: RAHUL, template_button: 'welcome_yes' })
  const r = await S.api('/_test/whatsapp', { from: RAHUL, button_id: 'budget_lt25' })
  assert.equal(r.flow.body[0].result, 'unqualified')
  const st = await S.inspect()
  const c = contactOf(st, RAHUL).properties
  assert.equal(c.hs_lead_status, 'UNQUALIFIED')
  assert.equal(c.hubspot_owner_id, undefined)
  assert.equal(st.tasks.length, 0)
})

test('Ex6 HubSpot rate limit (429) is retried, the lead is not lost', async () => {
  await S.api('/_test/faults', { hubspot429: 2 })
  const r = await S.api('/_test/lead', lead())
  assert.equal(r.flow.body[0].result, 'welcomed')
  const st = await S.inspect()
  assert.equal(Object.keys(st.contacts).length, 1)
})

test('Ex7 no reply: 2 reminder templates 4h apart, then handed to a consultant', async () => {
  await S.api('/_test/lead', lead())
  await S.setClock('2026-10-15T07:00:00Z')
  assert.deepEqual(await S.flowApi('/jobs/followups'), []) // only 2h: too early
  await S.setClock('2026-10-15T09:01:00Z')
  assert.equal((await S.flowApi('/jobs/followups'))[0].result, 'reminder_sent')
  await S.setClock('2026-10-15T13:02:00Z')
  assert.equal((await S.flowApi('/jobs/followups'))[0].reminder, 2)
  await S.setClock('2026-10-15T17:03:00Z')
  const r = await S.flowApi('/jobs/followups')
  assert.equal(r[0].result, 'handed_off_no_reply')
  const st = await S.inspect()
  assert.equal(contactOf(st, RAHUL).properties.hs_lead_status, 'ATTEMPTED_TO_CONTACT')
  assert.deepEqual(sentTo(st, RAHUL).map((m) => m.payload.template?.name), ['lead_welcome', 'lead_reminder', 'lead_reminder'])
})

test('Ex8 the 24h rule: a free-form message to someone who never replied is rejected by WhatsApp', async () => {
  const r = await fetch(`${S.mockUrl}/whatsapp/v21.0/100000000000001/messages`, {
    method: 'POST',
    headers: { Authorization: 'Bearer x', 'Content-Type': 'application/json' },
    body: JSON.stringify({ messaging_product: 'whatsapp', to: RAHUL, type: 'text', text: { body: 'Hi!' } }),
  }).then((x) => x.json())
  assert.equal(r.error.code, 131047)
})

test('Ex9 "call me" hands off at once, even mid-qualification', async () => {
  await S.api('/_test/lead', lead())
  const r = await S.api('/_test/whatsapp', { from: RAHUL, text: 'Can someone call me please' })
  assert.equal(r.flow.body[0].result, 'handed_off')
  assert.equal(r.flow.body[0].consultant, 'Neha')
})

test('Ex10 two wrong answers in a row → a person takes over instead of looping', async () => {
  await S.api('/_test/lead', lead())
  await S.api('/_test/whatsapp', { from: RAHUL, text: 'yes' })
  assert.equal((await S.api('/_test/whatsapp', { from: RAHUL, text: 'hmm not sure' })).flow.body[0].result, 'reasked')
  assert.equal((await S.api('/_test/whatsapp', { from: RAHUL, text: 'depends' })).flow.body[0].result, 'handed_off')
})

test('Ex11 Click-to-WhatsApp ad: unknown sender gets a contact with ad source', async () => {
  const r = await S.api('/_test/whatsapp', { from: '919811112222', text: 'Hi, I saw your ad', name: 'Anita', referral: '23850000000000009' })
  assert.equal(r.flow.body[0].result, 'asked_budget')
  const st = await S.inspect()
  assert.equal(contactOf(st, '919811112222').properties.fib_source, 'ctwa_ad:23850000000000009')
})

test('Ex12 duplicate WhatsApp message id is processed once', async () => {
  await S.api('/_test/lead', lead())
  const r = await S.api('/_test/whatsapp', { from: RAHUL, template_button: 'welcome_yes', deliver_twice: true, id: 'wamid.SAME' })
  assert.equal(r.flow[1].body[0].result, 'duplicate_message_ignored')
})

test('city not on the form is asked for; Jaipur goes to the least-loaded consultant', async () => {
  await S.api('/_test/lead', lead({ city: '' }))
  await S.api('/_test/whatsapp', { from: RAHUL, template_button: 'welcome_yes' })
  assert.equal((await S.api('/_test/whatsapp', { from: RAHUL, button_id: 'budget_25_40' })).flow.body[0].result, 'asked_city')
  await S.api('/_test/whatsapp', { from: RAHUL, text: 'Jaipur' })
  const r = await S.api('/_test/whatsapp', { from: RAHUL, button_id: 'time_3_6' })
  assert.equal(r.flow.body[0].score, 'warm')
  assert.ok(['Neha', 'Priya', 'Arjun'].includes(r.flow.body[0].consultant))
})

test('webhook with a bad signature is rejected', async () => {
  const r = await fetch(`${S.flowUrl}/webhooks/meta`, { method: 'POST', headers: { 'X-Hub-Signature-256': 'sha256=bad' }, body: '{}' })
  assert.equal(r.status, 401)
})

test('verification handshake echoes the challenge', async () => {
  const r = await fetch(`${S.flowUrl}/webhooks/meta?hub.mode=subscribe&hub.verify_token=test-verify-token&hub.challenge=42`)
  assert.equal(await r.text(), '42')
})
