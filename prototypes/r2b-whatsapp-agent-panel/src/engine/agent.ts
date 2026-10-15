// Scripted AI agent (A17): answers only from approved facts, otherwise asks the next qualification
// question. Deterministic so the takeover flow can be tested; a live LLM is the stretch goal (F2B.19).

import type { Brand, Message, TriggerHit, TriggerId } from './types'
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

// When several rules fired, the reply answers the most urgent one: complaints and legal topics first.
const REPLY_PRIORITY: TriggerId[] = ['A4', 'A7', 'A5', 'A6', 'A1', 'A2', 'A3', 'A8', 'NO_REPLY', 'AI_OFF']

/** The quoted value in a trigger reason, e.g. `Asked about "agreement"` → agreement. */
const quoted = (reason: string) => reason.match(/"([^"]+)"/)?.[1]

/** What an A1 (purchase intent) keyword is about, in words fit for a reply. */
function intentTopic(word: string | undefined): { en: string; hi: string } {
  const w = word?.toLowerCase() ?? ''
  if (w === 'agreement') return { en: 'the agreement and next steps', hi: 'agreement aur agle steps' }
  if (['payment', 'pay now', 'token amount', 'token', 'advance'].includes(w))
    return { en: 'the payment schedule and token amount', hi: 'payment schedule aur token amount' }
  if (['site visit', 'visit'].includes(w)) return { en: 'planning a site visit', hi: 'site visit ka plan' }
  if (['meeting', 'meet', 'milna hai', 'book a call'].includes(w)) return { en: 'setting up a meeting', hi: 'meeting ka plan' }
  return { en: 'the next steps to get started', hi: 'shuru karne ke agle steps' }
}

export interface SuggestOptions {
  /** First name of the person who would send the reply (assignee, manager, or viewer). */
  sender?: string
  /** Rules that flagged the chat; the reply is written for the most urgent one. */
  flags?: TriggerHit[]
}

/**
 * Suggested first human reply. Written in gender-neutral phrasing ("main Ravi", "karun", "hum")
 * so it fits any sender without guessing their gender from a name.
 */
function suggestReply(first: string, brand: Brand, hi: boolean, asked: boolean, opts: SuggestOptions): string {
  const intro = opts.sender
    ? (hi ? `Namaste ${first} ji, main ${opts.sender}, ${brand.name} franchise team se.` : `Hi ${first}, this is ${opts.sender} from the ${brand.name} franchise team.`)
    : (hi ? `Namaste ${first} ji, ${brand.name} franchise team se.` : `Hi ${first}, from the ${brand.name} franchise team.`)
  const thanks = asked ? (hi ? ' Aapke sawaal ke liye shukriya.' : ' Thanks for your question.') : ''
  const call = hi ? ' Kya aaj ya kal 15 minute ki call ho sakti hai?' : ' Could we do a 15-minute call today or tomorrow?'
  const hit = REPLY_PRIORITY.map((r) => opts.flags?.find((f) => f.rule === r)).find(Boolean)
  const v = hit ? quoted(hit.reason) : undefined
  let body: string
  switch (hit?.rule) {
    case 'A4':
      return intro + (hi
        ? ' Aapko jo pareshani hui, uske liye maafi chahte hain. Ise sulajhaana ab meri zimmedaari hai. Kya aap bata sakte hain kya hua?'
        : " I'm sorry for the trouble. I'm handling this personally now. Could you tell me what went wrong?")
    case 'A7':
      body = hi
        ? ` ${v ? `${v} ke baare mein` : 'Is baare mein'} hum aapko andaza nahi, sahi aur clear jawab denge.`
        : ` ${v ? `About the ${v} point` : 'On this'}, we'll give you an accurate, clear answer rather than a guess.`
      return intro + thanks + body + call
    case 'A5':
      return intro + (hi
        ? ' Maaf kijiye, aapko dobara poochhna pada. Ab aapke sawaal ka jawab seedha yahin milega.'
        : " Sorry you had to ask again. I'll answer your question myself, right here.")
    case 'A6':
      return intro + (hi
        ? ' Aapne team se baat karne ko kaha tha, toh main yahan hoon. Aaj aapko kis time call karun?'
        : " You asked to speak to someone, so I'm here. What time today suits you for a call?")
    case 'A1': {
      const t = intentTopic(v)
      body = hi
        ? ` 15 minute ki call par hum ${t.hi} detail mein dekh sakte hain. Aaj ya kal ka time theek rahega?`
        : ` I can take you through ${t.en} on a 15-minute call. Does today or tomorrow work?`
      return intro + thanks + body
    }
    case 'A2':
      body = hi
        ? ' Aapka budget share karne ke liye shukriya. Investment aur payback ke numbers ek call par saath mein dekhte hain.'
        : ' Thanks for sharing your budget. Let\'s go through the investment and payback numbers together.'
      return intro + thanks + body + call
    case 'A3':
      return intro + thanks + (hi
        ? ' Iska sahi jawab hum team se confirm karke yahin denge.'
        : " I'm confirming the exact answer with our team and will reply here shortly.")
    case 'A8':
      return intro + (hi
        ? ` Yeh sawaal hamari ${hit.reason.split('route to ')[1] ?? 'sahi'} team dekhti hai. Hum aapka message unhe bhej rahe hain.`
        : ` This is handled by our ${hit.reason.split('route to ')[1] ?? 'relevant'} team. We're passing your message to them.`)
    default:
      return intro + thanks + call
  }
}

/** 5-point summary shown to the consultant at takeover (1c §2C). */
export function summarise(history: Message[], brand: Brand, city: string, name: string, opts: SuggestOptions = {}): LeadSummary {
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
    suggestedReply: suggestReply(first, brand, hi, lastQuestion !== 'None', opts),
  }
}
