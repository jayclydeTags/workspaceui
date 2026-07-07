"use client"

import * as React from "react"
import { Trash2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { Page } from "@/registry/bases/base/workspaceui/page"
import { ConfirmDialog } from "./components/confirm-dialog"

interface ApiKey {
  id: string
  name: string
}

const INITIAL_KEYS: ApiKey[] = [
  { id: "1", name: "Production" },
  { id: "2", name: "Staging" },
  { id: "3", name: "CI pipeline" },
]

export function ConfirmDialogDemo() {
  const [keys, setKeys] = React.useState<ApiKey[]>(INITIAL_KEYS)
  const [deleting, setDeleting] = React.useState<ApiKey | null>(null)

  function remove() {
    if (!deleting) return
    setKeys((prev) => prev.filter((k) => k.id !== deleting.id))
  }

  return (
    <Page title="API keys" subtitle={`${keys.length} keys`} hasPadding>
      {keys.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No API keys</EmptyTitle>
            <EmptyDescription>You revoked all of them.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <ul className="divide-y divide-border rounded-md border">
          {keys.map((key) => (
            <li
              key={key.id}
              className="flex items-center justify-between gap-3 px-4 py-3"
            >
              <span className="text-sm font-medium">{key.name}</span>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Revoke ${key.name}`}
                onClick={() => setDeleting(key)}
              >
                <Trash2Icon />
              </Button>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Revoke API key"
        description={
          <>
            Revoke <span className="font-medium">{deleting?.name}</span>? Any
            services using it will stop working immediately. This can&apos;t be
            undone.
          </>
        }
        confirmLabel="Revoke"
        onConfirm={remove}
      />
    </Page>
  )
}
