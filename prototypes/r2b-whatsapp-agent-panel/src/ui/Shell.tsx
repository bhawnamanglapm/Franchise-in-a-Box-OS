import { Component, type ReactNode } from 'react'
import { FACTS_STATUS } from '../data/approvedFacts'
import { resetDemo, useApp } from '../store'

// The 5 modules, in the R1 1a ranking order. Only the Sales Agent exists in this prototype.
const MODULES = [
  { id: 'agent', label: 'Sales Agent', icon: 'M4 5h16v10H8l-4 4z', active: true },
  { id: 'crm', label: 'Sales CRM', icon: 'M4 6h16M4 12h16M4 18h10' },
  { id: 'roi', label: 'ROI Engine', icon: 'M4 19V9m6 10V5m6 14v-7m4 7H3' },
  { id: 'onboarding', label: 'Brand Onboarding', icon: 'M5 12l4 4L19 6' },
  { id: 'collateral', label: 'Collateral Studio', icon: 'M5 4h10l4 4v12H5z' },
]

export function NavRail() {
  return (
    <nav aria-label="Modules" className="hidden w-[68px] shrink-0 flex-col items-center gap-1 border-r border-line bg-bg py-3 lg:flex">
      <div className="mb-3 grid h-9 w-9 place-items-center rounded-lg bg-accent text-sm font-bold text-white" aria-hidden>F</div>
      {MODULES.map((m) => (
        <button key={m.id} aria-current={m.active ? 'page' : undefined} disabled={!m.active}
          title={m.active ? m.label : `${m.label}: not part of this prototype`}
          className={`flex w-14 flex-col items-center gap-1 rounded-md py-2 text-[10px] leading-tight ${m.active ? 'bg-accent/15 text-ink' : 'cursor-not-allowed text-muted/60'}`}>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={m.icon} /></svg>
          <span className="text-center">{m.label}</span>
        </button>
      ))}
    </nav>
  )
}

export function Toasts() {
  const { ui } = useApp()
  return (
    <div className="pointer-events-none fixed inset-x-3 top-3 z-[60] flex flex-col items-center gap-2 sm:inset-x-auto sm:bottom-4 sm:right-4 sm:top-auto sm:items-end">
      {ui.toasts.map((t) => (
        <div key={t.id} role={t.tone === 'error' ? 'alert' : 'status'} data-testid="toast" data-tone={t.tone}
          className={`pointer-events-auto max-w-sm rounded-lg border px-3 py-2 text-sm shadow-xl ${
            t.tone === 'error' ? 'border-danger/60 bg-[#2A1215] text-[#FFB4B4]'
              : t.tone === 'ok' ? 'border-success/50 bg-[#0D231C] text-[#A7F3D0]' : 'border-line bg-card text-ink'}`}>
          {t.text}
        </div>
      ))}
    </div>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-line px-3 py-1.5 text-[11px] text-muted sm:px-4 sm:py-2">
      <p className="truncate sm:hidden" title={FACTS_STATUS}>
        Option B prototype · <span className="text-alert/90">Brand facts illustrative</span> · Mock data, nothing sent
      </p>
      <div className="hidden flex-wrap items-center gap-x-4 gap-y-1 sm:flex">
        <span>Franchise-in-a-Box OS · Task 2, Option B: WhatsApp AI Agent Panel</span>
        <span className="text-alert/90">Brand facts: {FACTS_STATUS}</span>
        <span className="ml-auto">Mock data runs in your browser. Nothing is sent to WhatsApp.</span>
      </div>
    </footer>
  )
}

export class ErrorBoundary extends Component<{ children: ReactNode }, { error?: Error }> {
  state: { error?: Error } = {}
  static getDerivedStateFromError(error: Error) { return { error } }
  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className="grid h-full place-items-center p-6 text-center">
        <div className="max-w-sm">
          <p className="text-base font-semibold">Something went wrong in the panel.</p>
          <p className="mt-1 text-sm text-muted">{this.state.error.message}</p>
          <button className="mt-4 rounded-md bg-accent px-3 py-1.5 text-sm text-white"
            onClick={() => { resetDemo(); this.setState({ error: undefined }) }}>Reset demo</button>
        </div>
      </div>
    )
  }
}
