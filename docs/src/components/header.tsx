import { Link } from "react-router-dom"
import { Github } from "lucide-react"

import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-screen-2xl items-center gap-4 px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="text-sm">WorkspaceUI</span>
        </Link>

        <nav className="hidden items-center gap-1 text-sm text-muted-foreground md:flex">
          <Link
            to="/docs/getting-started/introduction"
            className="rounded-md px-3 py-1.5 transition-colors hover:text-foreground"
          >
            Docs
          </Link>
          <Link
            to="/docs/components/workspace-tabs"
            className="rounded-md px-3 py-1.5 transition-colors hover:text-foreground"
          >
            Components
          </Link>
          <Link
            to="/docs/blocks"
            className="rounded-md px-3 py-1.5 transition-colors hover:text-foreground"
          >
            Blocks
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <a
            href="https://github.com/jayclydeTags/workspaceui"
            target="_blank"
            rel="noreferrer"
            className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="GitHub"
          >
            <Github className="size-4" />
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
