export type Round = {
  scores: number[]
  khishti: boolean[]
}

export type GameData = {
  players: string[]
  rounds: Round[]
}

export const STORAGE_KEY = "buragame_data"
export const MIN_PLAYERS = 3
export const MAX_PLAYERS = 4
export const DEFAULT_PLAYERS = 4
export const KHISHTI_PENALTY = -120
export const ROUND_TOTAL = 120

export function emptyGame(): GameData {
  return { players: [], rounds: [] }
}

export function loadGame(): GameData | null {
  if (typeof window === "undefined") return null
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (!saved) return null
    const data = JSON.parse(saved) as GameData
    if (
      Array.isArray(data.players) &&
      data.players.length >= MIN_PLAYERS &&
      data.players.length <= MAX_PLAYERS
    ) {
      return { players: data.players, rounds: Array.isArray(data.rounds) ? data.rounds : [] }
    }
  } catch {
    return null
  }
  return null
}

export function saveGame(data: GameData) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function clearGame() {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(STORAGE_KEY)
}

export function computeTotals(rounds: Round[], playerCount: number) {
  const totals = new Array(playerCount).fill(0)
  const khishtiCounts = new Array(playerCount).fill(0)
  for (const round of rounds) {
    for (let i = 0; i < playerCount; i++) {
      totals[i] += round.scores[i] ?? 0
      if (round.khishti[i]) {
        khishtiCounts[i]++
        totals[i] += KHISHTI_PENALTY
      }
    }
  }
  return { totals, khishtiCounts }
}
