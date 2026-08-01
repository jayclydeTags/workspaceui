import { HugeiconsIcon } from "@hugeicons/react"
import { Delete02Icon } from "@hugeicons/core-free-icons"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { StatusBadge } from "@/registry/bases/base/workspaceui/status-badge"
import { formatCurrency, type Product } from "../data"

const STATUS_VARIANT: Record<
  Product["status"],
  "default" | "secondary" | "destructive" | "outline"
> = {
  draft: "outline",
  active: "default",
  discontinued: "secondary",
}

/** Master list — selecting a row opens it in the detail panel; no dialog. */
export function DataTable({
  products,
  selectedId,
  onSelect,
  onDelete,
}: {
  products: Product[]
  selectedId: string | null
  onSelect: (product: Product) => void
  onDelete: (product: Product) => void
}) {
  return (
    <>
      {/* Table — wide pane (≥ @sm) */}
      <div className="hidden flex-1 overflow-auto @sm:block">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow>
              <TableHead className="px-6">Name</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead className="hidden @md:table-cell">Category</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-0 pr-6" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow
                key={product.id}
                aria-selected={product.id === selectedId}
                onClick={() => onSelect(product)}
                className={cn(
                  "cursor-pointer",
                  product.id === selectedId && "bg-muted"
                )}
              >
                <TableCell className="px-6 font-medium">
                  {product.name}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {product.sku}
                </TableCell>
                <TableCell className="hidden @md:table-cell">
                  {product.category}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(product.price)}
                </TableCell>
                <TableCell>
                  <StatusBadge
                    status={product.status}
                    variantMap={STATUS_VARIANT}
                    className="capitalize"
                  />
                </TableCell>
                <TableCell className="pr-6">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Delete ${product.sku}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(product)
                    }}
                  >
                    <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Card list — narrow pane (< @sm) */}
      <ul className="flex-1 divide-y divide-border overflow-auto @sm:hidden">
        {products.map((product) => (
          <li
            key={product.id}
            className={cn(
              "flex items-start gap-3 px-4 py-3",
              product.id === selectedId && "bg-muted"
            )}
          >
            <button
              type="button"
              aria-selected={product.id === selectedId}
              onClick={() => onSelect(product)}
              className="min-w-0 flex-1 text-start"
            >
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-medium">
                  {product.name}
                </span>
                <Badge variant="outline" className="text-[10px]">
                  {product.sku}
                </Badge>
              </div>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {product.category} · {formatCurrency(product.price)}
              </p>
              <div className="mt-1.5">
                <StatusBadge
                  status={product.status}
                  variantMap={STATUS_VARIANT}
                  className="capitalize"
                />
              </div>
            </button>
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Delete ${product.sku}`}
              onClick={() => onDelete(product)}
            >
              <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
            </Button>
          </li>
        ))}
      </ul>
    </>
  )
}
