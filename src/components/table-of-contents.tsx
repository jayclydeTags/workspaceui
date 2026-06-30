import { useItems } from "fumadocs-core/toc"
import { cn } from "@/lib/utils"

export function TableOfContents() {
  const items = useItems()

  if (!items.length) return null

  return (
    <nav className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-foreground">
        On This Page
      </p>
      <ul className="space-y-1.5 border-l border-border">
        {items.map(({ id, active, original }) => (
          <li key={id}>
            <a
              href={original.url}
              className={cn(
                "-ml-px block border-l py-0.5 pl-3 text-xs transition-colors hover:text-foreground",
                original.depth === 3 && "pl-6",
                active
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground"
              )}
            >
              {original.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
