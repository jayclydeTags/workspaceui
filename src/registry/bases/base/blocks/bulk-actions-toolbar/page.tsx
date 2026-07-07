"use client"

import * as React from "react"
import { DownloadIcon, Trash2Icon } from "lucide-react"

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
import { Checkbox } from "@/components/ui/checkbox"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { Page } from "@/registry/bases/base/workspaceui/page"
import { DOCUMENTS, type Document } from "./data"
import { BulkToolbar } from "./components/bulk-toolbar"

export function BulkActionsToolbar() {
  const [docs, setDocs] = React.useState<Document[]>(DOCUMENTS)
  const [selected, setSelected] = React.useState<Set<string>>(new Set())
  const [confirmDelete, setConfirmDelete] = React.useState(false)

  const allSelected = docs.length > 0 && selected.size === docs.length
  const someSelected = selected.size > 0 && !allSelected

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(docs.map((d) => d.id)))
  }

  function deleteSelected() {
    setDocs((prev) => prev.filter((d) => !selected.has(d.id)))
    setSelected(new Set())
    setConfirmDelete(false)
  }

  return (
    <Page title="Documents" subtitle={`${docs.length} files`} hasPadding>
      <div className="flex flex-col gap-3">
        <BulkToolbar count={selected.size} onClear={() => setSelected(new Set())}>
          <Button variant="outline" size="sm">
            <DownloadIcon data-icon="inline-start" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setConfirmDelete(true)}
          >
            <Trash2Icon data-icon="inline-start" />
            Delete
          </Button>
        </BulkToolbar>

        {docs.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No documents</EmptyTitle>
              <EmptyDescription>You deleted all of them.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="rounded-md border">
            <div className="flex items-center gap-3 border-b px-4 py-2.5 text-sm font-medium">
              <Checkbox
                checked={allSelected}
                indeterminate={someSelected}
                onCheckedChange={toggleAll}
                aria-label="Select all"
              />
              Name
            </div>
            <ul className="divide-y divide-border">
              {docs.map((doc) => (
                <li key={doc.id} className="flex items-center gap-3 px-4 py-3">
                  <Checkbox
                    checked={selected.has(doc.id)}
                    onCheckedChange={() => toggle(doc.id)}
                    aria-label={`Select ${doc.name}`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{doc.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {doc.owner} · {doc.size}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selected.size} documents</AlertDialogTitle>
            <AlertDialogDescription>
              These files will be permanently deleted. This can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={deleteSelected}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Page>
  )
}
