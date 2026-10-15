// The orchestration: what n8n does between the webhooks and the APIs.
// Stateless by design: every bit of conversation state lives on the HubSpot contact
// (fib_qual_step etc.), so a restart, a retry or a second worker never loses a lead.
import { brand, budgetOptions, consultants, followUp, templates, timelineOptions } from './config.mjs'
import { meta, whatsapp, hubspot } from './clients.mjs'
import { classifyReply, parseLead, pickConsultant, scoreLead, windowOpen } from './rules.mjs'

export const clock = { now: () => new Date() }
const iso = () => clock.now().toISOString()
const OPEN_STEPS = ['awaiting_optin_reply', 'awaiting_budget', 'awaiting_city', 'awaiting_timeline']

// ───────────────────────── 1. Meta lead arrives ─────────────────────────

export async function handleMetaWebhook(body) {
  const results = []
  for (const entry of body.entry ?? [])
    for (const change of entry.changes ?? [])
      if (change.field === 'leadgen') results.push(await handleNewLead(change.value.leadgen_id))
  return results
}

export async function handleNewLead(leadgenId) {
  // Meta retries webhooks, so the same leadgen_id can arrive twice. Check before doing anything.
  if (await hubspot.findContact('fib_meta_lead_id', leadgenId)) return { leadgenId, result: 'duplicate_event_ignored' }

  const lead = parseLead(await meta.getLead(leadgenId))
  const [first, ...rest] = lead.name.trim().split(/\s+/)
  const props = {
    firstname: first || undefined,
    lastname: rest.join(' ') || undefined,
    email: lead.email ?? undefined,
    phone: lead.phone ?? undefined,
    city: lead.city || undefined,
    fib_meta_lead_id: lead.metaLeadId,
    fib_source: `meta_lead_ads${lead.campaignName ? ':' + lead.campaignName : ''}`,
    fib_whatsapp_consent: String(lead.whatsappConsent),
    hs_lead_status: 'NEW',
  }
  for (const k of Object.keys(props)) if (props[k] === undefined) delete props[k]

  // Same person, new form? Update the existing contact instead of creating a duplicate.
  const existing = (await hubspot.findContact('phone', lead.phone)) ?? (await hubspot.findContact('email', lead.email))
  const contact = existing
    ? await hubspot.updateContact(existing.id, props)
    : await hubspot.createContact({ ...props, lifecyclestage: 'lead', fib_qual_step: 'new', fib_reminders_sent: '0' })
  const c = { id: contact.id, ...contact.properties, ...props }

  if (existing?.properties.fib_qual_step === 'handed_off') {
    await hubspot.addNote(c.id, `Submitted another Meta lead form (${lead.metaLeadId}) while already with a consultant.`)
    return { leadgenId, contactId: c.id, result: 'existing_contact_already_with_consultant' }
  }
  if (existing?.properties.fib_wa_opt_out === 'true') {
    await hubspot.addNote(c.id, 'New Meta lead from a prospect who opted out of WhatsApp. No message sent.')
    return { leadgenId, contactId: c.id, result: 'opted_out_no_message' }
  }
  if (!lead.phone || !lead.whatsappConsent) {
    // No consent → no WhatsApp. A person follows up by phone or email instead.
    await save(c, { fib_qual_step: 'no_consent' })
    const reason = lead.phone ? 'No WhatsApp consent on the form' : 'No valid phone number on the form'
    const h = await handoff(c, { reason, score: 'unscored', messageProspect: false })
    return { leadgenId, contactId: c.id, result: 'no_consent_routed_to_consultant', ...h }
  }

  await whatsapp.template(lead.phone, templates.welcome, [lead.name || 'there', brand.name])
  await hubspot.updateContact(c.id, { fib_qual_step: 'awaiting_optin_reply', fib_last_outbound_at: iso(), fib_reminders_sent: '0' })
  return { leadgenId, contactId: c.id, result: existing ? 'existing_contact_welcomed' : 'welcomed' }
}

