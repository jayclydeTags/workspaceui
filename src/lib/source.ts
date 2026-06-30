import type { FC } from "react"

type DocModule = {
  default: FC<{ components?: Record<string, unknown> }>
  frontmatter: { title: string; description?: string }
  toc: Array<{ title: string; url: string; depth: number }>
}

// ponytail: eager glob — 5 pages, bundle cost is negligible
const modules = import.meta.glob<DocModule>("/content/docs/**/*.mdx", { eager: true })

export function getPage(slug: string[]) {
  const path = `/content/docs/${slug.join("/")}.mdx`
  return modules[path]
}
