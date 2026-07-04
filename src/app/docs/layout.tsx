import type { ReactNode } from "react"
import { DocsLayout } from "fumadocs-ui/layouts/docs"

import { WorkspaceUILogo } from "@/components/workspaceui-logo"
import { pageTree } from "@/lib/page-tree"

// Keeps the hand-written pageTree for now; switching to source.pageTree
// (+ meta.json) is a Phase 3 cleanup.
const links = [{ text: "Blocks", url: "/blocks", active: "nested-url" as const }]

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={pageTree}
      links={links}
      githubUrl="https://github.com/jayclydeTags/workspaceui"
      nav={{ title: <WorkspaceUILogo className="h-5 w-auto" /> }}
    >
      {children}
    </DocsLayout>
  )
}
