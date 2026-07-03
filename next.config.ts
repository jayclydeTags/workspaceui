import type { NextConfig } from "next"
import { createMDX } from "fumadocs-mdx/next"

const withMDX = createMDX()

const config: NextConfig = {
  // Static export — matches the previous react-router `ssr: false` SPA:
  // `next build` emits fully static HTML/JS to `out/`, no server needed.
  output: "export",
  // Static export can't use the Image Optimization server.
  images: { unoptimized: true },
}

export default withMDX(config)
