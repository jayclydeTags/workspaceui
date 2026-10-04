import { readFileSync } from "fs"
import { join } from "path"
import { DynamicCodeBlock } from "@/components/docs/dynamic-codeblock"
import { getRegistrySourcePath } from "@/lib/registry-files"

interface ComponentSourceProps {
  name: string
  filename?: string
}

// Server component: read the registry source at build time instead of Vite's
// `?raw` import (unsupported by Turbopack). Runs once per page at static export.
export function ComponentSource({ name, filename }: ComponentSourceProps) {
  const path = getRegistrySourcePath(name)
  if (!path) return null

  const src = readFileSync(
    join(/*turbopackIgnore: true*/ process.cwd(), path),
    "utf-8"
  )
  const lang = path.endsWith(".ts") ? "ts" : "tsx"

  return (
    <DynamicCodeBlock
      lang={lang}
      code={src}
      codeblock={{ title: filename ?? `components/ui/${name}.${lang}` }}
    />
  )
}
