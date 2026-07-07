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
import { Page } from "@/registry/bases/base/workspaceui/page"
import { PAYMENTS, type Payment, type PaymentDraft } from "./data"
import { DataTable } from "./components/data-table"
import { PaymentDialog } from "./components/payment-dialog"

export function Payments() {
  const [payments, setPayments] = React.useState<Payment[]>(PAYMENTS)
  const [formOpen, setFormOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<Payment | null>(null)
  const [deleting, setDeleting] = React.useState<Payment | null>(null)

  function openCreate() {
    setEditing(null)
    setFormOpen(true)
  }

  function openEdit(payment: Payment) {
    setEditing(payment)
    setFormOpen(true)
  }

  function save(draft: PaymentDraft) {
    if (editing) {
      setPayments((prev) =>
        prev.map((p) => (p.id === editing.id ? { ...p, ...draft } : p))
      )
    } else {
      setPayments((prev) => [...prev, { ...draft, id: crypto.randomUUID() }])
    }
  }

  function confirmDelete() {
    if (!deleting) return
    setPayments((prev) => prev.filter((p) => p.id !== deleting.id))
    setDeleting(null)
  }

  return (
    <Page
      title="Payments"
      subtitle={`${payments.length} payments`}
      className="@container overflow-hidden"
      actions={
        <Button size="sm" onClick={openCreate}>
          <PlusIcon data-icon="inline-start" />
          New payment
        </Button>
      }
    >
      <div className="flex h-full flex-col">
        {payments.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No payments</EmptyTitle>
              <EmptyDescription>
                Record a payment to get started.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <DataTable
            payments={payments}
            onEdit={openEdit}
            onDelete={setDeleting}
          />
        )}
      </div>

      <PaymentDialog
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
            <AlertDialogTitle>Delete payment</AlertDialogTitle>
            <AlertDialogDescription>
              Delete{" "}
              <span className="font-medium">{deleting?.reference}</span>?
              This action can&apos;t be undone.
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
