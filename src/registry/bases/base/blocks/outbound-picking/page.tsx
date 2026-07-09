"use client"

import * as React from "react"

import { Page } from "@/registry/bases/base/workspaceui/page"
import { type Bin } from "@/registry/bases/base/blocks/bin-location-map/data"
import {
  PICK_LISTS,
  canCompletePick,
  canPick,
  canPickFromBin,
  pickFromBin,
  pickStatus,
  remainingToPick,
  seedBins,
  type PickList,
} from "./data"
import { DataTable } from "./components/data-table"
import { PickSheet } from "./components/pick-sheet"

export function OutboundPicking() {
  const [lists, setLists] = React.useState<PickList[]>(PICK_LISTS)
  const [bins, setBins] = React.useState<Bin[]>(seedBins)
  const [selectedId, setSelectedId] = React.useState<string | null>(null)

  const selected = lists.find((l) => l.id === selectedId) ?? null

  const openCount = lists.filter(
    (l) => canPick(l) && pickStatus(l) !== "completed"
  ).length

  /** Apply a change to one line of the selected pick list. */
  function patchLine(
    lineId: string,
    change: (line: PickList["lines"][number]) => PickList["lines"][number]
  ) {
    setLists((prev) =>
      prev.map((l) =>
        l.id !== selectedId
          ? l
          : { ...l, lines: l.lines.map((ln) => (ln.id === lineId ? change(ln) : ln)) }
      )
    )
  }

  function handleClaim(name: string) {
    setLists((prev) =>
      prev.map((l) => (l.id === selectedId ? { ...l, picker: name } : l))
    )
  }

  function handleAllocate(lineId: string, binId: string, qty: number) {
    const list = lists.find((l) => l.id === selectedId)
    const line = list?.lines.find((ln) => ln.id === lineId)
    const bin = bins.find((b) => b.id === binId)
    if (!list || !line || !bin) return

    // Guard against a stale UI: never draw more than on-hand or the shortfall.
    const draw = Math.min(qty, remainingToPick(line))
    if (draw <= 0 || !canPickFromBin(bin, line.sku, draw)) return

    setBins((prev) =>
      prev.map((b) => (b.id === binId ? pickFromBin(b, draw) : b))
    )
    patchLine(lineId, (ln) => ({
      ...ln,
      allocations: [...ln.allocations, { binId, qty: draw }],
    }))
  }

  function handleShort(lineId: string) {
    patchLine(lineId, (ln) => ({ ...ln, short: true }))
  }

  function handleComplete() {
    setLists((prev) =>
      prev.map((l) =>
        l.id === selectedId && canCompletePick(l) ? { ...l, completed: true } : l
      )
    )
  }

  return (
    <Page
      title="Outbound / Picking"
      subtitle={`${lists.length} pick lists · ${openCount} to pick`}
      className="@container overflow-hidden"
    >
      <div className="flex h-full flex-col">
        <DataTable lists={lists} onOpen={(l) => setSelectedId(l.id)} />
      </div>

      <PickSheet
        list={selected}
        bins={bins}
        open={selected !== null}
        onOpenChange={(open) => !open && setSelectedId(null)}
        onClaim={handleClaim}
        onAllocate={handleAllocate}
        onShort={handleShort}
        onComplete={handleComplete}
      />
    </Page>
  )
}
