import { useEffect, useState } from 'react'
import { setUI, useApp } from './store'
import { Composer } from './ui/Composer'
import { ConversationHeader } from './ui/ConversationHeader'
import { Header } from './ui/Header'
import { Inbox } from './ui/Inbox'
import { ErrorBoundary, Footer, NavRail, Toasts } from './ui/Shell'
import { SimulatePanel } from './ui/SimulatePanel'
import { TakeoverPanel, WhyFlagged } from './ui/SidePanels'
import { Thread } from './ui/Thread'

// Desktop (lg+): nav · inbox · chat · side panel. Below lg: one column that switches between the
// inbox and the open chat; the side cards sit above the thread and Simulate opens as a bottom sheet.
/** True at xl (≥1280 px), where the side column shows. Each card renders in one place only, so test ids stay unique. */
function useWide() {
  const q = '(min-width: 1280px)'
  const [wide, setWide] = useState(() => window.matchMedia(q).matches)
  useEffect(() => {
    const m = window.matchMedia(q)
    const on = () => setWide(m.matches)
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [])
  return wide
}

export function App() {
  const { w, ui } = useApp()
  const c = ui.selected ? w.conversations[ui.selected] : undefined
  const wide = useWide()

  return (
    <div className="flex h-full min-h-0 flex-col">
      <Header />
      <div className="flex min-h-0 flex-1">
        <NavRail />
        <div className={`min-h-0 w-full shrink-0 lg:block lg:w-[320px] ${ui.mobileView === 'inbox' ? 'block' : 'hidden'}`}>
          <Inbox />
        </div>
        <main className={`min-h-0 min-w-0 flex-1 flex-col overflow-hidden lg:flex ${ui.mobileView === 'chat' ? 'flex' : 'hidden'}`}>
          <ErrorBoundary>
            {c ? <Chat id={c.id} wide={wide} /> : <NoChat />}
          </ErrorBoundary>
        </main>
        {wide && (
          <aside className="w-[340px] shrink-0 space-y-3 overflow-y-auto border-l border-line p-3" aria-label="Details and demo controls">
            {c && <WhyFlagged c={c} />}
            {c && <TakeoverPanel c={c} />}
            <SimulatePanel />
          </aside>
        )}
      </div>
      <Footer />
      {!wide && <SimSheet />}
      <Toasts />
    </div>
  )
}

function Chat({ id, wide }: { id: string; wide: boolean }) {
  const { w } = useApp()
  const c = w.conversations[id]
  const hasCards = c.flags.length > 0 || ['FLAGGED', 'ESCALATED', 'HUMAN_ACTIVE'].includes(c.state)
  return (
    <>
      <div className="flex items-center gap-2 border-b border-line px-3 py-2 lg:hidden">
        <button data-testid="back" onClick={() => setUI({ mobileView: 'inbox' })} className="text-sm text-muted hover:text-ink">← Inbox</button>
        <button data-testid="open-sim" onClick={() => setUI({ simOpen: true })}
          className="ml-auto rounded-md border border-line px-2.5 py-1 text-xs xl:hidden">Simulate</button>
      </div>
      <div className="hidden justify-end border-b border-line px-3 py-1.5 lg:flex xl:hidden">
        <button data-testid="open-sim-md" onClick={() => setUI({ simOpen: true })} className="rounded-md border border-line px-2.5 py-1 text-xs">Simulate</button>
      </div>
      <ConversationHeader c={c} />
      {hasCards && !wide && (
        <details className="group border-b border-line" data-testid="mobile-details">
          <summary className="cursor-pointer list-none px-4 py-2 text-xs text-muted">
            <span className="group-open:hidden">▸ Why flagged & lead summary</span><span className="hidden group-open:inline">▾ Hide details</span>
          </summary>
          <div className="max-h-[32vh] space-y-3 overflow-y-auto px-3 pb-3">
            <WhyFlagged c={c} />
            <TakeoverPanel c={c} />
          </div>
        </details>
      )}
      <Thread c={c} />
      <Composer c={c} />
    </>
  )
}

function NoChat() {
  return (
    <div className="grid flex-1 place-items-center p-6 text-center text-sm text-muted">
      Choose a conversation from the inbox.
    </div>
  )
}

function SimSheet() {
  const { ui } = useApp()
  if (!ui.simOpen) return null
  return (
    <div className="fixed inset-0 z-40 flex items-end bg-black/50 xl:hidden" onClick={() => setUI({ simOpen: false })}>
      <div className="max-h-[85vh] w-full overflow-y-auto rounded-t-2xl border-t border-line bg-bg p-3 sm:mx-auto sm:max-w-lg"
        onClick={(e) => e.stopPropagation()} data-testid="sim-sheet">
        <div className="mb-2 flex items-center justify-between">
          <span className="mx-auto h-1 w-10 rounded-full bg-line" />
        </div>
        <SimulatePanel />
        <button data-testid="close-sim" onClick={() => setUI({ simOpen: false })} className="mt-3 w-full rounded-md border border-line py-2 text-sm">Close</button>
      </div>
    </div>
  )
}
