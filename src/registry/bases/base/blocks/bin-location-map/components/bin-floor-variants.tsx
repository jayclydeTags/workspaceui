// PROTOTYPE — three variations on the A+B fusion: a top-down warehouse floor
// plan (aisles, walls, dock doors) where each position is drawn as a rack slot
// showing stock height (the side-elevation idea from variant B).
// Switchable via ?variant=A|B|C (see bin-grid.tsx). Throwaway: once a winner is
// picked, fold it into bin-grid.tsx and delete this file + the switcher.
import * as React from "react"

import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { fillPct, isOccupied, type Bin } from "../data"

// ── shared occupancy heat ────────────────────────────────────────────────────
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

// Blocked/quarantine slots get a hatched overlay — the universal "do not store"
// floor marking.
function statusOverlay(bin: Bin): React.ReactNode {
  if (bin.status === "active") return null
  const stripe =
    bin.status === "blocked"
      ? "repeating-linear-gradient(45deg,transparent,transparent 4px,rgb(100 116 139 / 0.35) 4px,rgb(100 116 139 / 0.35) 6px)"
      : "repeating-linear-gradient(45deg,transparent,transparent 4px,rgb(245 158 11 / 0.35) 4px,rgb(245 158 11 / 0.35) 6px)"
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 z-10 rounded-[inherit]"
      style={{ backgroundImage: stripe }}
    />
  )
}

function groupByRow(bins: Bin[]): Bin[][] {
  const rows = Math.max(...bins.map((b) => b.row)) + 1
  return Array.from({ length: rows }, (_, r) =>
    bins.filter((b) => b.row === r).sort((a, b) => a.col - b.col)
  )
}

const AISLE_LETTERS = "ABCDEFGH"

function SlotButton({
  bin,
  onSelect,
  className,
  style,
  children,
}: {
  bin: Bin
  onSelect: (bin: Bin) => void
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}) {
  const h = heat(bin)
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <button
            type="button"
            onClick={() => onSelect(bin)}
            aria-label={`Bin ${bin.code}`}
            style={style}
            className={cn(
              "group relative overflow-hidden ring-1 ring-inset transition-all hover:z-20 hover:shadow-md focus-visible:z-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              h.bg,
              h.ring,
              className
            )}
          />
        }
      >
        {statusOverlay(bin)}
        {children}
      </TooltipTrigger>
      <TooltipContent>
        {bin.code} · {bin.status} · {bin.qty}/{bin.capacity}
        {bin.sku ? ` · ${bin.sku}` : " · empty"}
      </TooltipContent>
    </Tooltip>
  )
}

// A rack slot rendered top-down but with the load rising from the floor edge,
// so you read both footprint (A) and stock height (B) at once.
function RackSlot({
  bin,
  onSelect,
  showSku = false,
}: {
  bin: Bin
  onSelect: (bin: Bin) => void
  showSku?: boolean
}) {
  const h = heat(bin)
  const pct = fillPct(bin)
  return (
    <SlotButton
      bin={bin}
      onSelect={onSelect}
      style={{ gridColumnStart: bin.col + 1 }}
      className="flex h-[4.5rem] flex-col justify-between rounded-sm border-x-2 border-foreground/25 p-1.5 text-left"
    >
      {/* Load rising from the bottom — the pallet stack. */}
      <span
        aria-hidden
        className={cn("absolute inset-x-0 bottom-0 z-0", h.fill)}
        style={{ height: `${pct}%` }}
      />
      <span className="relative z-[5] flex items-center justify-between">
        <span className={cn("text-[10px] leading-none font-semibold", h.text)}>{bin.code}</span>
        <span className="text-[9px] leading-none text-muted-foreground">
          {isOccupied(bin) ? `${pct}%` : "—"}
        </span>
      </span>
      {showSku && (
        <span className="relative z-[5] truncate text-[9px] leading-none text-muted-foreground">
          {bin.sku ?? "empty"}
        </span>
      )}
    </SlotButton>
  )
}

function WarehouseShell({
  cols,
  children,
}: {
  cols: number
  children: React.ReactNode
}) {
  return (
    <div className="inline-block min-w-full rounded-lg border-2 border-dashed border-muted-foreground/30 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:16px_16px]">
      <div className="flex items-center justify-between border-b border-dashed border-muted-foreground/30 px-4 py-1.5 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
        <span>◄ Receiving</span>
        <span>Storage floor</span>
      </div>
      {children}
      <div className="flex items-end gap-2 border-t border-dashed border-muted-foreground/30 px-4 py-2">
        <span className="mr-1 shrink-0 text-[9px] font-semibold tracking-widest text-muted-foreground uppercase">
          Shipping ►
        </span>
        {Array.from({ length: Math.max(3, cols - 1) }, (_, i) => (
          <span
            key={i}
            className="flex h-4 w-16 items-center justify-center rounded-b-sm border border-t-0 border-muted-foreground/40 text-[8px] text-muted-foreground"
          >
            DOCK {i + 1}
          </span>
        ))}
      </div>
    </div>
  )
}

function AisleLane({ letter }: { letter: string }) {
  return (
    <div className="relative my-1 ml-8 flex h-5 items-center">
      <span className="absolute inset-x-0 top-1/2 border-t border-dashed border-muted-foreground/40" />
      <span className="relative mx-auto rounded-full bg-background px-2 text-[9px] font-medium tracking-widest text-muted-foreground uppercase">
        Aisle {letter}
      </span>
    </div>
  )
}

