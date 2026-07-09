"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Page } from "@/registry/bases/base/workspaceui/page"
import {
  ADJUSTMENT_REQUESTS,
  adjustmentStatus,
  canApprove,
  canRequest,
  needsApproval,
  postAdjustment,
  seedBins,
  type AdjustmentDraft,
  type AdjustmentRequest,
  type Bin,
} from "./data"
import { ApprovalSheet } from "./components/approval-sheet"
import { DataTable } from "./components/data-table"
import { RequestDialog } from "./components/request-dialog"

export function InventoryAdjustments() {
  const [requests, setRequests] =
    React.useState<AdjustmentRequest[]>(ADJUSTMENT_REQUESTS)
  const [bins, setBins] = React.useState<Bin[]>(seedBins)
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const [creating, setCreating] = React.useState(false)

  const selected = requests.find((r) => r.id === selectedId) ?? null
  const selectedBin = selected
    ? (bins.find((b) => b.id === selected.binId) ?? null)
    : null

  const pendingCount = requests.filter(
    (r) => adjustmentStatus(r) === "pending"
  ).length

  /** Approving posts the count to the bin in one step — there's no held state. */
  function post(req: AdjustmentRequest, bin: Bin, approver: string) {
    setBins((prev) =>
      prev.map((b) => (b.id === bin.id ? postAdjustment(req, b) : b))
    )
    setRequests((prev) =>
      prev.map((r) => (r.id === req.id ? { ...r, approvedBy: approver } : r))
    )
  }

  function handleCreate(draft: AdjustmentDraft) {
    const bin = bins.find((b) => b.id === draft.binId)
    if (!bin || !canRequest(draft, bin)) return

    const req: AdjustmentRequest = {
      ...draft,
      id: crypto.randomUUID(),
      requestedBy: "You",
      approvedBy: null,
      rejected: false,
    }

    // Under the variance threshold there's nobody to ask — it posts on submit.
    if (needsApproval(req, bin)) {
      setRequests((prev) => [req, ...prev])
      return
    }
    setRequests((prev) => [req, ...prev])
    post(req, bin, "auto-posted")
  }

  function handleApprove() {
    if (!selected || !selectedBin || !canApprove(selected, selectedBin)) return
    post(selected, selectedBin, "You")
    setSelectedId(null)
  }

  function handleReject() {
    setRequests((prev) =>
      prev.map((r) => (r.id === selectedId ? { ...r, rejected: true } : r))
    )
    setSelectedId(null)
  }

  return (
    <Page
      title="Inventory Adjustments"
      subtitle={`${requests.length} adjustments · ${pendingCount} pending`}
      actions={
        <Button onClick={() => setCreating(true)}>New adjustment</Button>
      }
      className="@container overflow-hidden"
    >
      <div className="flex h-full flex-col">
        <DataTable
          requests={requests}
          bins={bins}
          onOpen={(r) => setSelectedId(r.id)}
        />
      </div>

      <RequestDialog
        bins={bins}
        open={creating}
        onOpenChange={setCreating}
        onSubmit={handleCreate}
      />

      <ApprovalSheet
        request={selected}
        bin={selectedBin}
        open={selected !== null}
        onOpenChange={(open) => !open && setSelectedId(null)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </Page>
  )
}
