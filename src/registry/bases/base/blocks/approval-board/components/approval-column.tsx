"use client"

import { BoardColumn } from "@/registry/bases/base/workspaceui/board-column"
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
  return (
    <BoardColumn
      columnId={status}
      label={STATUS_LABEL[status]}
      items={requests}
      getItemId={(request) => request.id}
      onDropItem={(id, status) => onDropRequest(id, status as ApprovalStatus)}
      emptyLabel="Drop a request here"
      renderItem={(request) => <ApprovalCard request={request} />}
    />
  )
}
