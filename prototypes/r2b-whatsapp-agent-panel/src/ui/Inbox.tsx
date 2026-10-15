import { USERS } from '../data/brands'
import { HOUR, fmtAgo, fmtCountdown, MIN } from '../engine/clock'
import { OPEN_STATES, claimTimeLeft } from '../engine/machine'
import type { Conversation, World } from '../engine/types'
import { setUI, useApp, type Filter } from '../store'
import { BrandTag, StateChip } from './bits'

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'human', label: 'Needs human' },
  { id: 'mine', label: 'Mine' },
]

const needsHuman = (c: Conversation) => c.state === 'FLAGGED' || c.state === 'ESCALATED'

function lastActivity(w: World, id: string) {
  return w.messages[id].at(-1)?.ts ?? 0
}

/** Chats waiting for a person come first, least time left on top; the rest by latest activity. */
function sortConvs(w: World, list: Conversation[]) {
  const urgency = (c: Conversation) =>
    c.state === 'ESCALATED' ? -Infinity : c.state === 'FLAGGED' ? claimTimeLeft(c, w.now) ?? Infinity : Infinity
  return [...list].sort((a, b) => urgency(a) - urgency(b) || lastActivity(w, b.id) - lastActivity(w, a.id))
}

export function Inbox() {
  const { w, ui } = useApp()
  const all = w.order.map((id) => w.conversations[id])
  const counts: Record<Filter, number> = {
    all: all.length,
    human: all.filter(needsHuman).length,
    mine: all.filter((c) => c.assignee === ui.viewer && c.state === 'HUMAN_ACTIVE').length,
  }
  const shown = sortConvs(w, all.filter((c) =>
    ui.filter === 'human' ? needsHuman(c) : ui.filter === 'mine' ? c.assignee === ui.viewer && c.state === 'HUMAN_ACTIVE' : true))

  return (
    <section className="flex h-full min-h-0 flex-col border-r border-line" aria-label="Conversations">
      <LiveStats />
      <div className="flex items-center gap-1 border-b border-line px-3 py-2" role="tablist">
        {FILTERS.map((f) => (
          <button key={f.id} role="tab" aria-selected={ui.filter === f.id} data-testid={`filter-${f.id}`}
            onClick={() => setUI({ filter: f.id })}
            className={`rounded-md px-2.5 py-1 text-xs font-medium ${ui.filter === f.id ? 'bg-white/10 text-ink' : 'text-muted hover:text-ink'}`}>
            {f.label} <span className={`num ${f.id === 'human' && counts.human ? 'text-alert' : ''}`}>{counts[f.id]}</span>
          </button>
        ))}
      </div>

      <ul className="min-h-0 flex-1 overflow-y-auto" data-testid="inbox">
        {ui.loading
          ? Array.from({ length: 6 }, (_, i) => <SkeletonRow key={i} />)
          : shown.length === 0
            ? <Empty filter={ui.filter} />
            : shown.map((c) => <Row key={c.id} c={c} />)}
      </ul>
    </section>
  )
}

const IST = 5.5 * HOUR
const dayOf = (t: number) => Math.floor((t + IST) / (24 * HOUR))

/** Live tracking of leads, messages and conversations (brief, Module 4). Recomputed from the same world on every tick. */
function LiveStats() {
  const { w } = useApp()
  const convs = Object.values(w.conversations)
  const today = dayOf(w.now)
  const msgs = Object.values(w.messages).flat().filter((m) => m.sender !== 'system' && dayOf(m.ts) === today)
  const stats = [
    { id: 'leads', label: 'Leads', value: convs.length },
    { id: 'messages', label: 'Messages today', value: msgs.length, sub: `${msgs.filter((m) => m.sender === 'ai').length} by AI` },
    { id: 'active', label: 'Active chats', value: convs.filter((c) => OPEN_STATES.includes(c.state)).length },
    { id: 'needs-human', label: 'Needs human', value: convs.filter(needsHuman).length, alert: true },
  ]
  return (
    <div className="grid grid-cols-4 border-b border-line" data-testid="live-stats" aria-label="Live tracking">
      {stats.map((s) => (
        <div key={s.id} className="border-r border-line px-2 py-2 last:border-r-0" data-testid={`stat-${s.id}`}>
          <div className={`num text-base font-semibold leading-none ${s.alert && s.value ? 'text-alert' : ''}`}>{s.value}</div>
          <div className="mt-1 text-[10px] uppercase leading-tight tracking-wide text-muted" title={s.sub ? `${s.label} · ${s.sub}` : s.label}>{s.label}</div>
        </div>
      ))}
    </div>
  )
}

