"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { nav, type NavItem, type NavSection } from "@/lib/nav"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

export function SidebarNav({ sections = nav }: { sections?: NavSection[] }) {
  const pathname = usePathname()
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
          {sections.map((section) => {
            const total =
              section.groups?.reduce((sum, g) => sum + g.items.length, 0) ?? 0
            return (
              <div key={section.title} className="pb-6">
                <h4 className="mb-1 flex items-center gap-1.5 rounded-md px-2 py-1 text-sm text-muted-foreground">
                  {section.title}
                  {section.groups && (
                    <span className="text-xs text-muted-foreground/70">
                      ({total})
                    </span>
                  )}
                </h4>
                {section.groups
                  ? section.groups.map((group) => (
                      // ponytail: default-open, no persisted expand state
                      <Collapsible key={group.title} defaultOpen className="mb-1">
                        <CollapsibleTrigger className="group flex w-full items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-foreground hover:bg-muted">
                          <ChevronDown className="size-3.5 shrink-0 -rotate-90 text-muted-foreground transition-transform group-data-open:rotate-0" />
                          {group.title}
                          <span className="text-xs text-muted-foreground/70">
                            ({group.items.length})
                          </span>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <ul className="grid gap-0.5 pl-4 pt-0.5">
                            {group.items.map((item) => (
                              <NavLink
                                key={item.href}
                                item={item}
                                active={pathname === item.href}
                              />
                            ))}
                          </ul>
                        </CollapsibleContent>
                      </Collapsible>
                    ))
                  : section.items && (
                      <ul className="grid gap-0.5">
                        {section.items.map((item) => (
                          <NavLink
                            key={item.href}
                            item={item}
                            active={pathname === item.href}
                          />
                        ))}
                      </ul>
                    )}
              </div>
            )
          })}
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

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <li>
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-semibold transition-colors",
          active ? "bg-muted text-foreground" : "text-foreground hover:bg-muted"
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
  )
}
