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
  REVIEWS,
  REVIEW_STATUSES,
  averageRating,
  type Review,
  type ReviewDraft,
  type ReviewStatus,
} from "./data"
import { DataTable } from "./components/data-table"
import { ReviewDialog } from "./components/review-dialog"

export function PerformanceReviews() {
  const [reviews, setReviews] = React.useState<Review[]>(REVIEWS)
  const [formOpen, setFormOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<Review | null>(null)
  const [deleting, setDeleting] = React.useState<Review | null>(null)
  const [statusFilter, setStatusFilter] = React.useState<ReviewStatus | "all">(
    "all"
  )

  const visible =
    statusFilter === "all"
      ? reviews
      : reviews.filter((r) => r.status === statusFilter)

  const avg = averageRating(reviews)

  function openCreate() {
    setEditing(null)
    setFormOpen(true)
  }

  function save(draft: ReviewDraft) {
    if (editing) {
      setReviews((prev) =>
        prev.map((r) => (r.id === editing.id ? { ...r, ...draft } : r))
      )
    } else {
      setReviews((prev) => [{ ...draft, id: crypto.randomUUID() }, ...prev])
    }
  }

  function confirmDelete() {
    if (!deleting) return
    setReviews((prev) => prev.filter((r) => r.id !== deleting.id))
    setDeleting(null)
  }

  return (
    <Page
      title="Performance reviews"
      subtitle={`${reviews.length} reviews · avg ${avg || "—"}`}
      className="@container overflow-hidden"
      actions={
        <Button size="sm" onClick={openCreate}>
          <PlusIcon data-icon="inline-start" />
          New review
        </Button>
      }
    >
      <div className="flex h-full flex-col">
        <div className="border-b px-4 py-3 @sm:px-6">
          <Select
            value={statusFilter}
            onValueChange={(v) =>
              setStatusFilter((v as ReviewStatus | "all") ?? "all")
            }
          >
            <SelectTrigger aria-label="Filter by status" className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {REVIEW_STATUSES.map((status) => (
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
              <EmptyTitle>No performance reviews</EmptyTitle>
              <EmptyDescription>
                No {statusFilter === "all" ? "" : `${statusFilter} `}reviews to
                show.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <DataTable
            reviews={visible}
            onEdit={(review) => {
              setEditing(review)
              setFormOpen(true)
            }}
            onDelete={setDeleting}
          />
        )}
      </div>

      <ReviewDialog
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
            <AlertDialogTitle>Delete review</AlertDialogTitle>
            <AlertDialogDescription>
              Delete <span className="font-medium">{deleting?.employee}</span>
              &apos;s {deleting?.period} review? This action can&apos;t be
              undone.
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
