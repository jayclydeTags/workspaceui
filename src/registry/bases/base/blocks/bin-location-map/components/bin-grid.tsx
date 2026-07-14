"use client"

import * as React from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import { type Bin } from "../data"
import {
  DetailedFloorVariant,
  FloorPlanSlotsVariant,
  MapPlusElevationVariant,
} from "./bin-floor-variants"

// PROTOTYPE SWITCHER — three variations on the A+B fusion gated by ?variant=.
// Once a winner is picked, keep just that variant's render and delete the
// switcher + the losing variants (see bin-floor-variants.tsx header).
const VARIANTS = [
  { key: "A", name: "Floor plan · rack-slot loads", render: FloorPlanSlotsVariant },
  { key: "B", name: "Map + side elevation strip", render: MapPlusElevationVariant },
  { key: "C", name: "Detailed floor (SKU on slot)", render: DetailedFloorVariant },
] as const

function useVariant(): [string, (key: string) => void] {
  const [variant, setVariant] = React.useState("A")

  React.useEffect(() => {
    const v = new URLSearchParams(window.location.search).get("variant")
    if (v && VARIANTS.some((x) => x.key === v)) setVariant(v)
  }, [])

  const set = React.useCallback((key: string) => {
    setVariant(key)
    const url = new URL(window.location.href)
    url.searchParams.set("variant", key)
    window.history.replaceState(null, "", url)
  }, [])

  return [variant, set]
}

export function BinGrid({
  bins,
  onSelect,
}: {
  bins: Bin[]
  onSelect: (bin: Bin) => void
}) {
  const [variant, setVariant] = useVariant()

  const index = Math.max(
    0,
    VARIANTS.findIndex((v) => v.key === variant)
  )
  const active = VARIANTS[index]
  const cycle = React.useCallback(
    (dir: number) =>
      setVariant(VARIANTS[(index + dir + VARIANTS.length) % VARIANTS.length].key),
    [index, setVariant]
  )

  React.useEffect(() => {
    if (process.env.NODE_ENV === "production") return
    function onKey(e: KeyboardEvent) {
      const el = document.activeElement as HTMLElement | null
      if (el && /^(INPUT|TEXTAREA)$/.test(el.tagName)) return
      if (el?.isContentEditable) return
      if (e.key === "ArrowLeft") cycle(-1)
      if (e.key === "ArrowRight") cycle(1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [cycle])

  if (bins.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No bins</EmptyTitle>
          <EmptyDescription>
            Add a bin to start mapping this warehouse&apos;s floor.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  const Render = active.render

  return (
    <>
      <Render bins={bins} onSelect={onSelect} />

      {process.env.NODE_ENV !== "production" && (
        <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full border bg-background/95 px-1.5 py-1 text-xs shadow-lg backdrop-blur">
          <button
            type="button"
            aria-label="Previous variant"
            onClick={() => cycle(-1)}
            className="flex size-6 items-center justify-center rounded-full hover:bg-muted"
          >
            <ChevronLeftIcon className="size-4" />
          </button>
          <span className="px-2 font-medium tabular-nums">
            {active.key} — {active.name}
          </span>
          <button
            type="button"
            aria-label="Next variant"
            onClick={() => cycle(1)}
            className="flex size-6 items-center justify-center rounded-full hover:bg-muted"
          >
            <ChevronRightIcon className="size-4" />
          </button>
        </div>
      )}
    </>
  )
}
