import { MoreHorizontalIcon, StarIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { RATING_LABELS, type Rating, type Review, type ReviewStatus } from "../data"

const STATUS_VARIANT: Record<ReviewStatus, "default" | "secondary" | "outline"> =
  {
    completed: "default",
    "in-review": "secondary",
    draft: "outline",
  }

interface RowProps {
  review: Review
  onEdit: (review: Review) => void
  onDelete: (review: Review) => void
}

function RowActions({ review, onEdit, onDelete }: RowProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Actions for ${review.employee}`}
          >
            <MoreHorizontalIcon />
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(review)}>Edit</DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onClick={() => onDelete(review)}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function StatusBadge({ status }: { status: ReviewStatus }) {
  return <Badge variant={STATUS_VARIANT[status]}>{status}</Badge>
}

export function Stars({ rating }: { rating: Rating }) {
  if (rating === 0) return <span className="text-muted-foreground">Unrated</span>
  return (
    <span
      role="img"
      className="flex items-center gap-0.5"
      aria-label={`${rating} of 5 — ${RATING_LABELS[rating]}`}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <StarIcon
          key={n}
          aria-hidden
          className={cn(
            "size-3.5",
            n <= rating ? "fill-current" : "text-muted-foreground/30"
          )}
        />
      ))}
    </span>
  )
}

export function DataTable({
  reviews,
  onEdit,
  onDelete,
}: {
  reviews: Review[]
  onEdit: (review: Review) => void
  onDelete: (review: Review) => void
}) {
  return (
    <>
      {/* Table — wide pane (≥ @sm) */}
      <div className="hidden flex-1 overflow-auto @sm:block">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow>
              <TableHead className="px-6">Employee</TableHead>
              <TableHead className="hidden @md:table-cell">Reviewer</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-0 pr-6" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell className="px-6 font-medium">
                  {review.employee}
                </TableCell>
                <TableCell className="hidden text-muted-foreground @md:table-cell">
                  {review.reviewer}
                </TableCell>
                <TableCell>{review.period}</TableCell>
                <TableCell>
                  <Stars rating={review.rating} />
                </TableCell>
                <TableCell>
                  <StatusBadge status={review.status} />
                </TableCell>
                <TableCell className="pr-6">
                  <RowActions
                    review={review}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Card list — narrow pane (< @sm) */}
      <ul className="flex-1 divide-y divide-border overflow-auto @sm:hidden">
        {reviews.map((review) => (
          <li key={review.id} className="flex items-start gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-medium">
                  {review.employee}
                </span>
                <Badge variant="outline" className="text-[10px]">
                  {review.period}
                </Badge>
              </div>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                Reviewed by {review.reviewer}
              </p>
              <div className="mt-1.5 flex items-center gap-2">
                <StatusBadge status={review.status} />
                <Stars rating={review.rating} />
              </div>
            </div>
            <RowActions review={review} onEdit={onEdit} onDelete={onDelete} />
          </li>
        ))}
      </ul>
    </>
  )
}
