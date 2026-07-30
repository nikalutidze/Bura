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
    <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {players.map((player, idx) => (
              <th key={idx} className="border-b border-border px-1 py-3 text-center text-sm font-semibold text-primary">
                <span className="line-clamp-1 px-1">{player}</span>
              </th>
            ))}
          </tr>
          <tr className="bg-secondary/60">
            {totals.map((total, idx) => {
              const isLeader = hasScores && total === maxTotal

              return (
                <td
                  key={idx}
                  className={cn(
                    "border-b-2 border-border px-1 py-3 text-center align-top",
                    isLeader && "bg-primary/10",
                  )}
                >
                  <div className="flex items-center justify-center gap-1 font-mono text-2xl font-bold tabular-nums">
                    {isLeader && <Crown className="size-4 text-primary" aria-label="Leader" />}
                    {total}
                  </div>
                  <span className="mt-0.5 block text-[0.7rem] text-muted-foreground">
                    {`${khishtiCounts[idx]} khishti`}
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
                No rounds entered yet.
              </td>
            </tr>
          ) : (
            rounds.map((round, roundIndex) => (
              <tr key={roundIndex} className="odd:bg-background/30">
                {round.scores.map((score, playerIndex) => (
                  <td key={playerIndex} className="border-b border-border px-1 py-2.5 text-center">
                    <span className="font-mono text-base tabular-nums">{score}</span>
                    {round.khishti[playerIndex] && (
                      <span className="block text-[0.7rem] font-bold text-destructive">khishti -120</span>
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
