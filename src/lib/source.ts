import type { FC } from "react"
import type { TOCItemType } from "fumadocs-core/toc"

type DocModule = {
  default: FC<{ components?: Record<string, unknown> }>
  frontmatter: { title: string; description?: string }
  toc: TOCItemType[]
}

const modules = import.meta.glob<DocModule>("/src/content/docs/**/*.mdx", { eager: true })

export function getPage(slug: string[]) {
  const path = `/src/content/docs/${slug.join("/")}.mdx`
  return modules[path]
}
