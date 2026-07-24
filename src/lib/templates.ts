import { existsSync, readFileSync, readdirSync } from "fs"
import { join } from "path"

export interface TemplateMeta {
  slug: string // manifest file basename; also derives the detail URL
  type: string // top-level catalog axis: Application | Website | Landing page
  title: string
  description: string
  category: string // domain grouping (e.g. Payroll)
  techStack: string[]
  createdDate: string // manual ISO
  updatedDate: string // manual ISO
  features: string[]
  pages: string[] // routes/pages included
  screenshots: string[] // public asset paths (e.g. /templates/<slug>/hero.png)
  liveDemoUrl?: string // optional; detail page hides the demo action when absent
}

// Template manifests live as `src/lib/templates/<slug>.json`. This aggregator
// fs-reads every manifest at build time (Turbopack can't do raw imports — same
// pattern as the blocks source reads) and exposes the typed list to the catalog
// UI. It holds no hand-maintained data itself, so adding a template needs no
// edit here — drop in a new JSON file.
// ponytail: plain JSON for now; migrate to a fumadocs content collection when
// template pages need MDX bodies.
const TEMPLATES_DIR = join(process.cwd(), "src", "lib", "templates")

function loadTemplates(): TemplateMeta[] {
  if (!existsSync(TEMPLATES_DIR)) return []
  return readdirSync(TEMPLATES_DIR)
    .filter((name) => name.endsWith(".json"))
    .map(
      (name) =>
        JSON.parse(
          readFileSync(join(TEMPLATES_DIR, name), "utf-8")
        ) as TemplateMeta
    )
    .sort((a, b) => a.title.localeCompare(b.title))
}

export const templates: TemplateMeta[] = loadTemplates()

export function getTemplate(slug: string): TemplateMeta | undefined {
  return templates.find((t) => t.slug === slug)
}

// A `pages` entry is "Route → source-block"; the block half is optional (a page
// not composed from a WorkspaceUI block, like a hand-rolled landing). Split on
// the arrow so the detail page can show each route and where it comes from —
// no schema change, just formatting of the existing string field.
export function parsePage(entry: string): { route: string; block?: string } {
  const [route, block] = entry.split("→").map((s) => s.trim())
  return block ? { route, block } : { route }
}
