import { HugeiconsIcon } from "@hugeicons/react"
import { Search01Icon } from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  CATEGORY_BY_ID,
  formatNumber,
  formatShare,
  type Agent,
  type CategoryId,
  type PowerUser,
} from "@/registry/bases/base/blocks/credit-usage/data"

export function CategoryBadge({ category }: { category: CategoryId }) {
  const { label, swatch } = CATEGORY_BY_ID[category]
  return (
    <Badge variant="outline">
      <span
        aria-hidden="true"
        className={cn("size-1.5 rounded-full", swatch)}
      />
      {label}
    </Badge>
  )
}

function NoResults({
  colSpan,
  onReset,
}: {
  colSpan: number
  onReset: () => void
}) {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell colSpan={colSpan} className="p-0">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <HugeiconsIcon icon={Search01Icon} strokeWidth={2} />
            </EmptyMedia>
            <EmptyTitle>No matches</EmptyTitle>
            <EmptyDescription>
              Nothing matches your search and filters for this period.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="outline" size="sm" onClick={onReset}>
              Clear search and filters
            </Button>
          </EmptyContent>
        </Empty>
      </TableCell>
    </TableRow>
  )
}

const NUMERIC = "text-end tabular-nums"

interface AgentsTableProps {
  rows: Agent[]
  totalCredits: number
  onReset: () => void
}

export function AgentsTable({ rows, totalCredits, onReset }: AgentsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="ps-4">Agent</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-end">Runs</TableHead>
          <TableHead className="text-end">Hours saved</TableHead>
          <TableHead className="text-end">Credits</TableHead>
          <TableHead className="pe-4 text-end">Share</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.length === 0 ? (
          <NoResults colSpan={6} onReset={onReset} />
        ) : (
          rows.map((agent) => (
            <TableRow key={agent.id}>
              <TableHead
                scope="row"
                className="ps-4 font-normal text-foreground"
              >
                {agent.name}
              </TableHead>
              <TableCell>
                <CategoryBadge category={agent.category} />
              </TableCell>
              <TableCell className={NUMERIC}>
                {formatNumber(agent.runs)}
              </TableCell>
              <TableCell className={NUMERIC}>
                {formatNumber(agent.hoursSaved)}
              </TableCell>
              <TableCell className={NUMERIC}>
                {formatNumber(agent.credits)}
              </TableCell>
              <TableCell className={cn(NUMERIC, "pe-4")}>
                {formatShare(agent.credits, totalCredits)}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}

interface PowerUsersTableProps {
  rows: PowerUser[]
  totalCredits: number
  onReset: () => void
}

export function PowerUsersTable({
  rows,
  totalCredits,
  onReset,
}: PowerUsersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="ps-4">User</TableHead>
          <TableHead>Team</TableHead>
          <TableHead>Top agent</TableHead>
          <TableHead className="text-end">Runs</TableHead>
          <TableHead className="text-end">Credits</TableHead>
          <TableHead className="pe-4 text-end">Share</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.length === 0 ? (
          <NoResults colSpan={6} onReset={onReset} />
        ) : (
          rows.map((user) => (
            <TableRow key={user.id}>
              <TableHead
                scope="row"
                className="ps-4 font-normal text-foreground"
              >
                <div className="flex items-center gap-3">
                  <Avatar size="sm">
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate">{user.name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </div>
              </TableHead>
              <TableCell className="text-muted-foreground">
                {user.team}
              </TableCell>
              <TableCell>
                <div className="flex flex-col items-start gap-1">
                  <span>{user.topAgent}</span>
                  <CategoryBadge category={user.category} />
                </div>
              </TableCell>
              <TableCell className={NUMERIC}>
                {formatNumber(user.runs)}
              </TableCell>
              <TableCell className={NUMERIC}>
                {formatNumber(user.credits)}
              </TableCell>
              <TableCell className={cn(NUMERIC, "pe-4")}>
                {formatShare(user.credits, totalCredits)}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
