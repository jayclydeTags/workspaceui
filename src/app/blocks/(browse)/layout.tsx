import type { Metadata } from "next"

import { BlocksSidebarNav } from "@/components/blocks-sidebar-nav"
import { getBlocksNav } from "@/lib/block-taxonomy"

// Default title for the gallery (a client page that can't export metadata);
// block detail pages override it via their own generateMetadata.
export const metadata: Metadata = { title: "Blocks" }

// Wraps the gallery + block detail pages. The bare preview route
// (blocks/preview/[slug]) lives outside this group so the iframe renders
// without this chrome — see its page.tsx.
export default function BlocksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-[calc(100svh-3.5rem)] overflow-hidden">
      <aside className="hidden w-56 shrink-0 px-4 py-6 md:flex">
        <BlocksSidebarNav sections={getBlocksNav()} />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {children}
      </div>
    </div>
  )
}
