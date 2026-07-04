"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { MenuIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { WorkspaceUILogo } from "@/components/workspaceui-logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { SearchDialog } from "@/components/search-dialog"
import { SidebarNav } from "@/components/sidebar-nav"
import { GithubIcon } from "@/components/github-icon"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

const links = [
  { text: "Docs", href: "/docs/getting-started/introduction" },
  { text: "Components", href: "/docs/components" },
  { text: "Blocks", href: "/blocks" },
]

function isActive(pathname: string, href: string) {
  const section = href.startsWith("/docs") ? "/docs" : href
  return pathname === section || pathname.startsWith(`${section}/`)
}

export function SiteHeader() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Bare iframe target for BlockPreview — no site chrome inside the frame.
  if (pathname.startsWith("/blocks/preview")) return null

  return (
    <header className="sticky top-0 z-40 h-14 border-b bg-background/80 backdrop-blur-lg">
      <div className="flex h-14 items-center gap-4 px-4">
        <Link href="/" className="inline-flex items-center gap-2.5 font-semibold">
          <WorkspaceUILogo className="h-5 w-auto" />
        </Link>

        <nav className="hidden flex-1 items-center gap-1 sm:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground",
                isActive(pathname, link.href) && "text-foreground"
              )}
            >
              {link.text}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-1.5 sm:flex">
          <SearchDialog />
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="GitHub"
            nativeButton={false}
            render={
              <a
                href="https://github.com/jayclydeTags/workspaceui"
                target="_blank"
                rel="noreferrer"
              />
            }
          >
            <GithubIcon className="size-4" />
          </Button>
        </div>

        <div className="ml-auto flex items-center gap-1 sm:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="GitHub"
            nativeButton={false}
            render={
              <a
                href="https://github.com/jayclydeTags/workspaceui"
                target="_blank"
                rel="noreferrer"
              />
            }
          >
            <GithubIcon className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen(true)}
          >
            <MenuIcon />
          </Button>
        </div>
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="right" className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <div className="px-4 pb-2">
            <SearchDialog />
          </div>
          <nav className="flex flex-col gap-1 px-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-md px-2 py-2 text-sm font-medium",
                  isActive(pathname, link.href)
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.text}
              </Link>
            ))}
            <Button
              variant="ghost"
              className="justify-start gap-2 px-2 text-sm font-medium text-muted-foreground hover:text-foreground"
              nativeButton={false}
              render={
                <a
                  href="https://github.com/jayclydeTags/workspaceui"
                  target="_blank"
                  rel="noreferrer"
                />
              }
            >
              <GithubIcon className="size-4" />
              GitHub
            </Button>
          </nav>
          {pathname.startsWith("/docs") && (
            <div
              className="mt-2 border-t px-4 pt-4"
              onClick={(e) => {
                if ((e.target as HTMLElement).closest("a")) setMobileOpen(false)
              }}
            >
              <SidebarNav />
            </div>
          )}
        </SheetContent>
      </Sheet>
    </header>
  )
}
