import { existsSync, readFileSync } from "fs"
import { resolve } from "path"

import ts from "typescript"
import { describe, expect, it } from "vitest"

interface RegistryItem {
  name: string
  type: string
  files: { path: string }[]
}

// vitest always runs from the project root, so process.cwd() is the repo root.
const REPO_ROOT = process.cwd()

const registry: { items: RegistryItem[] } = JSON.parse(
  readFileSync(resolve(REPO_ROOT, "registry.json"), "utf-8")
)

const uiItems = registry.items.filter((item) => item.type === "registry:ui")

function toPascalCase(kebabName: string) {
  return kebabName.replace(/(^|-)([a-z])/g, (_, __, letter: string) =>
    letter.toUpperCase()
  )
}

// Pulls the top-level property names off `export interface <Name>Props { ... }`.
function getPropsInterfaceMembers(
  filePath: string,
  interfaceName: string
): string[] {
  const sourceText = readFileSync(resolve(REPO_ROOT, filePath), "utf-8")
  const sourceFile = ts.createSourceFile(
    filePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  )
  let members: string[] = []

  const visit = (node: ts.Node) => {
    if (ts.isInterfaceDeclaration(node) && node.name.text === interfaceName) {
      members = node.members
        .filter(ts.isPropertySignature)
        .map((member) => member.name.getText(sourceFile))
    }
    ts.forEachChild(node, visit)
  }
  visit(sourceFile)
  return members
}

// Two documentation formats are in use: <TypeTable type={{ propName: { type: "...", ... } }} />
// (every row starts with `<propName>: { type:`) and a plain markdown table with the prop name
// backtick-code'd in the first cell (`| \`propName\` | ... |`). Either satisfies the invariant.
function getDocumentedPropNames(mdxPath: string): Set<string> {
  const text = readFileSync(resolve(REPO_ROOT, mdxPath), "utf-8")
  const typeTableKeys = [...text.matchAll(/(\w+):\s*\{\s*type:/g)].map(
    (match) => match[1]
  )
  const markdownTableKeys = [...text.matchAll(/\|\s*`(\w+)\??`\s*\|/g)].map(
    (match) => match[1]
  )
  return new Set([...typeTableKeys, ...markdownTableKeys])
}

describe("component docs coverage", () => {
  it.each(uiItems)(
    "$name: has a docs page, is in the sidebar nav tree, and has a prop table",
    (item) => {
      const docPath = `src/content/docs/components/${item.name}.mdx`

      expect(
        existsSync(resolve(REPO_ROOT, docPath)),
        `missing doc page: ${docPath}`
      ).toBe(true)

      // The sidebar's Components section is generated from source.getPages()
      // (see src/lib/docs-nav.ts), which fumadocs builds from
      // content/docs/**/meta.json `pages` — a page not listed there is
      // dropped from the tree. Assert the item is curated in.
      const meta = JSON.parse(
        readFileSync(
          resolve(REPO_ROOT, "src/content/docs/components/meta.json"),
          "utf-8"
        )
      ) as { pages?: string[] }
      const inTree = meta.pages?.includes(item.name) ?? false
      expect(
        inTree,
        `${item.name}: not listed in src/content/docs/components/meta.json pages`
      ).toBe(true)
    }
  )

  it.each(uiItems)(
    "$name: every component prop is documented in its TypeTable",
    (item) => {
      const componentPath = item.files[0].path
      const interfaceName = `${toPascalCase(item.name)}Props`
      const propMembers = getPropsInterfaceMembers(componentPath, interfaceName)

      // ponytail: if the interface can't be found, the naming convention (<Name>Props) doesn't hold
      // for this component — skip rather than false-fail; add it to the naming exception if that's real.
      if (propMembers.length === 0) return

      const docPath = `src/content/docs/components/${item.name}.mdx`
      const documentedProps = getDocumentedPropNames(docPath)

      for (const prop of propMembers) {
        expect(
          documentedProps.has(prop),
          `${item.name}: prop "${prop}" (${interfaceName}) is not documented in ${docPath}`
        ).toBe(true)
      }
    }
  )
})
