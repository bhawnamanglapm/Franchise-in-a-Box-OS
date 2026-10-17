import { describe, expect, it } from 'vitest'
import { BRANDS } from '../../src/data/brands'
import { APPROVED_FACTS } from '../../src/data/approvedFacts'
import { evaluate, isOptIn, isOptOut, parseInvestmentLakh, parseOutlets } from '../../src/engine/triggers'

const ctx = (topicAsks: Record<string, number> = {}) => ({
  brand: BRANDS.freshbrew, facts: APPROVED_FACTS.freshbrew, topicAsks, now: 0,
})
const rules = (text: string, asks?: Record<string, number>) => evaluate(text, ctx(asks)).hits.map((h) => h.rule)

describe('amount and count parsing', () => {
  it('reads lakh and crore in the forms prospects write', () => {
    expect(parseInvestmentLakh('budget 45 lakh')).toBe(45)
    expect(parseInvestmentLakh('₹45L ready')).toBe(45)
    expect(parseInvestmentLakh('around 1.2 crore')).toBe(120)
    expect(parseInvestmentLakh('Rs. 30 lacs')).toBe(30)
    expect(parseInvestmentLakh('I am 45 years old')).toBeUndefined()
  })
  it('reads outlet counts in English and Hindi', () => {
    expect(parseOutlets('want 3 outlets')).toBe(3)
    expect(parseOutlets('do cafes kholne hain')).toBe(2)
  })
})

describe('trigger rules (draft F3.A1–A9)', () => {
  it('A1 + A2 fire together and both carry their value (one flag, every reason)', () => {
    const ev = evaluate('Mere paas 45 lakh hai, agreement kab sign kar sakte hain?', ctx())
    expect(ev.hits.map((h) => h.rule)).toEqual(['A1', 'A2'])
    expect(ev.hits[1].reason).toBe('Stated investment ₹45L, brand threshold ₹32L')
  })
  it('A2 does not fire below the threshold', () => {
    expect(rules('My budget is 25 lakh')).toEqual([])
  })
  it('A2 fires on 2 or more outlets', () => {
    expect(rules('We want to open 2 outlets in Pune')).toEqual(['A2'])
  })
  it('A4 negative sentiment, Hinglish', () => {
    expect(rules('Ye sab bakwas hai')).toContain('A4')
  })
  it('A6 asks for a person', () => {
    expect(rules('kisi se baat karni hai')).toContain('A6')
  })
  it('A7 legal / money is marked compliance', () => {
    const ev = evaluate('Is the return guaranteed?', ctx())
    expect(ev.hits.find((h) => h.rule === 'A7')?.compliance).toBe(true)
  })
  it('A8 routes out-of-scope messages', () => {
    const ev = evaluate('Is there any job vacancy?', ctx())
    expect(ev.hits[0].rule).toBe('A8')
    expect(ev.hits[0].reason).toContain('HR')
  })
  it('A5 fires on the third ask of the same topic', () => {
    expect(rules('What is the royalty?', { royalty: 1 })).toEqual([])
    expect(rules('What is the royalty?', { royalty: 2 })).toEqual(['A5'])
  })
  it('A3 fires on a question no approved fact answers, and only then', () => {
    expect(rules('Do you have a franchise in Dubai?')).toEqual(['A3'])
    expect(rules('What is the franchise fee?')).toEqual([])
  })
  it('whole-word matching: "meeting" is A1, "meet" inside "meets" is not', () => {
    expect(rules('can we fix a meeting')).toContain('A1')
    expect(rules('the space meets my needs')).not.toContain('A1')
  })
})

describe('opt-out keywords (T9): the whole message only', () => {
  it.each(['STOP', ' stop ', 'Stop.', 'Unsubscribe', 'band karo', 'Message mat karo', 'बंद करो'])('"%s" opts out', (t) => {
    expect(isOptOut(t)).toBe(true)
  })
  it.each(['please stop calling at night', 'nonstop', 'stop by tomorrow?'])('"%s" does not', (t) => {
    expect(isOptOut(t)).toBe(false)
  })
  it('START opts back in', () => {
    expect(isOptIn('start')).toBe(true)
  })
})
