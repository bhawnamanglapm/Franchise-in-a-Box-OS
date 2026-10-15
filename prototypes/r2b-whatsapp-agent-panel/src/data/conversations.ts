// Seed world: 10 fictional prospects (A26: fictional names, masked phones).
// Built by replaying a timeline through the engine, so every seeded flag, state-log row and
// ACTION_EVENT comes from the same rules the reviewer exercises. Nothing is hand-written state.

import { dispatch, type Command } from '../engine/machine'
import { HOUR, demoStart, istAt } from '../engine/clock'
import type { Conversation, World } from '../engine/types'

interface Seed {
  id: string
  brandId: string
  name: string
  phone: string
  city: string
}

const SEEDS: Seed[] = [
  { id: 'c1', brandId: 'freshbrew', name: 'Ankit Verma', phone: '+91 98XXX XX214', city: 'Lucknow' },
  { id: 'c2', brandId: 'freshbrew', name: 'Sneha Kulkarni', phone: '+91 97XXX XX530', city: 'Pune' },
  { id: 'c3', brandId: 'ironpulse', name: 'Mohammed Irfan', phone: '+91 99XXX XX871', city: 'Hyderabad' },
  { id: 'c4', brandId: 'freshbrew', name: 'Harpreet Kaur', phone: '+91 98XXX XX046', city: 'Ludhiana' },
  { id: 'c5', brandId: 'freshbrew', name: 'Rahul Mehta', phone: '+91 96XXX XX392', city: 'Indore' },
  { id: 'c6', brandId: 'ironpulse', name: 'Divya Nair', phone: '+91 94XXX XX718', city: 'Kochi' },
  { id: 'c7', brandId: 'freshbrew', name: 'Vikram Singh', phone: '+91 93XXX XX655', city: 'Jaipur' },
  { id: 'c8', brandId: 'freshbrew', name: 'Pooja Shah', phone: '+91 90XXX XX127', city: 'Surat' },
  { id: 'c9', brandId: 'ironpulse', name: 'Amit Kumar', phone: '+91 88XXX XX903', city: 'Patna' },
  { id: 'c10', brandId: 'freshbrew', name: 'Sunita Rao', phone: '+91 87XXX XX461', city: 'Nagpur' },
]

type Step = { at: number; cmd: (w: World) => Command }

function emptyWorld(now: number): World {
  const conversations: Record<string, Conversation> = {}
  const messages: World['messages'] = {}
  for (const s of SEEDS) {
    conversations[s.id] = {
      id: s.id, brandId: s.brandId, prospect: { name: s.name, phone: s.phone, city: s.city },
      state: 'AI_ACTIVE', version: 1, flags: [], lastProspectAt: now, holdingSent: false,
      consent: 'given', lowConfidenceStreak: 0, topicAsks: {},
    }
    messages[s.id] = []
  }
  return {
    now, conversations, order: SEEDS.map((s) => s.id), messages, stateLog: [], actions: [], queue: [],
    agents: { freshbrew: { status: 'ACTIVE' }, ironpulse: { status: 'ACTIVE' } },
    sim: { outage: false, failNextAction: false }, requests: {}, seq: 0,
  }
}

