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
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Page } from "@/registry/bases/base/workspaceui/page"
import {
  LEAVE_REQUESTS,
  pendingCount,
  type LeaveRequest,
  type LeaveRequestDraft,
  type LeaveStatus,
} from "./data"
import { DataTable } from "./components/data-table"
import { RequestDialog } from "./components/request-dialog"

const STATUSES: LeaveStatus[] = ["pending", "approved", "rejected"]

export function LeaveRequests() {
  const [requests, setRequests] = React.useState<LeaveRequest[]>(LEAVE_REQUESTS)
  const [formOpen, setFormOpen] = React.useState(false)
  const [deleting, setDeleting] = React.useState<LeaveRequest | null>(null)
  const [statusFilter, setStatusFilter] = React.useState<LeaveStatus | "all">(
    "all"
  )

  const visible =
    statusFilter === "all"
      ? requests
      : requests.filter((r) => r.status === statusFilter)

  function create(draft: LeaveRequestDraft) {
    setRequests((prev) => [
      { ...draft, id: crypto.randomUUID(), status: "pending" },
      ...prev,
    ])
  }

  function decide(request: LeaveRequest, status: LeaveStatus) {
    setRequests((prev) =>
      prev.map((r) => (r.id === request.id ? { ...r, status } : r))
    )
  }

  function confirmDelete() {
    if (!deleting) return
    setRequests((prev) => prev.filter((r) => r.id !== deleting.id))
    setDeleting(null)
  }

  return (
    <Page
      title="Leave requests"
      subtitle={`${requests.length} requests · ${pendingCount(requests)} pending`}
      className="@container overflow-hidden"
      actions={
        <Button size="sm" onClick={() => setFormOpen(true)}>
          <PlusIcon data-icon="inline-start" />
          New request
        </Button>
      }
    >
      <div className="flex h-full flex-col">
        <div className="border-b px-4 py-3 @sm:px-6">
          <Select
            value={statusFilter}
            onValueChange={(v) =>
              setStatusFilter((v as LeaveStatus | "all") ?? "all")
            }
          >
            <SelectTrigger aria-label="Filter by status" className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {STATUSES.map((status) => (
                <SelectItem key={status} value={status} className="capitalize">
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {visible.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No leave requests</EmptyTitle>
              <EmptyDescription>
                No {statusFilter === "all" ? "" : `${statusFilter} `}requests to
                show.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <DataTable
            requests={visible}
            onDecide={decide}
            onDelete={setDeleting}
          />
        )}
      </div>

      <RequestDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={create}
      />

      <AlertDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete leave request</AlertDialogTitle>
            <AlertDialogDescription>
              Delete{" "}
              <span className="font-medium">{deleting?.employee}</span>&apos;s{" "}
              {deleting?.type} request? This action can&apos;t be undone.
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
