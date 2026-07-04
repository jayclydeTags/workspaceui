import { readFileSync } from "fs"
import { join } from "path"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { BlockPreview } from "@/components/block-preview"
import { blocks } from "@/lib/blocks"
import { blockFiles } from "@/lib/block-files"

type PageProps = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return blocks.map((b) => ({ slug: b.slug }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const block = blocks.find((b) => b.slug === slug)
  return { title: block?.title }
}

export default async function BlockPage({ params }: PageProps) {
  const { slug } = await params
  const block = blocks.find((b) => b.slug === slug)
  const refs = blockFiles[slug]
  if (!block || !refs) notFound()

  // Read each registry source at build time (replaces Vite `?raw` imports).
  const base = join(process.cwd(), "src/registry/bases/base/blocks", slug)
  const files = refs.map((ref) => ({
    name: ref.name,
    path: ref.path,
    code: readFileSync(join(base, ref.src), "utf-8"),
  }))

  return (
    <BlockPreview
      title={block.title}
      slug={slug}
      installCmd={`npx shadcn@latest add jayclydeTags/workspaceui/${slug}`}
      files={files}
    />
  )
}
