import { readFileSync } from "fs"
import { join } from "path"

export interface ComponentExample {
  /** Example file name under registry/bases/base/examples (no extension). */
  name: string
  label: string
}

// The URL a fumadocs page is actually served from.
export function pageHref(page: { url: string; slugs: string[] }): string {
  return page.slugs[0] === "components" && page.slugs.length > 1
    ? `/components/${page.slugs.slice(1).join("/")}`
    : page.url
}

const PREVIEW_RE = /<ComponentPreview\s+name="([^"]+)"/
const HEADING_RE = /^#{2,4}\s+(.+?)\s*$/

// Every <ComponentPreview name="…"> in a component's mdx, in document order,
// labelled by the heading above it. The page-level preview (name === slug,
// before any heading) is the "Overview".
export function getComponentExamples(slug: string): ComponentExample[] {
  const text = readFileSync(
    join(
      /*turbopackIgnore: true*/ process.cwd(),
      "src/content/docs/components",
      `${slug}.mdx`
    ),
    "utf-8"
  )

  const examples: ComponentExample[] = []
  let heading: string | undefined
  let inFence = false

  for (const line of text.split("\n")) {
    if (line.trimStart().startsWith("```")) inFence = !inFence
    if (inFence) continue

    const headingMatch = HEADING_RE.exec(line)
    if (headingMatch) heading = headingMatch[1]

    const previewMatch = PREVIEW_RE.exec(line)
    if (previewMatch) {
      const name = previewMatch[1]!
      examples.push({
        name,
        label: name === slug || !heading ? "Overview" : heading,
      })
    }
  }
  return examples
}
