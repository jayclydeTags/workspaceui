import * as React from "react"
import { PlusIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import { Separator } from "@/components/ui/separator"
import { fillPct, isOccupied, type Bin } from "../data"

// Top-down warehouse floor: rack runs (R1/R2…) separated by labelled aisle
// lanes. Each position is a rack slot whose stock rises from the floor edge
// (height = fill %) and surfaces its SKU inline, so an operator reads footprint,
// load, and contents at a glance. When `onAdd` is set, empty positions —
// including a one-cell margin past the last row/column — render as clickable
// ghost slots so a manager extends the floor by clicking where the bin goes.

const AISLE_LETTERS = "ABCDEFGH"

// `fill` is a solid variant of `bg` for the load bar — kept as a literal class
// (not string-built) so Tailwind's JIT actually generates it.
function heat(bin: Bin): { bg: string; fill: string; ring: string; text: string } {
  if (!isOccupied(bin))
    return { bg: "bg-muted/30", fill: "bg-muted-foreground/40", ring: "ring-border", text: "text-muted-foreground" }
  const pct = fillPct(bin)
  if (pct >= 90)
    return { bg: "bg-red-500/10", fill: "bg-red-500/70", ring: "ring-red-500/50", text: "text-red-700 dark:text-red-300" }
  if (pct >= 60)
    return { bg: "bg-amber-500/10", fill: "bg-amber-500/70", ring: "ring-amber-500/50", text: "text-amber-700 dark:text-amber-300" }
  return { bg: "bg-emerald-500/10", fill: "bg-emerald-500/70", ring: "ring-emerald-500/50", text: "text-emerald-700 dark:text-emerald-300" }
}

// Hatched "do not store" floor markings, shared by the slot overlay and legend.
const STATUS_STRIPE: Record<"blocked" | "quarantine", string> = {
  blocked:
    "repeating-linear-gradient(45deg,transparent,transparent 4px,rgb(100 116 139 / 0.35) 4px,rgb(100 116 139 / 0.35) 6px)",
  quarantine:
    "repeating-linear-gradient(45deg,transparent,transparent 4px,rgb(245 158 11 / 0.35) 4px,rgb(245 158 11 / 0.35) 6px)",
}

function statusOverlay(bin: Bin): React.ReactNode {
  if (bin.status === "active") return null
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 z-10 rounded-[inherit]"
      style={{ backgroundImage: STATUS_STRIPE[bin.status] }}
    />
  )
}

function Swatch({
  className,
  style,
  label,
}: {
  className?: string
  style?: React.CSSProperties
  label: string
}) {
  return (
    <span className="flex items-center gap-1.5">
      <span
        aria-hidden
        className={cn("size-3 rounded-[3px] ring-1 ring-inset ring-border", className)}
        style={style}
      />
      {label}
    </span>
  )
}

export function FloorLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10px] text-muted-foreground">
      <span className="font-semibold tracking-widest uppercase">Occupancy</span>
      <Swatch className="bg-muted" label="Empty" />
      <Swatch className="bg-emerald-500/60" label="<60%" />
      <Swatch className="bg-amber-500/60" label="60–89%" />
      <Swatch className="bg-red-500/60" label="≥90%" />
      <Separator orientation="vertical" className="h-3" />
      <Swatch style={{ backgroundImage: STATUS_STRIPE.blocked }} label="Blocked" />
      <Swatch style={{ backgroundImage: STATUS_STRIPE.quarantine }} label="Quarantine" />
    </div>
  )
}

