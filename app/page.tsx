"use client"

import { useEffect, useState } from "react"
import { SetupScreen } from "@/components/setup-screen"
import { Scoreboard } from "@/components/scoreboard"
import { RoundInput } from "@/components/round-input"
import { clearGame, loadGame, saveGame, type GameData, type Round } from "@/lib/bura"

export default function Page() {
  const [game, setGame] = useState<GameData | null>(null)
  const [loaded, setLoaded] = useState(false)

  // Load persisted game on mount
  useEffect(() => {
    setGame(loadGame())
    setLoaded(true)
  }, [])

  // Persist whenever the game changes
  useEffect(() => {
    if (game) saveGame(game)
  }, [game])

  function startGame(players: string[]) {
    setGame({ players, rounds: [] })
  }

  function addRound(round: Round) {
    setGame((prev) => (prev ? { ...prev, rounds: [...prev.rounds, round] } : prev))
  }

  function undoLastRound() {
    setGame((prev) => (prev ? { ...prev, rounds: prev.rounds.slice(0, -1) } : prev))
  }

  function resetGame() {
    if (window.confirm("ნამდვილად გსურთ ახალი თამაშის დაწყება? მიმდინარე ქულები წაიშლება.")) {
      clearGame()
      setGame(null)
    }
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-lg flex-col gap-4 px-3 py-5">
      <header className="border-b-2 border-border pb-4 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-primary text-balance">
          წერითი ბურა
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">ქულების დაფა</p>
      </header>

      {!loaded ? null : !game ? (
        <SetupScreen onStart={startGame} />
      ) : (
        <>
          <Scoreboard players={game.players} rounds={game.rounds} />
          <RoundInput
            players={game.players}
            onAddRound={addRound}
            onUndo={undoLastRound}
            onReset={resetGame}
            canUndo={game.rounds.length > 0}
          />
        </>
      )}
    </main>
  )
}
