import type { FC } from "react"
import type { TOCItemType } from "fumadocs-core/toc"

type DocModule = {
  default: FC<{ components?: Record<string, unknown> }>
  frontmatter: { title: string; description?: string }
  toc: TOCItemType[]
}

const modules = import.meta.glob<DocModule>("/content/docs/**/*.mdx", { eager: true })

export function getPage(slug: string[]) {
  const path = `/content/docs/${slug.join("/")}.mdx`
  return modules[path]
}
