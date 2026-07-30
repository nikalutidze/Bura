"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ROUND_TOTAL, type Round } from "@/lib/bura"
import { cn } from "@/lib/utils"
import { Undo2, RotateCcw } from "lucide-react"

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

  // Auto-fill the single remaining empty field so the round totals 120.
  const emptyIndexes = inputs.scores.map((s, i) => (s.trim() === "" ? i : -1)).filter((i) => i >= 0)
  const autoIndex = emptyIndexes.length === 1 ? emptyIndexes[0] : -1
  const filledSum = inputs.scores.reduce((acc, s) => acc + (Number.parseInt(s) || 0), 0)
  const autoValue = ROUND_TOTAL - filledSum

  // Effective scores include the auto-filled value.
  const effectiveScores = inputs.scores.map((s, i) =>
    i === autoIndex && autoValue >= 0 ? String(autoValue) : s,
  )

  const sum = effectiveScores.reduce((acc, s) => acc + (Number.parseInt(s) || 0), 0)
  const isValid = sum === ROUND_TOTAL

  function handleAdd() {
    if (!isValid) return
    const round: Round = {
      scores: effectiveScores.map((s) => Number.parseInt(s) || 0),
      khishti: [...inputs.khishti],
    }
    onAddRound(round)
    setInputs(emptyInputs(players.length))
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-lg">
      <h3 className="mb-3 text-base font-bold">ახალი რაუნდი</h3>

      <div className="grid grid-cols-2 gap-3">
        {players.map((p, idx) => {
          const isAuto = idx === autoIndex && autoValue >= 0
          return (
          <div key={idx} className="rounded-xl border border-border bg-background/50 p-3">
            <label htmlFor={`score-${idx}`} className="mb-1.5 flex items-center justify-between gap-1 truncate text-sm font-semibold">
              <span className="truncate">{p}</span>
              {isAuto && <span className="shrink-0 text-[0.7rem] font-medium text-primary">ავტო</span>}
            </label>
            <input
              id={`score-${idx}`}
              type="number"
              inputMode="numeric"
              min={0}
              placeholder="ქულა"
              readOnly={isAuto}
              value={isAuto ? String(autoValue) : inputs.scores[idx]}
              onChange={(e) => {
                const next = { ...inputs, scores: [...inputs.scores] }
                next.scores[idx] = e.target.value
                setInputs(next)
              }}
              className={cn(
                "w-full rounded-md border border-input bg-background px-2.5 py-2 font-mono text-base text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/40",
                isAuto && "border-primary/50 bg-primary/10 text-primary",
              )}
            />
            <label
              className={cn(
                "mt-2 flex cursor-pointer select-none items-center gap-2 text-sm transition",
                inputs.khishti[idx] ? "text-destructive" : "text-muted-foreground",
              )}
            >
              <input
                type="checkbox"
                checked={inputs.khishti[idx]}
                onChange={(e) => {
                  const next = { ...inputs, khishti: [...inputs.khishti] }
                  next.khishti[idx] = e.target.checked
                  setInputs(next)
                }}
                className="size-4 accent-[var(--destructive)]"
              />
              ხიშტი
            </label>
          </div>
          )
        })}
      </div>

      <div
        className={cn(
          "mt-3 flex items-center justify-between rounded-xl border px-3 py-2 text-sm font-semibold transition",
          isValid
            ? "border-primary/50 bg-primary/10 text-primary"
            : "border-destructive/50 bg-destructive/10 text-destructive",
        )}
      >
        <span>ჯამი</span>
        <span className="font-mono text-base">
          {sum} / {ROUND_TOTAL}
        </span>
      </div>

      <Button
        onClick={handleAdd}
        disabled={!isValid}
        className="mt-3 w-full text-base font-bold"
        size="lg"
      >
        ქულების ჩაწერა
      </Button>

      <div className="mt-3 flex gap-2">
        <Button
          onClick={onUndo}
          disabled={!canUndo}
          variant="outline"
          className="flex-1 bg-transparent"
        >
          <Undo2 className="size-4" />
          უკან
        </Button>
        <Button
          onClick={onReset}
          variant="outline"
          className="flex-1 border-destructive/50 bg-transparent text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <RotateCcw className="size-4" />
          ახალი თამაში
        </Button>
      </div>
    </section>
  )
}
