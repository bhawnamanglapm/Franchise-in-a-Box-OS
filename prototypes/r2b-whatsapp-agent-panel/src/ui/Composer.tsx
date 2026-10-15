import { useState } from 'react'
import { TEMPLATES } from '../data/approvedFacts'
import { USERS } from '../data/brands'
import { MAX_CHARS, windowLeft } from '../engine/machine'
import type { Conversation } from '../engine/types'
import { run, setUI, useApp } from '../store'
import { Btn } from './bits'

export function Composer({ c }: { c: Conversation }) {
  const { w, ui } = useApp()
  const [tpl, setTpl] = useState('')
  const mine = c.state === 'HUMAN_ACTIVE' && c.assignee === ui.viewer

  if (!mine) {
    const msg =
      c.state === 'AI_ACTIVE' ? 'The AI is handling this chat. Take over to reply yourself.'
        : c.state === 'FLAGGED' ? 'This chat needs a person. Claim it to reply.'
          : c.state === 'ESCALATED' ? 'Escalated to the brand manager. Only they can claim or assign it.'
            : c.state === 'OPTED_OUT' ? 'Prospect opted out. Nothing can be sent, templates included.'
              : c.state === 'HUMAN_ACTIVE' ? `${USERS[c.assignee ?? '']?.name ?? 'Someone'} is handling this chat.`
                : `Deal closed (${c.state === 'CLOSED_WON' ? 'Won' : `Lost: ${c.lossReason}`}). A new prospect message reopens it for the AI.`
    return (
      <div data-testid="composer-locked" className={`border-t border-line px-4 py-3 text-center text-sm ${c.state === 'OPTED_OUT' ? 'text-[#FF8A8A]' : 'text-muted'}`}>
        {msg}
      </div>
    )
  }

  const draft = ui.drafts[c.id] ?? ''
  const n = draft.length
  const over = n > MAX_CHARS
  const windowOpen = windowLeft(c, w.now) > 0
  const setDraft = (v: string) => setUI({ drafts: { ...ui.drafts, [c.id]: v } })
  const send = () => {
    const r = run({ type: 'send', convId: c.id, by: ui.viewer, text: draft })
    if (r.ok) setDraft('')
  }

  return (
    <div className="border-t border-line">
      <div data-testid="ai-paused-banner" className="flex items-center gap-2 bg-success/10 px-4 py-1.5 text-xs text-success">
        <span className="h-1.5 w-1.5 rounded-full bg-success" /> AI paused for this chat. You're replying as {USERS[ui.viewer].name}.
      </div>
      {windowOpen ? (
        <div className="flex items-end gap-2 px-3 py-2.5 sm:px-4">
          <div className="min-w-0 flex-1">
            <textarea data-testid="composer" value={draft} onChange={(e) => setDraft(e.target.value)} rows={2}
              onKeyDown={(e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && n && !over) send() }}
              placeholder="Type a WhatsApp reply… (Ctrl+Enter to send)" aria-label="Reply"
              className={`block max-h-40 w-full resize-y rounded-md border bg-bg px-3 py-2 text-sm outline-none focus:border-accent ${over ? 'border-danger' : 'border-line'}`} />
            <p className="mt-1 flex justify-between text-[11px]">
              <span className="text-[#FF8A8A]">{over ? `Too long by ${(n - MAX_CHARS).toLocaleString('en-IN')} characters. WhatsApp's limit is 4,096.` : ''}</span>
              <span data-testid="char-count" data-over={over} className={`num ${over ? 'font-semibold text-[#FF8A8A]' : 'text-muted'}`}>
                {n.toLocaleString('en-IN')} / {MAX_CHARS.toLocaleString('en-IN')}
              </span>
            </p>
          </div>
          <Btn tone="primary" data-testid="send" disabled={!draft.trim() || over} onClick={send} className="mb-5">Send</Btn>
        </div>
      ) : (
        <div className="px-4 py-3" data-testid="template-picker">
          <p className="text-xs text-alert">More than 24 h since the prospect's last message. WhatsApp only allows an approved template now.</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <select value={tpl} onChange={(e) => setTpl(e.target.value)} aria-label="Approved template"
              className="min-w-0 flex-1 rounded-md border border-line bg-bg px-2 py-2 text-sm">
              <option value="">Choose an approved template…</option>
              {TEMPLATES.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <Btn tone="primary" disabled={!tpl} data-testid="send-template" onClick={() => {
              const r = run({ type: 'sendTemplate', convId: c.id, by: ui.viewer, templateId: tpl })
              if (r.ok) setTpl('')
            }}>Send template</Btn>
          </div>
          {tpl && <p className="mt-2 rounded border border-line bg-bg p-2 text-xs text-muted">{TEMPLATES.find((t) => t.id === tpl)?.text}</p>}
        </div>
      )}
    </div>
  )
}
