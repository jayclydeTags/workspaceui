import { useParams } from "react-router-dom"

import { useDocumentTitle } from "@/lib/use-document-title"
import { getPage } from "@/lib/source"
import { mdxComponents } from "@/lib/mdx-components"

export function DocPage() {
  const params = useParams()
  const slug = (params["*"] ?? "").split("/").filter(Boolean)
  const page = getPage(slug)

  useDocumentTitle(page?.frontmatter.title ?? "")

  if (!page) {
    return (
      <article className="space-y-10">
        <h1 className="text-3xl font-bold">Page not found</h1>
      </article>
    )
  }

  const MDX = page.default

  return (
    <article className="space-y-10">
      <div>
        {slug[0] === "components" && (
          <p className="mb-1 text-sm text-muted-foreground">Components</p>
        )}
        <h1 className="mb-3 text-3xl font-bold">{page.frontmatter.title}</h1>
      </div>
      <MDX components={mdxComponents} />
    </article>
  )
}
