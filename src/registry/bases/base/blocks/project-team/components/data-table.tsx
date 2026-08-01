import { HugeiconsIcon } from "@hugeicons/react"
import { MoreHorizontalIcon } from "@hugeicons/core-free-icons"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import { StatusBadge } from "@/registry/bases/base/workspaceui/status-badge"
import { initials, isLastLead, type Member, type TeamRole } from "../data"

const ROLE_VARIANT: Record<TeamRole, "default" | "secondary" | "outline"> = {
  lead: "default",
  member: "secondary",
  viewer: "outline",
}

interface RowProps {
  member: Member
  /** The last lead can't be removed — someone has to own the project. */
  locked: boolean
  onEdit: (member: Member) => void
  onRemove: (member: Member) => void
}

function RowActions({ member, locked, onEdit, onRemove }: RowProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Actions for ${member.name}`}
          >
            <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} />
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(member)}>Edit</DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          disabled={locked}
          onClick={() => !locked && onRemove(member)}
        >
          {locked ? "Last lead" : "Remove"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function Person({ member }: { member: Member }) {
  return (
    <div className="flex items-center gap-2">
      <Avatar size="sm">
        <AvatarFallback>{initials(member.name)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <div className="truncate font-medium">{member.name}</div>
        <div className="truncate text-xs text-muted-foreground">
          {member.email}
        </div>
      </div>
    </div>
  )
}

export function DataTable({
  members,
  onEdit,
  onRemove,
}: {
  members: Member[]
  onEdit: (member: Member) => void
  onRemove: (member: Member) => void
}) {
  return (
    <>
      {/* Table — wide pane (≥ @sm) */}
      <div className="hidden flex-1 overflow-auto @sm:block">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow>
              <TableHead className="px-6">Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Allocation</TableHead>
              <TableHead className="w-0 pr-6" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="px-6">
                  <Person member={member} />
                </TableCell>
                <TableCell>
                  <StatusBadge status={member.role} variantMap={ROLE_VARIANT} />
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {member.allocation}h / wk
                </TableCell>
                <TableCell className="pr-6">
                  <RowActions
                    member={member}
                    locked={isLastLead(members, member)}
                    onEdit={onEdit}
                    onRemove={onRemove}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Card list — narrow pane (< @sm) */}
      <ul className="flex-1 divide-y divide-border overflow-auto @sm:hidden">
        {members.map((member) => (
          <li key={member.id} className="flex items-center gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <Person member={member} />
              <div className="mt-1.5 flex items-center gap-2 text-xs">
                <StatusBadge
                  status={member.role}
                  variantMap={ROLE_VARIANT}
                  className="text-[10px]"
                />
                <span className="text-muted-foreground tabular-nums">
                  {member.allocation}h / wk
                </span>
              </div>
            </div>
            <RowActions
              member={member}
              locked={isLastLead(members, member)}
              onEdit={onEdit}
              onRemove={onRemove}
            />
          </li>
        ))}
      </ul>
    </>
  )
}
