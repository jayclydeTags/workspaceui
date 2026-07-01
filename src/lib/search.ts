import { create, insertMultiple, save } from "@orama/orama"

export type SearchIndexEntry = {
  title: string
  description: string
  url: string
  id: string
}

type DocModule = {
  frontmatter?: {
    title?: string
    description?: string
  }
}

// Schema required by fumadocs-core's searchAdvanced
const schema = {
  content: "string",
  page_id: "string",
  type: "string",
  breadcrumbs: "string[]",
  tags: "enum[]",
  url: "string",
} as const

const modules = import.meta.glob<DocModule>("/src/content/docs/**/*.mdx", { eager: true })

export async function buildSearchIndexEntries(): Promise<SearchIndexEntry[]> {
  return Object.entries(modules).map(([path, module]) => {
    const slug = path.replace("/src/content/docs/", "").replace(/\.mdx$/, "")
    const url = `/docs/${slug}`

    return {
      title: module.frontmatter?.title ?? slug.split("/").pop() ?? "Untitled",
      description: module.frontmatter?.description ?? "",
      url,
      id: url,
    }
  })
}

export async function buildSearchIndexPayload() {
  const entries = await buildSearchIndexEntries()
  const db = await create({ schema, language: "english" })

  const docs = entries.flatMap(({ id, title, description, url }) => [
    { id, page_id: id, type: "page", content: title, breadcrumbs: [] as string[], tags: [] as string[], url },
    ...(description ? [{ id: `${id}-desc`, page_id: id, type: "text", content: description, breadcrumbs: [] as string[], tags: [] as string[], url }] : []),
  ])

  await insertMultiple(db, docs)

  return {
    type: "advanced",
    ...(await save(db)),
  }
}
