import { Outlet } from "react-router-dom"
import { AnchorProvider } from "fumadocs-core/toc"

import { SidebarNav } from "@/components/sidebar-nav"
import { TableOfContents } from "@/components/table-of-contents"
import { TocProvider, useTocContext } from "@/lib/toc-context"

function DocsLayoutInner() {
  const { toc } = useTocContext()

  return (
    <AnchorProvider toc={toc}>
      <div className="flex w-full gap-8 px-6 py-8">
        <aside className="hidden w-56 shrink-0 md:block">
          <div className="sticky top-20">
            <SidebarNav />
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-3xl">
            <Outlet />
          </div>
        </main>

        <aside className="hidden w-44 shrink-0 xl:block">
          <div className="sticky top-20">
            <TableOfContents />
          </div>
        </aside>
      </div>
    </AnchorProvider>
  )
}

export function DocsLayout() {
  return (
    <TocProvider>
      <DocsLayoutInner />
    </TocProvider>
  )
}
