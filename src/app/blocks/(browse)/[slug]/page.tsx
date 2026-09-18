import { readFileSync } from "fs"
import { join } from "path"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { BlockPreview, type BlockFile } from "@/components/block-preview"
import { galleryComponents } from "@/lib/blocks"
import { getBlockTitle } from "@/lib/block-taxonomy"
import { blockFiles } from "@/lib/block-files"
import { COPY_BLOCKS_DIR, getCopyBlock } from "@/lib/copy-blocks"

type PageProps = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return Object.keys(galleryComponents).map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  return { title: getBlockTitle(slug) }
}

// Read each block source at build time (replaces Vite `?raw` imports).
function readSources(slug: string): BlockFile[] | undefined {
  const copyBlock = getCopyBlock(slug)
  if (copyBlock) {
    const base = join(process.cwd(), COPY_BLOCKS_DIR, slug)
    return copyBlock.files.map((file) => ({
      name: file.slice(file.lastIndexOf("/") + 1),
      path: `components/${slug}/${file}`,
      code: readFileSync(join(base, file), "utf-8"),
    }))
  }

  const refs = blockFiles[slug]
  if (!refs) return undefined
  const base = join(process.cwd(), "src/registry/bases/base/blocks", slug)
  return refs.map((ref) => ({
    name: ref.name,
    path: ref.path,
    code: readFileSync(join(base, ref.src), "utf-8"),
  }))
}

export default async function BlockPage({ params }: PageProps) {
  const { slug } = await params
  const title = getBlockTitle(slug)
  const files = readSources(slug)
  if (!title || !files) notFound()

  return (
    <BlockPreview
      title={title}
      slug={slug}
      // Copy-only blocks aren't in registry.json, so there's nothing to install.
      installCmd={
        getCopyBlock(slug)
          ? undefined
          : `npx shadcn@latest add jayclydeTags/workspaceui/${slug}`
      }
      files={files}
    />
  )
}
