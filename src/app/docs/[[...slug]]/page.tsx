import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { source } from "@/lib/source"
import { mdxComponents } from "@/lib/mdx-components"
import { DocsPageLayout } from "@/components/docs-toc"

type PageProps = { params: Promise<{ slug?: string[] }> }

export function generateStaticParams() {
  return source.generateParams()
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
  if (!page) notFound()

  const MDX = page.data.body

  return (
    <DocsPageLayout toc={page.data.toc}>
      
      <div className="typeset typeset-docs max-w-[42em]">
        <h1 className="text-3xl font-bold tracking-tight">{page.data.title}</h1>
        {page.data.description && (
          <p className="mt-2 text-lg text-muted-foreground">
            {page.data.description}
          </p>
        )}
        <MDX components={mdxComponents} />
      </div>
    </DocsPageLayout>
  )
}
