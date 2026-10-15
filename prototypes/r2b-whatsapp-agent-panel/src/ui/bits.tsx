import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { BRANDS } from '../data/brands'
import type { ConvState } from '../engine/types'

export const STATE_LABEL: Record<ConvState, string> = {
  AI_ACTIVE: 'AI handling',
  FLAGGED: 'Needs a human',
  ESCALATED: 'Escalated',
  HUMAN_ACTIVE: 'Human handling',
  CLOSED_WON: 'Won',
  CLOSED_LOST: 'Lost',
  OPTED_OUT: 'Opted out',
}

const STATE_STYLE: Record<ConvState, string> = {
  AI_ACTIVE: 'bg-accent/15 text-[#7EA6FF] border-accent/40',
  FLAGGED: 'bg-alert/15 text-alert border-alert/40',
  ESCALATED: 'bg-danger/15 text-[#FF8A8A] border-danger/40',
  HUMAN_ACTIVE: 'bg-success/15 text-success border-success/40',
  CLOSED_WON: 'bg-line text-muted border-line',
  CLOSED_LOST: 'bg-line text-muted border-line',
  OPTED_OUT: 'bg-line text-muted border-line line-through',
}

export function StateChip({ state }: { state: ConvState }) {
  return (
    <span data-testid="state-chip" data-state={state}
      className={`inline-flex items-center whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-medium ${STATE_STYLE[state]}`}>
      {STATE_LABEL[state]}
    </span>
  )
}

export function BrandTag({ brandId }: { brandId: string }) {
  const b = BRANDS[brandId]
  return (
    <span className="whitespace-nowrap rounded border border-line px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted">
      {b.name}
    </span>
  )
}

type Tone = 'primary' | 'success' | 'ghost' | 'danger' | 'alert'
const TONE: Record<Tone, string> = {
  primary: 'bg-accent text-white hover:bg-[#1D4FD8] border-accent',
  success: 'bg-success text-[#04140E] hover:brightness-110 border-success',
  alert: 'bg-alert text-[#1A1003] hover:brightness-110 border-alert',
  danger: 'bg-transparent text-[#FF8A8A] border-danger/60 hover:bg-danger/10',
  ghost: 'bg-transparent text-ink border-line hover:bg-white/5',
}

export function Btn({ tone = 'ghost', className = '', children, ...rest }:
  ButtonHTMLAttributes<HTMLButtonElement> & { tone?: Tone; children: ReactNode }) {
  return (
    <button {...rest}
      className={`inline-flex items-center justify-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition
        disabled:cursor-not-allowed disabled:opacity-40 ${TONE[tone]} ${className}`}>
      {children}
    </button>
  )
}

export function Card({ title, right, children, className = '', testid }:
  { title?: ReactNode; right?: ReactNode; children: ReactNode; className?: string; testid?: string }) {
  return (
    <section data-testid={testid} className={`rounded-lg border border-line bg-card ${className}`}>
      {title && (
        <header className="flex items-center justify-between gap-2 border-b border-line px-3 py-2">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">{title}</h3>
          {right}
        </header>
      )}
      <div className="p-3">{children}</div>
    </section>
  )
}

export const pct = (x: number) => `${Math.round(x * 100)}%`
