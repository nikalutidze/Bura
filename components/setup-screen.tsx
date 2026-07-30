"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PLAYER_COUNT } from "@/lib/bura"

type SetupScreenProps = {
  onStart: (players: string[]) => void
}

export function SetupScreen({ onStart }: SetupScreenProps) {
  const [names, setNames] = useState<string[]>(
    Array.from({ length: PLAYER_COUNT }, (_, i) => `მოთამაშე ${i + 1}`),
  )

  function handleStart() {
    const cleaned = names.map((n, i) => n.trim() || `მოთამაშე ${i + 1}`)
    onStart(cleaned)
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-lg">
      <h2 className="mb-5 text-lg font-bold text-balance">თამაშის დაწყება</h2>

      <div className="flex flex-col gap-4">
        {names.map((name, idx) => (
          <div key={idx} className="flex flex-col gap-1.5">
            <label htmlFor={`player-${idx}`} className="text-sm text-muted-foreground">
              {`მოთამაშე ${idx + 1}`}
            </label>
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
          </div>
        ))}
      </div>

      <Button onClick={handleStart} className="mt-6 w-full text-base font-bold" size="lg">
        თამაშის დაწყება
      </Button>
    </section>
  )
}
