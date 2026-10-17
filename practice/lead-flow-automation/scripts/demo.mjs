// npm run demo: one lead, start to finish, narrated. Starts its own fake APIs, so nothing else needs to run.
import { startStack, lead, RAHUL } from '../tests/helpers.mjs'

const S = await startStack()
await S.setClock('2026-10-15T05:00:00Z')
let seen = 0
const step = async (title, fn) => {
  console.log(`\n▶ ${title}`)
  const r = await fn()
  const body = r?.flow?.body ?? r
  console.log('  flow result:', JSON.stringify(body))
  const st = await S.inspect()
  for (const m of st.sent.slice(seen)) {
    const what = m.type === 'template' ? `template "${m.payload.template.name}"`
      : m.type === 'interactive' ? `buttons [${m.payload.interactive.action.buttons.map((b) => b.reply.title).join(' | ')}]`
      : `"${m.payload.text.body}"`
    console.log(`  WhatsApp → ${m.to}: ${what}`)
  }
  seen = st.sent.length
}

await step('Rahul submits the Instant Form on a FreshBrew Facebook ad (consent ticked)', () => S.api('/_test/lead', lead()))
await step('Rahul taps "Yes, tell me more" on the welcome template', () =>
  S.api('/_test/whatsapp', { from: RAHUL, template_button: 'welcome_yes', button_title: 'Yes, tell me more' }))
await step('Rahul taps "₹40L+"', () => S.api('/_test/whatsapp', { from: RAHUL, button_id: 'budget_40p' }))
await step('Rahul taps "0–3 months"', () => S.api('/_test/whatsapp', { from: RAHUL, button_id: 'time_0_3' }))

const st = await S.inspect()
const c = Object.values(st.contacts)[0]
console.log('\n■ HubSpot contact:')
for (const k of ['firstname', 'phone', 'city', 'lifecyclestage', 'hs_lead_status', 'hubspot_owner_id', 'fib_lead_score', 'fib_budget_lakh', 'fib_timeline_months', 'fib_source'])
  console.log(`  ${k.padEnd(20)} ${c.properties[k]}`)
console.log('\n■ HubSpot task:', st.tasks[0].properties.hs_task_subject, '· due', st.tasks[0].properties.hs_timestamp)
console.log('■ API calls made:', st.log.length, '(GET /_inspect on the mock server shows every one)')
await S.close()
