import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { source } from "@/lib/source"
import { mdxComponents } from "@/lib/mdx-components"
import { DocsPageLayout } from "@/components/docs-toc"
import { DocsPager, getAdjacentDocs } from "@/components/docs-pager"
import { DocsPageActions } from "@/components/docs-page-actions"

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
  const body = (await page.data.getText("processed"))
    // resolves `%%CODE_REF:NAME%%` markers left by the TypeTable/ComponentPreview
    // stringify overrides in source.config.ts for `code={someExportedConst}` refs
    .replace(/%%CODE_REF:(\w+)%%/g, (match, ref: string) => {
      const value = page.data._exports[ref]
      return typeof value === "string" ? `\`\`\`tsx\n${value}\n\`\`\`` : match
    })
    .replace(/\n{3,}/g, "\n\n")
    .trim()
  const frontmatter = (
    [
      ["title", page.data.title],
      ["description", page.data.description],
      ["url", page.url],
    ] as const
  )
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
    .join("\n")
  const markdown = `---\n${frontmatter}\n---\n\n${body}\n`
  const { prev, next } = getAdjacentDocs(slug)

  return (
    <DocsPageLayout toc={page.data.toc}>
      <div className="typeset typeset-docs max-w-[42em]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="mt-0">{page.data.title}</h1>
            {page.data.description && (
              <p>
                {page.data.description}
              </p>
            )}
          </div>
          <DocsPageActions markdown={markdown} prev={prev} next={next} />
        </div>
        <MDX components={mdxComponents} />
        <DocsPager slug={slug} />
      </div>
    </DocsPageLayout>
  )
}
