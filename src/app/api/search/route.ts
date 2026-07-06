import { createSearchAPI } from "fumadocs-core/search/server"

import { source } from "@/lib/source"
import { blocksNav } from "@/lib/nav"

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
      { heading: "", content: [title, description].filter(Boolean).join(". ") },
    ],
  },
})

const server = createSearchAPI("advanced", {
  indexes: [
    ...source
      .getPages()
      .map((page) =>
        entry(page.url, page.data.title ?? page.url, page.data.description)
      ),
    ...blocksNav.flatMap((section) =>
      [...(section.items ?? []), ...(section.groups ?? []).flatMap((g) => g.items)].map(
        (item) => entry(item.href, item.title, item.description)
      )
    ),
  ],
})

export const GET = server.staticGET
