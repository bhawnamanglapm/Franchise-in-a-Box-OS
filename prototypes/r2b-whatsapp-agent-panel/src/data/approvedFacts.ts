// The only numbers the agent may quote (A32).
//
// FreshBrew investment, fee, royalty, payback and outlet size come from the base case of the Task 5
// financial model (outputs/R5-financial-model, task T2B.18). That model is built from third-party
// listings and labelled estimates, so these are model figures, not a franchisor disclosure.
// Training/support and every IronPulse fact are still illustrative placeholders: the brief gives no
// figures for them. Each fact carries its source so the UI can say which is which.

export type FactSource = 'model' | 'illustrative'

export interface Fact {
  topic: string
  label: string
  /** Words that point a prospect question at this fact (EN / Hindi / Hinglish). */
  keywords: string[]
  en: string
  hi: string
  /** 'model': base case of the R5 financial model. 'illustrative': placeholder, no source. */
  source: FactSource
}

export const FACTS_STATUS =
  'FreshBrew investment, fee, royalty, payback and size: R5 financial model base case (estimates). Training/support and IronPulse: illustrative'

export const SOURCE_LABEL: Record<FactSource, string> = {
  model: 'from R5 model',
  illustrative: 'illustrative',
}

export const APPROVED_FACTS: Record<string, Fact[]> = {
  freshbrew: [
    {
      topic: 'investment',
      label: 'Total investment',
      keywords: ['investment', 'invest', 'cost', 'kitna lagega', 'kitna paisa', 'kharcha', 'total', 'capital'],
      en: 'The total investment for one FreshBrew outlet is about ₹32 lakh: ₹24 lakh for fit-out and equipment, the ₹6 lakh franchise fee and ₹2 lakh working capital.',
      hi: 'Ek FreshBrew outlet ka total investment lagbhag ₹32 lakh hai: ₹24 lakh fit-out aur equipment, ₹6 lakh franchise fee aur ₹2 lakh working capital.',
      source: 'model',
    },
    {
      topic: 'fee',
      label: 'Franchise fee',
      keywords: ['franchise fee', 'fee', 'fees', 'joining'],
      en: 'The one-time franchise fee is ₹6 lakh.',
      hi: 'One-time franchise fee ₹6 lakh hai.',
      source: 'model',
    },
    {
      topic: 'royalty',
      label: 'Royalty',
      keywords: ['royalty', 'commission', 'monthly share'],
      en: 'Royalty is 6% of monthly gross sales.',
      hi: 'Royalty monthly gross sales ka 6% hai.',
      source: 'model',
    },
    {
      topic: 'payback',
      label: 'Payback',
      keywords: ['payback', 'roi', 'kitne time', 'kab tak wapas', 'break even', 'breakeven', 'recover'],
      en: 'In our model, at ₹8 lakh of monthly sales payback is about 29 months. At ₹10 lakh it is about 17 months; at ₹6 lakh it takes more than 3 years. I can share the model with its assumptions.',
      hi: 'Hamare model mein ₹8 lakh monthly sales par payback lagbhag 29 mahine hai. ₹10 lakh par lagbhag 17 mahine, aur ₹6 lakh par 3 saal se zyada. Main assumptions ke saath model share kar sakti hoon.',
      source: 'model',
    },
    {
      topic: 'area',
      label: 'Space needed',
      keywords: ['sq ft', 'sqft', 'square', 'area', 'space', 'jagah', 'shop size'],
      en: 'A FreshBrew outlet needs about 400–700 sq ft (our model uses 600), ideally on the ground floor with good footfall.',
      hi: 'FreshBrew outlet ke liye lagbhag 400–700 sq ft chahiye (model mein 600), ground floor aur achhi footfall wali jagah best hai.',
      source: 'model',
    },
    {
      topic: 'support',
      label: 'Training and support',
      keywords: ['training', 'support', 'help', 'staff', 'madad'],
      en: 'We give 2 weeks of training for you and your staff, plus launch and marketing support.',
      hi: 'Hum aapko aur aapke staff ko 2 hafte ki training dete hain, saath mein launch aur marketing support bhi.',
      source: 'illustrative',
    },
  ],
  ironpulse: [
    {
      topic: 'investment',
      label: 'Total investment',
      keywords: ['investment', 'invest', 'cost', 'kitna lagega', 'kitna paisa', 'kharcha', 'total', 'capital'],
      en: 'The total investment for an IronPulse gym is about ₹55–60 lakh, including equipment.',
      hi: 'IronPulse gym ka total investment lagbhag ₹55–60 lakh hai, equipment mila ke.',
      source: 'illustrative',
    },
    {
      topic: 'fee',
      label: 'Franchise fee',
      keywords: ['franchise fee', 'fee', 'fees', 'joining'],
      en: 'The one-time franchise fee is ₹10 lakh.',
      hi: 'One-time franchise fee ₹10 lakh hai.',
      source: 'illustrative',
    },
    {
      topic: 'royalty',
      label: 'Royalty',
      keywords: ['royalty', 'commission', 'monthly share'],
      en: 'Royalty is 7% of monthly membership revenue.',
      hi: 'Royalty monthly membership revenue ka 7% hai.',
      source: 'illustrative',
    },
    {
      topic: 'area',
      label: 'Space needed',
      keywords: ['sq ft', 'sqft', 'square', 'area', 'space', 'jagah'],
      en: 'An IronPulse gym needs 3,000–4,000 sq ft.',
      hi: 'IronPulse gym ke liye 3,000–4,000 sq ft chahiye.',
      source: 'illustrative',
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
