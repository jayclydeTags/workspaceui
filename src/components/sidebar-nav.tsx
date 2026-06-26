import { Link, useLocation } from "react-router-dom"

import { cn } from "@/lib/utils"
import { nav } from "@/lib/nav"

export function SidebarNav() {
  const { pathname } = useLocation()

  return (
    <nav className="w-full">
      {nav.map((section) => (
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
  )
}
