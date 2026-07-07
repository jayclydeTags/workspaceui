"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  STATUS_LABEL,
  type ApprovalRequest,
  type ApprovalStatus,
} from "@/registry/bases/base/blocks/approval-board/data"
import { ApprovalCard } from "@/registry/bases/base/blocks/approval-board/components/approval-card"

export function ApprovalColumn({
  status,
  requests,
  onDropRequest,
}: {
  status: ApprovalStatus
  requests: ApprovalRequest[]
  onDropRequest: (id: string, status: ApprovalStatus) => void
}) {
  const [isDragOver, setIsDragOver] = React.useState(false)

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragOver(true)
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setIsDragOver(false)
        onDropRequest(e.dataTransfer.getData("text/plain"), status)
      }}
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-3 rounded-lg border border-transparent bg-muted/30 p-3",
        isDragOver && "border-primary/50 bg-muted/60"
      )}
    >
      <div className="flex shrink-0 items-center gap-2">
        <span className="text-sm font-medium">{STATUS_LABEL[status]}</span>
        <Badge variant="secondary">{requests.length}</Badge>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
        {requests.map((request) => (
          <ApprovalCard key={request.id} request={request} />
        ))}
        {requests.length === 0 && (
          <div className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
            Drop a request here
          </div>
        )}
      </div>
    </div>
  )
}
