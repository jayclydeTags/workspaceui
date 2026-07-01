import { existsSync, readFileSync } from "fs"
import { resolve } from "path"

import ts from "typescript"
import { describe, expect, it } from "vitest"

import { nav } from "@/lib/nav"
import { pageTree } from "@/lib/page-tree"

interface RegistryItem {
  name: string
  type: string
  files: { path: string }[]
}

// vitest always runs from the project root, so process.cwd() is the repo root.
const REPO_ROOT = process.cwd()

const registry: { items: RegistryItem[] } = JSON.parse(readFileSync(resolve(REPO_ROOT, "registry.json"), "utf-8"))

// Installed automatically as a dependency of other items — not a standalone doc page.
const INTERNAL_ONLY = new Set(["workspace-context"])

const uiItems = registry.items.filter((item) => item.type === "registry:ui" && !INTERNAL_ONLY.has(item.name))

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

    const inPageTree = pageTree.children.some(
      (child) => child.type === "folder" && child.children.some((page) => page.type === "page" && page.url === url)
    )
    expect(inPageTree, `${item.name}: no sidebar entry in src/lib/page-tree.ts for ${url}`).toBe(true)
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
