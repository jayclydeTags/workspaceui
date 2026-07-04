"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Page } from "@/registry/bases/base/workspaceui/page"
import {
  INITIAL_REQUESTS,
  STATUS_COLUMNS,
  type ApprovalRequest,
  type ApprovalStatus,
} from "@/registry/bases/base/blocks/approval-board-01/data"
import { ApprovalColumn } from "@/registry/bases/base/blocks/approval-board-01/components/approval-column"

export function ApprovalBoard01({ className }: { className?: string }) {
  const [requests, setRequests] = React.useState<ApprovalRequest[]>(INITIAL_REQUESTS)

  function moveRequest(id: string, status: ApprovalStatus) {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
  }

  return (
    <Page
      title="Approvals"
      subtitle={`${requests.filter((r) => r.status === "pending").length} pending review`}
      className={cn("@container overflow-hidden", className)}
      hasPadding
    >
      <div className="flex h-full gap-4">
        {STATUS_COLUMNS.map((status) => (
          <ApprovalColumn
            key={status}
            status={status}
            requests={requests.filter((r) => r.status === status)}
            onDropRequest={moveRequest}
          />
        ))}
      </div>
    </Page>
  )
}
