import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { source } from "@/lib/source"
import { getPageMarkdown } from "@/lib/page-markdown"
import { mdxComponents } from "@/lib/mdx-components"
import { DocsPageLayout } from "@/components/docs/docs-toc"
import { DocsPager, getAdjacentDocs } from "@/components/docs/docs-pager"
import { DocsPageActions } from "@/components/docs/docs-page-actions"

type PageProps = { params: Promise<{ slug?: string[] }> }

// Component pages are served from /components/<slug>; only prose lives here.
export const dynamicParams = false

export function generateStaticParams() {
  return source.generateParams().filter((p) => p.slug?.[0] !== "components")
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const page = source.getPage(slug)
  if (!page) return {}
  return { title: page.data.title, description: page.data.description }
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params
  const page = source.getPage(slug)
  if (!page || page.slugs[0] === "components") notFound()

  const MDX = page.data.body
  const markdown = await getPageMarkdown(page)
  const { prev, next } = getAdjacentDocs(slug)

  return (
    <DocsPageLayout toc={page.data.toc}>
      <div className="typeset typeset-docs w-full max-w-[42em] min-w-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="mt-0">{page.data.title}</h1>
            {page.data.description && <p>{page.data.description}</p>}
          </div>
          <DocsPageActions markdown={markdown} prev={prev} next={next} />
        </div>
        <MDX components={mdxComponents} />
        <DocsPager slug={slug} />
      </div>
    </DocsPageLayout>
  )
}
