import { source } from "@/lib/source"
import { nav, type NavSection } from "@/lib/nav"

// Server-only: reads compiled mdx frontmatter via `source`, which isn't safe
// to bundle into the client (sidebar-nav.tsx default `sections = nav` must
// stay static-data-only). Components section is generated from
// src/content/docs/components/*.mdx so a new component's doc page shows up
// here without a manual nav.ts edit.
export function getDocsNav(): NavSection[] {
  const componentItems = source
    .getPages()
    .filter((page) => page.slugs[0] === "components" && page.slugs.length > 1)
    .sort((a, b) => (a.data.title ?? "").localeCompare(b.data.title ?? ""))
    .map((page) => ({ title: page.data.title, href: page.url }))

  return [...nav, { title: "Components", items: componentItems }]
}
