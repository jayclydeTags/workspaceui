import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { getComponentExamples } from "@/lib/component-examples"
import { getComponentPages } from "@/lib/component-pages"
import { getApiReference } from "@/lib/api-reference"
import { shadcnDocsUrl, shadcnInstallCommand } from "@/lib/shadcn-components"
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
  const page = getComponentPages().find((p) => p.slug === slug)
  if (!page) return {}
  return { title: page.title, description: page.description }
}

export default async function ComponentPage({ params }: PageProps) {
  const { slug } = await params
  const pages = getComponentPages()
  const index = pages.findIndex((p) => p.slug === slug)
  const page = pages[index]
  if (!page) notFound()

  const link = (p?: { title: string; href: string }) =>
    p && { title: p.title, href: p.href }
  const shared = {
    slug,
    title: page.title,
    description: page.description,
    prev: link(pages[index - 1]),
    next: link(pages[index + 1]),
  }

  // shadcn/ui primitives: a playground, the install command and a link to the
  // official docs. Their API tables live on ui.shadcn.com, not here.
  if (page.origin === "shadcn") {
    return renderStudio(slug, {
      ...shared,
      examples: [],
      install: shadcnInstallCommand(slug),
      docsUrl: shadcnDocsUrl(slug),
      api: [],
    })
  }

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

  return renderStudio(slug, {
    ...shared,
    examples,
    install: `npx shadcn@latest add jayclydeTags/workspaceui/${slug}`,
    api: getApiReference(slug),
  })
}
