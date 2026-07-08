"use client"

import * as React from "react"
import { PlusIcon, SearchIcon } from "lucide-react"

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
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Page } from "@/registry/bases/base/workspaceui/page"
import {
  BORROWERS,
  canBorrow,
  formatCurrency,
  totalOutstanding,
  type Borrower,
  type BorrowerDraft,
} from "./data"
import { DataTable } from "./components/data-table"
import { BorrowerDialog } from "./components/borrower-dialog"

export function Borrowers() {
  const [borrowers, setBorrowers] = React.useState<Borrower[]>(BORROWERS)
  const [formOpen, setFormOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<Borrower | null>(null)
  const [deleting, setDeleting] = React.useState<Borrower | null>(null)
  const [query, setQuery] = React.useState("")

  const q = query.trim().toLowerCase()
  const visible = q
    ? borrowers.filter((b) =>
        [b.name, b.email, b.phone].some((field) => field.toLowerCase().includes(q))
      )
    : borrowers

  const eligible = borrowers.filter(canBorrow).length

  function save(draft: BorrowerDraft) {
    if (editing) {
      setBorrowers((prev) =>
        prev.map((b) => (b.id === editing.id ? { ...b, ...draft } : b))
      )
    } else {
      setBorrowers((prev) => [
        ...prev,
        { ...draft, id: crypto.randomUUID(), activeLoans: 0, outstanding: 0 },
      ])
    }
  }

  function confirmDelete() {
    if (!deleting) return
    setBorrowers((prev) => prev.filter((b) => b.id !== deleting.id))
    setDeleting(null)
  }

  return (
    <Page
      title="Borrowers"
      subtitle={`${borrowers.length} borrowers · ${eligible} eligible · ${formatCurrency(totalOutstanding(borrowers))} outstanding`}
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
          New borrower
        </Button>
      }
    >
      <div className="flex h-full flex-col">
        <div className="border-b px-4 py-3 @sm:px-6">
          <InputGroup>
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search borrowers"
              aria-label="Search borrowers"
            />
          </InputGroup>
        </div>

        {visible.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No borrowers found</EmptyTitle>
              <EmptyDescription>
                Nothing matches &ldquo;{query}&rdquo;.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <DataTable
            borrowers={visible}
            onEdit={(borrower) => {
              setEditing(borrower)
              setFormOpen(true)
            }}
            onVerify={(borrower) =>
              setBorrowers((prev) =>
                prev.map((b) =>
                  b.id === borrower.id ? { ...b, kyc: "verified" } : b
                )
              )
            }
            onDelete={setDeleting}
          />
        )}
      </div>

      <BorrowerDialog
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
            <AlertDialogTitle>Delete borrower</AlertDialogTitle>
            <AlertDialogDescription>
              Delete <span className="font-medium">{deleting?.name}</span>? Their
              closed loans stay on file. This action can&apos;t be undone.
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
