"use client"

import * as React from "react"
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"

import { cn } from "@/lib/utils"
import { Page } from "@/registry/bases/base/workspaceui/page"
import {
  INITIAL_REQUESTS,
  STATUS_COLUMNS,
  type ApprovalRequest,
  type ApprovalStatus,
} from "@/registry/bases/base/blocks/approval-board/data"
import { ApprovalColumn } from "@/registry/bases/base/blocks/approval-board/components/approval-column"

export function ApprovalBoard({ className }: { className?: string }) {
  const [requests, setRequests] =
    React.useState<ApprovalRequest[]>(INITIAL_REQUESTS)
  // Distance constraint keeps a plain click on a card from arming a drag —
  // matters once a card grows its own interactive controls.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  function moveRequest(id: string, status: ApprovalStatus) {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over) return
    moveRequest(String(active.id), over.id as ApprovalStatus)
  }

  return (
    <Page
      title="Approvals"
      subtitle={`${requests.filter((r) => r.status === "pending").length} pending review`}
      className={cn("@container overflow-hidden", className)}
      hasPadding
    >
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="flex h-full gap-4">
          {STATUS_COLUMNS.map((status) => (
            <ApprovalColumn
              key={status}
              status={status}
              requests={requests.filter((r) => r.status === status)}
            />
          ))}
        </div>
      </DndContext>
    </Page>
  )
}
