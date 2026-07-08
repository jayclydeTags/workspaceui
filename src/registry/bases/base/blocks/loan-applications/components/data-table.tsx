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
import {
  MAX_DTI,
  dti,
  formatCurrency,
  isApprovable,
  monthlyPayment,
  type LoanApplication,
  type LoanStatus,
} from "../data"

const STATUS_VARIANT: Record<
  LoanStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  approved: "default",
  "under-review": "secondary",
  submitted: "secondary",
  draft: "outline",
  rejected: "destructive",
}

interface RowProps {
  application: LoanApplication
  onEdit: (application: LoanApplication) => void
  onDecide: (application: LoanApplication, status: LoanStatus) => void
  onDelete: (application: LoanApplication) => void
}

/** Approve is gated on the DTI ceiling; a decided application is read-only. */
function RowActions({ application, onEdit, onDecide, onDelete }: RowProps) {
  const decided =
    application.status === "approved" || application.status === "rejected"
  const approvable = isApprovable(application)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Actions for ${application.reference}`}
          >
            <MoreHorizontalIcon />
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(application)}>Edit</DropdownMenuItem>
        {!decided && (
          <>
            <DropdownMenuItem
              disabled={!approvable}
              onClick={() => approvable && onDecide(application, "approved")}
            >
              {approvable ? "Approve" : "DTI too high"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDecide(application, "rejected")}>
              Reject
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuItem variant="destructive" onClick={() => onDelete(application)}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** Over the ceiling reads as a warning — it's what blocks approval. */
function Dti({ application }: { application: LoanApplication }) {
  const ratio = dti(application)
  const over = ratio > MAX_DTI
  return (
    <span className={over ? "font-medium text-destructive" : undefined}>
      {Number.isFinite(ratio) ? `${Math.round(ratio * 100)}%` : "—"}
    </span>
  )
}

const Payment = ({ application }: { application: LoanApplication }) => (
  <>
    {formatCurrency(
      Math.round(
        monthlyPayment(application.amount, application.rate, application.termMonths)
      )
    )}
    /mo
  </>
)

export function DataTable({
  applications,
  onEdit,
  onDecide,
  onDelete,
}: {
  applications: LoanApplication[]
  onEdit: (application: LoanApplication) => void
  onDecide: (application: LoanApplication, status: LoanStatus) => void
  onDelete: (application: LoanApplication) => void
}) {
  return (
    <>
      {/* Table — wide pane (≥ @sm) */}
      <div className="hidden flex-1 overflow-auto @sm:block">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow>
              <TableHead className="px-6">Reference</TableHead>
              <TableHead>Borrower</TableHead>
              <TableHead className="hidden @md:table-cell">Purpose</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="hidden text-right @md:table-cell">
                Payment
              </TableHead>
              <TableHead className="text-right">DTI</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-0 pr-6" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((application) => (
              <TableRow key={application.id}>
                <TableCell className="px-6 font-medium">
                  {application.reference}
                </TableCell>
                <TableCell>{application.borrower}</TableCell>
                <TableCell className="hidden text-muted-foreground @md:table-cell">
                  {application.purpose}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatCurrency(application.amount)}
                </TableCell>
                <TableCell className="hidden text-right tabular-nums text-muted-foreground @md:table-cell">
                  <Payment application={application} />
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  <Dti application={application} />
                </TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[application.status]}>
                    {application.status}
                  </Badge>
                </TableCell>
                <TableCell className="pr-6">
                  <RowActions
                    application={application}
                    onEdit={onEdit}
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
        {applications.map((application) => (
          <li key={application.id} className="flex items-start gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-medium">
                  {application.borrower}
                </span>
                <Badge variant="outline" className="text-[10px]">
                  {application.reference}
                </Badge>
              </div>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {formatCurrency(application.amount)} ·{" "}
                <Payment application={application} />
              </p>
              <div className="mt-1.5 flex items-center gap-2 text-xs">
                <Badge
                  variant={STATUS_VARIANT[application.status]}
                  className="text-[10px]"
                >
                  {application.status}
                </Badge>
                <span className="tabular-nums">
                  DTI <Dti application={application} />
                </span>
              </div>
            </div>
            <RowActions
              application={application}
              onEdit={onEdit}
              onDecide={onDecide}
              onDelete={onDelete}
            />
          </li>
        ))}
      </ul>
    </>
  )
}
