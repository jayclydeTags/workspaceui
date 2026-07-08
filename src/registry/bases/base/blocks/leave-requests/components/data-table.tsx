import { MoreHorizontalIcon } from "lucide-react"

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
import { dayCount, type LeaveRequest, type LeaveStatus } from "../data"

const STATUS_VARIANT: Record<
  LeaveStatus,
  "default" | "secondary" | "destructive"
> = {
  approved: "default",
  pending: "secondary",
  rejected: "destructive",
}

interface RowProps {
  request: LeaveRequest
  onDecide: (request: LeaveRequest, status: LeaveStatus) => void
  onDelete: (request: LeaveRequest) => void
}

function RowActions({ request, onDecide, onDelete }: RowProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Actions for ${request.employee}`}
          >
            <MoreHorizontalIcon />
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        {request.status === "pending" && (
          <>
            <DropdownMenuItem onClick={() => onDecide(request, "approved")}>
              Approve
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDecide(request, "rejected")}>
              Reject
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuItem variant="destructive" onClick={() => onDelete(request)}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function StatusBadge({ status }: { status: LeaveStatus }) {
  return (
    <Badge variant={STATUS_VARIANT[status]} className="capitalize">
      {status}
    </Badge>
  )
}

/** "Jul 13 – Jul 17 · 5 days" */
function Dates({ request }: { request: LeaveRequest }) {
  const days = dayCount(request.start, request.end)
  return (
    <span>
      {request.start} – {request.end} · {days} {days === 1 ? "day" : "days"}
    </span>
  )
}

export function DataTable({
  requests,
  onDecide,
  onDelete,
}: {
  requests: LeaveRequest[]
  onDecide: (request: LeaveRequest, status: LeaveStatus) => void
  onDelete: (request: LeaveRequest) => void
}) {
  return (
    <>
      {/* Table — wide pane (≥ @sm) */}
      <div className="hidden flex-1 overflow-auto @sm:block">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow>
              <TableHead className="px-6">Employee</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead className="hidden @md:table-cell">Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-0 pr-6" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="px-6 font-medium">
                  {request.employee}
                </TableCell>
                <TableCell className="capitalize text-muted-foreground">
                  {request.type}
                </TableCell>
                <TableCell className="tabular-nums">
                  <Dates request={request} />
                </TableCell>
                <TableCell className="hidden max-w-48 truncate @md:table-cell">
                  {request.reason}
                </TableCell>
                <TableCell>
                  <StatusBadge status={request.status} />
                </TableCell>
                <TableCell className="pr-6">
                  <RowActions
                    request={request}
                    onDecide={onDecide}
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
        {requests.map((request) => (
          <li key={request.id} className="flex items-start gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-medium">
                  {request.employee}
                </span>
                <Badge variant="outline" className="text-[10px] capitalize">
                  {request.type}
                </Badge>
              </div>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                <Dates request={request} />
              </p>
              <div className="mt-1.5">
                <StatusBadge status={request.status} />
              </div>
            </div>
            <RowActions
              request={request}
              onDecide={onDecide}
              onDelete={onDelete}
            />
          </li>
        ))}
      </ul>
    </>
  )
}
