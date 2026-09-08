import Link from "next/link"

import { getBlockGroups } from "@/lib/block-taxonomy"

// Grouping, order, and titles all come from the block taxonomy (registry.json
// + the family declaration), so the gallery and the sidebar can't disagree.
const groups = getBlockGroups()

export default function BlocksIndex() {
  return (
    <div className="overflow-y-auto px-6 py-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-tight">Blocks</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ready-made layouts built on the Workspace primitives. Click any block
          to preview, copy, or install it.
        </p>

        {groups.length === 0 ? (
          <p className="mt-8 rounded-xl border border-border px-4 py-8 text-center text-sm text-muted-foreground">
            No blocks yet.
          </p>
        ) : (
          <div className="mt-8 space-y-8">
            {groups.map(({ category, items }) => (
              <section key={category} aria-labelledby={`group-${category}`}>
                <h2
                  id={`group-${category}`}
                  className="px-1 font-mono text-xs text-muted-foreground"
                >
                  {category}{" "}
                  <span className="text-muted-foreground/60">
                    ({items.length})
                  </span>
                </h2>
                <ul className="mt-2 divide-y divide-border overflow-hidden rounded-xl border border-border">
                  {items.map(({ slug, title }) => (
                    <li key={slug}>
                      <Link
                        href={`/blocks/${slug}`}
                        className="block truncate px-4 py-3 text-sm font-medium text-foreground transition-colors outline-none hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-inset"
                      >
                        {title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
