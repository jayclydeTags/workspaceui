import type { NextConfig } from "next"

const config: NextConfig = {
  // Static export — a frontend-only app shell, no server runtime.
  output: "export",
  images: { unoptimized: true },
  // Pin the workspace root so a stray lockfile above doesn't confuse Next.
  turbopack: { root: __dirname },
}

export default config
