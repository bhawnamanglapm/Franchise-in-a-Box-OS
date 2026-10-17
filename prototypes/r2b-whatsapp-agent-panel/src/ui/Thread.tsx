import { useEffect, useRef } from 'react'
import { APPROVED_FACTS, FACTS_STATUS, SOURCE_LABEL } from '../data/approvedFacts'
import { USERS } from '../data/brands'
import { HOUR, fmtCountdown, fmtTime } from '../engine/clock'
import type { Conversation, Message } from '../engine/types'
import { run, useApp } from '../store'

const DAY = 24 * HOUR
const IST = 5.5 * HOUR
const dayOf = (t: number) => Math.floor((t + IST) / DAY)

export function Thread({ c }: { c: Conversation }) {
  const { w, ui } = useApp()
  const msgs = w.messages[c.id]
  const queued = w.queue.find((q) => q.convId === c.id)
  const end = useRef<HTMLDivElement>(null)

  useEffect(() => { end.current?.scrollIntoView({ block: 'end' }) }, [msgs.length, queued?.id, c.id])

  let lastDay = -1
  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-5" data-testid="thread" aria-live="polite">
      <div className="mx-auto flex max-w-3xl flex-col gap-2">
        {msgs.map((m) => {
          const d = dayOf(m.ts)
          const sep = d !== lastDay
          lastDay = d
          return (
            <div key={m.id} className="contents">
              {sep && (
                <div className="my-2 text-center text-[11px] uppercase tracking-wide text-muted">
                  {d === dayOf(w.now) ? 'Today' : d === dayOf(w.now) - 1 ? 'Yesterday' : `${dayOf(w.now) - d} days ago`}
                </div>
              )}
              <Bubble m={m} c={c} viewer={ui.viewer} />
            </div>
          )
        })}
        {queued && (
          <div data-testid="ai-typing" className="ml-auto flex items-center gap-2 rounded-lg border border-dashed border-accent/40 px-3 py-2 text-xs text-[#7EA6FF]">
            <span className="flex gap-0.5"><Dot /><Dot d="150ms" /><Dot d="300ms" /></span>
            AI reply queued, sends in <span className="num">{fmtCountdown(queued.dueAt - w.now)}</span>. Take over now to cancel it.
          </div>
        )}
        <div ref={end} />
      </div>
    </div>
  )
}

function Dot({ d = '0ms' }: { d?: string }) {
  return <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#7EA6FF]" style={{ animationDelay: d }} />
}

function Bubble({ m, c, viewer }: { m: Message; c: Conversation; viewer: string }) {
  if (m.sender === 'system') {
    return (
      <div data-testid="system-note" className="mx-auto max-w-[90%] rounded-full border border-line bg-card px-3 py-1 text-center text-[11px] text-muted">
        {m.text} <span className="num opacity-70">· {fmtTime(m.ts)}</span>
      </div>
    )
  }
  const out = m.sender !== 'prospect'
  const who = m.sender === 'prospect' ? c.prospect.name.split(' ')[0]
    : m.sender === 'ai' ? 'AI agent'
      : m.by === viewer ? `You (${USERS[m.by].name})` : USERS[m.by ?? '']?.name ?? 'Team'
  const style = m.sender === 'prospect' ? 'bg-card border-line'
    : m.sender === 'ai' ? 'bg-accent/15 border-accent/30' : 'bg-success/10 border-success/30'
  const fact = m.factTopic ? APPROVED_FACTS[c.brandId]?.find((f) => f.topic === m.factTopic) : undefined
  const failed = m.status === 'failed'

  return (
    <div className={`flex max-w-[85%] flex-col sm:max-w-[70%] ${out ? 'ml-auto items-end' : 'items-start'}`}
      data-testid={`msg-${m.sender}`} data-status={m.status}>
      <div className={`rounded-xl border px-3 py-2 text-sm leading-relaxed ${style} ${failed ? '!border-danger' : ''}`}>
        <div className="mb-0.5 flex items-center gap-1.5 text-[11px] font-medium text-muted">
          <span className={m.sender === 'ai' ? 'text-[#7EA6FF]' : m.sender === 'human' ? 'text-success' : ''}>{who}</span>
          {m.template && <span className="rounded border border-line px-1 text-[10px]">Template</span>}
        </div>
        <p className="whitespace-pre-wrap break-words">{m.text}</p>
        {fact && (
          <p className="mt-1.5 text-[10px] text-muted" title={FACTS_STATUS}>
            Approved fact: {fact.label} ·{' '}
            <span className={fact.source === 'model' ? 'text-success' : 'text-alert'}>{SOURCE_LABEL[fact.source]}</span>
          </p>
        )}
      </div>
      <div className="mt-0.5 flex items-center gap-2 text-[10px] text-muted">
        <span className="num">{fmtTime(m.ts)}</span>
        {failed && (
          <>
            <span className="text-[#FF8A8A]">Not delivered{m.retries ? ` · ${m.retries} ${m.retries === 1 ? 'retry' : 'retries'} failed` : ''}</span>
            {c.state !== 'OPTED_OUT' && (
              <button data-testid="retry" className="font-medium text-ink underline underline-offset-2"
                onClick={() => run({ type: 'retry', convId: c.id, by: viewer, messageId: m.id })}>Retry</button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
