"use client"

import * as React from "react"
import { PlusIcon } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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
  COLLATERAL,
  LOANS,
  formatCurrency,
  isUnderSecured,
  securedValue,
  type Collateral,
  type CollateralDraft,
  type LienStatus,
} from "./data"
import { DataTable } from "./components/data-table"
import { CollateralDialog } from "./components/collateral-dialog"

export function CollateralRegister() {
  const [items, setItems] = React.useState<Collateral[]>(COLLATERAL)
  const [formOpen, setFormOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<Collateral | null>(null)
  const [deleting, setDeleting] = React.useState<Collateral | null>(null)
  const [loanFilter, setLoanFilter] = React.useState("all")

  const visible =
    loanFilter === "all" ? items : items.filter((c) => c.loan === loanFilter)

  const underSecured = LOANS.filter((loan) => isUnderSecured(items, loan))
  const totalSecured = LOANS.reduce(
    (sum, loan) => sum + securedValue(items, loan),
    0
  )

  function save(draft: CollateralDraft) {
    if (editing) {
      setItems((prev) =>
        prev.map((c) => (c.id === editing.id ? { ...c, ...draft } : c))
      )
    } else {
      setItems((prev) => [
        ...prev,
        { ...draft, id: crypto.randomUUID(), lien: "pending" },
      ])
    }
  }

  function setLien(item: Collateral, lien: LienStatus) {
    setItems((prev) => prev.map((c) => (c.id === item.id ? { ...c, lien } : c)))
  }

  function confirmDelete() {
    if (!deleting) return
    setItems((prev) => prev.filter((c) => c.id !== deleting.id))
    setDeleting(null)
  }

  return (
    <Page
      title="Collateral"
      subtitle={`${items.length} assets · ${formatCurrency(totalSecured)} lendable security`}
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
          Pledge collateral
        </Button>
      }
    >
      <div className="flex h-full flex-col">
        <div className="flex flex-col gap-3 border-b px-4 py-3 @sm:px-6">
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

          {underSecured.length > 0 && (
            <Alert>
              <AlertTitle>Under-secured</AlertTitle>
              <AlertDescription>
                {underSecured.join(", ")} owes more than its lendable security.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {visible.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No collateral</EmptyTitle>
              <EmptyDescription>
                Pledge an asset against a loan to secure it.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <DataTable
            items={visible}
            onEdit={(item) => {
              setEditing(item)
              setFormOpen(true)
            }}
            onSetLien={setLien}
            onDelete={setDeleting}
          />
        )}
      </div>

      <CollateralDialog
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
            <AlertDialogTitle>Delete collateral</AlertDialogTitle>
            <AlertDialogDescription>
              Remove <span className="font-medium">{deleting?.description}</span> from{" "}
              {deleting?.loan}? The loan may fall under-secured.
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
