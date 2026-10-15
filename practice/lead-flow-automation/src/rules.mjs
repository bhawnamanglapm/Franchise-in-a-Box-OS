// Pure functions: no network, no state. Easy to test, and each one maps to one n8n Code/IF node.
import { createHmac, timingSafeEqual } from 'node:crypto'
import { brand, budgetOptions, timelineOptions, OPT_OUT_WORDS, HUMAN_WORDS } from './config.mjs'

/** Meta signs the raw body: X-Hub-Signature-256: sha256=<hex HMAC of body with app secret>. */
export function verifySignature(rawBody, header, secret) {
  if (!header?.startsWith('sha256=')) return false
  const expected = Buffer.from(createHmac('sha256', secret).update(rawBody).digest('hex'))
  const given = Buffer.from(header.slice(7))
  return given.length === expected.length && timingSafeEqual(given, expected)
}

export function sign(rawBody, secret) {
  return 'sha256=' + createHmac('sha256', secret).update(rawBody).digest('hex')
}

/** Indian numbers to WhatsApp's format: digits only, country code, no '+'. Returns null if unusable. */
export function normalizePhone(raw) {
  if (!raw) return null
  let d = String(raw).replace(/\D/g, '')
  if (d.startsWith('00')) d = d.slice(2)
  if (d.length === 11 && d.startsWith('0')) d = d.slice(1)
  if (d.length === 10) d = '91' + d
  return /^91[6-9]\d{9}$/.test(d) ? d : null
}

/** Meta returns field_data as [{name, values:[...]}]; flatten it to a plain object. */
export function parseLead(graphLead) {
  const f = Object.fromEntries((graphLead.field_data ?? []).map((x) => [x.name, x.values?.[0] ?? '']))
  const consentRaw = String(f.whatsapp_consent ?? '').toLowerCase()
  return {
    metaLeadId: graphLead.id,
    createdTime: graphLead.created_time,
    name: f.full_name || f.first_name || '',
    email: (f.email || '').toLowerCase() || null,
    phone: normalizePhone(f.phone_number),
    city: (f.city || '').trim(),
    // The lead form must carry an explicit, unticked-by-default consent question for WhatsApp.
    whatsappConsent: ['yes', 'true', 'i agree', 'agree'].includes(consentRaw),
    adId: graphLead.ad_id ?? null,
    formId: graphLead.form_id ?? null,
    campaignName: graphLead.campaign_name ?? null,
  }
}

const has = (text, words) => {
  const t = ` ${text.toLowerCase().replace(/[^\p{L}\p{M}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim()} `
  return words.some((w) => t.includes(` ${w} `))
}

/** Turn a WhatsApp inbound message into one intent the flow can switch on. */
export function classifyReply(msg) {
  // Tapped buttons: interactive reply (session message) or quick reply on a template.
  const buttonId = msg.interactive?.button_reply?.id ?? msg.interactive?.list_reply?.id ?? msg.button?.payload
  const text = (msg.text?.body ?? msg.button?.text ?? msg.interactive?.button_reply?.title ?? '').trim()
  if (has(text, OPT_OUT_WORDS) && text.split(/\s+/).length <= 3) return { intent: 'opt_out' }
  if (text.toLowerCase() === 'start') return { intent: 'opt_in' }
  if (has(text, HUMAN_WORDS)) return { intent: 'human', text }
  if (buttonId === 'welcome_yes' || /^(yes|haan|ha|ok|sure)\b/i.test(text)) return { intent: 'yes', text }
  if (buttonId === 'welcome_no' || /^(no|not now|nahi)\b/i.test(text)) return { intent: 'no', text }
  const budget = budgetOptions.find((o) => o.id === buttonId) ?? parseBudgetText(text)
  if (budget) return { intent: 'budget', value: budget }
  const timeline = timelineOptions.find((o) => o.id === buttonId)
  if (timeline) return { intent: 'timeline', value: timeline }
  return { intent: 'text', text }
}

/** "30 lakh", "₹45L", "1.2 crore" → closest budget option. */
export function parseBudgetText(text) {
  const m = text.toLowerCase().replace(/,/g, '').match(/(\d+(?:\.\d+)?)\s*(lakh|lac|l|cr|crore)\b/)
  if (!m) return null
  const lakh = Number(m[1]) * (m[2].startsWith('c') ? 100 : 1)
  if (lakh < 25) return { ...budgetOptions[0], lakh }
  if (lakh < 40) return { ...budgetOptions[1], lakh }
  return { ...budgetOptions[2], lakh }
}

/**
 * hot  = can afford it and wants to start within 3 months
 * warm = can afford it, 3–6 months
 * cold = can afford it, later
 * unqualified = budget under the brand minimum
 */
export function scoreLead({ budgetLakh, timelineMonths }) {
  if (budgetLakh < brand.minBudgetLakh) return 'unqualified'
  if (timelineMonths <= 3) return 'hot'
  if (timelineMonths <= 6) return 'warm'
  return 'cold'
}

/**
 * Pick the consultant: available, under capacity, covers the city if anyone does,
 * then the one with the fewest open leads (ties → list order). Stateless, so it is
 * safe to re-run and needs no round-robin pointer.
 */
export function pickConsultant({ city, consultants, openCounts }) {
  const c = (city || '').toLowerCase().trim()
  const free = consultants.filter((k) => k.available && (openCounts[k.email] ?? 0) < k.maxOpen)
  if (!free.length) return null
  const local = free.filter((k) => k.cities.includes(c))
  const pool = local.length ? local : free
  return [...pool].sort((a, b) => (openCounts[a.email] ?? 0) - (openCounts[b.email] ?? 0))[0]
}

/** 24-hour customer service window: free-form messages only within 24h of the prospect's last message. */
export function windowOpen(lastInboundIso, now = new Date()) {
  if (!lastInboundIso) return false
  return now - new Date(lastInboundIso) < 24 * 3600 * 1000
}
