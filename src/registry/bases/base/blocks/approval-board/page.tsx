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

import { cn } from "@/lib/utils"
import { Page } from "@/registry/bases/base/workspaceui/page"
import {
  INITIAL_REQUESTS,
  STATUS_COLUMNS,
  type ApprovalRequest,
  type ApprovalStatus,
} from "@/registry/bases/base/blocks/approval-board/data"
import { ApprovalCard } from "@/registry/bases/base/blocks/approval-board/components/approval-card"
import { ApprovalColumn } from "@/registry/bases/base/blocks/approval-board/components/approval-column"

export function ApprovalBoard({ className }: { className?: string }) {
  const [requests, setRequests] =
    React.useState<ApprovalRequest[]>(INITIAL_REQUESTS)
  const [activeRequest, setActiveRequest] =
    React.useState<ApprovalRequest | null>(null)
  // Distance constraint keeps a plain click on a card from arming a drag —
  // matters once a card grows its own interactive controls.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  function handleDragStart(event: DragStartEvent) {
    setActiveRequest(requests.find((r) => r.id === event.active.id) ?? null)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveRequest(null)
    if (!over || active.id === over.id) return
    const activeId = String(active.id)
    const overId = String(over.id)

    setRequests((prev) => {
      const activeIndex = prev.findIndex((r) => r.id === activeId)
      if (activeIndex === -1) return prev

      // Dropped on a column background (empty space) vs. on another request —
      // the latter is where in-column reordering comes from.
      const overIsColumn = STATUS_COLUMNS.includes(overId as ApprovalStatus)
      const overStatus = overIsColumn
        ? (overId as ApprovalStatus)
        : prev.find((r) => r.id === overId)?.status
      if (!overStatus) return prev

      const withStatus =
        prev[activeIndex].status === overStatus
          ? prev
          : prev.map((r) =>
              r.id === activeId ? { ...r, status: overStatus } : r
            )

      const from = withStatus.findIndex((r) => r.id === activeId)
      const to = overIsColumn
        ? withStatus.length - 1
        : withStatus.findIndex((r) => r.id === overId)
      return arrayMove(withStatus, from, to)
    })
  }

  return (
    <Page
      title="Approvals"
      subtitle={`${requests.filter((r) => r.status === "pending").length} pending review`}
      className={cn("@container overflow-hidden", className)}
      hasPadding
    >
      <DndContext
        id="approval-board"
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex h-full gap-4">
          {STATUS_COLUMNS.map((status) => (
            <ApprovalColumn
              key={status}
              status={status}
              requests={requests.filter((r) => r.status === status)}
            />
          ))}
        </div>
        <DragOverlay>
          {activeRequest && <ApprovalCard request={activeRequest} overlay />}
        </DragOverlay>
      </DndContext>
    </Page>
  )
}