// ───────────────────────── 2. Prospect replies on WhatsApp ─────────────────────────

export async function handleWhatsAppWebhook(body) {
  const results = []
  for (const entry of body.entry ?? [])
    for (const change of entry.changes ?? []) {
      if (change.field !== 'messages') continue
      // value.statuses = sent/delivered/read/failed receipts. Only failures matter here.
      for (const s of change.value.statuses ?? [])
        if (s.status === 'failed') results.push({ result: 'delivery_failed', to: s.recipient_id, errors: s.errors })
      for (const m of change.value.messages ?? []) {
        const profileName = change.value.contacts?.find((x) => x.wa_id === m.from)?.profile?.name
        results.push(await handleInbound(m, profileName))
      }
    }
  return results
}

async function handleInbound(m, profileName) {
  let c = await loadContact('phone', m.from)
  if (!c) {
    // They messaged first, e.g. from a Click-to-WhatsApp ad (m.referral carries the ad id).
    // Messaging us opens the 24h window, so a reply is allowed.
    const created = await hubspot.createContact({
      firstname: profileName ?? '',
      phone: m.from,
      lifecyclestage: 'lead',
      hs_lead_status: 'NEW',
      fib_source: m.referral ? `ctwa_ad:${m.referral.source_id}` : 'whatsapp_direct',
      fib_whatsapp_consent: 'true',
      fib_qual_step: 'awaiting_optin_reply',
      fib_reminders_sent: '0',
    })
    c = { id: created.id, ...created.properties }
  }
  if (c.fib_last_wa_message_id === m.id) return { contactId: c.id, result: 'duplicate_message_ignored' }

  const r = classifyReply(m)
  await save(c, { fib_last_inbound_at: iso(), fib_last_wa_message_id: m.id })
  const out = (result, extra = {}) => ({ contactId: c.id, intent: r.intent, result, ...extra })

  if (r.intent === 'opt_out') {
    await save(c, { fib_wa_opt_out: 'true', fib_qual_step: c.fib_qual_step === 'handed_off' ? 'handed_off' : 'opted_out' })
    await whatsapp.text(m.from, `You won't get any more messages from ${brand.name}. Reply START if you change your mind.`)
    await hubspot.addNote(c.id, 'Prospect opted out of WhatsApp (STOP).')
    return out('opted_out')
  }
  if (c.fib_wa_opt_out === 'true') {
    if (r.intent !== 'opt_in') return out('ignored_opted_out')
    await save(c, { fib_wa_opt_out: 'false' })
    await askBudget(c, m.from, `Welcome back! Let's continue.`)
    return out('opted_back_in')
  }
  if (r.intent === 'human') return out('handed_off', await handoff(c, { reason: `Asked for a person: "${r.text}"`, score: c.fib_lead_score || 'unscored' }))

  switch (c.fib_qual_step) {
    case 'new':
    case 'awaiting_optin_reply':
      if (r.intent === 'yes' || r.intent === 'text') {
        await askBudget(c, m.from, `Great! A few quick questions so the right consultant can help you.`)
        return out('asked_budget')
      }
      if (r.intent === 'no') {
        await save(c, { fib_qual_step: 'declined', hs_lead_status: 'BAD_TIMING' })
        await whatsapp.text(m.from, `No problem. Message us here any time if you'd like to know more about ${brand.name}.`)
        return out('declined')
      }
      return reask(c, m.from, r, out)

    case 'awaiting_budget':
      if (r.intent !== 'budget') return reask(c, m.from, r, out)
      await save(c, { fib_budget_lakh: String(r.value.lakh), fib_reask_count: '0' })
      if (r.value.lakh < brand.minBudgetLakh) {
        await save(c, { fib_qual_step: 'unqualified', hs_lead_status: 'UNQUALIFIED', fib_lead_score: 'unqualified' })
        await whatsapp.text(m.from, `Thank you for sharing. A ${brand.name} outlet needs about ₹${brand.minBudgetLakh}–${brand.fullInvestmentLakh} lakh, so it may not be the right fit today. We'll keep you posted on smaller formats.`)
        await hubspot.addNote(c.id, `Unqualified: budget ${r.value.title}, below the ₹${brand.minBudgetLakh}L minimum. Not assigned.`)
        return out('unqualified')
      }
      if (c.city) {
        await askTimeline(c, m.from)
        return out('asked_timeline')
      }
      await save(c, { fib_qual_step: 'awaiting_city', fib_last_outbound_at: iso() })
      await whatsapp.text(m.from, `Which city are you planning to open in?`)
      return out('asked_city')

    case 'awaiting_city':
      if (r.intent !== 'text' || !r.text) return reask(c, m.from, r, out)
      await save(c, { city: r.text.slice(0, 60), fib_reask_count: '0' })
      await askTimeline(c, m.from)
      return out('asked_timeline')

    case 'awaiting_timeline': {
      if (r.intent !== 'timeline') return reask(c, m.from, r, out)
      const score = scoreLead({ budgetLakh: Number(c.fib_budget_lakh), timelineMonths: r.value.months })
      await save(c, { fib_timeline_months: String(r.value.months), fib_reask_count: '0' })
      return out('qualified_and_handed_off', await handoff(c, { reason: 'Qualified on WhatsApp', score }))
    }

    default:
      // handed_off / unqualified / declined / no_consent: a person owns this chat now. Log it, don't auto-reply.
      await hubspot.addNote(c.id, `WhatsApp from prospect: "${r.text ?? r.intent}"`)
      return out('logged_for_consultant')
  }
}

