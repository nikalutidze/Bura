"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DEFAULT_PLAYERS, MAX_PLAYERS, MIN_PLAYERS } from "@/lib/bura"
import { UserPlus, X } from "lucide-react"

type SetupScreenProps = {
  onStart: (players: string[]) => void
}

export function SetupScreen({ onStart }: SetupScreenProps) {
  const [names, setNames] = useState<string[]>(
    Array.from({ length: DEFAULT_PLAYERS }, (_, i) => `მოთამაშე ${i + 1}`),
  )

  function addPlayer() {
    if (names.length >= MAX_PLAYERS) return
    setNames([...names, `მოთამაშე ${names.length + 1}`])
  }

  function removePlayer(idx: number) {
    if (names.length <= MIN_PLAYERS) return
    setNames(names.filter((_, i) => i !== idx))
  }

  function handleStart() {
    const cleaned = names.map((n, i) => n.trim() || `მოთამაშე ${i + 1}`)
    onStart(cleaned)
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-lg">
      <div className="mb-5 flex items-center justify-between gap-2">
        <h2 className="text-lg font-bold text-balance">თამაშის დაწყება</h2>
        <span className="rounded-full bg-secondary px-3 py-1 text-sm font-semibold text-secondary-foreground">
          {`${names.length} მოთამაშე`}
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {names.map((name, idx) => (
          <div key={idx} className="flex flex-col gap-1.5">
            <label htmlFor={`player-${idx}`} className="text-sm text-muted-foreground">
              {`მოთამაშე ${idx + 1}`}
            </label>
            <div className="flex items-center gap-2">
              <input
                id={`player-${idx}`}
                type="text"
                value={name}
                onChange={(e) => {
                  const next = [...names]
                  next[idx] = e.target.value
                  setNames(next)
                }}
                className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-base text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/40"
              />
              <button
                type="button"
                onClick={() => removePlayer(idx)}
                disabled={names.length <= MIN_PLAYERS}
                aria-label={`${name}-ის ამოღება`}
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
        მოთამაშის დამატება
      </Button>

      <Button onClick={handleStart} className="mt-3 w-full text-base font-bold" size="lg">
        თამაშის დაწყება
      </Button>
    </section>
  )
}
