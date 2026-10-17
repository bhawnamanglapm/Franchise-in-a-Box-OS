// Thin HTTP clients for the three APIs. Same request shapes as the real APIs, so pointing
// the URLs in config.mjs at graph.facebook.com / api.hubapi.com is the only change for real use.
import { env } from './config.mjs'

export class ApiError extends Error {
  constructor(service, status, body) {
    super(`${service} ${status}: ${JSON.stringify(body)}`)
    Object.assign(this, { service, status, body })
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/** Retries 429 and 5xx with backoff (honours Retry-After). 4xx other than 429 are real errors: no retry. */
async function call(service, url, { method = 'GET', token, body, retries = 3 } = {}) {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, {
      method,
      headers: { Authorization: `Bearer ${token}`, ...(body ? { 'Content-Type': 'application/json' } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    })
    const data = res.status === 204 ? null : await res.json().catch(() => null)
    if (res.ok) return data
    const retryable = res.status === 429 || res.status >= 500
    if (!retryable || attempt >= retries) throw new ApiError(service, res.status, data)
    const wait = Number(res.headers.get('retry-after')) * 1000 || 200 * 2 ** attempt
    await sleep(Math.min(wait, 2000))
  }
}

export const meta = {
  getLead: (leadgenId) =>
    call('meta', `${env.META_GRAPH_URL}/${leadgenId}?fields=id,created_time,field_data,ad_id,form_id,campaign_name`, {
      token: env.META_PAGE_TOKEN,
    }),
}

const waSend = (payload) =>
  call('whatsapp', `${env.WHATSAPP_API_URL}/${env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
    method: 'POST',
    token: env.WHATSAPP_TOKEN,
    body: { messaging_product: 'whatsapp', recipient_type: 'individual', ...payload },
  })

export const whatsapp = {
  template: (to, { name, language }, params = []) =>
    waSend({
      to,
      type: 'template',
      template: {
        name,
        language: { code: language },
        components: params.length
          ? [{ type: 'body', parameters: params.map((text) => ({ type: 'text', text: String(text) })) }]
          : [],
      },
    }),
  text: (to, body) => waSend({ to, type: 'text', text: { body } }),
  // Reply buttons: max 3 buttons, title max 20 characters.
  buttons: (to, body, options) =>
    waSend({
      to,
      type: 'interactive',
      interactive: {
        type: 'button',
        body: { text: body },
        action: { buttons: options.map((o) => ({ type: 'reply', reply: { id: o.id, title: o.title } })) },
      },
    }),
}

const hs = (path, opts = {}) => call('hubspot', `${env.HUBSPOT_API_URL}${path}`, { token: env.HUBSPOT_TOKEN, ...opts })

export const hubspot = {
  async findContact(property, value) {
    if (!value) return null
    const r = await hs('/crm/v3/objects/contacts/search', {
      method: 'POST',
      body: {
        filterGroups: [{ filters: [{ propertyName: property, operator: 'EQ', value }] }],
        properties: CONTACT_PROPS,
        limit: 1,
      },
    })
    return r.results[0] ?? null
  },
  searchByStep: (steps) =>
    hs('/crm/v3/objects/contacts/search', {
      method: 'POST',
      body: {
        filterGroups: [{ filters: [{ propertyName: 'fib_qual_step', operator: 'IN', values: steps }] }],
        properties: CONTACT_PROPS,
        limit: 100,
      },
    }).then((r) => r.results),
  createContact: (properties) => hs('/crm/v3/objects/contacts', { method: 'POST', body: { properties } }),
  updateContact: (id, properties) => hs(`/crm/v3/objects/contacts/${id}`, { method: 'PATCH', body: { properties } }),
  listOwners: () => hs('/crm/v3/owners').then((r) => r.results),
  async countOpenByOwner() {
    const r = await hs('/crm/v3/objects/contacts/search', {
      method: 'POST',
      body: {
        filterGroups: [{ filters: [{ propertyName: 'hs_lead_status', operator: 'IN', values: ['OPEN', 'IN_PROGRESS'] }] }],
        properties: ['hubspot_owner_id'],
        limit: 200,
      },
    })
    const counts = {}
    for (const c of r.results) counts[c.properties.hubspot_owner_id] = (counts[c.properties.hubspot_owner_id] ?? 0) + 1
    return counts
  },
  // associationTypeId 202 = note→contact, 204 = task→contact (HubSpot-defined).
  addNote: (contactId, body) =>
    hs('/crm/v3/objects/notes', {
      method: 'POST',
      body: {
        properties: { hs_timestamp: new Date().toISOString(), hs_note_body: body },
        associations: [{ to: { id: contactId }, types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 202 }] }],
      },
    }),
  addTask: (contactId, ownerId, subject, body, dueIso) =>
    hs('/crm/v3/objects/tasks', {
      method: 'POST',
      body: {
        properties: {
          hs_timestamp: dueIso,
          hs_task_subject: subject,
          hs_task_body: body,
          hs_task_status: 'NOT_STARTED',
          hs_task_priority: 'HIGH',
          hubspot_owner_id: ownerId,
        },
        associations: [{ to: { id: contactId }, types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 204 }] }],
      },
    }),
}

// Custom properties (create them once in HubSpot → Settings → Properties) are prefixed fib_.
export const CONTACT_PROPS = [
  'firstname', 'lastname', 'email', 'phone', 'city', 'hubspot_owner_id', 'lifecyclestage', 'hs_lead_status',
  'fib_meta_lead_id', 'fib_source', 'fib_whatsapp_consent', 'fib_wa_opt_out', 'fib_qual_step',
  'fib_budget_lakh', 'fib_timeline_months', 'fib_lead_score', 'fib_last_inbound_at', 'fib_last_wa_message_id',
  'fib_reminders_sent', 'fib_last_outbound_at', 'fib_reask_count',
]
