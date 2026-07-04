import { createSearchAPI } from "fumadocs-core/search/server"

import { source } from "@/lib/source"
import { blocksNav } from "@/lib/nav"

// Static export: staticGET builds the index at `next build` and the client
// (RootProvider search type "static") fetches it. Replaces the custom
// generate-search-index.mjs script + public/api/search.json.
//
// "simple" (title/description) matches the previous shallow index, and lets us
// merge docs pages with the blocks gallery — fumadocs' createFromSource would
// only cover MDX docs and silently drop blocks from search.
export const revalidate = false

const entry = (
  id: string,
  url: string,
  title: string,
  description?: string
) => ({
  id,
  url,
  title,
  description,
  // simple index requires `content`; use title + description as the
  // searchable text (matches the old shallow index).
  content: [title, description].filter(Boolean).join(" — "),
})

const server = createSearchAPI("simple", {
  indexes: [
    ...source
      .getPages()
      .map((page) =>
        entry(page.url, page.url, page.data.title ?? page.url, page.data.description)
      ),
    ...blocksNav.flatMap((section) =>
      section.items.map((item) =>
        entry(item.href, item.href, item.title, item.description)
      )
    ),
  ],
})

export const GET = server.staticGET
