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
  canPerfect,
  formatCurrency,
  isAppraisalStale,
  lendableValue,
  type Collateral,
  type LienStatus,
} from "../data"

const LIEN_VARIANT: Record<LienStatus, "default" | "secondary" | "outline"> = {
  perfected: "default",
  pending: "secondary",
  released: "outline",
}

interface RowProps {
  item: Collateral
  onEdit: (item: Collateral) => void
  onSetLien: (item: Collateral, lien: LienStatus) => void
  onDelete: (item: Collateral) => void
}

/** A lien can only be perfected on a current appraisal. */
function RowActions({ item, onEdit, onSetLien, onDelete }: RowProps) {
  const perfectable = canPerfect(item)
  const stale = isAppraisalStale(item)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Actions for ${item.description}`}
          >
            <MoreHorizontalIcon />
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(item)}>Edit</DropdownMenuItem>
        {item.lien === "pending" && (
          <DropdownMenuItem
            disabled={!perfectable}
            onClick={() => perfectable && onSetLien(item, "perfected")}
          >
            {stale ? "Appraisal stale" : "Perfect lien"}
          </DropdownMenuItem>
        )}
        {item.lien !== "released" && (
          <DropdownMenuItem onClick={() => onSetLien(item, "released")}>
            Release lien
          </DropdownMenuItem>
        )}
        <DropdownMenuItem variant="destructive" onClick={() => onDelete(item)}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** A stale appraisal reads as a warning — it's what blocks perfecting. */
function Appraisal({ item }: { item: Collateral }) {
  const stale = isAppraisalStale(item)
  return (
    <span className={stale ? "font-medium text-destructive" : undefined}>
      {item.appraisedOn}
    </span>
  )
}

export function DataTable({
  items,
  onEdit,
  onSetLien,
  onDelete,
}: {
  items: Collateral[]
  onEdit: (item: Collateral) => void
  onSetLien: (item: Collateral, lien: LienStatus) => void
  onDelete: (item: Collateral) => void
}) {
  return (
    <>
      {/* Table — wide pane (≥ @sm) */}
      <div className="hidden flex-1 overflow-auto @sm:block">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow>
              <TableHead className="px-6">Asset</TableHead>
              <TableHead>Loan</TableHead>
              <TableHead className="hidden @md:table-cell">Type</TableHead>
              <TableHead className="text-right">Appraised</TableHead>
              <TableHead className="text-right">Lendable</TableHead>
              <TableHead className="hidden @md:table-cell">Appraised on</TableHead>
              <TableHead>Lien</TableHead>
              <TableHead className="w-0 pr-6" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="px-6 font-medium">
                  {item.description}
                </TableCell>
                <TableCell className="text-muted-foreground">{item.loan}</TableCell>
                <TableCell className="hidden text-muted-foreground @md:table-cell">
                  {item.type}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatCurrency(item.value)}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatCurrency(lendableValue(item))}
                </TableCell>
                <TableCell className="hidden tabular-nums @md:table-cell">
                  <Appraisal item={item} />
                </TableCell>
                <TableCell>
                  <Badge variant={LIEN_VARIANT[item.lien]}>{item.lien}</Badge>
                </TableCell>
                <TableCell className="pr-6">
                  <RowActions
                    item={item}
                    onEdit={onEdit}
                    onSetLien={onSetLien}
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
        {items.map((item) => (
          <li key={item.id} className="flex items-start gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-medium">
                  {item.description}
                </span>
                <Badge variant="outline" className="text-[10px]">
                  {item.loan}
                </Badge>
              </div>
              <p className="mt-0.5 truncate text-xs tabular-nums text-muted-foreground">
                {formatCurrency(item.value)} · lendable{" "}
                {formatCurrency(lendableValue(item))}
              </p>
              <div className="mt-1.5 flex items-center gap-2 text-xs">
                <Badge variant={LIEN_VARIANT[item.lien]} className="text-[10px]">
                  {item.lien}
                </Badge>
                <Appraisal item={item} />
              </div>
            </div>
            <RowActions
              item={item}
              onEdit={onEdit}
              onSetLien={onSetLien}
              onDelete={onDelete}
            />
          </li>
        ))}
      </ul>
    </>
  )
}
