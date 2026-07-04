import Link from "next/link"

import { source } from "@/lib/source"

export function ComponentsIndex() {
  const pages = source
    .getPages()
    .filter((page) => page.slugs[0] === "components" && page.slugs.length > 1)
    .sort((a, b) => (a.data.title ?? "").localeCompare(b.data.title ?? ""))

  return (
    <div className="not-prose mt-6 grid gap-2 sm:grid-cols-3">
      {pages.map((page) => (
        <Link
          key={page.url}
          href={page.url}
          className="text-sm font-medium text-foreground hover:text-primary hover:underline"
        >
          {page.data.title}
        </Link>
      ))}
    </div>
  )
}
