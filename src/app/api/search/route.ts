import { createSearchAPI } from "fumadocs-core/search/server"

import { source } from "@/lib/source"
import { pageHref } from "@/lib/component-examples"
import { getBlocksNav } from "@/lib/block-taxonomy"
import { copyBlocks } from "@/lib/copy-blocks"
import registry from "../../../../registry.json"

// registry.json is the one place a block's description has to live (the shadcn
// CLI ships it), so the gallery data files don't keep their own copy. Read here
// rather than in nav.ts: this route is build-time only, and the manifest is
// ~90KB that nav.ts would otherwise pull into every route's bundle. Copy-only
// blocks keep theirs in lib/copy-blocks.
const blockDescriptions = new Map<string, string>([
  ...registry.items
    .filter((item) => item.type === "registry:block")
    .map((item) => [`/blocks/${item.name}`, item.description] as const),
  ...copyBlocks.map(
    (block) => [`/blocks/${block.slug}`, block.description] as const
  ),
])

// Static export: staticGET builds the index at `next build` and the client
// (RootProvider search type "static") fetches it. Replaces the custom
// generate-search-index.mjs script + public/api/search.json.
//
// Uses "advanced" (not "simple"): fumadocs-core 16.10.6's orama-static client
// passes the DB wrapper — not the inner orama db — to searchSimple, so "simple"
// static search throws and silently returns nothing. The "advanced" path passes
// db.db correctly. We merge docs pages with the blocks gallery, which fumadocs'
// createFromSource wouldn't cover.
export const revalidate = false

// Shallow structuredData (title + description) matches the previous index —
// advanced entries require it, so synthesize one searchable content block.
const entry = (url: string, title: string, description?: string) => ({
  id: url,
  url,
  title,
  description,
  structuredData: {
    headings: [],
    contents: [
      {
        heading: "",
        content: [title, description].filter(Boolean).join(". "),
      },
    ],
  },
})

const server = createSearchAPI("advanced", {
  indexes: [
    ...source
      .getPages()
      .map((page) =>
        entry(
          pageHref(page),
          page.data.title ?? page.url,
          page.data.description
        )
      ),
    ...getBlocksNav().flatMap((section) =>
      [
        ...(section.items ?? []),
        ...(section.groups ?? []).flatMap((g) => g.items),
      ].map((item) =>
        entry(item.href, item.title, blockDescriptions.get(item.href))
      )
    ),
  ],
})

export const GET = server.staticGET
