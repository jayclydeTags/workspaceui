import { readFileSync } from "fs"
import { join } from "path"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { BlockPreview } from "@/components/block-preview"
import { blockComponents } from "@/lib/blocks"
import { getBlockTitle } from "@/lib/block-taxonomy"
import { blockFiles } from "@/lib/block-files"

type PageProps = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return Object.keys(blockComponents).map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  return { title: getBlockTitle(slug) }
}

export default async function BlockPage({ params }: PageProps) {
  const { slug } = await params
  const title = getBlockTitle(slug)
  const refs = blockFiles[slug]
  if (!title || !refs) notFound()

  // Read each registry source at build time (replaces Vite `?raw` imports).
  const base = join(process.cwd(), "src/registry/bases/base/blocks", slug)
  const files = refs.map((ref) => ({
    name: ref.name,
    path: ref.path,
    code: readFileSync(join(base, ref.src), "utf-8"),
  }))

  return (
    <BlockPreview
      title={title}
      slug={slug}
      installCmd={`npx shadcn@latest add jayclydeTags/workspaceui/${slug}`}
      files={files}
    />
  )
}
