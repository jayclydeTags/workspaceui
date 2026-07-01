import { useEffect, useRef, useState } from "react"
import { Link, useLocation } from "react-router"

import { cn } from "@/lib/utils"
import { nav, type NavSection } from "@/lib/nav"

export function SidebarNav({ sections = nav }: { sections?: NavSection[] }) {
  const { pathname } = useLocation()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [fades, setFades] = useState({ top: false, bottom: false })

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const update = () =>
      setFades({
        top: el.scrollTop > 0,
        bottom: el.scrollTop + el.clientHeight < el.scrollHeight - 1,
      })
    update()
    el.addEventListener("scroll", update, { passive: true })
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => {
      el.removeEventListener("scroll", update)
      ro.disconnect()
    }
  }, [sections])

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="w-full overflow-y-auto max-h-[calc(100svh-6rem)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <nav className="w-full">
          {sections.map((section) => (
            <div key={section.title} className="pb-6">
              <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-semibold">
                {section.title}
              </h4>
              <ul className="grid gap-0.5">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                        pathname === item.href
                          ? "bg-muted font-medium text-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {item.title}
                      {item.label && (
                        <span className="ml-auto rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
                          {item.label}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-background to-transparent transition-opacity duration-150",
          fades.top ? "opacity-100" : "opacity-0"
        )}
      />
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-background to-transparent transition-opacity duration-150",
          fades.bottom ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  )
}
