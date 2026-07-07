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
import { ACCOUNTS, type Account, type AccountDraft } from "./data"
import { DataTable } from "./components/data-table"
import { AccountDialog } from "./components/account-dialog"

export function ChartOfAccounts() {
  const [accounts, setAccounts] = React.useState<Account[]>(ACCOUNTS)
  const [formOpen, setFormOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<Account | null>(null)
  const [deleting, setDeleting] = React.useState<Account | null>(null)

  function openCreate() {
    setEditing(null)
    setFormOpen(true)
  }

  function openEdit(account: Account) {
    setEditing(account)
    setFormOpen(true)
  }

  function save(draft: AccountDraft) {
    if (editing) {
      setAccounts((prev) =>
        prev.map((a) => (a.id === editing.id ? { ...a, ...draft } : a))
      )
    } else {
      setAccounts((prev) => [
        ...prev,
        { ...draft, id: crypto.randomUUID(), balance: 0 },
      ])
    }
  }

  function confirmDelete() {
    if (!deleting) return
    setAccounts((prev) => prev.filter((a) => a.id !== deleting.id))
    setDeleting(null)
  }

  return (
    <Page
      title="Chart of accounts"
      subtitle={`${accounts.length} accounts`}
      className="@container overflow-hidden"
      actions={
        <Button size="sm" onClick={openCreate}>
          <PlusIcon data-icon="inline-start" />
          New account
        </Button>
      }
    >
      <div className="flex h-full flex-col">
        {accounts.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No accounts</EmptyTitle>
              <EmptyDescription>
                Create an account to get started.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <DataTable
            accounts={accounts}
            onEdit={openEdit}
            onDelete={setDeleting}
          />
        )}
      </div>

      <AccountDialog
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
            <AlertDialogTitle>Delete account</AlertDialogTitle>
            <AlertDialogDescription>
              Delete <span className="font-medium">{deleting?.name}</span>?
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
