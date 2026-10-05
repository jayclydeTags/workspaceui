"use client"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { defineStory } from "@/components/studio/studio"

interface Args {
  active: number
  ellipsis: boolean
}

function Preview({ active, ellipsis }: Args) {
  const current = Math.min(Math.max(active, 1), 3)
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        {[1, 2, 3].map((page) => (
          <PaginationItem key={page}>
            <PaginationLink href="#" isActive={page === current}>
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        {ellipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default defineStory<Args>({
  args: { active: 2, ellipsis: true },
  controls: {
    active: { type: "number", min: 1, max: 3, label: "Active page" },
    ellipsis: { type: "boolean", group: "style" },
  },
  preview: Preview,
})
