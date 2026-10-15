// Takeover triggers: pure, deterministic rules from the R3 drafts (F3.A1–A9).
// In production A1/A3/A4/A7/A8 also use model classifiers; the prototype uses the keyword and
// threshold half of each rule so every flag can be explained and tested.

import type { Brand, TriggerHit } from './types'
import type { Fact } from '../data/approvedFacts'

export const KEYWORDS = {
  A1: ['agreement', 'payment', 'pay now', 'token amount', 'token', 'advance', 'site visit', 'visit', 'meeting', 'meet',
    'milna hai', 'ready to start', 'ready to proceed', 'sign', 'book a call', 'kab start'],
  A4: ['fraud', 'scam', 'cheat', 'cheating', 'worst', 'pathetic', 'useless', 'rubbish', 'bakwas', 'ghatiya', 'dhokha',
    'bekar', 'faltu', 'waste of time', 'time waste', 'angry', 'complaint'],
  A5: ["you didn't answer", 'you did not answer', 'not answering', 'jawab nahi', 'answer nahi', 'phir se pooch',
    'dobara pooch', 'already asked', 'asked before'],
  A6: ['talk to a person', 'talk to someone', 'real person', 'human', 'call me', 'call karo', 'call kariye', 'phone karo',
    'insaan se baat', 'kisi se baat', 'manager se baat', 'baat karni hai', 'speak to'],
  A7: ['refund', 'guaranteed', 'guarantee', 'assured return', 'loan', 'emi', 'gst', 'legal', 'lawyer', 'court',
    'dispute', 'clause', 'termination', 'paisa wapas', 'wapas milega', 'kanooni'],
}

const OUT_OF_SCOPE: { words: string[]; route: string }[] = [
  { words: ['job', 'vacancy', 'naukri', 'resume', 'cv', 'hiring', 'internship'], route: 'HR' },
  { words: ['supplier', 'vendor', 'supply', 'distributor'], route: 'Vendor team' },
  { words: ['my order', 'order was', 'cold coffee', 'bad service', 'membership cancel'], route: 'Customer support' },
]

const QUESTION_WORDS = ['kya', 'kitna', 'kitni', 'kitne', 'kaise', 'kab', 'kahan', 'kaun', 'how', 'what', 'when',
  'where', 'which', 'why', 'is there', 'can i', 'do you', 'batao', 'bataiye', 'bata do', 'tell me']

export const OPT_OUT_WORDS = ['stop', 'unsubscribe', 'band karo', 'message mat karo', 'बंद करो']
export const OPT_IN_WORDS = ['start']

function escape(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Finds the first phrase in `list` that appears in `text` as whole words. */
export function findPhrase(text: string, list: string[]): string | undefined {
  const t = text.toLowerCase()
  return list.find((p) => new RegExp(`(^|[^a-z0-9])${escape(p.toLowerCase())}([^a-z0-9]|$)`).test(t))
}

/** The whole message is the keyword (any capitals, spaces trimmed): T9. */
export function isOptOut(text: string): boolean {
  const t = text.trim().toLowerCase().replace(/[.!]+$/, '').replace(/\s+/g, ' ')
  return OPT_OUT_WORDS.includes(t)
}

export function isOptIn(text: string): boolean {
  return OPT_IN_WORDS.includes(text.trim().toLowerCase())
}

/** Largest amount stated, in ₹ lakh: "40 lakh", "₹45L", "1.2 crore". */
export function parseInvestmentLakh(text: string): number | undefined {
  const re = /(?:₹|rs\.?|inr)?\s*(\d+(?:\.\d+)?)\s*(lakhs?|lacs?|l|cr|crores?)(?![a-z])/gi
  let best: number | undefined
  for (const m of text.matchAll(re)) {
    const n = parseFloat(m[1])
    const v = m[2].toLowerCase().startsWith('c') ? n * 100 : n
    if (best === undefined || v > best) best = v
  }
  return best
}

const COUNT_WORDS: Record<string, number> = { two: 2, three: 3, four: 4, five: 5, do: 2, teen: 3, char: 4, paanch: 5 }

export function parseOutlets(text: string): number | undefined {
  const m = text.toLowerCase().match(/(\d+|two|three|four|five|do|teen|char|paanch)\s*(outlets?|stores?|branches|franchises|gyms|cafes?|units)/)
  if (!m) return undefined
  return COUNT_WORDS[m[1]] ?? parseInt(m[1], 10)
}

export function isQuestion(text: string): boolean {
  return text.includes('?') || findPhrase(text, QUESTION_WORDS) !== undefined
}

export function matchFact(text: string, facts: Fact[]): Fact | undefined {
  return facts.find((f) => findPhrase(text, f.keywords) !== undefined)
}

const lakh = (n: number) => `₹${Number.isInteger(n) ? n : n.toFixed(1)}L`

export interface Evaluation {
  hits: TriggerHit[]
  fact?: Fact
  question: boolean
}

/** Runs every rule on one prospect message. One flag lists every rule that fired (F3.A9). */
export function evaluate(
  text: string,
  ctx: { brand: Brand; facts: Fact[]; topicAsks: Record<string, number>; now: number },
): Evaluation {
  const hits: TriggerHit[] = []
  const add = (rule: TriggerHit['rule'], label: string, reason: string, compliance = false) =>
    hits.push({ rule, label, reason, compliance, resolved: false, at: ctx.now })

  const a1 = findPhrase(text, KEYWORDS.A1)
  if (a1) add('A1', 'High purchase intent', `Asked about "${a1}"`)

  const inv = parseInvestmentLakh(text)
  const outlets = parseOutlets(text)
  if (inv !== undefined && inv >= ctx.brand.fullInvestmentLakh) {
    add('A2', 'Deal value', `Stated investment ${lakh(inv)}, brand threshold ${lakh(ctx.brand.fullInvestmentLakh)}`)
  } else if (outlets !== undefined && outlets >= 2) {
    add('A2', 'Deal value', `Wants ${outlets} outlets (threshold: 2 or more)`)
  }

  const a4 = findPhrase(text, KEYWORDS.A4)
  if (a4) add('A4', 'Negative sentiment', `Complaint or abuse word: "${a4}"`)

  const a6 = findPhrase(text, KEYWORDS.A6)
  if (a6) add('A6', 'Asked for a person', `"${a6}"`)

  const a7 = findPhrase(text, KEYWORDS.A7)
  if (a7) add('A7', 'Legal / financial', `Topic "${a7}": the AI may not answer this`, true)

  for (const o of OUT_OF_SCOPE) {
    const w = findPhrase(text, o.words)
    if (w) {
      add('A8', 'Out of scope', `"${w}": route to ${o.route}`)
      break
    }
  }

  const question = isQuestion(text)
  const fact = matchFact(text, ctx.facts)

  const a5 = findPhrase(text, KEYWORDS.A5)
  if (a5) add('A5', 'Repeated question', `"${a5}"`)
  else if (fact && (ctx.topicAsks[fact.topic] ?? 0) >= 2) {
    add('A5', 'Repeated question', `Asked about ${fact.label.toLowerCase()} ${(ctx.topicAsks[fact.topic] ?? 0) + 1} times`)
  }

  // A3: a question the approved facts can't answer, and nothing else explains the flag.
  if (question && !fact && hits.length === 0) {
    add('A3', 'Low AI confidence', 'No approved fact answers this question')
  }

  return { hits, fact, question }
}
