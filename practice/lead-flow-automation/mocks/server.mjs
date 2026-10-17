// Fake Meta Graph API + WhatsApp Cloud API + HubSpot CRM, all on one port, all in memory.
// Request and webhook shapes follow the real APIs closely enough to practise against,
// and the fake enforces the rules that most often break real builds:
//   • free-form WhatsApp messages are rejected outside the 24-hour window (error 131047)
//   • unknown template names are rejected (error 132001)
//   • reply buttons: max 3, title max 20 characters
//   • HubSpot can be told to return 429 rate limits (POST /_test/faults)
// Test-only endpoints start with /_test or /_inspect. Nothing here talks to the internet.
import http from 'node:http'
import { fileURLToPath } from 'node:url'
import { sign } from '../src/rules.mjs'

const APPROVED_TEMPLATES = ['lead_welcome', 'lead_reminder', 'consultant_new_lead']
const OWNERS = [
  { id: '101', email: 'neha@example.com', firstName: 'Neha', lastName: 'K' },
  { id: '102', email: 'priya@example.com', firstName: 'Priya', lastName: 'S' },
  { id: '103', email: 'arjun@example.com', firstName: 'Arjun', lastName: 'R' },
]

export function createMockServer({
  flowUrl = process.env.FLOW_URL ?? 'http://localhost:3010',
  appSecret = process.env.APP_SECRET ?? 'test-app-secret',
} = {}) {
  let s
  const reset = () => {
    s = { leads: {}, sent: [], lastInbound: {}, contacts: {}, notes: [], tasks: [], seq: 1, faults: { hubspot429: 0 }, now: null, log: [] }
  }
  reset()
  const now = () => (s.now ? new Date(s.now) : new Date())
  const id = () => String(s.seq++)

  async function postSigned(path, payload) {
    const raw = JSON.stringify(payload)
    const r = await fetch(flowUrl + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Hub-Signature-256': sign(raw, appSecret) },
      body: raw,
    })
    return { status: r.status, body: await r.json().catch(() => null) }
  }

  const routes = [
    // ─── test helpers ───
    ['POST', /^\/_reset$/, () => (reset(), [200, { ok: true }])],
    ['GET', /^\/_inspect$/, () => [200, s]],
    ['POST', /^\/_test\/clock$/, (_, b) => ((s.now = b.now ?? null), [200, { now: now().toISOString() }])],
    ['POST', /^\/_test\/faults$/, (_, b) => (Object.assign(s.faults, b), [200, s.faults])],
    // Simulates a person submitting the Instant Form on a Facebook/Instagram ad.
    ['POST', /^\/_test\/lead$/, async (_, b) => {
      const leadId = b.leadgen_id ?? String(9000000000 + s.seq++)
      s.leads[leadId] = {
        id: leadId,
        created_time: now().toISOString().replace(/\.\d+Z$/, '+0000'),
        ad_id: '23850000000000001',
        form_id: '1234567890',
        campaign_name: b.campaign ?? 'FreshBrew-Franchise-Mumbai',
        field_data: Object.entries(b.fields ?? {}).map(([name, v]) => ({ name, values: [String(v)] })),
      }
      const webhook = {
        object: 'page',
        entry: [{ id: '111111111111111', time: Math.floor(now() / 1000), changes: [{
          field: 'leadgen',
          value: { ad_id: '23850000000000001', form_id: '1234567890', leadgen_id: leadId, created_time: Math.floor(now() / 1000), page_id: '111111111111111', adgroup_id: '23850000000000001' },
        }] }],
      }
      const sends = b.deliver_twice ? 2 : 1
      const res = []
      for (let i = 0; i < sends; i++) res.push(await postSigned('/webhooks/meta', webhook))
      return [200, { leadgen_id: leadId, flow: sends === 1 ? res[0] : res }]
    }],
    // Simulates the prospect sending a WhatsApp message (text or a tapped button).
    ['POST', /^\/_test\/whatsapp$/, async (_, b) => {
      const msgId = b.id ?? `wamid.TEST${s.seq++}`
      const ts = String(Math.floor(now() / 1000))
      let message = { from: b.from, id: msgId, timestamp: ts, type: 'text', text: { body: b.text ?? '' } }
      if (b.button_id) message = { from: b.from, id: msgId, timestamp: ts, type: 'interactive', interactive: { type: 'button_reply', button_reply: { id: b.button_id, title: b.button_title ?? b.button_id } } }
      if (b.template_button) message = { from: b.from, id: msgId, timestamp: ts, type: 'button', button: { payload: b.template_button, text: b.button_title ?? b.template_button } }
      if (b.referral) message.referral = { source_url: 'https://fb.me/example', source_id: b.referral, source_type: 'ad', headline: 'Own a FreshBrew café' }
      s.lastInbound[b.from] = now().toISOString()
      const webhook = {
        object: 'whatsapp_business_account',
        entry: [{ id: 'WABA_ID', changes: [{ field: 'messages', value: {
          messaging_product: 'whatsapp',
          metadata: { display_phone_number: '919000000000', phone_number_id: '100000000000001' },
          contacts: [{ profile: { name: b.name ?? 'Prospect' }, wa_id: b.from }],
          messages: [message],
        } }] }],
      }
      const sends = b.deliver_twice ? 2 : 1
      const res = []
      for (let i = 0; i < sends; i++) res.push(await postSigned('/webhooks/whatsapp', webhook))
      return [200, { message_id: msgId, flow: sends === 1 ? res[0] : res }]
    }],

    // ─── Meta Graph API ───
    ['GET', /^\/meta\/v[\d.]+\/(\d+)$/, ([leadId]) =>
      s.leads[leadId] ? [200, s.leads[leadId]] : [400, { error: { message: 'Unsupported get request.', type: 'GraphMethodException', code: 100 } }]],

    // ─── WhatsApp Cloud API ───
    ['POST', /^\/whatsapp\/v[\d.]+\/(\d+)\/messages$/, (_, b) => {
      const err = (code, message) => [400, { error: { message, type: 'OAuthException', code, fbtrace_id: 'TEST' } }]
      if (b.messaging_product !== 'whatsapp') return err(100, 'messaging_product must be "whatsapp"')
      if (!/^\d{8,15}$/.test(b.to ?? '')) return err(100, 'Invalid "to" phone number')
      if (b.type === 'template') {
        if (!APPROVED_TEMPLATES.includes(b.template?.name)) return err(132001, `Template name does not exist in the translation (${b.template?.name})`)
      } else {
        const last = s.lastInbound[b.to]
        if (!last || now() - new Date(last) >= 24 * 3600e3)
          return err(131047, 'Re-engagement message: more than 24 hours have passed since the recipient last replied. Use a template.')
        if (b.type === 'interactive') {
          const btns = b.interactive?.action?.buttons ?? []
          if (btns.length < 1 || btns.length > 3) return err(131009, 'Parameter value is not valid: 1–3 buttons allowed')
          if (btns.some((x) => (x.reply?.title ?? '').length > 20)) return err(131009, 'Parameter value is not valid: button title max 20 characters')
        }
      }
      const wamid = `wamid.OUT${s.seq++}`
      s.sent.push({ id: wamid, at: now().toISOString(), to: b.to, type: b.type, payload: b })
      return [200, { messaging_product: 'whatsapp', contacts: [{ input: b.to, wa_id: b.to }], messages: [{ id: wamid }] }]
    }],

    // ─── HubSpot CRM v3 ───
    ['GET', /^\/hubspot\/crm\/v3\/owners\/?$/, () => [200, { results: OWNERS }]],
    ['POST', /^\/hubspot\/crm\/v3\/objects\/contacts\/search$/, (_, b) => {
      const groups = b.filterGroups ?? []
      const match = (c) => !groups.length || groups.some((g) => g.filters.every((f) => {
        const v = c.properties[f.propertyName]
        if (f.operator === 'EQ') return v !== undefined && String(v).toLowerCase() === String(f.value).toLowerCase()
        if (f.operator === 'NEQ') return String(v) !== String(f.value)
        if (f.operator === 'IN') return f.values.map(String).includes(String(v))
        if (f.operator === 'HAS_PROPERTY') return v !== undefined && v !== ''
        return false
      }))
      const results = Object.values(s.contacts).filter(match).slice(0, b.limit ?? 10)
      return [200, { total: results.length, results }]
    }],
    ['POST', /^\/hubspot\/crm\/v3\/objects\/contacts$/, (_, b) => {
      const p = b.properties ?? {}
      if (p.email && Object.values(s.contacts).some((c) => c.properties.email === p.email))
        return [409, { status: 'error', category: 'CONFLICT', message: `Contact already exists. Existing ID: ${Object.values(s.contacts).find((c) => c.properties.email === p.email).id}` }]
      const c = { id: id(), properties: { ...stringify(p), createdate: now().toISOString() }, createdAt: now().toISOString() }
      s.contacts[c.id] = c
      return [201, c]
    }],
    ['PATCH', /^\/hubspot\/crm\/v3\/objects\/contacts\/(\w+)$/, ([cid], b) => {
      const c = s.contacts[cid]
      if (!c) return [404, { status: 'error', category: 'OBJECT_NOT_FOUND', message: 'resource not found' }]
      Object.assign(c.properties, stringify(b.properties ?? {}), { lastmodifieddate: now().toISOString() })
      return [200, c]
    }],
    ['POST', /^\/hubspot\/crm\/v3\/objects\/notes$/, (_, b) => {
      const n = { id: id(), properties: b.properties, contactId: b.associations?.[0]?.to?.id }
      s.notes.push(n)
      return [201, n]
    }],
    ['POST', /^\/hubspot\/crm\/v3\/objects\/tasks$/, (_, b) => {
      const t = { id: id(), properties: b.properties, contactId: b.associations?.[0]?.to?.id }
      s.tasks.push(t)
      return [201, t]
    }],
  ]

  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://x')
    let raw = ''
    for await (const chunk of req) raw += chunk
    const body = raw ? JSON.parse(raw) : {}
    const send = (status, data, headers = {}) => {
      res.writeHead(status, { 'Content-Type': 'application/json', ...headers })
      res.end(JSON.stringify(data))
    }

    const isApi = /^\/(meta|whatsapp|hubspot)\//.test(url.pathname)
    if (isApi && !/^Bearer \S+/.test(req.headers.authorization ?? '')) return send(401, { error: 'missing bearer token' })
    if (url.pathname.startsWith('/hubspot/') && s.faults.hubspot429 > 0) {
      s.faults.hubspot429--
      return send(429, { status: 'error', category: 'RATE_LIMITS', message: 'You have reached your secondly limit.' }, { 'Retry-After': '0' })
    }
    for (const [method, re, fn] of routes) {
      const m = url.pathname.match(re)
      if (m && method === req.method) {
        try {
          const [status, data] = await fn(m.slice(1), body)
          if (isApi) s.log.push({ at: now().toISOString(), method, path: url.pathname, status })
          return send(status, data)
        } catch (e) {
          return send(500, { error: String(e) })
        }
      }
    }
    send(404, { error: `no mock for ${req.method} ${url.pathname}` })
  })
  return server
}

const stringify = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && v !== null).map(([k, v]) => [k, String(v)]))

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.MOCK_PORT ?? 4010)
  createMockServer().listen(port, () => console.log(`Mock Meta + WhatsApp + HubSpot on http://localhost:${port}  (state: GET /_inspect)`))
}
