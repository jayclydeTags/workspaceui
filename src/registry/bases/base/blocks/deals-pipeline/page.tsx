"use client"

import * as React from "react"
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon } from "@hugeicons/core-free-icons"

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
import { DealCard } from "./components/deal-card"
import { StageColumn } from "./components/stage-column"
import { DealDialog } from "./components/deal-dialog"

export function DealsPipeline({ className }: { className?: string }) {
  const [deals, setDeals] = React.useState<Deal[]>(DEALS)
  const [formOpen, setFormOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<Deal | null>(null)
  const [deleting, setDeleting] = React.useState<Deal | null>(null)
  const [activeDeal, setActiveDeal] = React.useState<Deal | null>(null)
  // Without a distance constraint, a pointerdown on a card's nested "Actions"
  // button also arms drag-start and swallows the click that opens the menu.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  function handleDragStart(event: DragStartEvent) {
    setActiveDeal(deals.find((d) => d.id === event.active.id) ?? null)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveDeal(null)
    if (!over || active.id === over.id) return
    const activeId = String(active.id)
    const overId = String(over.id)

    setDeals((prev) => {
      const activeIndex = prev.findIndex((d) => d.id === activeId)
      if (activeIndex === -1) return prev

      // Dropped on a column background (empty space) vs. on another deal —
      // the latter is where in-column reordering comes from.
      const overIsColumn = STAGE_COLUMNS.includes(overId as DealStage)
      const overStage = overIsColumn
        ? (overId as DealStage)
        : prev.find((d) => d.id === overId)?.stage
      if (!overStage) return prev

      const withStage =
        prev[activeIndex].stage === overStage
          ? prev
          : prev.map((d) =>
              d.id === activeId ? { ...d, stage: overStage } : d
            )

      const from = withStage.findIndex((d) => d.id === activeId)
      const to = overIsColumn
        ? withStage.length - 1
        : withStage.findIndex((d) => d.id === overId)
      return arrayMove(withStage, from, to)
    })
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
          <HugeiconsIcon
            icon={PlusSignIcon}
            strokeWidth={2}
            data-icon="inline-start"
          />
          New deal
        </Button>
      }
    >
      <DndContext
        id="deals-pipeline"
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex h-full gap-4">
          {STAGE_COLUMNS.map((stage) => (
            <StageColumn
              key={stage}
              stage={stage}
              deals={deals.filter((d) => d.stage === stage)}
              onEdit={(deal) => {
                setEditing(deal)
                setFormOpen(true)
              }}
              onDelete={setDeleting}
            />
          ))}
        </div>
        <DragOverlay>
          {activeDeal && (
            <DealCard
              deal={activeDeal}
              onEdit={() => {}}
              onDelete={() => {}}
              overlay
            />
          )}
        </DragOverlay>
      </DndContext>

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
