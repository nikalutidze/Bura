"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DEFAULT_PLAYERS, MAX_PLAYERS, MIN_PLAYERS, PLAYER_POOL } from "@/lib/bura"
import { Check, UserPlus, X } from "lucide-react"

type SetupScreenProps = {
  onStart: (players: string[]) => void
}

export function SetupScreen({ onStart }: SetupScreenProps) {
  const [names, setNames] = useState<string[]>(PLAYER_POOL.slice(0, DEFAULT_PLAYERS))
  const selectedNames = new Set(names.map((name) => name.trim()).filter(Boolean))

  function addPlayer() {
    if (names.length >= MAX_PLAYERS) return
    const nextName = PLAYER_POOL.find((name) => !selectedNames.has(name)) ?? ""
    setNames([...names, nextName])
  }

  function removePlayer(idx: number) {
    if (names.length <= MIN_PLAYERS) return
    setNames(names.filter((_, i) => i !== idx))
  }

  function choosePlayer(slotIndex: number, playerName: string) {
    const next = [...names]
    next[slotIndex] = playerName
    setNames(next)
  }

  function addQuickPick(playerName: string) {
    if (selectedNames.has(playerName)) return

    const emptyIndex = names.findIndex((name) => name.trim() === "")
    if (emptyIndex >= 0) {
      choosePlayer(emptyIndex, playerName)
      return
    }

    if (names.length < MAX_PLAYERS) {
      setNames([...names, playerName])
    }
  }

  function handleStart() {
    const cleaned = names.map((name, index) => name.trim() || `Player ${index + 1}`)
    onStart(cleaned)
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-lg">
      <div className="mb-5 flex items-center justify-between gap-2">
        <h2 className="text-lg font-bold text-balance">Start game</h2>
        <span className="rounded-full bg-secondary px-3 py-1 text-sm font-semibold text-secondary-foreground">
          {`${names.length} players`}
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {names.map((name, idx) => (
          <div key={idx} className="flex flex-col gap-1.5">
            <label htmlFor={`player-${idx}`} className="text-sm text-muted-foreground">
              {`Player ${idx + 1}`}
            </label>
            <div className="flex items-center gap-2">
              <select
                id={`player-${idx}`}
                value={name}
                onChange={(event) => choosePlayer(idx, event.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-base text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/40"
              >
                <option value="">Choose player</option>
                {PLAYER_POOL.map((playerName) => (
                  <option
                    key={playerName}
                    value={playerName}
                    disabled={selectedNames.has(playerName) && playerName !== name}
                  >
                    {playerName}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => removePlayer(idx)}
                disabled={names.length <= MIN_PLAYERS}
                aria-label={`Remove ${name || `Player ${idx + 1}`}`}
                className="flex size-10 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground transition hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive disabled:cursor-not-allowed disabled:opacity-40"
              >
                <X className="size-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Button
        onClick={addPlayer}
        disabled={names.length >= MAX_PLAYERS}
        variant="outline"
        className="mt-4 w-full bg-transparent"
      >
        <UserPlus className="size-4" />
        Add player
      </Button>

      <div className="mt-4 rounded-xl border border-border bg-background/50 p-3">
        <p className="mb-2 text-sm font-semibold text-muted-foreground">Quick pick</p>
        <div className="flex flex-wrap gap-2">
          {PLAYER_POOL.map((playerName) => {
            const isSelected = selectedNames.has(playerName)

            return (
              <button
                key={playerName}
                type="button"
                disabled={isSelected || names.length >= MAX_PLAYERS}
                onClick={() => addQuickPick(playerName)}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary px-3 py-1.5 text-sm font-semibold text-secondary-foreground transition hover:border-primary/60 disabled:cursor-not-allowed disabled:opacity-45"
              >
                {isSelected && <Check className="size-3.5" />}
                {playerName}
              </button>
            )
          })}
        </div>
      </div>

      <Button onClick={handleStart} className="mt-3 w-full text-base font-bold" size="lg">
        Start game
      </Button>
    </section>
  )
}
