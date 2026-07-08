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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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
  CONTACTS,
  accountsWithoutPrimary,
  setPrimary,
  type Contact,
  type ContactDraft,
} from "./data"
import { DataTable } from "./components/data-table"
import { ContactDialog } from "./components/contact-dialog"

export function Contacts() {
  const [contacts, setContacts] = React.useState<Contact[]>(CONTACTS)
  const [formOpen, setFormOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<Contact | null>(null)
  const [deleting, setDeleting] = React.useState<Contact | null>(null)
  const [query, setQuery] = React.useState("")

  const q = query.trim().toLowerCase()
  const visible = q
    ? contacts.filter((c) =>
        [c.name, c.account, c.email, c.title].some((field) =>
          field.toLowerCase().includes(q)
        )
      )
    : contacts

  const orphanedAccounts = accountsWithoutPrimary(contacts)

  function save(draft: ContactDraft) {
    if (editing) {
      setContacts((prev) =>
        prev.map((c) => (c.id === editing.id ? { ...c, ...draft } : c))
      )
    } else {
      setContacts((prev) => [...prev, { ...draft, id: crypto.randomUUID() }])
    }
  }

  function confirmDelete() {
    if (!deleting) return
    setContacts((prev) => prev.filter((c) => c.id !== deleting.id))
    setDeleting(null)
  }

  return (
    <Page
      title="Contacts"
      subtitle={`${contacts.length} contacts`}
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
          New contact
        </Button>
      }
    >
      <div className="flex h-full flex-col">
        <div className="flex flex-col gap-3 border-b px-4 py-3 @sm:px-6">
          <InputGroup>
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search contacts"
              aria-label="Search contacts"
            />
          </InputGroup>

          {orphanedAccounts.length > 0 && (
            <Alert>
              <AlertTitle>No primary contact</AlertTitle>
              <AlertDescription>
                {orphanedAccounts.join(", ")} has no primary contact.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {visible.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No contacts found</EmptyTitle>
              <EmptyDescription>
                Nothing matches &ldquo;{query}&rdquo;.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <DataTable
            contacts={visible}
            onEdit={(contact) => {
              setEditing(contact)
              setFormOpen(true)
            }}
            onSetPrimary={(contact) =>
              setContacts((prev) => setPrimary(prev, contact.id))
            }
            onDelete={setDeleting}
          />
        )}
      </div>

      <ContactDialog
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
            <AlertDialogTitle>Delete contact</AlertDialogTitle>
            <AlertDialogDescription>
              Delete <span className="font-medium">{deleting?.name}</span>? This
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
