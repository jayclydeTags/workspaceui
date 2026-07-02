import { useEffect, useRef, useState } from "react"
import { Link } from "react-router"

import { blocks } from "@/lib/blocks"
import { cn } from "@/lib/utils"
import { useDocumentTitle } from "@/lib/use-document-title"

const categories = ["All", ...new Set(blocks.map((b) => b.category))]

// Renders a live block scaled to fit the card. Child is laid out at 1280×800
// (16:10) and scaled by width, so it fills the 16:10 card exactly.
function BlockThumb({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(() => setScale(el.clientWidth / 1280))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="origin-top-left"
        style={{ width: 1280, height: 800, transform: `scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  )
}

export default function BlocksIndex() {
  useDocumentTitle("Blocks")
  const [active, setActive] = useState("All")

  const visible =
    active === "All" ? blocks : blocks.filter((b) => b.category === active)

  return (
    <div className="overflow-y-auto px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-semibold tracking-tight">Blocks</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ready-made layouts built on the Workspace primitives. Click any block to preview,
          copy, or install it.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActive(category)}
              className={cn(
                "rounded-full border px-3 py-1 text-sm transition-colors",
                active === category
                  ? "border-transparent bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map(({ slug, title, description, category, Component }) => (
            <Link key={slug} to={`/blocks/${slug}`} className="group block">
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border bg-muted/30 transition group-hover:border-primary/40">
                <BlockThumb>
                  <Component />
                </BlockThumb>
              </div>
              <div className="mt-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium">{title}</h3>
                  <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {category}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
