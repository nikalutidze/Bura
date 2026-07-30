"use client"

import { useEffect, useState } from "react"
import { Leaderboard } from "@/components/leaderboard"
import { RoundInput } from "@/components/round-input"
import { Scoreboard } from "@/components/scoreboard"
import { SetupScreen } from "@/components/setup-screen"
import {
  clearGame,
  clearLeaderboard,
  loadGame,
  loadLeaderboard,
  recordGameResult,
  saveGame,
  saveLeaderboard,
  type GameData,
  type LeaderboardEntry,
  type Round,
} from "@/lib/bura"

export default function Page() {
  const [game, setGame] = useState<GameData | null>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setGame(loadGame())
    setLeaderboard(loadLeaderboard())
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (game) saveGame(game)
  }, [game])

  useEffect(() => {
    if (loaded) saveLeaderboard(leaderboard)
  }, [leaderboard, loaded])

  function startGame(players: string[]) {
    setGame({ players, rounds: [] })
  }

  function addRound(round: Round) {
    setGame((prev) => (prev ? { ...prev, rounds: [...prev.rounds, round] } : prev))
  }

  function undoLastRound() {
    setGame((prev) => (prev ? { ...prev, rounds: prev.rounds.slice(0, -1) } : prev))
  }

  function finishAndResetGame() {
    if (!game) return

    const hasRounds = game.rounds.length > 0
    const message = hasRounds
      ? "Finish this game, update the leaderboard, and start a new game?"
      : "Start a new game?"

    if (!window.confirm(message)) return

    if (hasRounds) {
      setLeaderboard((prev) => recordGameResult(prev, game))
    }

    clearGame()
    setGame(null)
  }

  function resetLeaderboard() {
    if (!window.confirm("Reset the full leaderboard?")) return
    clearLeaderboard()
    setLeaderboard([])
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-lg flex-col gap-4 px-3 py-5">
      <header className="border-b-2 border-border pb-4 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-primary text-balance">Bura Scoreboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Pick players, enter rounds, track winners.</p>
      </header>

      {!loaded ? null : (
        <>
          {!game ? (
            <SetupScreen onStart={startGame} />
          ) : (
            <>
              <Scoreboard players={game.players} rounds={game.rounds} />
              <RoundInput
                players={game.players}
                onAddRound={addRound}
                onUndo={undoLastRound}
                onReset={finishAndResetGame}
                canUndo={game.rounds.length > 0}
              />
            </>
          )}
          <Leaderboard entries={leaderboard} onReset={resetLeaderboard} />
        </>
      )}
    </main>
  )
}
