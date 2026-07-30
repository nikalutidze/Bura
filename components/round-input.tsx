"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { KHISHTI_PENALTY, ROUND_TOTAL, type Round } from "@/lib/bura"
import { cn } from "@/lib/utils"
import { RotateCcw, Undo2, Plus, Skull } from "lucide-react"

type RoundInputProps = {
  players: string[]
  onAddRound: (round: Round) => void
  onUndo: () => void
  onReset: () => void
  canUndo: boolean
}

function emptyInputs(count: number) {
  return {
    scores: Array.from({ length: count }, () => "") as string[],
    khishti: Array.from({ length: count }, () => false) as boolean[],
  }
}

export function RoundInput({ players, onAddRound, onUndo, onReset, canUndo }: RoundInputProps) {
  const [inputs, setInputs] = useState(() => emptyInputs(players.length))

  const emptyIndexes = inputs.scores.map((score, i) => (score.trim() === "" ? i : -1)).filter((i) => i >= 0)
  const autoIndex = emptyIndexes.length === 1 ? emptyIndexes[0] : -1
  const filledSum = inputs.scores.reduce((acc, score) => acc + (Number.parseInt(score) || 0), 0)
  const autoValue = ROUND_TOTAL - filledSum
  const isAutoKhishti = autoIndex >= 0 && autoValue === 0
  const effectiveScores = inputs.scores.map((score, i) =>
    i === autoIndex && autoValue >= 0 ? String(autoValue) : score,
  )
  const effectiveKhishti = inputs.khishti.map((k, i) => k || (i === autoIndex && isAutoKhishti))
  const sum = effectiveScores.reduce((acc, score) => acc + (Number.parseInt(score) || 0), 0)
  const isValid = sum === ROUND_TOTAL

  function handleAdd() {
    if (!isValid) return
    const round: Round = {
      scores: effectiveScores.map((score) => Number.parseInt(score) || 0),
      khishti: [...effectiveKhishti],
    }
    onAddRound(round)
    setInputs(emptyInputs(players.length))
  }

  return (
    <section className="animate-fade-up rounded-3xl border border-border/60 bg-card/80 p-4 shadow-2xl backdrop-blur-sm sm:p-5">
      <h3 className="mb-3 flex items-center gap-2 text-base font-bold">
        <Plus className="size-4 text-primary" />
        ახალი ხეობა
      </h3>

      <div className="grid grid-cols-2 gap-2.5">
        {players.map((player, idx) => {
          const isAuto = idx === autoIndex && autoValue >= 0

          return (
            <div
              key={idx}
              className={cn(
                "rounded-2xl border bg-background/50 p-3 transition",
                isAutoKhishti && idx === autoIndex
                  ? "border-destructive/60 bg-destructive/10"
                  : isAuto
                    ? "border-primary/40"
                    : "border-border/60",
              )}
            >
              <label
                htmlFor={`score-${idx}`}
                className="mb-1.5 flex items-center justify-between gap-1 truncate text-sm font-semibold"
              >
                <span className="truncate">{player}</span>
                {isAuto && (
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-1.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide",
                      isAutoKhishti
                        ? "bg-destructive/20 text-destructive"
                        : "bg-primary/20 text-primary",
                    )}
                  >
                    {isAutoKhishti ? "ხიშტი" : "ავტო"}
                  </span>
                )}
              </label>
              <input
                id={`score-${idx}`}
                type="number"
                inputMode="numeric"
                min={0}
                placeholder="ქულა"
                readOnly={isAuto}
                value={isAuto ? String(autoValue) : inputs.scores[idx]}
                onChange={(event) => {
                  const next = { ...inputs, scores: [...inputs.scores] }
                  next.scores[idx] = event.target.value
                  setInputs(next)
                }}
                className={cn(
                  "w-full rounded-lg border bg-background px-2.5 py-2.5 font-mono text-base text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30",
                  isAuto
                    ? isAutoKhishti
                      ? "border-destructive/50 bg-destructive/10 text-destructive"
                      : "border-primary/50 bg-primary/10 text-primary"
                    : "border-input",
                )}
              />
              {isAutoKhishti && idx === autoIndex ? (
                <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-destructive/15 px-2 py-1.5 text-[0.7rem] font-bold text-destructive">
                  <Skull className="size-3.5" />
                  ხიშტი {KHISHTI_PENALTY}
                </div>
              ) : (
                <label
                  className={cn(
                    "mt-2 flex cursor-pointer select-none items-center gap-2 rounded-lg px-1.5 py-1 text-sm transition",
                    inputs.khishti[idx] ? "text-destructive" : "text-muted-foreground",
                  )}
                >
                  <input
                    type="checkbox"
                    checked={inputs.khishti[idx]}
                    onChange={(event) => {
                      const next = { ...inputs, khishti: [...inputs.khishti] }
                      next.khishti[idx] = event.target.checked
                      setInputs(next)
                    }}
                    className="size-4 accent-[var(--destructive)]"
                  />
                  ხიშტი
                </label>
              )}
            </div>
          )
        })}
      </div>

      <div
        className={cn(
          "mt-3 flex items-center justify-between rounded-2xl border px-3.5 py-2.5 text-sm font-semibold transition",
          isValid
            ? "border-primary/40 bg-primary/10 text-primary"
            : "border-destructive/40 bg-destructive/10 text-destructive",
        )}
      >
        <span>ჯამი</span>
        <span className="font-mono text-base tabular-nums">
          {sum} / {ROUND_TOTAL}
        </span>
      </div>

      <Button
        onClick={handleAdd}
        disabled={!isValid}
        className="mt-3 w-full bg-gradient-to-r from-primary to-accent text-base font-bold shadow-lg shadow-primary/20"
        size="lg"
      >
        ხეობის დამატება
      </Button>

      <div className="mt-3 flex gap-2">
        <Button onClick={onUndo} disabled={!canUndo} variant="outline" className="flex-1 bg-transparent">
          <Undo2 className="size-4" />
          გაუქმება
        </Button>
        <Button
          onClick={onReset}
          variant="outline"
          className="flex-1 border-destructive/40 bg-transparent text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <RotateCcw className="size-4" />
          დასრულება
        </Button>
      </div>
    </section>
  )
}
