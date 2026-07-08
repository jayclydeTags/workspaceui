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
import {
  MEMBERS,
  isLastLead,
  totalAllocation,
  type Member,
  type MemberDraft,
} from "./data"
import { DataTable } from "./components/data-table"
import { MemberDialog } from "./components/member-dialog"

export function ProjectTeam() {
  const [members, setMembers] = React.useState<Member[]>(MEMBERS)
  const [formOpen, setFormOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<Member | null>(null)
  const [removing, setRemoving] = React.useState<Member | null>(null)

  function save(draft: MemberDraft) {
    if (editing) {
      setMembers((prev) =>
        prev.map((m) => (m.id === editing.id ? { ...m, ...draft } : m))
      )
    } else {
      setMembers((prev) => [...prev, { ...draft, id: crypto.randomUUID() }])
    }
  }

  function confirmRemove() {
    if (!removing) return
    setMembers((prev) => prev.filter((m) => m.id !== removing.id))
    setRemoving(null)
  }

  return (
    <Page
      title="Team"
      subtitle={`${members.length} members · ${totalAllocation(members)}h / week allocated`}
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
          Add member
        </Button>
      }
    >
      <div className="flex h-full flex-col">
        {members.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No team members</EmptyTitle>
              <EmptyDescription>
                Add someone to assign work to them.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <DataTable
            members={members}
            onEdit={(member) => {
              setEditing(member)
              setFormOpen(true)
            }}
            onRemove={setRemoving}
          />
        )}
      </div>

      <MemberDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        editing={editing}
        lockRole={editing !== null && isLastLead(members, editing)}
        onSubmit={save}
      />

      <AlertDialog
        open={removing !== null}
        onOpenChange={(open) => !open && setRemoving(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove member</AlertDialogTitle>
            <AlertDialogDescription>
              Remove <span className="font-medium">{removing?.name}</span> from
              the team? Their assignments stay, unassigned.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmRemove}>
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Page>
  )
}