async function askBudget(c, to, intro) {
  await save(c, { fib_qual_step: 'awaiting_budget', fib_last_outbound_at: iso(), fib_reask_count: '0' })
  await whatsapp.buttons(to, `${intro}\n\nWhat budget are you planning for the investment?`, budgetOptions)
}

async function askTimeline(c, to) {
  await save(c, { fib_qual_step: 'awaiting_timeline', fib_last_outbound_at: iso() })
  await whatsapp.buttons(to, `When would you like to open your outlet?`, timelineOptions)
}

/** One polite re-ask per question; a second miss goes to a person rather than looping. */
async function reask(c, to, r, out) {
  if (Number(c.fib_reask_count ?? 0) >= 1)
    return out('handed_off', await handoff(c, { reason: `Could not understand answer at ${c.fib_qual_step}: "${r.text ?? ''}"`, score: 'unscored' }))
  if (c.fib_qual_step === 'awaiting_budget') await askBudget(c, to, 'Sorry, please pick one of the options below.')
  else if (c.fib_qual_step === 'awaiting_timeline') await askTimeline(c, to)
  else if (c.fib_qual_step === 'awaiting_city') await whatsapp.text(to, 'Sorry, which city is that? Just the city name is fine.')
  else await whatsapp.text(to, `Would you like to know more about opening a ${brand.name} franchise? Reply YES or NO.`)
  await save(c, { fib_reask_count: '1' }) // after the re-ask, which resets the counter for a new question
  return out('reasked')
}

// ───────────────────────── 3. Hand to a consultant ─────────────────────────

const TASK_DUE_MIN = { hot: 15, warm: 120, cold: 24 * 60, unscored: 60 }

