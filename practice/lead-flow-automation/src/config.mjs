// Everything a non-developer might want to change lives here.
// All figures are ILLUSTRATIVE practice values (same FreshBrew placeholders as prototype B).

// Getters, so values are read when used (tests set them after import).
export const env = {
  // Where the three (fake or real) APIs live. The mock server serves all three on one port.
  get META_GRAPH_URL() { return process.env.META_GRAPH_URL ?? 'http://localhost:4010/meta/v21.0' },
  get WHATSAPP_API_URL() { return process.env.WHATSAPP_API_URL ?? 'http://localhost:4010/whatsapp/v21.0' },
  get HUBSPOT_API_URL() { return process.env.HUBSPOT_API_URL ?? 'http://localhost:4010/hubspot' },

  get META_PAGE_TOKEN() { return process.env.META_PAGE_TOKEN ?? 'test-page-token' },
  get WHATSAPP_TOKEN() { return process.env.WHATSAPP_TOKEN ?? 'test-wa-token' },
  get WHATSAPP_PHONE_NUMBER_ID() { return process.env.WHATSAPP_PHONE_NUMBER_ID ?? '100000000000001' },
  get HUBSPOT_TOKEN() { return process.env.HUBSPOT_TOKEN ?? 'test-hubspot-token' },

  // Meta signs every webhook with the app secret (X-Hub-Signature-256). Never skip this check.
  get APP_SECRET() { return process.env.APP_SECRET ?? 'test-app-secret' },
  // Echoed back during the GET handshake when you register the webhook URL in the Meta app.
  get VERIFY_TOKEN() { return process.env.VERIFY_TOKEN ?? 'test-verify-token' },
}

export const brand = {
  id: 'freshbrew',
  name: 'FreshBrew',
  minBudgetLakh: 25, // below this the lead is UNQUALIFIED (illustrative)
  fullInvestmentLakh: 40,
}

// WhatsApp templates must be approved in WhatsApp Manager before use.
// They are the only thing you may send when the 24-hour customer service window is closed.
export const templates = {
  welcome: { name: 'lead_welcome', language: 'en' }, // body: {{1}} name, {{2}} brand; buttons: "Yes, tell me more" / "Not now"
  reminder: { name: 'lead_reminder', language: 'en' }, // body: {{1}} name, {{2}} brand
  consultantAlert: { name: 'consultant_new_lead', language: 'en' }, // body: {{1}} consultant, {{2}} lead, {{3}} score, {{4}} summary
}

// Quick-reply / button ids. The prospect taps these; the ids come back in the webhook.
export const budgetOptions = [
  { id: 'budget_lt25', title: 'Under ₹25L', lakh: 15 },
  { id: 'budget_25_40', title: '₹25–40L', lakh: 30 },
  { id: 'budget_40p', title: '₹40L+', lakh: 45 },
]
export const timelineOptions = [
  { id: 'time_0_3', title: '0–3 months', months: 3 },
  { id: 'time_3_6', title: '3–6 months', months: 6 },
  { id: 'time_later', title: 'Later', months: 12 },
]

// Matches the R3 trigger lists (A6 "asked for a person", STOP opt-out).
export const OPT_OUT_WORDS = ['stop', 'unsubscribe', 'band karo', 'message mat karo', 'बंद करो']
export const HUMAN_WORDS = ['talk to a person', 'talk to someone', 'real person', 'human', 'call me', 'call karo',
  'phone karo', 'insaan se baat', 'kisi se baat', 'baat karni hai', 'speak to']

// Consultants are matched to HubSpot owners by email.
export const consultants = [
  { email: 'neha@example.com', name: 'Neha', phone: '919800000001', cities: ['mumbai', 'pune'], available: true, maxOpen: 25 },
  { email: 'priya@example.com', name: 'Priya', phone: '919800000002', cities: ['delhi', 'gurugram', 'noida'], available: true, maxOpen: 25 },
  { email: 'arjun@example.com', name: 'Arjun', phone: '919800000003', cities: ['bengaluru', 'bangalore', 'chennai'], available: true, maxOpen: 25 },
]

export const followUp = {
  reminderAfterHours: 4, // no reply for this long → one reminder template
  maxReminders: 2, // after this many, hand to a consultant to call
}
