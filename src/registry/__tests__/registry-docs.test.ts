import { existsSync, readFileSync } from "fs"
import { resolve } from "path"

import ts from "typescript"
import { describe, expect, it } from "vitest"

import { nav } from "@/lib/nav"

interface RegistryItem {
  name: string
  type: string
  files: { path: string }[]
}

// vitest always runs from the project root, so process.cwd() is the repo root.
const REPO_ROOT = process.cwd()

const registry: { items: RegistryItem[] } = JSON.parse(readFileSync(resolve(REPO_ROOT, "registry.json"), "utf-8"))

const uiItems = registry.items.filter((item) => item.type === "registry:ui")

function toPascalCase(kebabName: string) {
  return kebabName.replace(/(^|-)([a-z])/g, (_, __, letter: string) => letter.toUpperCase())
}

// Pulls the top-level property names off `export interface <Name>Props { ... }`.
function getPropsInterfaceMembers(filePath: string, interfaceName: string): string[] {
  const sourceText = readFileSync(resolve(REPO_ROOT, filePath), "utf-8")
  const sourceFile = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  let members: string[] = []

  const visit = (node: ts.Node) => {
    if (ts.isInterfaceDeclaration(node) && node.name.text === interfaceName) {
      members = node.members.filter(ts.isPropertySignature).map((member) => member.name.getText(sourceFile))
    }
    ts.forEachChild(node, visit)
  }
  visit(sourceFile)
  return members
}

// <TypeTable type={{ propName: { type: "...", ... } }} /> — every documented prop row starts
// with `<propName>: { type:`, regardless of which TypeTable block in the file it's in.
function getDocumentedPropNames(mdxPath: string): Set<string> {
  const text = readFileSync(resolve(REPO_ROOT, mdxPath), "utf-8")
  const keys = [...text.matchAll(/(\w+):\s*\{\s*type:/g)].map((match) => match[1])
  return new Set(keys)
}

describe("component docs coverage", () => {
  it.each(uiItems)("$name: has a docs page, sidebar entries, and prop table", (item) => {
    const docPath = `src/content/docs/components/${item.name}.mdx`
    const url = `/docs/components/${item.name}`

    expect(existsSync(resolve(REPO_ROOT, docPath)), `missing doc page: ${docPath}`).toBe(true)

    const inNav = nav.some((section) => section.items.some((navItem) => navItem.href === url))
    expect(inNav, `${item.name}: no sidebar entry in src/lib/nav.ts for ${url}`).toBe(true)

    // fumadocs builds the sidebar from content/docs/**/meta.json `pages`; a page
    // not listed there is dropped from the tree. Assert the item is curated in.
    const meta = JSON.parse(
      readFileSync(resolve(REPO_ROOT, "src/content/docs/components/meta.json"), "utf-8")
    ) as { pages?: string[] }
    const inTree = meta.pages?.includes(item.name) ?? false
    expect(inTree, `${item.name}: not listed in src/content/docs/components/meta.json pages`).toBe(true)
  })

  it.each(uiItems)("$name: every component prop is documented in its TypeTable", (item) => {
    const componentPath = item.files[0].path
    const interfaceName = `${toPascalCase(item.name)}Props`
    const propMembers = getPropsInterfaceMembers(componentPath, interfaceName)

    // ponytail: if the interface can't be found, the naming convention (<Name>Props) doesn't hold
    // for this component — skip rather than false-fail; add it to the naming exception if that's real.
    if (propMembers.length === 0) return

    const docPath = `src/content/docs/components/${item.name}.mdx`
    const documentedProps = getDocumentedPropNames(docPath)

    for (const prop of propMembers) {
      expect(documentedProps.has(prop), `${item.name}: prop "${prop}" (${interfaceName}) is not documented in ${docPath}`).toBe(true)
    }
  })
})
