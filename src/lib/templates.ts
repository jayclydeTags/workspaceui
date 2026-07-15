import { existsSync, readFileSync, readdirSync } from "fs"
import { join } from "path"

export interface TemplateMeta {
  slug: string // directory name; also derives the zip path and detail URL
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

// Standalone starter projects live at the repo-top-level `templates/<slug>/`,
// each carrying a colocated `template.json`. This aggregator fs-reads every
// manifest at build time (Turbopack can't do raw imports — same pattern as the
// blocks source reads) and exposes the typed list to the catalog UI. It holds
// no hand-maintained data itself, so adding a template needs no edit here.
const TEMPLATES_DIR = join(process.cwd(), "templates")

function loadTemplates(): TemplateMeta[] {
  if (!existsSync(TEMPLATES_DIR)) return []
  return readdirSync(TEMPLATES_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory() && existsSync(join(TEMPLATES_DIR, e.name, "template.json")))
    .map((e) => JSON.parse(readFileSync(join(TEMPLATES_DIR, e.name, "template.json"), "utf-8")) as TemplateMeta)
}

export const templates: TemplateMeta[] = loadTemplates()

export function getTemplate(slug: string): TemplateMeta | undefined {
  return templates.find((t) => t.slug === slug)
}

// Detail-page and download paths are derived from the slug, never stored — avoids drift.
export function templateUrl(slug: string): string {
  return `/templates/${slug}`
}

export function templateZipPath(slug: string): string {
  return `/templates/${slug}.zip`
}
