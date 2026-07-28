"use client"

import type { Table as TanstackTable } from "@tanstack/react-table"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowLeftDoubleIcon,
  ArrowRightDoubleIcon,
} from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface DataPaginationProps<TData> {
  table: TanstackTable<TData>
  /** Choices in the rows-per-page select. Defaults to 10/20/30/40/50. */
  pageSizeOptions?: number[]
  className?: string
}

const DEFAULT_PAGE_SIZES = [10, 20, 30, 40, 50]

export function DataPagination<TData>({
  table,
  pageSizeOptions = DEFAULT_PAGE_SIZES,
  className,
}: DataPaginationProps<TData>) {
  const { pageIndex, pageSize } = table.getState().pagination
  // Both fall back to the pre-filtered (core) model when no filter model is
  // set, so this reads correctly on an unfiltered table too.
  const selectedCount = table.getFilteredSelectedRowModel().rows.length
  const rowCount = table.getFilteredRowModel().rows.length
  // An empty table still reads "Page 1 of 1" rather than "of 0".
  const pageCount = Math.max(1, table.getPageCount())

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-1",
        className
      )}
    >
      <span className="text-sm text-muted-foreground">
        {table.options.enableRowSelection === false
          ? `${rowCount} row(s)`
          : `${selectedCount} of ${rowCount} row(s) selected`}
      </span>
      <div className="flex items-center gap-x-4 gap-y-2 sm:gap-x-6">
        <div className="flex items-center gap-2">
          <span aria-hidden="true" className="text-sm font-medium">
            Rows per page
          </span>
          <Select
            value={String(pageSize)}
            onValueChange={(v) => table.setPageSize(Number(v))}
          >
            <SelectTrigger aria-label="Rows per page" className="w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <span className="text-sm font-medium">
          Page {pageIndex + 1} of {pageCount}
        </span>
        {/* Pagination's nav/list structure, but plain Buttons inside it:
            PaginationLink/Previous/Next render an <a> with no href, which
            can't take a disabled state or keyboard activation — and these
            controls page client-side state, they don't navigate. */}
        <Pagination className="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <Button
                variant="outline"
                size="icon"
                aria-label="Go to first page"
                disabled={!table.getCanPreviousPage()}
                onClick={() => table.setPageIndex(0)}
              >
                <HugeiconsIcon
                  icon={ArrowLeftDoubleIcon}
                  strokeWidth={2}
                  className="size-4"
                />
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button
                variant="outline"
                size="icon"
                aria-label="Go to previous page"
                disabled={!table.getCanPreviousPage()}
                onClick={() => table.previousPage()}
              >
                <HugeiconsIcon
                  icon={ArrowLeft01Icon}
                  strokeWidth={2}
                  className="size-4"
                />
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button
                variant="outline"
                size="icon"
                aria-label="Go to next page"
                disabled={!table.getCanNextPage()}
                onClick={() => table.nextPage()}
              >
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  strokeWidth={2}
                  className="size-4"
                />
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button
                variant="outline"
                size="icon"
                aria-label="Go to last page"
                disabled={!table.getCanNextPage()}
                onClick={() => table.setPageIndex(pageCount - 1)}
              >
                <HugeiconsIcon
                  icon={ArrowRightDoubleIcon}
                  strokeWidth={2}
                  className="size-4"
                />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
