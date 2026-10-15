import { useState, type ReactNode } from 'react'
import { MANAGER_OF, USERS } from '../data/brands'
import { HOUR, fmtTime } from '../engine/clock'
import { LOSS_REASONS, RETURN_REASONS, windowLeft } from '../engine/machine'
import type { Conversation } from '../engine/types'
import { claimOrTake, getState, run, toast, useApp } from '../store'
import { BrandTag, Btn, StateChip } from './bits'

const req = (kind: string, c: Conversation, by: string) => `${kind}:${c.id}:${c.version}:${by}`

export function ConversationHeader({ c }: { c: Conversation }) {
  const { w, ui } = useApp()
  const [dialog, setDialog] = useState<'return' | 'lost' | undefined>()
  const viewer = USERS[ui.viewer]
  const isManager = MANAGER_OF[c.brandId] === ui.viewer
  const mine = c.state === 'HUMAN_ACTIVE' && c.assignee === ui.viewer
  const win = windowLeft(c, w.now)
  const priorityBlocked = c.state === 'FLAGGED' && c.priorityUser && c.priorityUser !== ui.viewer && c.priorityUntil && w.now < c.priorityUntil

  return (
    <div className="border-b border-line px-3 py-2.5 sm:px-5">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <div className="w-full min-w-0 sm:w-auto sm:flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-base font-semibold" data-testid="conv-name">{c.prospect.name}</h2>
            <StateChip state={c.state} />
            <BrandTag brandId={c.brandId} />
          </div>
          <p className="mt-0.5 truncate text-xs text-muted">
            <span className="num">{c.prospect.phone}</span> · {c.prospect.city}
            {c.assignee && c.state === 'HUMAN_ACTIVE' && <> · Owner: <span className="text-ink">{c.assignee === ui.viewer ? 'You' : USERS[c.assignee].name}</span></>}
            {c.state !== 'OPTED_OUT' && (
              <> · <span className={win <= 0 ? 'text-alert' : ''} data-testid="window" title="WhatsApp only allows free-form replies within 24 h of the prospect's last message.">
                {win > 0 ? <>Reply window <span className="num">{Math.floor(win / HOUR)}h {Math.floor((win % HOUR) / 60000)}m</span> left</> : 'Reply window closed: templates only'}
              </span></>
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {c.state === 'AI_ACTIVE' && (
            <Btn tone="primary" data-testid="take-over" onClick={() => claimOrTake('takeOver', c.id, c.version)}>Take over</Btn>
          )}
          {c.state === 'FLAGGED' && (
            <Btn tone="alert" data-testid="claim" disabled={!!priorityBlocked}
              title={priorityBlocked ? `${USERS[c.priorityUser!].name} has first claim until ${fmtTime(c.priorityUntil!)}` : ''}
              onClick={() => claimOrTake('claim', c.id, c.version)}>Claim</Btn>
          )}
          {c.state === 'ESCALATED' && (
            isManager ? (
              <>
                <Btn tone="alert" data-testid="claim" onClick={() => claimOrTake('claim', c.id, c.version)}>Claim</Btn>
                <select data-testid="assign" defaultValue="" aria-label="Assign to"
                  className="rounded-md border border-line bg-card px-2 py-1.5 text-sm"
                  onChange={(e) => {
                    const to = e.target.value
                    e.target.value = ''
                    if (!to) return
                    const r = run({ type: 'assign', convId: c.id, by: ui.viewer, to, seenVersion: c.version, requestId: req('assign', c, ui.viewer) })
                    if (r.ok) toast(`Assigned to ${USERS[to].name}.`, 'ok')
                  }}>
                  <option value="" disabled>Assign to…</option>
                  {Object.values(USERS).filter((u) => u.role === 'consultant' && u.brands.includes(c.brandId)).map((u) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </>
            ) : (
              <span className="max-w-xs text-xs text-[#FF8A8A]" data-testid="escalated-note">
                Escalated: only {USERS[MANAGER_OF[c.brandId]].name} (manager) can claim or assign it now.
              </span>
            )
          )}
          {mine && (
            <>
              <Btn data-testid="return-to-ai" onClick={() => setDialog('return')}>Return to AI</Btn>
              <Btn tone="success" data-testid="mark-won" onClick={() => {
                const r = run({ type: 'markWon', convId: c.id, by: ui.viewer, seenVersion: c.version, requestId: req('won', c, ui.viewer) })
                if (r.ok) toast('Marked Won. Nice work.', 'ok')
              }}>Won</Btn>
              <Btn tone="danger" data-testid="mark-lost" onClick={() => setDialog('lost')}>Lost</Btn>
            </>
          )}
          {c.state === 'HUMAN_ACTIVE' && !mine && (
            <span className="text-xs text-muted">{USERS[c.assignee ?? '']?.name ?? 'Someone'} is handling this chat.</span>
          )}
        </div>
      </div>
      {c.state === 'ESCALATED' && viewer.role === 'manager' && (
        <p className="mt-2 text-xs text-[#FF8A8A]">Unclaimed past the 10-minute SLA. You were alerted in-app and by email.</p>
      )}
      {dialog === 'return' && <ReturnDialog c={c} onClose={() => setDialog(undefined)} />}
      {dialog === 'lost' && <LostDialog c={c} onClose={() => setDialog(undefined)} />}
    </div>
  )
}

function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-t-xl border border-line bg-card p-4 sm:rounded-xl">
        <h3 className="text-base font-semibold">{title}</h3>
        {children}
      </div>
    </div>
  )
}

function ReturnDialog({ c, onClose }: { c: Conversation; onClose: () => void }) {
  const { ui } = useApp()
  const [reason, setReason] = useState('')
  const [note, setNote] = useState('')
  const unresolved = c.flags.filter((f) => f.compliance && !f.resolved)
  const draft = (ui.drafts[c.id] ?? '').trim()
  const noteBad = reason === 'Other' && (note.trim().length < 5 || note.trim().length > 200)
  const blockers = [
    !reason && 'Choose a reason.',
    noteBad && 'Describe the reason in 5–200 characters.',
    unresolved.length > 0 && `Mark ${unresolved.map((f) => `"${f.label}"`).join(', ')} resolved first (legal / financial).`,
    draft && 'Send or clear your draft first.',
  ].filter(Boolean) as string[]

  return (
    <Modal title="Return this chat to the AI?" onClose={onClose}>
      <p className="mt-1 text-sm text-muted">The AI starts replying again and the flags are cleared. The reason goes in the log.</p>
      <label className="mt-3 block text-xs font-medium text-muted" htmlFor="ret-reason">Reason</label>
      <select id="ret-reason" data-testid="return-reason" value={reason} onChange={(e) => setReason(e.target.value)}
        className="mt-1 w-full rounded-md border border-line bg-bg px-2 py-2 text-sm">
        <option value="">Choose a reason…</option>
        {RETURN_REASONS.map((r) => <option key={r}>{r}</option>)}
      </select>
      {reason === 'Other' && (
        <>
          <textarea data-testid="return-note" value={note} onChange={(e) => setNote(e.target.value)} rows={2}
            placeholder="What happened? (5–200 characters)"
            className="mt-2 w-full rounded-md border border-line bg-bg px-2 py-2 text-sm" />
          <p className={`num text-right text-[11px] ${noteBad ? 'text-[#FF8A8A]' : 'text-muted'}`}>{note.trim().length} / 200</p>
        </>
      )}
      {blockers.length > 0 && (
        <ul className="mt-3 space-y-1 text-xs text-alert" data-testid="return-blockers">
          {blockers.map((b) => <li key={b}>• {b}</li>)}
        </ul>
      )}
      <div className="mt-4 flex justify-end gap-2">
        <Btn onClick={onClose}>Cancel</Btn>
        <Btn tone="primary" data-testid="confirm-return" disabled={blockers.length > 0} onClick={() => {
          const s = getState()
          const cur = s.w.conversations[c.id]
          const r = run({
            type: 'returnToAI', convId: c.id, by: s.ui.viewer, seenVersion: cur.version, reason, note: note.trim() || undefined,
            composerEmpty: !(s.ui.drafts[c.id] ?? '').trim(), requestId: `return:${c.id}:${cur.version}:${s.ui.viewer}`,
          })
          if (r.ok) { toast('Returned to the AI.', 'ok'); onClose() }
        }}>Return to AI</Btn>
      </div>
    </Modal>
  )
}

function LostDialog({ c, onClose }: { c: Conversation; onClose: () => void }) {
  const [reason, setReason] = useState('')
  return (
    <Modal title={`Mark ${c.prospect.name.split(' ')[0]} as Lost`} onClose={onClose}>
      <label className="mt-3 block text-xs font-medium text-muted" htmlFor="loss-reason">Loss reason (required)</label>
      <select id="loss-reason" data-testid="loss-reason" value={reason} onChange={(e) => setReason(e.target.value)}
        className="mt-1 w-full rounded-md border border-line bg-bg px-2 py-2 text-sm">
        <option value="">Choose a reason…</option>
        {LOSS_REASONS.map((r) => <option key={r}>{r}</option>)}
      </select>
      <div className="mt-4 flex justify-end gap-2">
        <Btn onClick={onClose}>Cancel</Btn>
        <Btn tone="danger" data-testid="confirm-lost" disabled={!reason} onClick={() => {
          const s = getState()
          const cur = s.w.conversations[c.id]
          const r = run({ type: 'markLost', convId: c.id, by: s.ui.viewer, seenVersion: cur.version, reason, requestId: `lost:${c.id}:${cur.version}:${s.ui.viewer}` })
          if (r.ok) { toast(`Marked Lost: ${reason}.`, 'info'); onClose() }
        }}>Mark Lost</Btn>
      </div>
    </Modal>
  )
}

