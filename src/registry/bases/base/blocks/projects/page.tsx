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
  PROJECTS,
  PROJECT_STATUSES,
  activeCount,
  type Project,
  type ProjectDraft,
  type ProjectStatus,
} from "./data"
import { DataTable } from "./components/data-table"
import { ProjectDialog } from "./components/project-dialog"

export function Projects() {
  const [projects, setProjects] = React.useState<Project[]>(PROJECTS)
  const [formOpen, setFormOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<Project | null>(null)
  const [deleting, setDeleting] = React.useState<Project | null>(null)
  const [statusFilter, setStatusFilter] = React.useState<ProjectStatus | "all">(
    "all"
  )

  const visible =
    statusFilter === "all"
      ? projects
      : projects.filter((p) => p.status === statusFilter)

  function openCreate() {
    setEditing(null)
    setFormOpen(true)
  }

  function save(draft: ProjectDraft) {
    if (editing) {
      setProjects((prev) =>
        prev.map((p) => (p.id === editing.id ? { ...p, ...draft } : p))
      )
    } else {
      setProjects((prev) => [...prev, { ...draft, id: crypto.randomUUID() }])
    }
  }

  function confirmDelete() {
    if (!deleting) return
    setProjects((prev) => prev.filter((p) => p.id !== deleting.id))
    setDeleting(null)
  }

  return (
    <Page
      title="Projects"
      subtitle={`${projects.length} projects · ${activeCount(projects)} active`}
      className="@container overflow-hidden"
      actions={
        <Button size="sm" onClick={openCreate}>
          <PlusIcon data-icon="inline-start" />
          New project
        </Button>
      }
    >
      <div className="flex h-full flex-col">
        <div className="border-b px-4 py-3 @sm:px-6">
          <Select
            value={statusFilter}
            onValueChange={(v) =>
              setStatusFilter((v as ProjectStatus | "all") ?? "all")
            }
          >
            <SelectTrigger aria-label="Filter by status" className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {PROJECT_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {visible.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No projects</EmptyTitle>
              <EmptyDescription>
                No {statusFilter === "all" ? "" : `${statusFilter} `}projects to
                show.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <DataTable
            projects={visible}
            onEdit={(project) => {
              setEditing(project)
              setFormOpen(true)
            }}
            onDelete={setDeleting}
          />
        )}
      </div>

      <ProjectDialog
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
            <AlertDialogTitle>Delete project</AlertDialogTitle>
            <AlertDialogDescription>
              Delete <span className="font-medium">{deleting?.code}</span>? This
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
