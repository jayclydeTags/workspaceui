// Builds one downloadable zip per template into public/templates/<slug>.zip.
//
// Uses `git archive` — no new dependency, and .gitignore *is* the exclude list
// (node_modules, build output, etc. are excluded for free). Ceiling: it archives
// committed state, so a template must be committed for its zip to reflect edits;
// switch to a dedicated archiver if working-tree zipping is ever needed.
//
// Wired to prebuild/predev (pnpm auto-runs pre-scripts) so zips exist during
// `next dev` and are copied into the static export by `next build`.
import { execFileSync } from "node:child_process"
import { existsSync, mkdirSync, readdirSync } from "node:fs"
import { join } from "node:path"

const root = process.cwd()
const templatesDir = join(root, "templates")
const outDir = join(root, "public", "templates")

if (!existsSync(templatesDir)) process.exit(0)
mkdirSync(outDir, { recursive: true })

for (const entry of readdirSync(templatesDir, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue
  const slug = entry.name
  const zip = join(outDir, `${slug}.zip`)
  try {
    execFileSync("git", ["archive", "--format=zip", "--output", zip, `HEAD:templates/${slug}`], {
      stdio: ["ignore", "ignore", "inherit"],
    })
    console.log(`zipped templates/${slug} → public/templates/${slug}.zip`)
  } catch {
    // Not yet committed (git archive reads HEAD only) — skip rather than break the build.
    console.warn(`skipped templates/${slug}: not found in HEAD (commit it to publish its zip)`)
  }
}
