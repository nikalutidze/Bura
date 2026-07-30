"use client"

import { computeTotals, type Round } from "@/lib/bura"
import { cn } from "@/lib/utils"
import { Crown } from "lucide-react"

type ScoreboardProps = {
  players: string[]
  rounds: Round[]
}

export function Scoreboard({ players, rounds }: ScoreboardProps) {
  const { totals, khishtiCounts } = computeTotals(rounds, players.length)
  const maxTotal = Math.max(...totals)
  const hasScores = rounds.length > 0

  return (
    <section className="animate-fade-up overflow-hidden rounded-3xl border border-border/60 bg-card/80 shadow-2xl backdrop-blur-sm">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {players.map((player, idx) => (
              <th
                key={idx}
                className="border-b border-border/60 px-1 py-3 text-center text-sm font-semibold text-primary"
              >
                <span className="line-clamp-1 px-1">{player}</span>
              </th>
            ))}
          </tr>
          <tr className="bg-secondary/50">
            {totals.map((total, idx) => {
              const isLeader = hasScores && total === maxTotal

              return (
                <td
                  key={idx}
                  className={cn(
                    "border-b-2 border-border/60 px-1 py-3 text-center align-top transition",
                    isLeader && "bg-primary/10",
                  )}
                >
                  <div className="flex items-center justify-center gap-1 font-mono text-2xl font-bold tabular-nums">
                    {isLeader && <Crown className="size-4 text-primary" aria-label="ლიდერი" />}
                    {total}
                  </div>
                  <span className="mt-0.5 block text-[0.7rem] text-muted-foreground">
                    {`${khishtiCounts[idx]} ხიშტი`}
                  </span>
                </td>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {rounds.length === 0 ? (
            <tr>
              <td colSpan={players.length} className="px-4 py-8 text-center text-sm text-muted-foreground">
                ჯერ ქულები არ არის შეყვანილი.
              </td>
            </tr>
          ) : (
            rounds.map((round, roundIndex) => (
              <tr key={roundIndex} className="odd:bg-background/20 transition hover:bg-primary/5">
                {round.scores.map((score, playerIndex) => (
                  <td key={playerIndex} className="border-b border-border/40 px-1 py-2.5 text-center">
                    <span className="font-mono text-base tabular-nums">{score}</span>
                    {round.khishti[playerIndex] && (
                      <span className="mt-0.5 block text-[0.7rem] font-bold text-destructive">
                        ხიშტი -120
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  )
}
