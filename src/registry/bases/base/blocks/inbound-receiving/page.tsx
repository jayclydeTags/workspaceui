"use client"

import * as React from "react"

import { Page } from "@/registry/bases/base/workspaceui/page"
import { assign, type Bin } from "@/registry/bases/base/blocks/bin-location-map/data"
import {
  RECEIPTS,
  canPutAway,
  receiptStatus,
  remainingToPutAway,
  seedBins,
  type QcVerdict,
  type Receipt,
} from "./data"
import { DataTable } from "./components/data-table"
import { ReceiptSheet } from "./components/receipt-sheet"

export function InboundReceiving() {
  const [receipts, setReceipts] = React.useState<Receipt[]>(RECEIPTS)
  const [bins, setBins] = React.useState<Bin[]>(seedBins)
  const [selectedId, setSelectedId] = React.useState<string | null>(null)

  const selected = receipts.find((r) => r.id === selectedId) ?? null

  const openCount = receipts.filter(
    (r) => receiptStatus(r.lines) !== "put-away"
  ).length

  /** Apply a change to one line of the selected receipt. */
  function patchLine(
    lineId: string,
    change: (line: Receipt["lines"][number]) => Receipt["lines"][number]
  ) {
    setReceipts((prev) =>
      prev.map((r) =>
        r.id !== selectedId
          ? r
          : { ...r, lines: r.lines.map((l) => (l.id === lineId ? change(l) : l)) }
      )
    )
  }

  function handleReceive(lineId: string, qty: number) {
    patchLine(lineId, (l) => ({ ...l, receivedQty: Math.max(0, qty) }))
  }

  function handleQc(lineId: string, verdict: QcVerdict) {
    patchLine(lineId, (l) => ({ ...l, qc: verdict }))
  }

  function handlePutAway(lineId: string, binId: string) {
    const receipt = receipts.find((r) => r.id === selectedId)
    const line = receipt?.lines.find((l) => l.id === lineId)
    const bin = bins.find((b) => b.id === binId)
    if (!line || !bin || !canPutAway(line, bin)) return

    const qty = remainingToPutAway(line)
    setBins((prev) =>
      prev.map((b) => (b.id === binId ? assign(b, { sku: line.sku, qty }) : b))
    )
    patchLine(lineId, (l) => ({
      ...l,
      putAwayQty: l.putAwayQty + qty,
      binId,
    }))
  }

  return (
    <Page
      title="Inbound / Receiving"
      subtitle={`${receipts.length} receipts · ${openCount} awaiting put-away`}
      className="@container overflow-hidden"
    >
      <div className="flex h-full flex-col">
        <DataTable receipts={receipts} onOpen={(r) => setSelectedId(r.id)} />
      </div>

      <ReceiptSheet
        receipt={selected}
        bins={bins}
        open={selected !== null}
        onOpenChange={(open) => !open && setSelectedId(null)}
        onReceive={handleReceive}
        onQc={handleQc}
        onPutAway={handlePutAway}
      />
    </Page>
  )
}
