import { BRANDS, MANAGER_OF, USERS } from '../data/brands'
import { summarise } from '../engine/agent'
import { MIN, fmtCountdown, fmtTime } from '../engine/clock'
import { claimTimeLeft } from '../engine/machine'
import type { Conversation } from '../engine/types'
import { run, setUI, useApp } from '../store'
import { Btn, Card } from './bits'

/** Why this chat was flagged: every rule that fired, with the value that fired it (1c §2B). */
export function WhyFlagged({ c }: { c: Conversation }) {
  const { w, ui } = useApp()
  if (!c.flags.length || !['FLAGGED', 'ESCALATED', 'HUMAN_ACTIVE'].includes(c.state)) return null
  const mine = c.state === 'HUMAN_ACTIVE' && c.assignee === ui.viewer
  const left = claimTimeLeft(c, w.now)

  return (
    <Card title="Why this was flagged" testid="why-flagged"
      right={left !== undefined
        ? <span className={`num text-xs ${left < 2 * MIN ? 'text-[#FF8A8A]' : 'text-alert'}`}>{left > 0 ? `${fmtCountdown(left)} to claim` : 'SLA missed'}</span>
        : c.state === 'ESCALATED' && c.escalatedAt
          ? <span className="text-xs text-[#FF8A8A]">To {USERS[MANAGER_OF[c.brandId]].name} at <span className="num">{fmtTime(c.escalatedAt)}</span></span>
          : undefined}>
      <ul className="space-y-2.5">
        {c.flags.map((f) => (
          <li key={f.rule} data-testid={`flag-${f.rule}`} className="text-sm">
            <div className="flex items-center gap-2">
              <span className="num rounded bg-alert/15 px-1.5 text-[11px] text-alert">{f.rule}</span>
              <span className="font-medium">{f.label}</span>
              {f.compliance && <span className="rounded border border-danger/50 px-1 text-[10px] text-[#FF8A8A]">Legal / financial</span>}
            </div>
            <p className="mt-0.5 text-xs text-muted">{f.reason}</p>
            {f.compliance && (
              f.resolved
                ? <p className="mt-1 text-xs text-success">✓ Marked resolved</p>
                : mine && <Btn className="mt-1 !px-2 !py-0.5 text-xs" data-testid={`resolve-${f.rule}`}
                    onClick={() => run({ type: 'resolveFlag', convId: c.id, by: ui.viewer, rule: f.rule })}>Mark resolved</Btn>
            )}
          </li>
        ))}
      </ul>
      {c.flags.some((f) => f.compliance && !f.resolved) && (
        <p className="mt-3 text-[11px] text-muted">Legal and financial flags must be marked resolved before the chat goes back to the AI.</p>
      )}
    </Card>
  )
}

/** The 5-point lead summary and a suggested reply, shown when a person is about to (or does) handle the chat. */
export function TakeoverPanel({ c }: { c: Conversation }) {
  const { w, ui } = useApp()
  if (!['FLAGGED', 'ESCALATED', 'HUMAN_ACTIVE'].includes(c.state)) return null
  const s = summarise(w.messages[c.id], BRANDS[c.brandId], c.prospect.city, c.prospect.name)
  const mine = c.state === 'HUMAN_ACTIVE' && c.assignee === ui.viewer
  const rows: [string, string][] = [
    ['Budget', s.budget], ['City', s.city], ['Timeline', s.timeline], ['Objections', s.objections], ['Last question', s.lastQuestion],
  ]
  return (
    <Card title="Lead summary" testid="takeover-panel"
      right={<span className="num text-xs" title="Rule-based score: budget, intent words, timeline, city">Score {s.score}/100</span>}>
      <div className="mb-3 h-1.5 overflow-hidden rounded bg-line"><div className="h-full bg-accent" style={{ width: `${s.score}%` }} /></div>
      <dl className="grid grid-cols-[6.5rem_1fr] gap-x-2 gap-y-1.5 text-xs">
        {rows.map(([k, v]) => (
          <div key={k} className="contents"><dt className="text-muted">{k}</dt><dd className="break-words">{v}</dd></div>
        ))}
      </dl>
      <div className="mt-3 rounded-md border border-line bg-bg p-2.5">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted">Suggested reply</p>
        <p className="mt-1 text-xs leading-relaxed" data-testid="suggested-reply">{s.suggestedReply}</p>
        {mine && (
          <Btn className="mt-2 !px-2 !py-1 text-xs" data-testid="use-reply"
            onClick={() => setUI({ drafts: { ...ui.drafts, [c.id]: s.suggestedReply } })}>Use reply</Btn>
        )}
      </div>
    </Card>
  )
}
