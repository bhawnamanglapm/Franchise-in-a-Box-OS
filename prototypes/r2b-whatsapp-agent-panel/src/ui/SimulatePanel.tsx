import { useState } from 'react'
import { resetDemo, run, setUI, simulateInbound, useApp } from '../store'
import { Btn, Card } from './bits'

// The 9-step test messages first (docs/requirements/R2B-whatsapp-agent-panel/tasks.md), then one per trigger.
const EXAMPLES = [
  { label: 'Hot lead (Hinglish)', text: 'Mujhe franchise lena hai, budget 40 lakh, agreement bhejo' },
  { label: 'FAQ', text: 'Kitna investment lagega?' },
  { label: 'STOP', text: 'STOP' },
  { label: 'START', text: 'START' },
  { label: 'Refund / legal', text: 'Is the return guaranteed? Refund milega agar loss hua?' },
  { label: 'Angry', text: 'Bakwas service, 2 din se koi jawab nahi' },
  { label: 'Wants a person', text: 'Can I talk to a real person please?' },
  { label: 'Hindi', text: 'मुझे फ्रेंचाइज़ी के बारे में जानकारी चाहिए, कितना खर्चा आएगा?' },
]

export function SimulatePanel() {
  const { w, ui } = useApp()
  const [text, setText] = useState('')
  const c = ui.selected ? w.conversations[ui.selected] : undefined
  const armed = c && ui.rival === c.id
  const send = (t: string) => {
    if (!c || !t.trim()) return
    const r = simulateInbound(c.id, t.trim())
    if (r.ok) setText('')
  }

  return (
    <Card title="Simulate (demo controls)" testid="simulate">
      <label className="block text-xs text-muted" htmlFor="sim-text">
        Prospect message to <span className="text-ink">{c ? c.prospect.name : '…choose a chat'}</span>
      </label>
      <div className="mt-1 flex gap-2">
        <input id="sim-text" data-testid="sim-text" value={text} onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') send(text) }}
          placeholder="Type as the prospect…" className="min-w-0 flex-1 rounded-md border border-line bg-bg px-2 py-1.5 text-sm" />
        <Btn tone="primary" data-testid="sim-send" disabled={!c || !text.trim()} onClick={() => send(text)}>Send</Btn>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {EXAMPLES.map((e) => (
          <button key={e.label} data-testid={`sim-example-${e.label}`} title={e.text} disabled={!c}
            onClick={() => send(e.text)}
            className="rounded-full border border-line px-2 py-0.5 text-[11px] text-muted hover:border-accent hover:text-ink disabled:opacity-40">
            {e.label}
          </button>
        ))}
      </div>
      <p className="mt-1.5 text-[11px] text-muted">The AI replies 2 s after a prospect message, so you can take over before it sends.</p>

      <div className="mt-4 space-y-2 border-t border-line pt-3">
        <Toggle testid="sim-rival" on={!!armed} disabled={!c || !['AI_ACTIVE', 'FLAGGED', 'ESCALATED'].includes(c.state)}
          label="Second consultant" hint="Priya clicks Claim / Take over at the same moment as you."
          onChange={(on) => setUI({ rival: on && c ? c.id : undefined })} />
        <Toggle testid="sim-outage" on={w.sim.outage} label="WhatsApp outage"
          hint="Sends fail. The agent shows Error after the first failed send or within 60 s."
          onChange={(on) => run({ type: 'setOutage', on })} />
        <Toggle testid="sim-fail-next" on={w.sim.failNextAction} label="Network failure on next action"
          hint="The next Claim, Take over or hand-back fails; nothing changes."
          onChange={(on) => run({ type: 'failNextAction', on })} />
      </div>
      <div className="mt-3 flex justify-end">
        <Btn className="!px-2 !py-1 text-xs" data-testid="reset" onClick={resetDemo}>Reset demo</Btn>
      </div>
    </Card>
  )
}

function Toggle({ label, hint, on, onChange, disabled, testid }:
  { label: string; hint: string; on: boolean; onChange: (on: boolean) => void; disabled?: boolean; testid: string }) {
  return (
    <label className={`flex items-start gap-2.5 ${disabled ? 'opacity-40' : 'cursor-pointer'}`}>
      <button role="switch" aria-checked={on} data-testid={testid} disabled={disabled} onClick={() => onChange(!on)}
        className={`relative mt-0.5 h-5 w-9 shrink-0 rounded-full transition ${on ? 'bg-accent' : 'bg-line'}`}>
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${on ? 'left-[18px]' : 'left-0.5'}`} />
      </button>
      <span className="text-xs">
        <span className="font-medium text-ink">{label}</span>
        <span className="block text-muted">{hint}</span>
      </span>
    </label>
  )
}