/** The demo world at 14:00 IST today (demo clock), whatever the reviewer's local time. */
export function seedWorld(realNow: number = Date.now()): World {
  const now = demoStart(realNow)
  const today = (hh: number, mm: number) => istAt(now, hh, mm)
  const yday = (hh: number, mm: number) => istAt(now - 24 * HOUR, hh, mm)
  const v = (w: World, id: string) => w.conversations[id].version

  const steps: Step[] = []
  // A prospect message, then a tick 2 s later so a queued AI reply goes out.
  const say = (at: number, convId: string, text: string) => {
    steps.push({ at, cmd: () => ({ type: 'inbound', convId, text }) })
    steps.push({ at: at + 2000, cmd: () => ({ type: 'tick' }) })
  }
  const act = (at: number, cmd: (w: World) => Command) => steps.push({ at, cmd })

  // Yesterday ------------------------------------------------------------------------------
  // c9: high intent + deal value → flagged → Priya claims → Won.
  say(yday(10, 0), 'c9', 'I have 60 lakh ready and want to visit one of your gyms this week.')
  act(yday(10, 5), (w) => ({ type: 'claim', convId: 'c9', by: 'priya', seenVersion: v(w, 'c9'), requestId: 'seed-c9-claim' }))
  act(yday(10, 7), () => ({ type: 'send', convId: 'c9', by: 'priya', text: 'Hi Amit, Priya here from IronPulse. Happy to set up a visit. Does Thursday 11 am work?' }))
  say(yday(10, 20), 'c9', 'Thursday works. Please send the agreement draft also.')
  act(yday(10, 25), () => ({ type: 'send', convId: 'c9', by: 'priya', text: 'Done, sharing the draft on email now. See you Thursday!' }))
  act(yday(17, 30), (w) => ({ type: 'markWon', convId: 'c9', by: 'priya', seenVersion: v(w, 'c9'), requestId: 'seed-c9-won' }))

  // c8: Neha took over yesterday; the prospect's last message is now more than 24 h old.
  say(yday(11, 50), 'c8', 'Hi, I want to open a FreshBrew in Surat. What is the total investment?')
  act(yday(11, 55), (w) => ({ type: 'takeOver', convId: 'c8', by: 'neha', seenVersion: v(w, 'c8'), requestId: 'seed-c8-take' }))
  act(yday(12, 0), () => ({ type: 'send', convId: 'c8', by: 'neha', text: 'Hi Pooja, Neha from FreshBrew. The first step is a 15-minute call. When are you free?' }))

  // Today ----------------------------------------------------------------------------------
  // c10: asked a question, then opted out.
  say(today(11, 0), 'c10', 'What is the royalty?')
  say(today(11, 30), 'c10', 'STOP')

  // c2: English, answered from approved facts.
  say(today(13, 10), 'c2', 'Hi, what is the total investment for a FreshBrew outlet?')
  say(today(13, 20), 'c2', 'I am in Pune. How much space do I need?')

  // c3: English, gym, answered from approved facts.
  say(today(13, 30), 'c3', 'Hello, how much space is needed for an IronPulse gym?')

  // c7: asked for a person, nobody claimed in 10 business minutes → escalated to Ravi.
  say(today(13, 40), 'c7', 'Mera budget 25 lakh hai, Jaipur mein.')
  say(today(13, 46), 'c7', 'Please call me, I want to talk to someone today.')
  act(today(13, 56), () => ({ type: 'tick' }))

  // c4: Hinglish, fee answered.
  say(today(13, 50), 'c4', 'Namaste, franchise fee kitni hai?')

  // c1: Hinglish, AI is qualifying (asks for budget next). The reviewer continues this one.
  say(today(13, 54), 'c1', 'Namaste, mujhe FreshBrew franchise ke baare mein jaanna hai')

  // c5: high intent + deal value (₹45L ≥ ₹40L) → flagged 4 minutes ago.
  say(today(13, 56), 'c5', 'Mere paas 45 lakh ka budget hai. Agreement kab sign kar sakte hain?')

  // c6: legal / financial (A7) → flagged 2 minutes ago; must be resolved before hand-back.
  say(today(13, 58), 'c6', 'Is the return guaranteed? Can I get a refund if the gym does not work out?')

  act(now, () => ({ type: 'tick' }))

  let w = emptyWorld(steps[0].at)
  for (const s of steps.map((x, i) => ({ ...x, i })).sort((a, b) => a.at - b.at || a.i - b.i)) {
    w = { ...w, now: s.at }
    const r = dispatch(w, s.cmd(w))
    if (!r.result.ok) throw new Error(`Seed step failed at ${new Date(s.at).toISOString()}: ${r.result.message}`)
    w = r.world
  }
  // Conversations that never got a prospect message would keep the start time; none here.
  return { ...w, now, requests: {} }
}

