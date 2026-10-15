// Business-time helpers. Business hours are 09:00–21:00 IST every day (A22, D-06).

export const MIN = 60_000
export const HOUR = 60 * MIN
const DAY = 24 * HOUR
const IST = 5.5 * HOUR
const OPEN = 9 * HOUR
const CLOSE = 21 * HOUR

export const SLA_CLAIM_MS = 10 * MIN // T4
export const NO_REPLY_MS = 30 * MIN // T7
export const PRIORITY_MS = 2 * MIN // T7: original consultant's head start
export const WINDOW_MS = 24 * HOUR // WhatsApp customer-service window

function istDayStart(t: number): number {
  return Math.floor((t + IST) / DAY) * DAY - IST
}

/** Milliseconds between a and b that fall inside business hours. */
export function businessMs(a: number, b: number): number {
  if (b <= a) return 0
  let total = 0
  for (let d = istDayStart(a); d < b; d += DAY) {
    const s = Math.max(a, d + OPEN)
    const e = Math.min(b, d + CLOSE)
    if (e > s) total += e - s
  }
  return total
}

/** The moment at which `ms` business milliseconds have passed since `a`. */
export function addBusinessMs(a: number, ms: number): number {
  let left = ms
  for (let d = istDayStart(a); ; d += DAY) {
    const s = Math.max(a, d + OPEN)
    const e = d + CLOSE
    if (e > s) {
      if (e - s >= left) return s + left
      left -= e - s
    }
  }
}

export function isBusinessHours(t: number): boolean {
  const m = (t + IST) % DAY
  return m >= OPEN && m < CLOSE
}

/** 14:00 IST today: the demo clock's start, so the SLA clock runs whatever the reviewer's local time. */
export function demoStart(realNow: number): number {
  return istDayStart(realNow) + 14 * HOUR
}

export function istAt(base: number, hh: number, mm: number): number {
  return istDayStart(base) + hh * HOUR + mm * MIN
}

export function fmtTime(t: number): string {
  const m = Math.floor(((t + IST) % DAY) / MIN)
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
}

export function fmtCountdown(ms: number): string {
  const s = Math.max(0, Math.ceil(ms / 1000))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

export function fmtAgo(ms: number): string {
  if (ms < MIN) return 'now'
  if (ms < HOUR) return `${Math.floor(ms / MIN)}m`
  if (ms < DAY) return `${Math.floor(ms / HOUR)}h`
  return `${Math.floor(ms / DAY)}d`
}
