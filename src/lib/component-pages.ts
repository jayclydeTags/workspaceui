import { source } from "@/lib/source"
import type { NavSection } from "@/lib/nav"

export interface ComponentPage {
  slug: string
  title: string
  description?: string
  href: string
}

// Component docs are authored as fumadocs mdx under content/docs/components
// (so `source` still owns the frontmatter, meta.json order and markdown export)
// but are served from /components/<slug>, not /docs/components/<slug>.
export function getComponentPages(): ComponentPage[] {
  return source
    .getPages()
    .filter((page) => page.slugs[0] === "components" && page.slugs.length > 1)
    .map((page) => {
      const slug = page.slugs.slice(1).join("/")
      return {
        slug,
        title: page.data.title ?? slug,
        description: page.data.description,
        href: `/components/${slug}`,
      }
    })
    .sort((a, b) => a.title.localeCompare(b.title))
}

export function getComponentsNav(): NavSection[] {
  return [
    {
      title: "Components",
      items: getComponentPages().map(({ title, href }) => ({ title, href })),
    },
  ]
}
