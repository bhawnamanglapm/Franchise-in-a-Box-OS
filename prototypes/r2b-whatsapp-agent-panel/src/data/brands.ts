import type { Brand, User } from '../engine/types'

// FreshBrew comes from the brief; IronPulse Fitness is fictional (A26). No real company names.
export const BRANDS: Record<string, Brand> = {
  freshbrew: { id: 'freshbrew', name: 'FreshBrew', category: 'QSR café', fullInvestmentLakh: 32 },
  ironpulse: { id: 'ironpulse', name: 'IronPulse Fitness', category: 'Gym', fullInvestmentLakh: 60 },
}

// Fictional team. "Neha" is the person using the panel; Priya is the "second consultant" in the AC2 demo.
export const USERS: Record<string, User> = {
  neha: { id: 'neha', name: 'Neha', role: 'consultant', brands: ['freshbrew', 'ironpulse'] },
  priya: { id: 'priya', name: 'Priya', role: 'consultant', brands: ['freshbrew', 'ironpulse'] },
  arjun: { id: 'arjun', name: 'Arjun', role: 'consultant', brands: ['ironpulse'] },
  ravi: { id: 'ravi', name: 'Ravi', role: 'manager', brands: ['freshbrew', 'ironpulse'] },
}

export const MANAGER_OF: Record<string, string> = { freshbrew: 'ravi', ironpulse: 'ravi' }
