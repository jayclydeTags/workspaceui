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
  LEADS,
  LEAD_STAGES,
  isHot,
  qualificationRate,
  type Lead,
  type LeadDraft,
  type LeadStage,
} from "./data"
import { DataTable } from "./components/data-table"
import { LeadDialog } from "./components/lead-dialog"

export function Leads() {
  const [leads, setLeads] = React.useState<Lead[]>(LEADS)
  const [formOpen, setFormOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<Lead | null>(null)
  const [deleting, setDeleting] = React.useState<Lead | null>(null)
  const [converting, setConverting] = React.useState<Lead | null>(null)
  const [stageFilter, setStageFilter] = React.useState<LeadStage | "all">("all")

  const visible =
    stageFilter === "all" ? leads : leads.filter((l) => l.stage === stageFilter)

  function save(draft: LeadDraft) {
    if (editing) {
      setLeads((prev) =>
        prev.map((l) => (l.id === editing.id ? { ...l, ...draft } : l))
      )
    } else {
      setLeads((prev) => [{ ...draft, id: crypto.randomUUID() }, ...prev])
    }
  }

  // ponytail: converting just drops the lead from the pipeline — the account
  // and contact it becomes live in their own blocks.
  function confirmConvert() {
    if (!converting) return
    setLeads((prev) => prev.filter((l) => l.id !== converting.id))
    setConverting(null)
  }

  function confirmDelete() {
    if (!deleting) return
    setLeads((prev) => prev.filter((l) => l.id !== deleting.id))
    setDeleting(null)
  }

  const hot = leads.filter(isHot).length

  return (
    <Page
      title="Leads"
      subtitle={`${leads.length} leads · ${hot} hot · ${qualificationRate(leads)}% qualified`}
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
          New lead
        </Button>
      }
    >
      <div className="flex h-full flex-col">
        <div className="border-b px-4 py-3 @sm:px-6">
          <Select
            value={stageFilter}
            onValueChange={(v) => setStageFilter((v as LeadStage | "all") ?? "all")}
          >
            <SelectTrigger aria-label="Filter by stage" className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All stages</SelectItem>
              {LEAD_STAGES.map((stage) => (
                <SelectItem key={stage} value={stage}>
                  {stage}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {visible.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No leads</EmptyTitle>
              <EmptyDescription>
                No {stageFilter === "all" ? "" : `${stageFilter} `}leads to show.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <DataTable
            leads={visible}
            onEdit={(lead) => {
              setEditing(lead)
              setFormOpen(true)
            }}
            onConvert={setConverting}
            onDelete={setDeleting}
          />
        )}
      </div>

      <LeadDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        editing={editing}
        onSubmit={save}
      />

      <AlertDialog
        open={converting !== null}
        onOpenChange={(open) => !open && setConverting(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Convert lead</AlertDialogTitle>
            <AlertDialogDescription>
              Convert <span className="font-medium">{converting?.name}</span> into
              an account and contact? The lead leaves the pipeline.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmConvert}>Convert</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete lead</AlertDialogTitle>
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