function Row({ c }: { c: Conversation }) {
  const { w, ui } = useApp()
  const last = [...w.messages[c.id]].reverse().find((m) => m.sender !== 'system')
  const left = claimTimeLeft(c, w.now)
  const active = ui.selected === c.id
  const typing = w.queue.some((q) => q.convId === c.id)

  return (
    <li>
      <button data-testid={`conv-${c.id}`} data-state={c.state} aria-current={active}
        onClick={() => setUI({ selected: c.id, mobileView: 'chat' })}
        className={`block w-full border-b border-line px-3 py-2.5 text-left transition hover:bg-white/[0.03] ${active ? 'bg-accent/10 shadow-[inset_2px_0_0_#2563EB]' : ''}`}>
        <div className="flex items-center gap-2">
          <span className="min-w-0 flex-1 truncate text-sm font-medium">{c.prospect.name}</span>
          <span className="num shrink-0 text-[11px] text-muted">{last ? fmtAgo(w.now - last.ts) : ''}</span>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          <StateChip state={c.state} />
          <BrandTag brandId={c.brandId} />
          {left !== undefined && (
            <span data-testid="sla" className={`num rounded px-1.5 py-0.5 text-[11px] ${left < 2 * MIN ? 'bg-danger/20 text-[#FF8A8A]' : 'text-alert'}`}
              title="Business time left to claim (10-minute SLA)">
              {left > 0 ? `${fmtCountdown(left)} to claim` : 'SLA missed'}
            </span>
          )}
          {c.state === 'ESCALATED' && <span className="text-[11px] text-[#FF8A8A]">Manager alerted</span>}
          {c.state === 'HUMAN_ACTIVE' && c.assignee && (
            <span className="text-[11px] text-muted">{c.assignee === ui.viewer ? 'You' : USERS[c.assignee].name}</span>
          )}
        </div>
        <p className="mt-1 truncate text-xs text-muted">
          {typing ? <span className="text-[#7EA6FF]">AI is replying…</span> : last ? `${prefix(last.sender, last.by, ui.viewer)}${last.text}` : 'No messages'}
        </p>
      </button>
    </li>
  )
}

function prefix(sender: string, by: string | undefined, viewer: string) {
  if (sender === 'ai') return 'AI: '
  if (sender === 'human') return by === viewer ? 'You: ' : `${USERS[by ?? '']?.name ?? 'Team'}: `
  return ''
}

function SkeletonRow() {
  return (
    <li className="border-b border-line px-3 py-3" aria-hidden>
      <div className="h-3.5 w-2/5 animate-pulse rounded bg-line" />
      <div className="mt-2 h-3 w-1/3 animate-pulse rounded bg-line" />
      <div className="mt-2 h-3 w-4/5 animate-pulse rounded bg-line" />
    </li>
  )
}

function Empty({ filter }: { filter: Filter }) {
  const text = filter === 'human'
    ? 'No chats need a person right now. The AI is handling every open conversation.'
    : filter === 'mine'
      ? "You aren't handling any chats. Claim one from \"Needs human\"."
      : 'No conversations yet.'
  return <li className="px-4 py-10 text-center text-sm text-muted" data-testid="inbox-empty">{text}</li>
}
