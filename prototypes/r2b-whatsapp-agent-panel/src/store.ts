// One store for the whole app: the engine's World plus UI-only state. Components never hold
// conversation state themselves, so the badge, inbox and thread can't drift apart.

import { useSyncExternalStore } from 'react'
import { seedWorld } from './data/conversations'
import { AI_REPLY_DELAY_MS, dispatch, type Command } from './engine/machine'
import type { Result, World } from './engine/types'

export type Filter = 'all' | 'human' | 'mine'
export interface Toast { id: number; tone: 'error' | 'ok' | 'info'; text: string }

export interface UIState {
  viewer: string
  selected?: string
  filter: Filter
  speed: 1 | 60
  drafts: Record<string, string>
  toasts: Toast[]
  /** "Simulate second consultant": Priya will claim this conversation at the same moment as the viewer. */
  rival?: string
  mobileView: 'inbox' | 'chat'
  simOpen: boolean
  loading: boolean
}

export interface AppState { w: World; ui: UIState }

const TICK_MS = 250

const initialUI = (): UIState => ({
  viewer: 'neha', selected: 'c5', filter: 'all', speed: 1, drafts: {}, toasts: [],
  mobileView: 'inbox', simOpen: false, loading: true,
})

let state: AppState = { w: seedWorld(), ui: initialUI() }
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())

function set(next: Partial<AppState>) {
  state = { ...state, ...next }
  emit()
}

export function setUI(patch: Partial<UIState>) {
  set({ ui: { ...state.ui, ...patch } })
}

let toastSeq = 0
export function toast(text: string, tone: Toast['tone'] = 'info') {
  const id = ++toastSeq
  setUI({ toasts: [...state.ui.toasts, { id, tone, text }].slice(-4) })
  setTimeout(() => setUI({ toasts: state.ui.toasts.filter((t) => t.id !== id) }), tone === 'error' ? 6000 : 3500)
}

/** Every user action goes through the engine. Failures become a toast saying why (1c §4). */
export function run(cmd: Command, opts: { quiet?: boolean } = {}): Result {
  const { world, result } = dispatch(state.w, cmd)
  set({ w: world })
  if (!result.ok && !opts.quiet) toast(result.message, 'error')
  if (result.ok && result.note === 'not_delivered') toast('Not delivered: WhatsApp is unreachable. Use Retry on the message.', 'error')
  return result
}

/** A prospect message from the simulate box. The AI reply waits 2 real seconds at any demo speed (AC9 demo). */
export function simulateInbound(convId: string, text: string) {
  return run({ type: 'inbound', convId, text, aiDelayMs: AI_REPLY_DELAY_MS * state.ui.speed })
}

/** Claim or Take over, with the optional "second consultant" race for the AC2 demo. */
export function claimOrTake(kind: 'claim' | 'takeOver', convId: string, seenVersion: number) {
  const by = state.ui.viewer
  if (state.ui.rival === convId) {
    // Both requests carry the same version they saw; Priya's lands first.
    run({ type: kind, convId, by: 'priya', seenVersion, requestId: `${kind}:${convId}:${seenVersion}:priya` }, { quiet: true })
    setUI({ rival: undefined })
  }
  const r = run({ type: kind, convId, by, seenVersion, requestId: `${kind}:${convId}:${seenVersion}:${by}` })
  if (r.ok) toast(kind === 'claim' ? 'Claimed. The AI is paused for this chat.' : 'You took over. The AI is paused for this chat.', 'ok')
  return r
}

export function resetDemo() {
  const viewer = state.ui.viewer
  set({ w: seedWorld(), ui: { ...initialUI(), viewer, loading: false } })
  toast('Demo reset to 14:00 IST.', 'info')
}

// Demo clock: every 250 ms of real time moves the demo clock 250 ms × speed, then ticks the engine.
let last = Date.now()
setInterval(() => {
  const nowReal = Date.now()
  const dt = (nowReal - last) * state.ui.speed
  last = nowReal
  const { world } = dispatch({ ...state.w, now: state.w.now + dt }, { type: 'tick' })
  set({ w: world })
}, TICK_MS)

setTimeout(() => setUI({ loading: false }), 450)

export function getState() { return state }

export function useApp(): AppState {
  return useSyncExternalStore((l) => { listeners.add(l); return () => listeners.delete(l) }, () => state)
}
