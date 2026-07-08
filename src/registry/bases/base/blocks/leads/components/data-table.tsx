import { FlameIcon, MoreHorizontalIcon } from "lucide-react"

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
import { isHot, type Lead, type LeadStage } from "../data"

const STAGE_VARIANT: Record<
  LeadStage,
  "default" | "secondary" | "outline" | "destructive"
> = {
  qualified: "default",
  contacted: "secondary",
  new: "outline",
  unqualified: "destructive",
}

interface RowProps {
  lead: Lead
  onEdit: (lead: Lead) => void
  onConvert: (lead: Lead) => void
  onDelete: (lead: Lead) => void
}

/** Only a qualified lead can be converted into an account. */
function RowActions({ lead, onEdit, onConvert, onDelete }: RowProps) {
  const convertible = lead.stage === "qualified"
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Actions for ${lead.name}`}
          >
            <MoreHorizontalIcon />
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(lead)}>Edit</DropdownMenuItem>
        <DropdownMenuItem
          disabled={!convertible}
          onClick={() => convertible && onConvert(lead)}
        >
          Convert
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onClick={() => onDelete(lead)}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function Score({ lead }: { lead: Lead }) {
  return (
    <span className="flex items-center justify-end gap-1 tabular-nums">
      {isHot(lead) && (
        <FlameIcon className="size-3.5 text-destructive" aria-label="Hot lead" />
      )}
      {lead.score}
    </span>
  )
}

export function DataTable({
  leads,
  onEdit,
  onConvert,
  onDelete,
}: {
  leads: Lead[]
  onEdit: (lead: Lead) => void
  onConvert: (lead: Lead) => void
  onDelete: (lead: Lead) => void
}) {
  return (
    <>
      {/* Table — wide pane (≥ @sm) */}
      <div className="hidden flex-1 overflow-auto @sm:block">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow>
              <TableHead className="px-6">Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead className="hidden @md:table-cell">Email</TableHead>
              <TableHead className="hidden @md:table-cell">Source</TableHead>
              <TableHead className="text-right">Score</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead className="w-0 pr-6" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="px-6 font-medium">{lead.name}</TableCell>
                <TableCell>{lead.company}</TableCell>
                <TableCell className="hidden text-muted-foreground @md:table-cell">
                  {lead.email}
                </TableCell>
                <TableCell className="hidden text-muted-foreground @md:table-cell">
                  {lead.source}
                </TableCell>
                <TableCell className="text-right">
                  <Score lead={lead} />
                </TableCell>
                <TableCell>
                  <Badge variant={STAGE_VARIANT[lead.stage]}>{lead.stage}</Badge>
                </TableCell>
                <TableCell className="pr-6">
                  <RowActions
                    lead={lead}
                    onEdit={onEdit}
                    onConvert={onConvert}
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
        {leads.map((lead) => (
          <li key={lead.id} className="flex items-start gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-medium">{lead.name}</span>
                <Badge variant="outline" className="text-[10px]">
                  {lead.company}
                </Badge>
              </div>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {lead.email} · {lead.source}
              </p>
              <div className="mt-1.5 flex items-center gap-2 text-xs">
                <Badge variant={STAGE_VARIANT[lead.stage]} className="text-[10px]">
                  {lead.stage}
                </Badge>
                <Score lead={lead} />
              </div>
            </div>
            <RowActions
              lead={lead}
              onEdit={onEdit}
              onConvert={onConvert}
              onDelete={onDelete}
            />
          </li>
        ))}
      </ul>
    </>
  )
}
