import { useParams } from "react-router"

import { blocks } from "@/lib/blocks"

// Standalone block render for the BlockPreview iframe. Trailing `_` on the
// `blocks_` segment opts this route out of the blocks.tsx layout, so it renders
// bare inside root.tsx — its own document + window, so the block's viewport
// breakpoints and useIsMobile react to the iframe width, not the browser's.
export default function BlockPreviewFrame() {
  const { slug } = useParams()
  const block = blocks.find((b) => b.slug === slug)
  if (!block) return null
  const { Component } = block
  return <Component />
}
