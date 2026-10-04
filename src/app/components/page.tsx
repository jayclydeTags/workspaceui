import Link from "next/link"

import { getComponentPages } from "@/lib/component-pages"

export default function ComponentsIndexPage() {
  const pages = getComponentPages()

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Components</h1>
      <p className="mt-2 max-w-prose text-muted-foreground">
        Open any component to try its props, restyle its theme tokens, and copy
        the code.
      </p>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {pages.map((page) => (
          <li key={page.slug}>
            <Link
              href={page.href}
              className="flex h-full flex-col gap-1 rounded-xl border p-4 transition-colors outline-none hover:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <span className="font-medium">{page.title}</span>
              {page.description && (
                <span className="line-clamp-3 text-sm text-muted-foreground">
                  {page.description}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
