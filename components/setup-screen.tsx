"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DEFAULT_PLAYERS, MAX_PLAYERS, MIN_PLAYERS, PLAYER_POOL } from "@/lib/bura"
import { Check, UserPlus, X, Spade } from "lucide-react"

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
    const cleaned = names.map((name, index) => name.trim() || `მოთამაშე ${index + 1}`)
    onStart(cleaned)
  }

  return (
    <section className="animate-fade-up rounded-3xl border border-border/60 bg-card/80 p-5 shadow-2xl backdrop-blur-sm sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Spade className="size-5" />
          </span>
          <h2 className="text-lg font-bold text-balance">თამაშის დაწყება</h2>
        </div>
        <span className="rounded-full bg-secondary px-3 py-1 text-sm font-semibold text-secondary-foreground">
          {`${names.length} მოთამაშე`}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {names.map((name, idx) => (
          <div key={idx} className="flex flex-col gap-1.5">
            <label htmlFor={`player-${idx}`} className="text-sm text-muted-foreground">
              {`მოთამაშე ${idx + 1}`}
            </label>
            <div className="flex items-center gap-2">
              <select
                id={`player-${idx}`}
                value={name}
                onChange={(event) => choosePlayer(idx, event.target.value)}
                className="w-full rounded-xl border border-input bg-background/70 px-3.5 py-3 text-base text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
              >
                <option value="">აირჩიე მოთამაშე</option>
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
                aria-label={`${name || `მოთამაშე ${idx + 1}`}-ის მოხსნა`}
                className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border text-muted-foreground transition hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive disabled:cursor-not-allowed disabled:opacity-40"
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
        className="mt-3 w-full bg-transparent"
        size="lg"
      >
        <UserPlus className="size-4" />
        მოთამაშის დამატება
      </Button>

      <div className="mt-4 rounded-2xl border border-border/60 bg-background/40 p-3.5">
        <p className="mb-2.5 text-sm font-semibold text-muted-foreground">სწრაფი არჩევა</p>
        <div className="flex flex-wrap gap-2">
          {PLAYER_POOL.map((playerName) => {
            const isSelected = selectedNames.has(playerName)

            return (
              <button
                key={playerName}
                type="button"
                disabled={isSelected || names.length >= MAX_PLAYERS}
                onClick={() => addQuickPick(playerName)}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/70 px-3.5 py-2 text-sm font-semibold text-secondary-foreground transition hover:border-primary/60 hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-45"
              >
                {isSelected && <Check className="size-3.5 text-primary" />}
                {playerName}
              </button>
            )
          })}
        </div>
      </div>

      <Button
        onClick={handleStart}
        className="mt-4 w-full bg-gradient-to-r from-primary to-accent text-base font-bold shadow-lg shadow-primary/20"
        size="lg"
      >
        დაწყება
      </Button>
    </section>
  )
}
