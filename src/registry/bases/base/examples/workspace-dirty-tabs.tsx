"use client"

import * as React from "react"
import { FileText } from "lucide-react"

import { Textarea } from "@/components/ui/textarea"
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
import {
  Workspace,
  type WorkspaceHandle,
} from "@/registry/bases/base/workspaceui/workspace"

const INITIAL_TEXT: Record<string, string> = {
  draft: "Type here — the tab's close button becomes a dot.",
  notes: "This one is clean. Its ✕ closes without a prompt.",
}

export function WorkspaceDirtyTabsDemo() {
  const workspace = React.useRef<WorkspaceHandle>(null)
  const [text, setText] = React.useState(INITIAL_TEXT)

  // The guard is async, so it parks a resolver here and opens the dialog. The
  // dialog's buttons settle it — that's what un-blocks the pending close.
  const decision = React.useRef<((discard: boolean) => void) | null>(null)
  const [pendingTitle, setPendingTitle] = React.useState<string | null>(null)

  const settle = (discard: boolean) => {
    decision.current?.(discard)
    decision.current = null
    setPendingTitle(null)
  }

  return (
    <>
      <div className="h-[320px] w-full overflow-hidden rounded-lg border border-border shadow-sm">
        <Workspace
          ref={workspace}
          initialPanes={[
            {
              id: "main",
              tabs: [
                { id: "draft", title: "draft.md", icon: <FileText className="size-3.5" /> },
                { id: "notes", title: "notes.md", icon: <FileText className="size-3.5" /> },
              ],
            },
          ]}
          onBeforeCloseTab={(_paneId, _tabId, tab) => {
            if (!tab.dirty) return true
            setPendingTitle(tab.title)
            return new Promise<boolean>((resolve) => {
              decision.current = resolve
            })
          }}
          renderTabContent={(paneId, tabId) => (
            <Textarea
              value={text[tabId] ?? ""}
              onChange={(e) => {
                setText((prev) => ({ ...prev, [tabId]: e.target.value }))
                workspace.current?.updateTab(paneId, tabId, { dirty: true })
              }}
              className="h-full resize-none rounded-none border-0 font-mono text-sm focus-visible:ring-0"
            />
          )}
        />
      </div>

      {/* Dismissing any other way (Escape) must still settle the promise,
          or the pending close would hang forever. */}
      <AlertDialog
        open={pendingTitle !== null}
        onOpenChange={(open) => {
          if (!open) settle(false)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard changes to {pendingTitle}?</AlertDialogTitle>
            <AlertDialogDescription>
              This tab has unsaved changes. Closing it will lose them.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => settle(false)}>Keep editing</AlertDialogCancel>
            <AlertDialogAction onClick={() => settle(true)}>Discard</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
