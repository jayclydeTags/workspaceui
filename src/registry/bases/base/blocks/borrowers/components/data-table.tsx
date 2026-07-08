import { MoreHorizontalIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
  formatCurrency,
  initials,
  isRemovable,
  riskGrade,
  type Borrower,
  type KycStatus,
  type RiskGrade,
} from "../data"

const KYC_VARIANT: Record<KycStatus, "default" | "secondary" | "destructive"> = {
  verified: "default",
  pending: "secondary",
  unverified: "destructive",
}

const GRADE_VARIANT: Record<RiskGrade, "default" | "secondary" | "destructive"> =
  {
    A: "default",
    B: "default",
    C: "secondary",
    D: "destructive",
  }

interface RowProps {
  borrower: Borrower
  onEdit: (borrower: Borrower) => void
  onVerify: (borrower: Borrower) => void
  onDelete: (borrower: Borrower) => void
}

/** A borrower with active loans can't be removed. */
function RowActions({ borrower, onEdit, onVerify, onDelete }: RowProps) {
  const removable = isRemovable(borrower)
  const verified = borrower.kyc === "verified"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Actions for ${borrower.name}`}
          >
            <MoreHorizontalIcon />
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(borrower)}>Edit</DropdownMenuItem>
        <DropdownMenuItem
          disabled={verified}
          onClick={() => !verified && onVerify(borrower)}
        >
          {verified ? "KYC verified" : "Mark verified"}
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          disabled={!removable}
          onClick={() => removable && onDelete(borrower)}
        >
          {removable ? "Delete" : "Has active loans"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function Person({ borrower }: { borrower: Borrower }) {
  return (
    <div className="flex items-center gap-2">
      <Avatar size="sm">
        <AvatarFallback>{initials(borrower.name)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <div className="truncate font-medium">{borrower.name}</div>
        <div className="truncate text-xs text-muted-foreground">
          {borrower.email}
        </div>
      </div>
    </div>
  )
}

function Score({ borrower }: { borrower: Borrower }) {
  const grade = riskGrade(borrower.creditScore)
  return (
    <span className="flex items-center justify-end gap-2 tabular-nums">
      {borrower.creditScore}
      <Badge variant={GRADE_VARIANT[grade]} aria-label={`Risk grade ${grade}`}>
        {grade}
      </Badge>
    </span>
  )
}

export function DataTable({
  borrowers,
  onEdit,
  onVerify,
  onDelete,
}: {
  borrowers: Borrower[]
  onEdit: (borrower: Borrower) => void
  onVerify: (borrower: Borrower) => void
  onDelete: (borrower: Borrower) => void
}) {
  return (
    <>
      {/* Table — wide pane (≥ @sm) */}
      <div className="hidden flex-1 overflow-auto @sm:block">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow>
              <TableHead className="px-6">Borrower</TableHead>
              <TableHead className="hidden @md:table-cell">Phone</TableHead>
              <TableHead className="text-right">Credit score</TableHead>
              <TableHead className="text-right">Outstanding</TableHead>
              <TableHead>KYC</TableHead>
              <TableHead className="w-0 pr-6" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {borrowers.map((borrower) => (
              <TableRow key={borrower.id}>
                <TableCell className="px-6">
                  <Person borrower={borrower} />
                </TableCell>
                <TableCell className="hidden tabular-nums text-muted-foreground @md:table-cell">
                  {borrower.phone}
                </TableCell>
                <TableCell className="text-right">
                  <Score borrower={borrower} />
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatCurrency(borrower.outstanding)}
                </TableCell>
                <TableCell>
                  <Badge variant={KYC_VARIANT[borrower.kyc]}>{borrower.kyc}</Badge>
                </TableCell>
                <TableCell className="pr-6">
                  <RowActions
                    borrower={borrower}
                    onEdit={onEdit}
                    onVerify={onVerify}
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
        {borrowers.map((borrower) => (
          <li key={borrower.id} className="flex items-start gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <Person borrower={borrower} />
              <div className="mt-1.5 flex items-center gap-2 text-xs">
                <Badge variant={KYC_VARIANT[borrower.kyc]} className="text-[10px]">
                  {borrower.kyc}
                </Badge>
                <Score borrower={borrower} />
              </div>
            </div>
            <RowActions
              borrower={borrower}
              onEdit={onEdit}
              onVerify={onVerify}
              onDelete={onDelete}
            />
          </li>
        ))}
      </ul>
    </>
  )
}
