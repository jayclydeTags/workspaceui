import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { source } from "@/lib/source"
import { getComponentExamples } from "@/lib/component-examples"
import { getComponentPages } from "@/lib/component-pages"
import { getApiReference } from "@/lib/api-reference"
import { hasStory, renderStudio } from "@/lib/story-registry"
import { ExampleDemo, hasExample } from "@/components/docs/component-preview"

type PageProps = { params: Promise<{ slug: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return getComponentPages().map(({ slug }) => ({ slug }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const page = source.getPage(["components", slug])
  if (!page) return {}
  return { title: page.data.title, description: page.data.description }
}

export default async function ComponentPage({ params }: PageProps) {
  const { slug } = await params
  const page = source.getPage(["components", slug])
  if (!page) notFound()

  // With a story the canvas is the playground (plus its variants) and nothing
  // else. Without one, the mdx's examples are all there is to put on it.
  const examples = hasStory(slug)
    ? []
    : getComponentExamples(slug)
        .filter(({ name }) => hasExample(name))
        .map(({ name, label }) => ({
          id: name,
          label,
          node: <ExampleDemo name={name} />,
        }))

  const pages = getComponentPages()
  const index = pages.findIndex((p) => p.slug === slug)
  const link = (p?: { title: string; href: string }) =>
    p && { title: p.title, href: p.href }

  return renderStudio(slug, {
    slug,
    title: page.data.title,
    description: page.data.description,
    examples,
    prev: link(pages[index - 1]),
    next: link(pages[index + 1]),
    install: `npx shadcn@latest add jayclydeTags/workspaceui/${slug}`,
    api: getApiReference(slug),
  })
}
