/**
 * Generates static JSON files in docs/public/r/ that serve the registry data
 * at /r/*.json. These are served as static assets by Vite dev server and
 * copied into dist/ on build.
 *
 * Reads component source directly from the root registry/ui/ — no local copy needed.
 */
import { readFileSync, mkdirSync, writeFileSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const docsRoot = join(__dirname, "..")
const repoRoot = join(__dirname, "..", "..")

function readRegistryFile(filename) {
  return readFileSync(join(repoRoot, "registry", "ui", filename), "utf-8")
}

const SCHEMA = "https://ui.shadcn.com/schema/registry-item.json"

const registryItems = [
  {
    $schema: SCHEMA,
    name: "workspace-tabs",
    type: "registry:ui",
    title: "Workspace Tabs",
    description:
      "Chrome-style scrollable tab strip with closeable tabs, unread badges, overflow fade, and macOS-style curved active-tab connectors.",
    dependencies: ["lucide-react"],
    registryDependencies: ["utils"],
    files: [
      {
        path: "registry/ui/workspace-tabs.tsx",
        type: "registry:ui",
        content: readRegistryFile("workspace-tabs.tsx"),
      },
    ],
  },
  {
    $schema: SCHEMA,
    name: "workspace",
    type: "registry:ui",
    title: "Workspace",
    description:
      "Self-contained workspace with tab-based panels: closing a panel's last tab collapses the panel; closing all panels reveals a configurable fallback. Exposes useWorkspace context and a WorkspaceHandle ref for programmatic control.",
    dependencies: ["react-resizable-panels", "lucide-react"],
    registryDependencies: ["resizable", "workspace-tabs", "utils"],
    files: [
      {
        path: "registry/ui/workspace.tsx",
        type: "registry:ui",
        content: readRegistryFile("workspace.tsx"),
      },
    ],
  },
]

const publicR = join(docsRoot, "public", "r")
mkdirSync(publicR, { recursive: true })

for (const item of registryItems) {
  const outPath = join(publicR, `${item.name}.json`)
  writeFileSync(outPath, JSON.stringify(item, null, 2), "utf-8")
  console.log(`Generated ${outPath}`)
}
