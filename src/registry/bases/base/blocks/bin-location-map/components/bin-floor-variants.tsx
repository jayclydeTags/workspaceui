// PROTOTYPE — three warehouse-layout variants for the Bin / Location Map floor.
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
// Warehouse floors read as heatmaps: empty is cold, full is hot. Real hue helps
// an operator scan for full/near-full slots faster than a single-tone bar does.
// `fill` is a solid variant of `bg` for the load bar in variant B — kept as a
// literal class (not string-built) so Tailwind's JIT actually generates it.
function heat(bin: Bin): { bg: string; fill: string; ring: string; text: string } {
  if (!isOccupied(bin))
    return { bg: "bg-muted/40", fill: "bg-muted-foreground/40", ring: "ring-border", text: "text-muted-foreground" }
  const pct = fillPct(bin)
  if (pct >= 90)
    return { bg: "bg-red-500/20", fill: "bg-red-500/70", ring: "ring-red-500/50", text: "text-red-700 dark:text-red-300" }
  if (pct >= 60)
    return { bg: "bg-amber-500/20", fill: "bg-amber-500/70", ring: "ring-amber-500/50", text: "text-amber-700 dark:text-amber-300" }
  return { bg: "bg-emerald-500/20", fill: "bg-emerald-500/70", ring: "ring-emerald-500/50", text: "text-emerald-700 dark:text-emerald-300" }
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
      className="pointer-events-none absolute inset-0 rounded-[inherit]"
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

function Slot({
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
              "relative flex flex-col items-center justify-center gap-0.5 rounded-sm ring-1 ring-inset transition-all hover:z-10 hover:scale-[1.04] hover:shadow-md focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
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

// ── Variant A — top-down floor plan with aisles + dock doors ─────────────────
export function FloorPlanVariant({
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
      <div className="rounded-lg border-2 border-dashed border-muted-foreground/30 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:16px_16px]">
        <div className="flex items-center justify-between border-b border-dashed border-muted-foreground/30 px-4 py-1.5 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
          <span>◄ Receiving</span>
          <span>Storage floor</span>
        </div>

        <div className="flex flex-col gap-0 p-4">
          {rackRows.map((row, r) => (
            <React.Fragment key={r}>
              {/* Rack run: two facing rows of pallet positions read as a rack. */}
              <div className="flex items-stretch gap-2">
                <span className="flex w-6 shrink-0 items-center justify-center rounded-sm bg-foreground/80 text-[9px] font-bold text-background">
                  R{r + 1}
                </span>
                <div
                  className="grid flex-1 gap-1"
                  style={{ gridTemplateColumns: `repeat(${cols}, minmax(3.5rem, 1fr))` }}
                >
                  {row.map((bin) => (
                    <Slot
                      key={bin.id}
                      bin={bin}
                      onSelect={onSelect}
                      className="aspect-[4/3] p-1"
                      style={{ gridColumnStart: bin.col + 1 }}
                    >
                      <span className={cn("text-[10px] leading-none font-semibold", heat(bin).text)}>
                        {bin.code}
                      </span>
                      <span className="text-[9px] leading-none text-muted-foreground">
                        {isOccupied(bin) ? `${fillPct(bin)}%` : "—"}
                      </span>
                    </Slot>
                  ))}
                </div>
              </div>
              {/* Aisle lane between rack runs — dashed centre line + label. */}
              {r < rackRows.length - 1 && (
                <div className="relative my-1 ml-8 flex h-5 items-center">
                  <span className="absolute inset-x-0 top-1/2 border-t border-dashed border-muted-foreground/40" />
                  <span className="relative mx-auto rounded-full bg-background px-2 text-[9px] font-medium tracking-widest text-muted-foreground uppercase">
                    Aisle {AISLE_LETTERS[r]}
                  </span>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Dock doors along the outbound wall. */}
        <div className="flex items-end gap-2 border-t border-dashed border-muted-foreground/30 px-4 py-2">
          <span className="mr-1 text-[9px] font-semibold tracking-widest text-muted-foreground uppercase">
            Shipping ►
          </span>
          {Array.from({ length: Math.max(3, cols - 1) }, (_, i) => (
            <span
              key={i}
              className="flex h-4 flex-1 items-center justify-center rounded-b-sm border border-t-0 border-muted-foreground/40 text-[8px] text-muted-foreground"
            >
              DOCK {i + 1}
            </span>
          ))}
        </div>
      </div>
    </TooltipProvider>
  )
}

// ── Variant B — rack elevation (side view of shelving bays) ──────────────────
export function RackElevationVariant({
  bins,
  onSelect,
}: {
  bins: Bin[]
  onSelect: (bin: Bin) => void
}) {
  const cols = Math.max(...bins.map((b) => b.col)) + 1
  const levels = Math.max(...bins.map((b) => b.row)) + 1

  // One vertical bay per column; levels stack top (highest row) to bottom.
  const bays = Array.from({ length: cols }, (_, c) =>
    Array.from({ length: levels }, (_, lvl) =>
      bins.find((b) => b.col === c && b.row === levels - 1 - lvl)
    )
  )

  return (
    <TooltipProvider>
      <div className="overflow-x-auto rounded-lg border bg-muted/20 p-4">
        <div className="flex items-end gap-3">
          {bays.map((bay, c) => (
            <div key={c} className="flex flex-col items-center gap-1">
              {/* Uprights frame the bay; beams separate the levels. */}
              <div className="flex flex-col gap-[3px] rounded-sm border-x-4 border-t-2 border-foreground/70 bg-background/60 p-[3px]">
                {bay.map((bin, lvl) =>
                  bin ? (
                    <Slot
                      key={bin.id}
                      bin={bin}
                      onSelect={onSelect}
                      className="h-11 w-24 border-b-2 border-foreground/40 px-1.5 !items-start !justify-center"
                    >
                      <span className="flex w-full items-center justify-between">
                        <span className={cn("text-[10px] font-semibold", heat(bin).text)}>
                          {bin.code}
                        </span>
                        <span className="text-[9px] text-muted-foreground">
                          L{levels - lvl}
                        </span>
                      </span>
                      {/* Fill drawn as pallet load rising inside the bay slot. */}
                      <span className="mt-1 flex h-2.5 w-full items-end overflow-hidden rounded-[2px] bg-muted">
                        <span
                          className={cn("h-full", heat(bin).fill)}
                          style={{ width: `${fillPct(bin)}%` }}
                        />
                      </span>
                    </Slot>
                  ) : (
                    <span key={lvl} className="h-11 w-24 rounded-sm border-b-2 border-dashed border-muted" />
                  )
                )}
              </div>
              {/* Bay foot + column label. */}
              <span className="h-1 w-full rounded-full bg-foreground/70" />
              <span className="text-[9px] font-bold tracking-wider text-muted-foreground">
                BAY {c + 1}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[10px] text-muted-foreground">
          Side elevation · load height ∝ fill · L{levels} = top beam
        </p>
      </div>
    </TooltipProvider>
  )
}

// ── Variant C — zoned heatmap floor ──────────────────────────────────────────
const ZONES = [
  { name: "Fast pick", tint: "bg-sky-500/5 border-sky-500/30", label: "text-sky-600 dark:text-sky-400" },
  { name: "Bulk reserve", tint: "bg-violet-500/5 border-violet-500/30", label: "text-violet-600 dark:text-violet-400" },
  { name: "Overflow", tint: "bg-teal-500/5 border-teal-500/30", label: "text-teal-600 dark:text-teal-400" },
]

export function ZoneHeatmapVariant({
  bins,
  onSelect,
}: {
  bins: Bin[]
  onSelect: (bin: Bin) => void
}) {
  const cols = Math.max(...bins.map((b) => b.col)) + 1
  const rows = Math.max(...bins.map((b) => b.row)) + 1
  // Split the floor into contiguous column-band zones.
  const bandSize = Math.ceil(cols / ZONES.length)

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-muted-foreground">
          <span className="font-semibold uppercase tracking-widest">Occupancy</span>
          <Legend swatch="bg-muted/40" label="Empty" />
          <Legend swatch="bg-emerald-500/40" label="<60%" />
          <Legend swatch="bg-amber-500/40" label="60–89%" />
          <Legend swatch="bg-red-500/40" label="≥90%" />
        </div>

        <div className="flex gap-3 overflow-x-auto">
          {ZONES.map((zone, z) => {
            const from = z * bandSize
            const to = Math.min(cols, from + bandSize)
            const zoneBins = bins.filter((b) => b.col >= from && b.col < to)
            if (zoneBins.length === 0) return null
            return (
              <div
                key={zone.name}
                className={cn("flex-1 rounded-lg border-2 border-dashed p-3", zone.tint)}
              >
                <div className={cn("mb-2 text-[10px] font-bold tracking-widest uppercase", zone.label)}>
                  {zone.name}
                </div>
                <div
                  className="grid gap-1.5"
                  style={{
                    gridTemplateColumns: `repeat(${to - from}, minmax(2.75rem, 1fr))`,
                    gridTemplateRows: `repeat(${rows}, minmax(2.75rem, 1fr))`,
                  }}
                >
                  {zoneBins.map((bin) => (
                    <Slot
                      key={bin.id}
                      bin={bin}
                      onSelect={onSelect}
                      className="aspect-square"
                      style={{ gridColumnStart: bin.col - from + 1, gridRowStart: bin.row + 1 }}
                    >
                      <span className={cn("text-[9px] leading-none font-semibold", heat(bin).text)}>
                        {bin.code.split("-").pop()}
                      </span>
                      {isOccupied(bin) && (
                        <span className="text-[8px] leading-none text-muted-foreground">
                          {fillPct(bin)}
                        </span>
                      )}
                    </Slot>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </TooltipProvider>
  )
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className="flex items-center gap-1">
      <span className={cn("size-2.5 rounded-[2px] ring-1 ring-inset ring-border", swatch)} />
      {label}
    </span>
  )
}
