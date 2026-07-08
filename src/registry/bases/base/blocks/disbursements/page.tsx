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
  DISBURSEMENTS,
  LOANS,
  formatCurrency,
  releasedTotal,
  type Disbursement,
  type DisbursementDraft,
  type DisbursementStatus,
} from "./data"
import { DataTable } from "./components/data-table"
import { DisbursementDialog } from "./components/disbursement-dialog"

export function Disbursements() {
  const [disbursements, setDisbursements] =
    React.useState<Disbursement[]>(DISBURSEMENTS)
  const [formOpen, setFormOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<Disbursement | null>(null)
  const [deleting, setDeleting] = React.useState<Disbursement | null>(null)
  const [loanFilter, setLoanFilter] = React.useState("all")

  const visible =
    loanFilter === "all"
      ? disbursements
      : disbursements.filter((d) => d.loan === loanFilter)

  const scheduled = disbursements.filter((d) => d.status === "scheduled").length

  function save(draft: DisbursementDraft) {
    if (editing) {
      setDisbursements((prev) =>
        prev.map((d) => (d.id === editing.id ? { ...d, ...draft } : d))
      )
    } else {
      setDisbursements((prev) => [
        ...prev,
        { ...draft, id: crypto.randomUUID(), status: "scheduled" },
      ])
    }
  }

  function settle(disbursement: Disbursement, status: DisbursementStatus) {
    setDisbursements((prev) =>
      prev.map((d) => (d.id === disbursement.id ? { ...d, status } : d))
    )
  }

  function confirmDelete() {
    if (!deleting) return
    setDisbursements((prev) => prev.filter((d) => d.id !== deleting.id))
    setDeleting(null)
  }

  return (
    <Page
      title="Disbursements"
      subtitle={`${formatCurrency(releasedTotal(disbursements))} released · ${scheduled} scheduled`}
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
          Schedule disbursement
        </Button>
      }
    >
      <div className="flex h-full flex-col">
        <div className="border-b px-4 py-3 @sm:px-6">
          <Select
            value={loanFilter}
            onValueChange={(v) => setLoanFilter(v ?? "all")}
          >
            <SelectTrigger aria-label="Filter by loan" className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All loans</SelectItem>
              {LOANS.map((loan) => (
                <SelectItem key={loan} value={loan}>
                  {loan}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {visible.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No disbursements</EmptyTitle>
              <EmptyDescription>
                Schedule a tranche against an approved loan.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <DataTable
            disbursements={visible}
            onEdit={(disbursement) => {
              setEditing(disbursement)
              setFormOpen(true)
            }}
            onSettle={settle}
            onDelete={setDeleting}
          />
        )}
      </div>

      <DisbursementDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        editing={editing}
        disbursements={disbursements}
        onSubmit={save}
      />

      <AlertDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete disbursement</AlertDialogTitle>
            <AlertDialogDescription>
              Delete the{" "}
              <span className="font-medium">
                {deleting && formatCurrency(deleting.amount)}
              </span>{" "}
              tranche on {deleting?.loan}? This action can&apos;t be undone.
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
