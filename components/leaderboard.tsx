"use client"

import { Trophy, RotateCcw, Medal } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { LeaderboardEntry } from "@/lib/bura"
import { cn } from "@/lib/utils"

type LeaderboardProps = {
  entries: LeaderboardEntry[]
  onReset: () => void
}

export function Leaderboard({ entries, onReset }: LeaderboardProps) {
  return (
    <section className="animate-fade-up overflow-hidden rounded-3xl border border-border/60 bg-card/80 shadow-2xl backdrop-blur-sm">
      <div className="flex items-center justify-between gap-3 border-b border-border/60 px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Trophy className="size-4" />
          </span>
          <h2 className="text-base font-bold">ლიდერბორდი</h2>
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
          გასუფთავება
        </Button>
      </div>

      {entries.length === 0 ? (
        <p className="px-4 py-6 text-center text-sm text-muted-foreground">
          დაასრულე თამაში, რომ დაამატო პირველი გამარჯვებული.
        </p>
      ) : (
        <div className="divide-y divide-border/60">
          {entries.map((entry, index) => {
            const isTop = index === 0

            return (
              <div
                key={entry.name}
                className={cn(
                  "grid grid-cols-[2rem_1fr_auto] items-center gap-3 px-4 py-3 transition",
                  isTop && "bg-primary/5",
                )}
              >
                <span
                  className={cn(
                    "flex size-6 items-center justify-center rounded-full font-mono text-xs font-bold",
                    isTop ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground",
                  )}
                >
                  {isTop ? <Medal className="size-3.5" /> : index + 1}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-bold">{entry.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {`${entry.wins} გამარჯვება / ${entry.games} თამაში`}
                  </p>
                </div>
                <span className="rounded-full bg-secondary px-3 py-1 font-mono text-sm font-bold text-secondary-foreground">
                  {entry.points}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
