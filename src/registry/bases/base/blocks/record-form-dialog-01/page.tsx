"use client"

import * as React from "react"
import { PlusIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { Page } from "@/registry/bases/base/workspaceui/page"
import {
  CONTACTS,
  initials,
  type Contact,
  type ContactDraft,
} from "./data"
import { ContactDialog } from "./components/contact-dialog"

export function RecordFormDialog01() {
  const [contacts, setContacts] = React.useState<Contact[]>(CONTACTS)
  const [formOpen, setFormOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<Contact | null>(null)

  function openCreate() {
    setEditing(null)
    setFormOpen(true)
  }

  function openEdit(contact: Contact) {
    setEditing(contact)
    setFormOpen(true)
  }

  function save(draft: ContactDraft) {
    if (editing) {
      setContacts((prev) =>
        prev.map((c) => (c.id === editing.id ? { ...c, ...draft } : c))
      )
    } else {
      setContacts((prev) => [...prev, { ...draft, id: crypto.randomUUID() }])
    }
  }

  return (
    <Page
      title="Contacts"
      subtitle={`${contacts.length} contacts`}
      className="@container overflow-hidden"
      hasPadding
      actions={
        <Button size="sm" onClick={openCreate}>
          <PlusIcon data-icon="inline-start" />
          New contact
        </Button>
      }
    >
      {contacts.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No contacts</EmptyTitle>
            <EmptyDescription>
              Create a contact to get started.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <ul className="flex flex-col gap-2">
          {contacts.map((c) => (
            <li
              key={c.id}
              className="flex items-center gap-3 rounded-md border p-3"
            >
              <Avatar className="size-9 shrink-0">
                <AvatarFallback>{initials(c.name)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-medium">
                    {c.name}
                  </span>
                  <Badge
                    variant={c.status === "active" ? "secondary" : "outline"}
                    className="capitalize"
                  >
                    {c.status}
                  </Badge>
                </div>
                <p className="truncate text-xs text-muted-foreground">
                  {c.email} · {c.company}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => openEdit(c)}>
                Edit
              </Button>
            </li>
          ))}
        </ul>
      )}

      <ContactDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        editing={editing}
        onSubmit={save}
      />
    </Page>
  )
}
