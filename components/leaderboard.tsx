"use client"

import { Trophy, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { LeaderboardEntry } from "@/lib/bura"

type LeaderboardProps = {
  entries: LeaderboardEntry[]
  onReset: () => void
}

export function Leaderboard({ entries, onReset }: LeaderboardProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Trophy className="size-5 text-primary" />
          <h2 className="text-base font-bold">Leaderboard</h2>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onReset}
          disabled={entries.length === 0}
          className="bg-transparent"
        >
          <RotateCcw className="size-4" />
          Reset
        </Button>
      </div>

      {entries.length === 0 ? (
        <p className="px-4 py-6 text-center text-sm text-muted-foreground">
          Finish a game to add the first winner.
        </p>
      ) : (
        <div className="divide-y divide-border">
          {entries.map((entry, index) => (
            <div key={entry.name} className="grid grid-cols-[2rem_1fr_auto] items-center gap-3 px-4 py-3">
              <span className="font-mono text-sm text-muted-foreground">#{index + 1}</span>
              <div className="min-w-0">
                <p className="truncate font-bold">{entry.name}</p>
                <p className="text-xs text-muted-foreground">
                  {entry.wins} wins / {entry.games} games
                </p>
              </div>
              <span className="rounded-full bg-secondary px-3 py-1 font-mono text-sm font-bold text-secondary-foreground">
                {entry.points}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
