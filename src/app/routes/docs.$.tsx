import { useParams } from "react-router"
import { DocsPage, DocsBody, DocsTitle, DocsDescription } from "fumadocs-ui/page"

import { useDocumentTitle } from "@/lib/use-document-title"
import { getPage } from "@/lib/source"
import { mdxComponents } from "@/lib/mdx-components"

export default function DocPage() {
  const params = useParams()
  const slug = (params["*"] ?? "").split("/").filter(Boolean)
  const page = getPage(slug)

  useDocumentTitle(page?.frontmatter.title ?? "")

  if (!page) {
    return (
      <DocsPage>
        <DocsBody>
          <h1 className="text-3xl font-bold">Page not found</h1>
        </DocsBody>
      </DocsPage>
    )
  }

  const MDX = page.default

  return (
    <DocsPage toc={page.toc}>
      <DocsTitle>{page.frontmatter.title}</DocsTitle>
      {page.frontmatter.description && (
        <DocsDescription>{page.frontmatter.description}</DocsDescription>
      )}
      <DocsBody>
        <MDX components={mdxComponents} />
      </DocsBody>
    </DocsPage>
  )
}
