import { readFileSync } from "fs"
import { join } from "path"

interface RegistryItem {
  name: string
  files?: { path: string }[]
}

const REGISTRY_ROOT = "src/registry/bases/base/workspaceui"

// Maps a doc-page file name (e.g. "workspace-tabs") to its path in
// registry.json. Derived from the registry instead of hand-duplicated so
// every workspaceui file — including ones bundled into a multi-file item
// like "workspace" — is automatically available to <ComponentSource>.
function buildFileIndex(): Map<string, string> {
  const registry: { items: RegistryItem[] } = JSON.parse(
    readFileSync(
      join(/*turbopackIgnore: true*/ process.cwd(), "registry.json"),
      "utf-8"
    )
  )
  const index = new Map<string, string>()
  for (const item of registry.items) {
    for (const file of item.files ?? []) {
      if (!file.path.startsWith(`${REGISTRY_ROOT}/`)) continue
      const name = file.path
        .slice(REGISTRY_ROOT.length + 1)
        .replace(/\.tsx?$/, "")
      index.set(name, file.path)
    }
  }
  return index
}

let fileIndex: Map<string, string> | undefined

export function getRegistrySourcePath(name: string): string | undefined {
  fileIndex ??= buildFileIndex()
  return fileIndex.get(name)
}
