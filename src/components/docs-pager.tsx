import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { nav } from "@/lib/nav"
import { Button } from "@/components/ui/button"

const flatNav = nav.flatMap((section) => section.items ?? [])

export function getAdjacentDocs(slug?: string[]) {
  const href = `/docs/${(slug ?? []).join("/")}`
  const index = flatNav.findIndex((item) => item.href === href)
  if (index === -1) return { prev: undefined, next: undefined }
  return { prev: flatNav[index - 1], next: flatNav[index + 1] }
}

export function DocsPager({ slug }: { slug?: string[] }) {
  const { prev, next } = getAdjacentDocs(slug)
  if (!prev && !next) return null

  return (
    <div className="mt-10 w-full">
      <div className="mt-6 flex items-center justify-between gap-4">
        {prev ? (
          <Button
            variant="secondary"
            nativeButton={false}
            render={<Link href={prev.href} />}
          >
            <ChevronLeft />
            {prev.title}
          </Button>
        ) : (
          <div />
        )}
        {next ? (
          <Button
            variant="secondary"
            nativeButton={false}
            render={<Link href={next.href} />}
          >
            {next.title}
            <ChevronRight />
          </Button>
        ) : (
          <div />
        )}
      </div>
    </div>
  )
}
