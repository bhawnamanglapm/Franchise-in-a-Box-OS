// Scripted AI agent (A17): answers only from approved facts, otherwise asks the next qualification
// question. Deterministic so the takeover flow can be tested; a live LLM is the stretch goal (F2B.19).

import type { Brand, Message } from './types'
import type { Fact } from '../data/approvedFacts'
import { findPhrase, parseInvestmentLakh } from './triggers'

const HINDI_MARKERS = ['hai', 'kya', 'mujhe', 'karna', 'chahiye', 'kitna', 'kitne', 'lena', 'nahi', 'ji', 'haan',
  'mera', 'mere', 'aap', 'hoon', 'bhai', 'karo', 'batao', 'kaise', 'kab', 'sheher', 'shehar']

export function isHinglish(text: string): boolean {
  return /[ऀ-ॿ]/.test(text) || findPhrase(text, HINDI_MARKERS) !== undefined
}

export const HOLDING = {
  en: 'Thanks, a member of our franchise team will reply to you here shortly.',
  enAfter: 'Thanks, a member of our franchise team will reply to you here after 9 am.',
  hi: 'Dhanyavaad! Hamari franchise team ka koi member aapko yahin jaldi reply karega.',
  hiAfter: 'Dhanyavaad! Hamari franchise team ka koi member aapko yahin subah 9 baje ke baad reply karega.',
}

export const OPT_OUT_CONFIRM = (brand: string) =>
  `You won't get any more messages from ${brand}. Reply START if you change your mind.`

const CITY_WORDS = ['lucknow', 'pune', 'indore', 'hyderabad', 'ludhiana', 'jaipur', 'surat', 'kochi', 'ahmedabad',
  'patna', 'nagpur', 'bhopal', 'chandigarh', 'delhi', 'mumbai', 'bengaluru', 'bangalore', 'noida', 'gurgaon', 'kanpur']
const TIMELINE_RE = /(within|in|next|agle|is|\d+)\s*(\d+\s*)?(months?|mahine|mahino|weeks?|hafte|saal|year)|diwali|asap|jaldi|turant|next month|agle mahine/i

export interface ScriptedReply {
  text: string
  factTopic?: string
  actionRow: number
}

/** Reply for a message that fired no trigger. */
export function scriptedReply(prospectText: string, brand: Brand, fact: Fact | undefined, history: Message[]): ScriptedReply {
  const hi = isHinglish(prospectText)
  if (fact) {
    const follow = hi ? ' Aur kuch jaanna chahenge?' : ' Is there anything else you would like to know?'
    return { text: (hi ? fact.hi : fact.en) + follow, factTopic: fact.topic, actionRow: 25 }
  }
  const all = history.filter((m) => m.sender === 'prospect').map((m) => m.text).join(' \n ') + ' \n ' + prospectText
  const hasBudget = parseInvestmentLakh(all) !== undefined
  const hasCity = findPhrase(all, CITY_WORDS) !== undefined
  const hasTimeline = TIMELINE_RE.test(all)
  if (!hasBudget) {
    return {
      text: hi
        ? `Shukriya! ${brand.name} franchise ke liye aapka investment budget kitna hai (₹ lakh mein)?`
        : `Thanks! What investment budget do you have in mind for a ${brand.name} franchise (in ₹ lakh)?`,
      actionRow: 24,
    }
  }
  if (!hasCity) {
    return {
      text: hi ? 'Aap kis sheher mein outlet kholna chahte hain?' : 'Which city are you looking to open in?',
      actionRow: 24,
    }
  }
  if (!hasTimeline) {
    return {
      text: hi ? 'Aap kab tak start karna chahenge?' : 'When would you like to get started?',
      actionRow: 24,
    }
  }
  return {
    text: hi
      ? 'Bahut badhiya. Main aapko investment, fee aur payback ki details de sakti hoon. Kya jaanna chahenge?'
      : 'Great. I can share details on investment, fees and payback. What would you like to know?',
    actionRow: 24,
  }
}

export interface LeadSummary {
  budget: string
  city: string
  timeline: string
  objections: string
  lastQuestion: string
  score: number
  suggestedReply: string
}

const OBJECTION_WORDS = ['expensive', 'mehenga', 'mehnga', 'too high', 'zyada', 'risk', 'competition', 'loss', 'nuksan']

/** 5-point summary shown to the consultant at takeover (1c §2C). */
export function summarise(history: Message[], brand: Brand, city: string, name: string): LeadSummary {
  const prospect = history.filter((m) => m.sender === 'prospect')
  const all = prospect.map((m) => m.text).join(' \n ')
  const inv = parseInvestmentLakh(all)
  const tl = all.match(TIMELINE_RE)?.[0]
  const obj = findPhrase(all, OBJECTION_WORDS)
  let lastQuestion = 'None'
  for (let i = history.length - 1; i >= 0; i--) {
    const m = history[i]
    if (m.sender === 'human' && m.status === 'sent') break
    if (m.sender === 'prospect' && (m.text.includes('?') || /kya|kitna|kab|how|what|when/i.test(m.text))) {
      lastQuestion = m.text
      break
    }
  }
  let score = 10
  if (inv !== undefined) score += inv >= brand.fullInvestmentLakh ? 30 : 15
  if (findPhrase(all, ['agreement', 'payment', 'token', 'visit', 'meeting', 'sign', 'call me', 'call karo'])) score += 30
  if (tl) score += 20
  if (city) score += 10
  const first = name.split(' ')[0]
  const hi = isHinglish(all)
  return {
    budget: inv !== undefined ? `₹${inv}L stated` : 'Not stated yet',
    city: city || 'Not stated yet',
    timeline: tl ?? 'Not stated yet',
    objections: obj ? `Mentioned "${obj}"` : 'None raised',
    lastQuestion,
    score: Math.min(score, 100),
    suggestedReply: hi
      ? `Namaste ${first} ji, main Neha, ${brand.name} franchise team se. Aapke sawaal ke liye shukriya. Kya hum aaj ya kal 15 minute ki call kar sakte hain? Main aapko agreement aur next steps detail mein samjha doongi.`
      : `Hi ${first}, this is Neha from the ${brand.name} franchise team. Thanks for your questions. Could we do a 15-minute call today or tomorrow? I'll walk you through the agreement and next steps.`,
  }
}