export async function handoff(c, { reason, score, messageProspect = true, leadStatus = 'OPEN' }) {
  const owners = await hubspot.listOwners()
  const idByEmail = Object.fromEntries(owners.map((o) => [o.email, o.id]))
  const countsById = await hubspot.countOpenByOwner()
  const openCounts = Object.fromEntries(consultants.map((k) => [k.email, countsById[idByEmail[k.email]] ?? 0]))
  const consultant = pickConsultant({ city: c.city, consultants, openCounts })

  const summary = [
    `Name: ${c.firstname || '—'} · Phone: ${c.phone || '—'} · Email: ${c.email || '—'}`,
    `City: ${c.city || '—'} · Budget: ${c.fib_budget_lakh ? '₹' + c.fib_budget_lakh + 'L' : '—'} · Timeline: ${c.fib_timeline_months ? c.fib_timeline_months + ' months' : '—'}`,
    `Score: ${score} · Source: ${c.fib_source || '—'} · Reason: ${reason}`,
  ].join('\n')

  if (!consultant) {
    await save(c, { fib_qual_step: 'handoff_queue', fib_lead_score: score, hs_lead_status: leadStatus })
    await hubspot.addNote(c.id, `UNASSIGNED: no consultant available.\n${summary}`)
    return { consultant: null, score }
  }

  const ownerId = idByEmail[consultant.email]
  await save(c, {
    hubspot_owner_id: ownerId,
    hs_lead_status: leadStatus,
    lifecyclestage: score === 'hot' || score === 'warm' ? 'salesqualifiedlead' : 'marketingqualifiedlead',
    fib_qual_step: c.fib_qual_step === 'no_consent' ? 'no_consent' : 'handed_off',
    fib_lead_score: score,
  })
  const due = new Date(clock.now().getTime() + (TASK_DUE_MIN[score] ?? 60) * 60000).toISOString()
  await hubspot.addTask(c.id, ownerId, `[${score.toUpperCase()}] Contact ${c.firstname || c.phone || 'new lead'}`, summary, due)
  await hubspot.addNote(c.id, `Assigned to ${consultant.name}.\n${summary}`)
  await whatsapp.template(consultant.phone, templates.consultantAlert, [
    consultant.name, c.firstname || c.phone || 'New lead', score, `${c.city || 'city ?'}, ${reason}`,
  ])
  // Only a free-form reply if the prospect's 24h window is open and they haven't opted out.
  if (messageProspect && c.phone && c.fib_wa_opt_out !== 'true' && windowOpen(c.fib_last_inbound_at, clock.now()))
    await whatsapp.text(c.phone, `Thank you${c.firstname ? ', ' + c.firstname : ''}! ${consultant.name} from our franchise team will contact you shortly.`)
  return { consultant: consultant.name, score }
}

// ───────────────────────── 4. Scheduled follow-ups (cron) ─────────────────────────

export async function runFollowUps() {
  const res = await fetchStalled()
  const done = []
  for (const c of res) {
    if (c.fib_wa_opt_out === 'true') continue
    const lastOut = new Date(c.fib_last_outbound_at ?? 0)
    const lastIn = new Date(c.fib_last_inbound_at ?? 0)
    if (lastIn > lastOut) continue // they replied; ball is in our court, not theirs
    if (clock.now() - lastOut < followUp.reminderAfterHours * 3600e3) continue
    const sent = Number(c.fib_reminders_sent ?? 0)
    if (sent < followUp.maxReminders) {
      // The 24h window has probably closed, so only an approved template is allowed.
      await whatsapp.template(c.phone, templates.reminder, [c.firstname || 'there', brand.name])
      await save(c, { fib_reminders_sent: String(sent + 1), fib_last_outbound_at: iso() })
      done.push({ contactId: c.id, result: 'reminder_sent', reminder: sent + 1 })
    } else {
      const h = await handoff(c, { reason: `No WhatsApp reply after ${sent} reminders`, score: 'unscored', messageProspect: false, leadStatus: 'ATTEMPTED_TO_CONTACT' })
      done.push({ contactId: c.id, result: 'handed_off_no_reply', ...h })
    }
  }
  return done
}

async function fetchStalled() {
  return (await hubspot.searchByStep(OPEN_STEPS)).map((x) => ({ id: x.id, ...x.properties }))
}

// ───────────────────────── helpers ─────────────────────────

async function loadContact(prop, value) {
  const x = await hubspot.findContact(prop, value)
  return x && { id: x.id, ...x.properties }
}

/** PATCH HubSpot and keep the local copy in step so later checks in the same run see the change. */
async function save(c, props) {
  await hubspot.updateContact(c.id, props)
  Object.assign(c, props)
}
