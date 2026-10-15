// Autonomy Rate (R1 1b §5): share of standard minutes completed by automation with no human edit.
// Standard minutes come from outputs/R1-product-thinking/ai-human-split.csv (row = action id there).

import type { ActionEvent, World } from './types'

export const ACTIONS: Record<number, { type: string; actor: ActionEvent['actor']; stdMinutes: number }> = {
  23: { type: 'Send first WhatsApp reply (template)', actor: 'software', stdMinutes: 3 },
  24: { type: 'Qualify lead on WhatsApp', actor: 'ai_model', stdMinutes: 15 },
  25: { type: 'Answer FAQ from approved facts', actor: 'ai_model', stdMinutes: 2 },
  28: { type: 'Send follow-up nudge (template)', actor: 'software', stdMinutes: 1 },
  29: { type: 'Detect HITL triggers and flag', actor: 'ai_model', stdMinutes: 2 },
  31: { type: 'Build unified interaction timeline', actor: 'software', stdMinutes: 3 },
  32: { type: 'Summarise lead for the consultant', actor: 'ai_model', stdMinutes: 10 },
  33: { type: 'Take over the conversation and reply', actor: 'human', stdMinutes: 20 },
  37: { type: 'Update deal stage', actor: 'human', stdMinutes: 3 },
}

export interface Autonomy {
  rate: number
  modelShare: number
  rulesShare: number
  humanShare: number
  completed: number
  failed: number
  cancelled: number
  totalMinutes: number
  humanCloses: number
  closes: number
}

export function autonomy(w: World): Autonomy {
  let total = 0
  let model = 0
  let rules = 0
  let human = 0
  let failed = 0
  let cancelled = 0
  let completed = 0
  for (const a of w.actions) {
    if (a.status === 'failed') { failed++; continue }
    if (a.status === 'cancelled') { cancelled++; continue }
    completed++
    total += a.stdMinutes
    // An AI action a human edited counts as human work (unedited-approval rule).
    if (a.actor === 'human' || a.aiDraftEdited) human += a.stdMinutes
    else if (a.actor === 'ai_model') model += a.stdMinutes
    else rules += a.stdMinutes
  }
  const won = w.stateLog.filter((e) => e.to === 'CLOSED_WON')
  const pct = (n: number) => (total ? n / total : 0)
  return {
    rate: pct(model + rules),
    modelShare: pct(model),
    rulesShare: pct(rules),
    humanShare: pct(human),
    completed,
    failed,
    cancelled,
    totalMinutes: total,
    closes: won.length,
    humanCloses: won.filter((e) => e.by !== 'ai' && e.by !== 'system').length,
  }
}
