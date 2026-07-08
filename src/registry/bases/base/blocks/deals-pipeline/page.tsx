"use client"

import * as React from "react"
import { PlusIcon } from "lucide-react"

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
import { cn } from "@/lib/utils"
import { Page } from "@/registry/bases/base/workspaceui/page"
import {
  DEALS,
  STAGE_COLUMNS,
  formatCurrency,
  weightedForecast,
  winRate,
  type Deal,
  type DealDraft,
  type DealStage,
} from "./data"
import { StageColumn } from "./components/stage-column"
import { DealDialog } from "./components/deal-dialog"

export function DealsPipeline({ className }: { className?: string }) {
  const [deals, setDeals] = React.useState<Deal[]>(DEALS)
  const [formOpen, setFormOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<Deal | null>(null)
  const [deleting, setDeleting] = React.useState<Deal | null>(null)

  function move(id: string, stage: DealStage) {
    setDeals((prev) => prev.map((d) => (d.id === id ? { ...d, stage } : d)))
  }

  function save(draft: DealDraft) {
    if (editing) {
      setDeals((prev) =>
        prev.map((d) => (d.id === editing.id ? { ...d, ...draft } : d))
      )
    } else {
      setDeals((prev) => [...prev, { ...draft, id: crypto.randomUUID() }])
    }
  }

  function confirmDelete() {
    if (!deleting) return
    setDeals((prev) => prev.filter((d) => d.id !== deleting.id))
    setDeleting(null)
  }

  return (
    <Page
      title="Pipeline"
      subtitle={`${formatCurrency(weightedForecast(deals))} weighted · ${winRate(deals)}% win rate`}
      className={cn("@container overflow-hidden", className)}
      hasPadding
      actions={
        <Button
          size="sm"
          onClick={() => {
            setEditing(null)
            setFormOpen(true)
          }}
        >
          <PlusIcon data-icon="inline-start" />
          New deal
        </Button>
      }
    >
      <div className="flex h-full gap-4">
        {STAGE_COLUMNS.map((stage) => (
          <StageColumn
            key={stage}
            stage={stage}
            deals={deals.filter((d) => d.stage === stage)}
            onDropDeal={move}
            onEdit={(deal) => {
              setEditing(deal)
              setFormOpen(true)
            }}
            onDelete={setDeleting}
          />
        ))}
      </div>

      <DealDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        editing={editing}
        onSubmit={save}
      />

      <AlertDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete deal</AlertDialogTitle>
            <AlertDialogDescription>
              Delete <span className="font-medium">{deleting?.name}</span>? This
              action can&apos;t be undone.
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