function RackSlot({ bin, onSelect }: { bin: Bin; onSelect: (bin: Bin) => void }) {
  const h = heat(bin)
  const pct = fillPct(bin)
  // The accessible name carries the SKU and fill the sighted user reads from the
  // labels — otherwise `aria-label` would suppress them and leave a screen
  // reader with only the bin code.
  const label = [
    `Bin ${bin.code}`,
    bin.status !== "active" ? bin.status : null,
    isOccupied(bin) ? `${bin.sku}, ${pct}% full` : "empty",
  ]
    .filter(Boolean)
    .join(", ")
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <button
            type="button"
            onClick={() => onSelect(bin)}
            aria-label={label}
            className={cn(
              "group relative flex h-[4.5rem] flex-col justify-between overflow-hidden rounded-sm border-foreground/25 p-1.5 text-left ring-1 ring-inset transition-all hover:z-20 hover:shadow-md focus-visible:z-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              h.bg,
              h.ring
            )}
          />
        }
      >
        {statusOverlay(bin)}
        {/* Load rising from the floor edge — the pallet stack. */}
        <span
          aria-hidden
          className={cn("absolute inset-x-0 bottom-0 z-0", h.fill)}
          style={{ height: `${pct}%` }}
        />
        <span aria-hidden className="relative z-[5] flex items-center justify-between">
          <span className={cn("text-[10px] leading-none font-semibold", h.text)}>{bin.code}</span>
          <span className="text-[9px] leading-none text-muted-foreground">
            {isOccupied(bin) ? `${pct}%` : "—"}
          </span>
        </span>
        <span
          aria-hidden
          className="relative z-[5] truncate text-[9px] leading-none text-muted-foreground"
        >
          {bin.sku ?? "empty"}
        </span>
      </TooltipTrigger>
      <TooltipContent>
        {bin.code} · {bin.status} · {bin.qty}/{bin.capacity}
        {bin.sku ? ` · ${bin.sku}` : " · empty"}
      </TooltipContent>
    </Tooltip>
  )
}

// A vacant floor position. Clicking it opens the add form pre-seeded here, so
// the position comes from where the manager clicks — no coordinate entry.
function GhostSlot({
  row,
  col,
  onAdd,
}: {
  row: number
  col: number
  onAdd: (position: { row: number; col: number }) => void
}) {
  return (
    <button
      type="button"
      aria-label={`Add slot at row ${row + 1}, column ${col + 1}`}
      onClick={() => onAdd({ row, col })}
      className="flex h-[4.5rem] items-center justify-center rounded-sm border border-dashed border-muted-foreground/20 text-muted-foreground/40 transition-colors hover:border-ring hover:bg-muted/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <PlusIcon className="size-4" />
    </button>
  )
}

export function BinGrid({
  bins,
  onSelect,
  onAdd,
}: {
  bins: Bin[]
  onSelect: (bin: Bin) => void
  /** When set, empty positions become clickable ghost slots that open the add
   * form pre-seeded at that spot (plus a one-cell margin to extend the floor). */
  onAdd?: (position: { row: number; col: number }) => void
}) {
  if (bins.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No bins</EmptyTitle>
          <EmptyDescription>
            Add a bin to start mapping this warehouse's floor.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  const rows = Math.max(...bins.map((b) => b.row)) + 1
  const cols = Math.max(...bins.map((b) => b.col)) + 1
  const at = (r: number, c: number) => bins.find((b) => b.row === r && b.col === c)

  // With onAdd, extend by one row and column so clicking the margin grows the
  // floor; without it, render only the occupied footprint.
  const gridRows = onAdd ? rows + 1 : rows
  const gridCols = onAdd ? cols + 1 : cols
  const track: React.CSSProperties = {
    gridTemplateColumns: `repeat(${gridCols}, minmax(4rem, 7rem))`,
  }

  return (
    <TooltipProvider>
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full rounded-lg border border-dashed border-muted-foreground/30 bg-muted/20 p-4">
          <div className="flex flex-col gap-0">
          {Array.from({ length: gridRows }, (_, r) => {
            const isMarginRow = r >= rows
            return (
              <React.Fragment key={r}>
                <div className="flex items-stretch gap-2">
                  <span
                    className={cn(
                      "flex w-6 shrink-0 items-center justify-center rounded-sm text-[9px] font-bold",
                      isMarginRow
                        ? "border-2 border-dashed border-muted-foreground/30 text-muted-foreground/50"
                        : "bg-foreground/80 text-background"
                    )}
                  >
                    R{r + 1}
                  </span>
                  <div className="grid flex-1 gap-1" style={track}>
                    {Array.from({ length: gridCols }, (_, c) => {
                      const bin = at(r, c)
                      if (bin) return <RackSlot key={bin.id} bin={bin} onSelect={onSelect} />
                      if (onAdd)
                        return <GhostSlot key={`g-${r}-${c}`} row={r} col={c} onAdd={onAdd} />
                      return null
                    })}
                  </div>
                </div>
                {r < rows - 1 && (
                  <div className="relative my-1 ml-8 flex h-5 items-center">
                    <span className="absolute inset-x-0 top-1/2 border-t border-dashed border-muted-foreground/40" />
                    <span className="relative mx-auto rounded-full bg-background px-2 text-[9px] font-medium tracking-widest text-muted-foreground uppercase">
                      Aisle {AISLE_LETTERS[r]}
                    </span>
                  </div>
                )}
              </React.Fragment>
            )
          })}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
