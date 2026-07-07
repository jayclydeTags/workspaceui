"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  formatCurrency,
  initials,
  type ApprovalRequest,
} from "@/registry/bases/base/blocks/approval-board/data"

export function ApprovalCard({ request }: { request: ApprovalRequest }) {
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", request.id)
        e.dataTransfer.effectAllowed = "move"
      }}
      className="flex cursor-grab flex-col gap-2 rounded-lg border border-border bg-card p-3 text-sm shadow-xs active:cursor-grabbing"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="font-medium">{request.title}</span>
        <Badge variant="outline" className="shrink-0">
          {request.type}
        </Badge>
      </div>

      <div className="flex items-center justify-between gap-2 text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Avatar size="sm">
            <AvatarFallback>{initials(request.requester)}</AvatarFallback>
          </Avatar>
          <span>{request.requester}</span>
        </div>
        {request.amount != null && <span>{formatCurrency(request.amount)}</span>}
      </div>

      <span className="text-xs text-muted-foreground">{request.submittedDate}</span>
    </div>
  )
}
