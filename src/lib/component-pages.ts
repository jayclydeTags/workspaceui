import { source } from "@/lib/source"
import { SHADCN_COMPONENTS } from "@/lib/shadcn-components"
import type { NavSection } from "@/lib/nav"

export interface ComponentPage {
  slug: string
  title: string
  description?: string
  href: string
  /** Whose component it is: this registry's, or a stock shadcn/ui primitive. */
  origin: "workspaceui" | "shadcn"
}

// WorkspaceUI's docs are authored as fumadocs mdx under content/docs/components
// (so `source` owns the frontmatter and meta.json) and served from
// /components/<slug>.
function getWorkspaceUIPages(): ComponentPage[] {
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
        origin: "workspaceui" as const,
      }
    })
    .sort((a, b) => a.title.localeCompare(b.title))
}

function getShadcnPages(): ComponentPage[] {
  return SHADCN_COMPONENTS.map(({ slug, title, description }) => ({
    slug,
    title,
    description,
    href: `/components/${slug}`,
    origin: "shadcn" as const,
  })).sort((a, b) => a.title.localeCompare(b.title))
}

// Sidebar order: WorkspaceUI's components, then shadcn/ui's. This is also the
// order the prev/next arrows walk and the page /components redirects into.
export function getComponentPages(): ComponentPage[] {
  return [...getWorkspaceUIPages(), ...getShadcnPages()]
}

export function getComponentsNav(): NavSection[] {
  const items = (origin: ComponentPage["origin"]) =>
    getComponentPages()
      .filter((page) => page.origin === origin)
      .map(({ title, href }) => ({ title, href }))

  return [
    { title: "WorkspaceUI", items: items("workspaceui") },
    { title: "shadcn/ui", items: items("shadcn") },
  ]
}
