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
  APPLICATIONS,
  LOAN_STATUSES,
  formatCurrency,
  pipelineValue,
  type LoanApplication,
  type LoanDraft,
  type LoanStatus,
} from "./data"
import { DataTable } from "./components/data-table"
import { ApplicationDialog } from "./components/application-dialog"

export function LoanApplications() {
  const [applications, setApplications] =
    React.useState<LoanApplication[]>(APPLICATIONS)
  const [formOpen, setFormOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<LoanApplication | null>(null)
  const [deleting, setDeleting] = React.useState<LoanApplication | null>(null)
  const [statusFilter, setStatusFilter] = React.useState<LoanStatus | "all">("all")

  const visible =
    statusFilter === "all"
      ? applications
      : applications.filter((a) => a.status === statusFilter)

  const pending = applications.filter(
    (a) => a.status !== "approved" && a.status !== "rejected"
  ).length

  function save(draft: LoanDraft) {
    if (editing) {
      setApplications((prev) =>
        prev.map((a) => (a.id === editing.id ? { ...a, ...draft } : a))
      )
    } else {
      setApplications((prev) => [
        { ...draft, id: crypto.randomUUID(), status: "draft" },
        ...prev,
      ])
    }
  }

  function decide(application: LoanApplication, status: LoanStatus) {
    setApplications((prev) =>
      prev.map((a) => (a.id === application.id ? { ...a, status } : a))
    )
  }

  function confirmDelete() {
    if (!deleting) return
    setApplications((prev) => prev.filter((a) => a.id !== deleting.id))
    setDeleting(null)
  }

  return (
    <Page
      title="Loan applications"
      subtitle={`${pending} pending · ${formatCurrency(pipelineValue(applications))} in pipeline`}
      className="@container overflow-hidden"
      actions={
        <Button
          size="sm"
          onClick={() => {
            setEditing(null)
            setFormOpen(true)
          }}
        >
          <PlusIcon data-icon="inline-start" />
          New application
        </Button>
      }
    >
      <div className="flex h-full flex-col">
        <div className="border-b px-4 py-3 @sm:px-6">
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter((v as LoanStatus | "all") ?? "all")}
          >
            <SelectTrigger aria-label="Filter by status" className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {LOAN_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {visible.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No applications</EmptyTitle>
              <EmptyDescription>
                No {statusFilter === "all" ? "" : `${statusFilter} `}applications to
                show.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <DataTable
            applications={visible}
            onEdit={(application) => {
              setEditing(application)
              setFormOpen(true)
            }}
            onDecide={decide}
            onDelete={setDeleting}
          />
        )}
      </div>

      <ApplicationDialog
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
            <AlertDialogTitle>Delete application</AlertDialogTitle>
            <AlertDialogDescription>
              Delete <span className="font-medium">{deleting?.reference}</span>? This
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
