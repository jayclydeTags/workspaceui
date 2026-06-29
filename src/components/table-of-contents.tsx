import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"

import { cn } from "@/lib/utils"

interface Heading {
  id: string
  text: string
  level: 2 | 3
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[()]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "")
    .replace(/-+/g, "-")
    .trim()
}

export function TableOfContents({ contentRef }: { contentRef: React.RefObject<HTMLElement | null> }) {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState("")
  const { pathname } = useLocation()

  // Re-extract headings on route change
  useEffect(() => {
    const el = contentRef.current
    if (!el) return

    const nodes = Array.from(el.querySelectorAll("h2, h3")) as HTMLElement[]
    const items = nodes.map((node) => {
      const text = node.textContent ?? ""
      const id = node.id || slugify(text)
      node.id = id
      return { id, text, level: (node.tagName === "H2" ? 2 : 3) as 2 | 3 }
    })
    setHeadings(items)
    setActiveId(items[0]?.id ?? "")
  }, [pathname, contentRef])

  // Scroll-spy via IntersectionObserver
  useEffect(() => {
    if (!headings.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
            break
          }
        }
      },
      { rootMargin: "-20% 0% -70% 0%", threshold: 0 }
    )

    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  if (!headings.length) return null

  return (
    <nav className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-foreground">
        On This Page
      </p>
      <ul className="space-y-1.5 border-l border-border">
        {headings.map(({ id, text, level }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={cn(
                "-ml-px block border-l py-0.5 pl-3 text-xs transition-colors hover:text-foreground",
                level === 3 && "pl-6",
                activeId === id
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground"
              )}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
