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
            {players.map((p, idx) => (
              <th
                key={idx}
                className="border-b border-border px-1 py-3 text-center text-sm font-semibold text-primary"
              >
                <span className="line-clamp-1 px-1">{p}</span>
              </th>
            ))}
          </tr>
          <tr className="bg-secondary/60">
            {totals.map((t, idx) => {
              const isLeader = hasScores && t === maxTotal
              return (
                <td
                  key={idx}
                  className={cn(
                    "border-b-2 border-border px-1 py-3 text-center align-top",
                    isLeader && "bg-primary/10",
                  )}
                >
                  <div className="flex items-center justify-center gap-1 font-mono text-2xl font-bold tabular-nums">
                    {isLeader && <Crown className="size-4 text-primary" aria-label="ლიდერი" />}
                    {t}
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
              <td
                colSpan={players.length}
                className="px-4 py-8 text-center text-sm text-muted-foreground"
              >
                ჯერ არცერთი რაუნდი არ ჩაწერილა
              </td>
            </tr>
          ) : (
            rounds.map((round, rIdx) => (
              <tr key={rIdx} className="odd:bg-background/30">
                {round.scores.map((score, i) => (
                  <td key={i} className="border-b border-border px-1 py-2.5 text-center">
                    <span className="font-mono text-base tabular-nums">{score}</span>
                    {round.khishti[i] && (
                      <span className="block text-[0.7rem] font-bold text-destructive">ხიშტი −120</span>
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
