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
  ACCOUNTS,
  TIERS,
  formatCurrency,
  health,
  totalArr,
  type Account,
  type AccountDraft,
  type AccountTier,
} from "./data"
import { DataTable } from "./components/data-table"
import { AccountDialog } from "./components/account-dialog"

export function Accounts() {
  const [accounts, setAccounts] = React.useState<Account[]>(ACCOUNTS)
  const [formOpen, setFormOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<Account | null>(null)
  const [deleting, setDeleting] = React.useState<Account | null>(null)
  const [tierFilter, setTierFilter] = React.useState<AccountTier | "all">("all")

  const visible =
    tierFilter === "all" ? accounts : accounts.filter((a) => a.tier === tierFilter)

  const atRisk = accounts.filter((a) => health(a) === "at-risk").length

  function save(draft: AccountDraft) {
    if (editing) {
      setAccounts((prev) =>
        prev.map((a) => (a.id === editing.id ? { ...a, ...draft } : a))
      )
    } else {
      setAccounts((prev) => [
        ...prev,
        { ...draft, id: crypto.randomUUID(), openDeals: 0 },
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
      title="Accounts"
      subtitle={`${accounts.length} accounts · ${formatCurrency(totalArr(accounts))} ARR · ${atRisk} at risk`}
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
          New account
        </Button>
      }
    >
      <div className="flex h-full flex-col">
        <div className="border-b px-4 py-3 @sm:px-6">
          <Select
            value={tierFilter}
            onValueChange={(v) => setTierFilter((v as AccountTier | "all") ?? "all")}
          >
            <SelectTrigger aria-label="Filter by tier" className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All tiers</SelectItem>
              {TIERS.map((tier) => (
                <SelectItem key={tier} value={tier}>
                  {tier}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {visible.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No accounts</EmptyTitle>
              <EmptyDescription>
                No {tierFilter === "all" ? "" : `${tierFilter} `}accounts to show.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <DataTable
            accounts={visible}
            onEdit={(account) => {
              setEditing(account)
              setFormOpen(true)
            }}
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
              Delete <span className="font-medium">{deleting?.name}</span>? Its
              contacts stay, unlinked. This action can&apos;t be undone.
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
