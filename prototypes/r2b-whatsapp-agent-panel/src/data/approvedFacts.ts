// The only numbers the agent may quote (A32).
//
// ILLUSTRATIVE PLACEHOLDERS. The brief gives no FreshBrew figures and the ROI Dashboard (R2C) that
// approves the real Model Card isn't built yet. Every value here is shown in the UI as "illustrative"
// and gets replaced by R2C's approved Model Card export (task T2B.18). Nothing here is a sourced fact.

export interface Fact {
  topic: string
  label: string
  /** Words that point a prospect question at this fact (EN / Hindi / Hinglish). */
  keywords: string[]
  en: string
  hi: string
}

export const FACTS_STATUS = 'Illustrative: replaced by the approved Model Card (R2C)'

export const APPROVED_FACTS: Record<string, Fact[]> = {
  freshbrew: [
    {
      topic: 'investment',
      label: 'Total investment',
      keywords: ['investment', 'invest', 'cost', 'kitna lagega', 'kitna paisa', 'kharcha', 'total', 'capital'],
      en: 'The total investment for one FreshBrew outlet is about ₹35–40 lakh, including fit-out and equipment.',
      hi: 'Ek FreshBrew outlet ka total investment lagbhag ₹35–40 lakh hai, fit-out aur equipment mila ke.',
    },
    {
      topic: 'fee',
      label: 'Franchise fee',
      keywords: ['franchise fee', 'fee', 'fees', 'joining'],
      en: 'The one-time franchise fee is ₹8 lakh.',
      hi: 'One-time franchise fee ₹8 lakh hai.',
    },
    {
      topic: 'royalty',
      label: 'Royalty',
      keywords: ['royalty', 'commission', 'monthly share'],
      en: 'Royalty is 6% of monthly gross sales.',
      hi: 'Royalty monthly gross sales ka 6% hai.',
    },
    {
      topic: 'payback',
      label: 'Payback',
      keywords: ['payback', 'roi', 'kitne time', 'kab tak wapas', 'break even', 'breakeven', 'recover'],
      en: 'In our base-case model, payback is around 30–36 months. It depends on sales, so I can share the model with its assumptions.',
      hi: 'Base-case model mein payback lagbhag 30–36 mahine hai. Ye sales par depend karta hai, main assumptions ke saath model share kar sakti hoon.',
    },
    {
      topic: 'area',
      label: 'Space needed',
      keywords: ['sq ft', 'sqft', 'square', 'area', 'space', 'jagah', 'shop size'],
      en: 'A FreshBrew outlet needs 600–900 sq ft, ideally on the ground floor with good footfall.',
      hi: 'FreshBrew outlet ke liye 600–900 sq ft chahiye, ground floor aur achhi footfall wali jagah best hai.',
    },
    {
      topic: 'support',
      label: 'Training and support',
      keywords: ['training', 'support', 'help', 'staff', 'madad'],
      en: 'We give 2 weeks of training for you and your staff, plus launch and marketing support.',
      hi: 'Hum aapko aur aapke staff ko 2 hafte ki training dete hain, saath mein launch aur marketing support bhi.',
    },
  ],
  ironpulse: [
    {
      topic: 'investment',
      label: 'Total investment',
      keywords: ['investment', 'invest', 'cost', 'kitna lagega', 'kitna paisa', 'kharcha', 'total', 'capital'],
      en: 'The total investment for an IronPulse gym is about ₹55–60 lakh, including equipment.',
      hi: 'IronPulse gym ka total investment lagbhag ₹55–60 lakh hai, equipment mila ke.',
    },
    {
      topic: 'fee',
      label: 'Franchise fee',
      keywords: ['franchise fee', 'fee', 'fees', 'joining'],
      en: 'The one-time franchise fee is ₹10 lakh.',
      hi: 'One-time franchise fee ₹10 lakh hai.',
    },
    {
      topic: 'royalty',
      label: 'Royalty',
      keywords: ['royalty', 'commission', 'monthly share'],
      en: 'Royalty is 7% of monthly membership revenue.',
      hi: 'Royalty monthly membership revenue ka 7% hai.',
    },
    {
      topic: 'area',
      label: 'Space needed',
      keywords: ['sq ft', 'sqft', 'square', 'area', 'space', 'jagah'],
      en: 'An IronPulse gym needs 3,000–4,000 sq ft.',
      hi: 'IronPulse gym ke liye 3,000–4,000 sq ft chahiye.',
    },
  ],
}

export const TEMPLATES = [
  {
    id: 'follow_up',
    name: 'Follow-up (approved)',
    text: 'Hi {{name}}, following up on your {{brand}} franchise enquiry. Reply here and we will continue the conversation.',
  },
  {
    id: 'call_slot',
    name: 'Call slot (approved)',
    text: 'Hi {{name}}, can we schedule a short call about the {{brand}} franchise? Reply with a time that suits you.',
  },
]
