import {
  getBetsSummary,
  setBetsSummary,
  getRaceResults,
  setRaceResults,
  type BetsSummary,
  type RaceResult,
} from '@/lib/storage'

const SNAIL_NAMES = ['Rayo', 'Trueno', 'Bólido', 'Veloz', 'Centella', 'Relámpago']
const RACES_PER_DAY = 6

function generateBetsSummary(): BetsSummary {
  const total = 15 + Math.floor(Math.random() * 10)
  const won = Math.floor(Math.random() * (total + 1))
  return { won, lost: total - won }
}

function generateRaceResults(): RaceResult[] {
  const wins = new Array(SNAIL_NAMES.length).fill(0)

  // Cada carrera tiene exactamente un ganador, así que las victorias
  // repartidas entre los 6 caracoles siempre suman RACES_PER_DAY.
  for (let race = 0; race < RACES_PER_DAY; race++) {
    const winnerIndex = Math.floor(Math.random() * SNAIL_NAMES.length)
    wins[winnerIndex] += 1
  }

  return SNAIL_NAMES.map((name, index) => ({ name, wins: wins[index] }))
}

export function getOrCreateBetsSummary(): BetsSummary {
  const existing = getBetsSummary()
  if (existing) return existing

  const summary = generateBetsSummary()
  setBetsSummary(summary)
  return summary
}

export function getOrCreateRaceResults(): RaceResult[] {
  const existing = getRaceResults()
  if (existing) return existing

  const results = generateRaceResults()
  setRaceResults(results)
  return results
}
