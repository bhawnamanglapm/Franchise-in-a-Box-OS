import { seedWorld } from '../../src/data/conversations'
import { dispatch, type Command } from '../../src/engine/machine'
import type { Result, World } from '../../src/engine/types'

// Fixed real time so every run sees the same demo day.
export const REAL_NOW = Date.UTC(2026, 9, 15, 6, 0) // 11:30 IST; demo clock still starts at 14:00 IST

export const fresh = () => seedWorld(REAL_NOW)

export function step(w: World, cmd: Command): { w: World; r: Result } {
  const { world, result } = dispatch(w, cmd)
  return { w: world, r: result }
}

/** Runs a command that must succeed. */
export function must(w: World, cmd: Command): World {
  const { w: next, r } = step(w, cmd)
  if (!r.ok) throw new Error(`${cmd.type} failed: ${r.message}`)
  return next
}

/** Moves the clock forward, ticking every `every` ms like the store's ticker does. */
export function advance(w: World, ms: number, every = 1000): World {
  const end = w.now + ms
  let cur = w
  while (cur.now < end) {
    cur = must({ ...cur, now: Math.min(cur.now + every, end) }, { type: 'tick' })
  }
  return cur
}

export const msgs = (w: World, id: string) => w.messages[id]
export const aiMsgs = (w: World, id: string) => w.messages[id].filter((m) => m.sender === 'ai')
export const ver = (w: World, id: string) => w.conversations[id].version
