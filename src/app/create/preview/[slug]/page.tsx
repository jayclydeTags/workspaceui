import { Suspense } from "react"
import { notFound } from "next/navigation"

import { createFontVariables } from "@/app/create/fonts"
import { PreviewThemeBridge } from "@/components/create/preview-theme-bridge"
import { blockComponents } from "@/lib/blocks"
import { CREATE_PREVIEWS } from "@/lib/create-previews"

type PageProps = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return CREATE_PREVIEWS.map(({ slug }) => ({ slug }))
}

// Bare iframe target for the /create canvas — same idea as
// blocks/preview/[slug], plus the theme bridge and the creator's fonts.
export default async function CreatePreviewFrame({ params }: PageProps) {
  const { slug } = await params
  const Component = CREATE_PREVIEWS.some((p) => p.slug === slug)
    ? blockComponents[slug]
    : undefined
  if (!Component) notFound()

  return (
    <div className="h-dvh">
      {/* useSearchParams needs a Suspense boundary under static export. */}
      <Suspense>
        <PreviewThemeBridge fontVariables={createFontVariables} />
      </Suspense>
      <Component />
    </div>
  )
}
