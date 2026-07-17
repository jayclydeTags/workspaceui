import { defineConfig, defineDocs } from "fumadocs-mdx/config"
import { remarkNpm } from "fumadocs-core/mdx-plugins"

// Minimal shape of an MDX JSX node — avoids depending on mdast-util-mdx's
// types directly (transitive dep, not hoisted to top-level node_modules).
interface MdxJsxNode {
  type: string
  name?: string | null
  attributes?: Array<{
    type: string
    name?: string
    value?: string | { value?: string }
  }>
}

// TypeTable's `type` and ComponentPreview's `code` attrs are JS expressions
// written by us in trusted docs content (never user input) — safe to eval
// at build time to recover their literal value for the markdown export.
function evalExpr(src: string): unknown {
  try {
    return new Function(`"use strict"; return (${src});`)()
  } catch {
    return undefined
  }
}

function attrRaw(node: MdxJsxNode, name: string): string | undefined {
  const attr = node.attributes?.find((a) => a.type === "mdxJsxAttribute" && a.name === name)
  const value = attr?.value
  if (typeof value === "string") return value
  return value?.value
}

function stringifyTypeTable(node: MdxJsxNode): string | undefined {
  const raw = attrRaw(node, "type")
  const data = raw ? evalExpr(raw) : undefined
  if (!data || typeof data !== "object") return undefined

  const rows = Object.entries(data as Record<string, Record<string, unknown>>).map(
    ([prop, field]) => {
      const type = field.type ? `\`${field.type}\`` : ""
      const def = field.default ? `\`${field.default}\`` : ""
      const description = typeof field.description === "string" ? field.description : ""
      return `| \`${prop}\` | ${type} | ${def} | ${description} |`
    }
  )
  return ["| Prop | Type | Default | Description |", "| --- | --- | --- | --- |", ...rows].join("\n")
}

function stringifyComponentPreview(node: MdxJsxNode): string | undefined {
  const codeSrc = attrRaw(node, "code")
  const code = codeSrc ? evalExpr(codeSrc) : undefined
  if (typeof code === "string") return `\`\`\`tsx\n${code}\n\`\`\`\n`

  // `code` referenced a variable (e.g. `code={PREVIEW_CODE}`) whose
  // declaration is an mdxjsEsm node, filtered out of this output — leave a
  // marker for page.tsx to resolve from the compiled module's `_exports`,
  // which already holds the real evaluated value.
  if (codeSrc && /^[A-Za-z_$][\w$]*$/.test(codeSrc.trim())) {
    return `%%CODE_REF:${codeSrc.trim()}%%`
  }
  const name = attrRaw(node, "name")
  return name ? `_Live example: ${name}_` : undefined
}

export const { docs, meta } = defineDocs({
  dir: "src/content/docs",
  docs: {
    postprocess: {
      includeProcessedMarkdown: {
        stringify(node) {
          const n = node as unknown as MdxJsxNode
          if (n.type !== "mdxJsxFlowElement" && n.type !== "mdxJsxTextElement") return undefined
          if (n.name === "TypeTable") return stringifyTypeTable(n)
          if (n.name === "ComponentPreview") return stringifyComponentPreview(n)
          return undefined
        },
      },
    },
  },
})

// rehypeCode (github-light/dark, defaultColor: false) is included in the default fumadocs preset
export default defineConfig({
  mdxOptions: {
    remarkPlugins: (v) => [...v, remarkNpm],
  },
})
