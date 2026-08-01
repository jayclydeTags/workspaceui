"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { BoardCard } from "@/registry/bases/base/workspaceui/board-card"
import {
  formatCurrency,
  initials,
  type ApprovalRequest,
} from "@/registry/bases/base/blocks/approval-board/data"

export function ApprovalCard({ request }: { request: ApprovalRequest }) {
  return (
    <BoardCard itemId={request.id}>
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
        {request.amount != null && (
          <span>{formatCurrency(request.amount)}</span>
        )}
      </div>

      <span className="text-xs text-muted-foreground">
        {request.submittedDate}
      </span>
    </BoardCard>
  )
}
