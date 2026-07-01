import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "fs"
import { join, relative } from "path"
import { fileURLToPath } from "url"
import { create, insertMultiple, save } from "@orama/orama"

const __dir = fileURLToPath(new URL("..", import.meta.url))
const contentDir = join(__dir, "src/content/docs")

// Schema required by fumadocs-core's searchAdvanced
const schema = {
  content: "string",
  page_id: "string",
  type: "string",
  breadcrumbs: "string[]",
  tags: "enum[]",
  url: "string",
}

function extractFrontmatter(text) {
  const match = text.replace(/\r\n/g, "\n").match(/^---\n([\s\S]*?)\n---/)
  if (!match) return {}
  return Object.fromEntries(
    match[1].split("\n").flatMap((line) => {
      const i = line.indexOf(":")
      if (i === -1) return []
      return [[line.slice(0, i).trim(), line.slice(i + 1).trim()]]
    })
  )
}

function getMdxFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? getMdxFiles(join(dir, e.name)) : e.name.endsWith(".mdx") ? [join(dir, e.name)] : []
  )
}

const db = await create({ schema, language: "english" })
const files = getMdxFiles(contentDir)
const docs = []

for (const file of files) {
  const fm = extractFrontmatter(readFileSync(file, "utf-8"))
  const slug = relative(contentDir, file).replace(/\.mdx$/, "").replace(/\\/g, "/")
  const url = `/docs/${slug}`
  const title = fm.title ?? slug.split("/").pop() ?? "Untitled"
  docs.push({ id: url, page_id: url, type: "page", content: title, breadcrumbs: [], tags: [], url })
  if (fm.description) docs.push({ id: `${url}-desc`, page_id: url, type: "text", content: fm.description, breadcrumbs: [], tags: [], url })
}

await insertMultiple(db, docs)
mkdirSync(join(__dir, "public/api"), { recursive: true })
writeFileSync(join(__dir, "public/api/search.json"), JSON.stringify({ type: "advanced", ...(await save(db)) }))
console.log(`Search index: ${files.length} pages → public/api/search.json`)