function RackLabel({ n }: { n: number }) {
  return (
    <span className="flex w-6 shrink-0 items-center justify-center rounded-sm bg-foreground/80 text-[9px] font-bold text-background">
      R{n}
    </span>
  )
}

const trackStyle = (cols: number): React.CSSProperties => ({
  gridTemplateColumns: `repeat(${cols}, minmax(4rem, 7rem))`,
})

// ── Variant A — floor plan with rack-slot loads (the core A+B fusion) ─────────
export function FloorPlanSlotsVariant({
  bins,
  onSelect,
}: {
  bins: Bin[]
  onSelect: (bin: Bin) => void
}) {
  const rackRows = groupByRow(bins)
  const cols = Math.max(...bins.map((b) => b.col)) + 1

  return (
    <TooltipProvider>
      <div className="overflow-x-auto">
        <WarehouseShell cols={cols}>
          <div className="flex flex-col gap-0 p-4">
            {rackRows.map((row, r) => (
              <React.Fragment key={r}>
                <div className="flex items-stretch gap-2">
                  <RackLabel n={r + 1} />
                  <div className="grid flex-1 gap-1" style={trackStyle(cols)}>
                    {row.map((bin) => (
                      <RackSlot key={bin.id} bin={bin} onSelect={onSelect} />
                    ))}
                  </div>
                </div>
                {r < rackRows.length - 1 && <AisleLane letter={AISLE_LETTERS[r]} />}
              </React.Fragment>
            ))}
          </div>
        </WarehouseShell>
      </div>
    </TooltipProvider>
  )
}

// ── Variant B — map + side-elevation strip under each rack run ────────────────
// Dual projection: top-down footprint AND a side profile of load heights.
export function MapPlusElevationVariant({
  bins,
  onSelect,
}: {
  bins: Bin[]
  onSelect: (bin: Bin) => void
}) {
  const rackRows = groupByRow(bins)
  const cols = Math.max(...bins.map((b) => b.col)) + 1

  return (
    <TooltipProvider>
      <div className="overflow-x-auto">
        <WarehouseShell cols={cols}>
          <div className="flex flex-col gap-3 p-4">
            {rackRows.map((row, r) => (
              <React.Fragment key={r}>
                <div className="flex items-stretch gap-2">
                  <RackLabel n={r + 1} />
                  <div className="flex-1">
                    {/* Top-down footprint. */}
                    <div className="grid gap-1" style={trackStyle(cols)}>
                      {row.map((bin) => (
                        <SlotButton
                          key={bin.id}
                          bin={bin}
                          onSelect={onSelect}
                          style={{ gridColumnStart: bin.col + 1 }}
                          className="flex h-9 items-center justify-between rounded-sm border-x-2 border-foreground/25 px-1.5"
                        >
                          <span className={cn("relative z-[5] text-[10px] font-semibold", heat(bin).text)}>
                            {bin.code}
                          </span>
                          <span className="relative z-[5] text-[9px] text-muted-foreground">
                            {isOccupied(bin) ? `${fillPct(bin)}%` : "—"}
                          </span>
                        </SlotButton>
                      ))}
                    </div>
                    {/* Side elevation: load height per position, floor line below. */}
                    <div
                      className="mt-1 grid h-8 items-end gap-1 border-b-2 border-foreground/50"
                      style={trackStyle(cols)}
                    >
                      {row.map((bin) => (
                        <span
                          key={bin.id}
                          style={{ gridColumnStart: bin.col + 1 }}
                          className="flex h-full items-end"
                        >
                          <span
                            className={cn("w-full rounded-t-[2px]", heat(bin).fill)}
                            style={{ height: `${Math.max(fillPct(bin), isOccupied(bin) ? 8 : 0)}%` }}
                          />
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                {r < rackRows.length - 1 && <AisleLane letter={AISLE_LETTERS[r]} />}
              </React.Fragment>
            ))}
          </div>
        </WarehouseShell>
      </div>
    </TooltipProvider>
  )
}

// ── Variant C — dense floor plan, SKU on each slot ───────────────────────────
// Same fusion as A but taller slots that surface the SKU inline — a working
// operator view rather than an overview.
export function DetailedFloorVariant({
  bins,
  onSelect,
}: {
  bins: Bin[]
  onSelect: (bin: Bin) => void
}) {
  const rackRows = groupByRow(bins)
  const cols = Math.max(...bins.map((b) => b.col)) + 1

  return (
    <TooltipProvider>
      <div className="overflow-x-auto">
        <WarehouseShell cols={cols}>
          <div className="flex flex-col gap-0 p-4">
            {rackRows.map((row, r) => (
              <React.Fragment key={r}>
                <div className="flex items-stretch gap-2">
                  <RackLabel n={r + 1} />
                  <div className="grid flex-1 gap-1" style={trackStyle(cols)}>
                    {row.map((bin) => (
                      <RackSlot key={bin.id} bin={bin} onSelect={onSelect} showSku />
                    ))}
                  </div>
                </div>
                {r < rackRows.length - 1 && <AisleLane letter={AISLE_LETTERS[r]} />}
              </React.Fragment>
            ))}
          </div>
        </WarehouseShell>
      </div>
    </TooltipProvider>
  )
}
