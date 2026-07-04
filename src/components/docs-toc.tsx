"use client"

import type { ReactNode } from "react"
import { AnchorProvider, TOCItem, useActiveAnchor, type TOCItemType } from "fumadocs-core/toc"

import { cn } from "@/lib/utils"

export function DocsPageLayout({
  toc,
  children,
}: {
  toc: TOCItemType[]
  children: ReactNode
}) {
  return (
    <AnchorProvider toc={toc} single>
      <div className="mx-auto flex w-full max-w-(--fd-layout-width,90rem) gap-10 px-4 py-8 xl:px-8">
        <article className="min-w-0 flex-1">{children}</article>
        {toc.length > 0 && (
          <aside className="sticky top-24 hidden h-[calc(100svh-8rem)] w-56 shrink-0 overflow-y-auto xl:block">
            <p className="mb-3 text-sm font-medium">On This Page</p>
            <TocList toc={toc} />
          </aside>
        )}
      </div>
    </AnchorProvider>
  )
}

function TocList({ toc }: { toc: TOCItemType[] }) {
  const active = useActiveAnchor()

  return (
    <ul className="flex flex-col gap-2 text-sm">
      {toc.map((item) => (
        <li key={item.url} style={{ paddingLeft: `${(item.depth - 2) * 0.75}rem` }}>
          <TOCItem
            href={item.url}
            className={cn(
              "block text-muted-foreground transition-colors hover:text-foreground",
              active === item.url.slice(1) && "font-medium text-foreground"
            )}
          >
            {item.title}
          </TOCItem>
        </li>
      ))}
    </ul>
  )
}
