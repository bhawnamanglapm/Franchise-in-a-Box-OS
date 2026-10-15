import { useState } from 'react'
import { BRANDS, MANAGER_OF, USERS } from '../data/brands'
import { autonomy } from '../engine/autonomy'
import { fmtAgo, fmtTime } from '../engine/clock'
import { run, setUI, toast, useApp } from '../store'
import { Btn, pct } from './bits'

export function Header() {
  const { w, ui } = useApp()
  const a = autonomy(w)
  const [tip, setTip] = useState(false)
  const humanCloses = a.closes ? pct(a.humanCloses / a.closes) : '100%'

  return (
    <header className="border-b border-line bg-bg">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-3 py-2 sm:px-4 sm:py-3">
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-widest text-muted">Franchise-in-a-Box OS</div>
          <h1 className="text-base font-semibold">Sales Agent <span className="font-normal text-muted">· WhatsApp</span></h1>
        </div>

        <div className="relative ml-auto" onMouseEnter={() => setTip(true)} onMouseLeave={() => setTip(false)}>
          <button data-testid="autonomy-badge" onClick={() => setTip((t) => !t)}
            className="num rounded-full border border-accent/50 bg-accent/10 px-3 py-1 text-xs font-semibold text-ink">
            AI: <span data-testid="autonomy-value">{pct(a.rate)}</span> of work <span className="text-muted">|</span> Humans: {humanCloses} of closes
          </button>
          {tip && (
            <div className="absolute right-0 z-30 mt-2 w-80 rounded-lg border border-line bg-card p-3 text-xs leading-relaxed shadow-xl">
              <p className="font-semibold text-ink">Autonomy Rate, computed live</p>
              <p className="mt-1 text-muted">Standard minutes of work finished by automation with no human edit, ÷ all finished work. Failed and cancelled actions don't count.</p>
              <dl className="num mt-2 grid grid-cols-2 gap-y-1">
                <dt className="text-muted">AI models</dt><dd className="text-right">{pct(a.modelShare)}</dd>
                <dt className="text-muted">Software rules</dt><dd className="text-right">{pct(a.rulesShare)}</dd>
                <dt className="text-muted">Humans</dt><dd className="text-right">{pct(a.humanShare)}</dd>
                <dt className="text-muted">Actions logged</dt><dd className="text-right">{a.completed} done · {a.failed} failed · {a.cancelled} cancelled</dd>
                <dt className="text-muted">Deals closed</dt><dd className="text-right">{a.closes} ({a.humanCloses} by a person)</dd>
              </dl>
              <p className="mt-2 text-muted">Minutes per action come from the R1 action map (1b). Take over a chat and watch the number fall.</p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="num rounded border border-line px-2 py-1" title="Demo clock (IST). Business hours 09:00–21:00.">
            <span data-testid="demo-clock">{fmtTime(w.now)}</span> IST
          </span>
          <div className="flex overflow-hidden rounded border border-line" role="group" aria-label="Demo speed">
            {([1, 60] as const).map((s) => (
              <button key={s} data-testid={`speed-${s}`} onClick={() => setUI({ speed: s })}
                className={`num px-2 py-1 ${ui.speed === s ? 'bg-accent text-white' : 'text-muted hover:text-ink'}`}>{s}×</button>
            ))}
          </div>
          <label className="flex items-center gap-1 text-muted">
            <span className="hidden sm:inline">Viewing as</span>
            <select data-testid="viewer" value={ui.viewer} onChange={(e) => setUI({ viewer: e.target.value })}
              className="rounded border border-line bg-card px-1.5 py-1 text-ink">
              <option value="neha">Neha · consultant</option>
              <option value="ravi">Ravi · manager</option>
            </select>
          </label>
        </div>
      </div>
      <AgentStrip />
    </header>
  )
}

function AgentStrip() {
  const { w, ui } = useApp()
  return (
    <div className="flex flex-wrap gap-1.5 border-t border-line px-3 py-1.5 sm:gap-2 sm:px-4 sm:py-2" data-testid="agent-strip">
      {Object.entries(w.agents).map(([brandId, a]) => {
        const isManager = MANAGER_OF[brandId] === ui.viewer
        const dot = a.status === 'ACTIVE' ? 'bg-success' : a.status === 'PAUSED' ? 'bg-alert' : 'bg-danger animate-pulse'
        return (
          <div key={brandId} data-testid={`agent-${brandId}`} data-status={a.status}
            className="flex min-w-0 flex-1 basis-auto items-center sm:basis-72 gap-2 rounded-md border border-line bg-card px-2.5 py-1 text-xs sm:py-1.5">
            <span className={`h-2 w-2 shrink-0 rounded-full ${dot}`} />
            <span className="whitespace-nowrap font-medium">{BRANDS[brandId].name}<span className="hidden sm:inline"> agent</span>:</span>
            <span className={a.status === 'ERROR' ? 'text-[#FF8A8A]' : a.status === 'PAUSED' ? 'text-alert' : 'text-success'}>
              {a.status === 'ACTIVE' ? 'Active' : a.status === 'PAUSED' ? 'Paused' : 'Error'}
            </span>
            <span className={`min-w-0 truncate text-muted ${a.status === 'ACTIVE' ? 'hidden sm:inline' : ''}`}>
              {a.status === 'ERROR'
                ? `${a.lastError}. ${USERS[MANAGER_OF[brandId]].name} alerted.`
                : a.status === 'PAUSED'
                  ? `by ${USERS[a.changedBy ?? '']?.name ?? '—'} at ${fmtTime(a.changedAt ?? w.now)}. New messages go to a person.`
                  : a.lastSendAt ? `Last reply sent ${fmtAgo(w.now - a.lastSendAt)} ago` : 'No replies sent yet'}
            </span>
            <span className={`ml-auto ${isManager ? '' : 'hidden sm:inline'}`}>
              {a.status !== 'ERROR' && (
                <Btn className="!px-2 !py-0.5 text-xs" disabled={!isManager}
                  title={isManager ? '' : 'Only the brand manager (Ravi) can pause or resume the agent.'}
                  onClick={() => {
                    const r = run({ type: a.status === 'ACTIVE' ? 'pauseAgent' : 'resumeAgent', brandId, by: ui.viewer })
                    if (r.ok) toast(a.status === 'ACTIVE' ? `${BRANDS[brandId].name} agent paused.` : `${BRANDS[brandId].name} agent resumed.`, 'ok')
                  }}>
                  {a.status === 'ACTIVE' ? 'Pause' : 'Resume'}
                </Btn>
              )}
            </span>
          </div>
        )
      })}
    </div>
  )
}
