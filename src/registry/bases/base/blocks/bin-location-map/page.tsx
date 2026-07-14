"use client"

import * as React from "react"
import { PlusIcon } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Page } from "@/registry/bases/base/workspaceui/page"
import {
  BINS,
  WAREHOUSES,
  assign,
  clearBin,
  isOccupied,
  type Assignment,
  type Bin,
  type BinDraft,
} from "./data"
import { BinGrid, FloorLegend } from "./components/bin-grid"
import { BinSheet } from "./components/bin-sheet"
import { BinDialog } from "./components/bin-dialog"

export function BinLocationMap() {
  const [bins, setBins] = React.useState<Bin[]>(BINS)
  const [warehouse, setWarehouse] = React.useState(WAREHOUSES[0])
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const [formOpen, setFormOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<Bin | null>(null)
  const [addSeed, setAddSeed] = React.useState<{ row: number; col: number } | null>(null)
  const [deleting, setDeleting] = React.useState<Bin | null>(null)

  function openAdd(seed: { row: number; col: number } | null) {
    setEditing(null)
    setAddSeed(seed)
    setFormOpen(true)
  }

  const selected = bins.find((b) => b.id === selectedId) ?? null
  const occupiedCount = bins.filter(isOccupied).length

  function saveBin(draft: BinDraft) {
    if (editing) {
      setBins((prev) =>
        prev.map((b) => (b.id === editing.id ? { ...b, ...draft } : b))
      )
    } else {
      setBins((prev) => [
        ...prev,
        { ...draft, id: crypto.randomUUID(), sku: null, qty: 0 },
      ])
    }
  }

  function handleAssign(bin: Bin, assignment: Assignment) {
    setBins((prev) => prev.map((b) => (b.id === bin.id ? assign(b, assignment) : b)))
  }

  function handleClear(bin: Bin) {
    setBins((prev) => prev.map((b) => (b.id === bin.id ? clearBin(b) : b)))
  }

  function requestDelete(bin: Bin) {
    setSelectedId(null)
    setDeleting(bin)
  }

  function confirmDelete() {
    if (!deleting) return
    setBins((prev) => prev.filter((b) => b.id !== deleting.id))
    setDeleting(null)
  }

  return (
    <Page
      title="Bin / Location Map"
      subtitle={`${bins.length} bins across ${WAREHOUSES.length} warehouses · ${occupiedCount} occupied`}
      className="@container overflow-hidden"
      hasPadding
      actions={
        <Button size="sm" onClick={() => openAdd(null)}>
          <PlusIcon data-icon="inline-start" />
          Add bin
        </Button>
      }
    >
      <Tabs
        value={warehouse}
        onValueChange={(v) => v && setWarehouse(v)}
        className="h-full"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TabsList>
            {WAREHOUSES.map((w) => (
              <TabsTrigger key={w} value={w}>
                {w}
              </TabsTrigger>
            ))}
          </TabsList>
          <FloorLegend />
        </div>
        {WAREHOUSES.map((w) => {
          const warehouseBins = bins.filter((b) => b.warehouse === w)
          const unavailable = warehouseBins.filter((b) => b.status !== "active")
          return (
            <TabsContent
              key={w}
              value={w}
              className="flex flex-col gap-4 overflow-auto"
            >
              {unavailable.length > 0 && (
                <Alert>
                  <AlertTitle>Bins unavailable</AlertTitle>
                  <AlertDescription>
                    {`${unavailable.map((b) => `${b.code} (${b.status})`).join(", ")} can't accept stock right now.`}
                  </AlertDescription>
                </Alert>
              )}
              <BinGrid
                bins={warehouseBins}
                onSelect={(bin) => setSelectedId(bin.id)}
                onAdd={openAdd}
              />
            </TabsContent>
          )
        })}
      </Tabs>

      <BinSheet
        bin={selected}
        open={selected !== null}
        onOpenChange={(open) => !open && setSelectedId(null)}
        onAssign={handleAssign}
        onClear={handleClear}
        onEdit={(bin) => {
          setSelectedId(null)
          setEditing(bin)
          setFormOpen(true)
        }}
        onDelete={requestDelete}
      />

      <BinDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        editing={editing}
        defaultWarehouse={warehouse}
        seed={addSeed}
        bins={bins}
        onSubmit={saveBin}
      />

      <AlertDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete bin</AlertDialogTitle>
            <AlertDialogDescription>
              Remove <span className="font-medium">{deleting?.code}</span> from{" "}
              {deleting?.warehouse}?
              {deleting && isOccupied(deleting)
                ? ` It still holds ${deleting.qty} units of ${deleting.sku}.`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Page>
  )
}
