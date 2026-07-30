export type Round = {
  scores: number[]
  khishti: boolean[]
}

export type GameData = {
  players: string[]
  rounds: Round[]
}

export type LeaderboardEntry = {
  name: string
  wins: number
  games: number
  points: number
}

export const STORAGE_KEY = "buragame_data"
export const LEADERBOARD_STORAGE_KEY = "buragame_leaderboard"
export const MIN_PLAYERS = 3
export const MAX_PLAYERS = 4
export const DEFAULT_PLAYERS = 4
export const KHISHTI_PENALTY = -120
export const ROUND_TOTAL = 120
export const PLAYER_POOL = [
  "Saba",
  "Luto",
  "Aleko",
  "Dachi",
  "kaci",
  "Skhila",
  "Chantura",
  "Jokha",
  "Talakha",
  "Sandro",
  "zaqro",
]

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

export function loadLeaderboard(): LeaderboardEntry[] {
  if (typeof window === "undefined") return []
  try {
    const saved = window.localStorage.getItem(LEADERBOARD_STORAGE_KEY)
    if (!saved) return []
    const data = JSON.parse(saved) as LeaderboardEntry[]
    if (!Array.isArray(data)) return []
    return data
      .filter((entry) => typeof entry.name === "string")
      .map((entry) => ({
        name: entry.name,
        wins: Number(entry.wins) || 0,
        games: Number(entry.games) || 0,
        points: Number(entry.points) || 0,
      }))
  } catch {
    return []
  }
}

export function saveLeaderboard(entries: LeaderboardEntry[]) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(entries))
}

export function clearLeaderboard() {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(LEADERBOARD_STORAGE_KEY)
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

export function recordGameResult(
  leaderboard: LeaderboardEntry[],
  game: GameData,
): LeaderboardEntry[] {
  if (game.rounds.length === 0) return leaderboard

  const { totals } = computeTotals(game.rounds, game.players.length)
  const winningScore = Math.max(...totals)
  const winners = new Set(
    game.players.filter((_, index) => totals[index] === winningScore).map((name) => name.trim()),
  )
  const byName = new Map(leaderboard.map((entry) => [entry.name, { ...entry }]))

  game.players.forEach((player, index) => {
    const name = player.trim()
    if (!name) return
    const current = byName.get(name) ?? { name, wins: 0, games: 0, points: 0 }
    current.games += 1
    current.points += totals[index] ?? 0
    if (winners.has(name)) current.wins += 1
    byName.set(name, current)
  })

  return Array.from(byName.values()).sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins
    if (b.points !== a.points) return b.points - a.points
    return a.name.localeCompare(b.name)
  })
}
