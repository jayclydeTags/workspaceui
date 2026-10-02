import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"

import { source } from "@/lib/source"

export function ComponentsIndex() {
  const pages = source
    .getPages()
    .filter((page) => page.slugs[0] === "components" && page.slugs.length > 1)
    .sort((a, b) => (a.data.title ?? "").localeCompare(b.data.title ?? ""))

  if (pages.length === 0) {
    return (
      <p className="not-prose not-typeset mt-6 rounded-xl border border-border px-4 py-6 text-center text-sm text-muted-foreground">
        No components documented yet.
      </p>
    )
  }

  return (
    <ul className="not-prose not-typeset mt-6 divide-y divide-border overflow-hidden rounded-xl border border-border">
      {pages.map((page) => (
        <li key={page.url}>
          <Link
            href={page.url}
            className="group flex items-center gap-4 px-4 py-3.5 text-sm font-medium text-foreground transition-colors outline-none hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-inset"
          >
            <span className="min-w-0 flex-1 truncate">{page.data.title}</span>
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              strokeWidth={2}
              className="size-4 shrink-0 text-muted-foreground/60 transition-[transform,color] group-hover:translate-x-0.5 group-hover:text-foreground"
            />
          </Link>
        </li>
      ))}
    </ul>
  )
}
