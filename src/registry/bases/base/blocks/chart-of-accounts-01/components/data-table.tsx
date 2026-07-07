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
  ACCOUNT_TYPE_LABEL,
  formatCurrency,
  type Account,
} from "../data"

const TYPE_VARIANT: Record<
  Account["type"],
  "default" | "secondary" | "destructive" | "outline"
> = {
  asset: "secondary",
  liability: "destructive",
  equity: "default",
  revenue: "secondary",
  expense: "outline",
}

function RowActions({
  account,
  onEdit,
  onDelete,
}: {
  account: Account
  onEdit: (account: Account) => void
  onDelete: (account: Account) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Actions for ${account.name}`}
          >
            <MoreHorizontalIcon />
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(account)}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          onClick={() => onDelete(account)}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function StatusBadge({ status }: { status: Account["status"] }) {
  return (
    <Badge
      variant={status === "active" ? "secondary" : "outline"}
      className="capitalize"
    >
      {status}
    </Badge>
  )
}

export function DataTable({
  accounts,
  onEdit,
  onDelete,
}: {
  accounts: Account[]
  onEdit: (account: Account) => void
  onDelete: (account: Account) => void
}) {
  return (
    <>
      {/* Table — wide pane (≥ @sm) */}
      <div className="hidden flex-1 overflow-auto @sm:block">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow>
              <TableHead className="px-6">Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden @md:table-cell">Type</TableHead>
              <TableHead className="text-right">Balance</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-0 pr-6" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell className="px-6 font-medium">
                  {account.code}
                </TableCell>
                <TableCell>{account.name}</TableCell>
                <TableCell className="hidden @md:table-cell">
                  <Badge variant={TYPE_VARIANT[account.type]}>
                    {ACCOUNT_TYPE_LABEL[account.type]}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(account.balance)}
                </TableCell>
                <TableCell>
                  <StatusBadge status={account.status} />
                </TableCell>
                <TableCell className="pr-6">
                  <RowActions account={account} onEdit={onEdit} onDelete={onDelete} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Card list — narrow pane (< @sm) */}
      <ul className="flex-1 divide-y divide-border overflow-auto @sm:hidden">
        {accounts.map((account) => (
          <li key={account.id} className="flex items-start gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-medium">
                  {account.code} · {account.name}
                </span>
              </div>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {ACCOUNT_TYPE_LABEL[account.type]} · {formatCurrency(account.balance)}
              </p>
              <div className="mt-1.5">
                <StatusBadge status={account.status} />
              </div>
            </div>
            <RowActions account={account} onEdit={onEdit} onDelete={onDelete} />
          </li>
        ))}
      </ul>
    </>
  )
}
