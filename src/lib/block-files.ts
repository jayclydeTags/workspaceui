import registry from "../../registry.json"

// Source-file manifest for each block's Code tab. `src` is the path (relative
// to the block's registry dir) read at build time via fs; `path` is the display
// path shown in the file tree.
//
// Derived from registry.json rather than hand-listed: the manifest already
// declares every block's files so `npx shadcn add` can install them, and a
// second hand-maintained copy drifts silently. Server-only — the /blocks/[slug]
// route reads sources with fs, so the ~90KB manifest never reaches the client.
export interface BlockFileRef {
  name: string
  path: string
  src: string
}

const REGISTRY_DIR = "src/registry/bases/base/blocks"

// registry.json's inferred item type is a union (theme-only items have no
// files), so name the file shape blocks actually have.
interface RegistryFile {
  path: string
  target?: string
}

// A file's display path is the install `target` when the registry declares one
// (that's where the consumer's copy lands). Files without a target are the
// block's own internals, shown under the same app/… vs components/… split the
// targets use.
function displayPath(slug: string, src: string, target?: string) {
  if (target) return target
  return src.includes("/")
    ? `components/blocks/${slug}/${src}`
    : `app/${slug}/${src}`
}

export const blockFiles: Record<string, BlockFileRef[]> = Object.fromEntries(
  registry.items
    .filter((item) => item.type === "registry:block")
    .map((item) => {
      const prefix = `${REGISTRY_DIR}/${item.name}/`
      const refs = ((item.files ?? []) as RegistryFile[]).map((file) => {
        const src = file.path.slice(prefix.length)
        return {
          name: src.slice(src.lastIndexOf("/") + 1),
          path: displayPath(item.name, src, file.target),
          src,
        }
      })
      return [item.name, refs]
    })
)
