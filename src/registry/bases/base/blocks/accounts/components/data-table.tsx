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
  formatCurrency,
  health,
  type Account,
  type AccountHealth,
} from "../data"

const HEALTH_VARIANT: Record<
  AccountHealth,
  "default" | "secondary" | "destructive"
> = {
  healthy: "default",
  watch: "secondary",
  "at-risk": "destructive",
}

interface RowProps {
  account: Account
  onEdit: (account: Account) => void
  onDelete: (account: Account) => void
}

/** An account with open deals can't be deleted — close or move them first. */
function RowActions({ account, onEdit, onDelete }: RowProps) {
  const locked = account.openDeals > 0
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
        <DropdownMenuItem onClick={() => onEdit(account)}>Edit</DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          disabled={locked}
          onClick={() => !locked && onDelete(account)}
        >
          {locked ? "Has open deals" : "Delete"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function HealthBadge({ account }: { account: Account }) {
  const h = health(account)
  return <Badge variant={HEALTH_VARIANT[h]}>{h}</Badge>
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
              <TableHead className="px-6">Account</TableHead>
              <TableHead className="hidden @md:table-cell">Owner</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead className="text-right">ARR</TableHead>
              <TableHead className="hidden @md:table-cell">Last contact</TableHead>
              <TableHead>Health</TableHead>
              <TableHead className="w-0 pr-6" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell className="px-6">
                  <span className="font-medium">{account.name}</span>{" "}
                  <span className="text-muted-foreground">{account.industry}</span>
                </TableCell>
                <TableCell className="hidden @md:table-cell">
                  {account.owner}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{account.tier}</Badge>
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatCurrency(account.arr)}
                </TableCell>
                <TableCell className="hidden tabular-nums text-muted-foreground @md:table-cell">
                  {account.lastContact || "never"}
                </TableCell>
                <TableCell>
                  <HealthBadge account={account} />
                </TableCell>
                <TableCell className="pr-6">
                  <RowActions
                    account={account}
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
        {accounts.map((account) => (
          <li key={account.id} className="flex items-start gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-medium">{account.name}</span>
                <Badge variant="outline" className="text-[10px]">
                  {account.tier}
                </Badge>
              </div>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {account.owner} · {formatCurrency(account.arr)} ARR
              </p>
              <div className="mt-1.5">
                <HealthBadge account={account} />
              </div>
            </div>
            <RowActions account={account} onEdit={onEdit} onDelete={onDelete} />
          </li>
        ))}
      </ul>
    </>
  )
}
