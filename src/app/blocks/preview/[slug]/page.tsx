import { notFound } from "next/navigation"

import { blocks } from "@/lib/blocks"

type PageProps = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return blocks.map((b) => ({ slug: b.slug }))
}

// Standalone block render for the BlockPreview iframe. Lives outside the
// blocks/(browse) group, so it inherits only the root layout — no site nav or
// sidebar. Its own document + window means the block's viewport breakpoints and
// useIsMobile react to the iframe width, not the browser's.
export default async function BlockPreviewFrame({ params }: PageProps) {
  const { slug } = await params
  const block = blocks.find((b) => b.slug === slug)
  if (!block) notFound()
  const { Component } = block
  return (
    <div className="h-dvh">
      <Component />
    </div>
  )
}
