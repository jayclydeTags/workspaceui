import { readFileSync } from "fs"
import { join } from "path"

export type ApiBlock =
  | { type: "heading"; text: string }
  | { type: "text"; text: string }
  | { type: "list"; items: string[] }
  | { type: "table"; columns: string[]; rows: string[][] }

const SECTION_RE = /^##\s+API Reference\s*$/
const H2_RE = /^##\s+/
const HEADING_RE = /^#{3,6}\s+(.+?)\s*$/
const SEPARATOR_RE = /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)*\|?$/

// Splits a markdown table row on unescaped pipes (`\|` stays a literal pipe).
function splitRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split(/(?<!\\)\|/)
    .map((cell) => cell.replace(/\\\|/g, "|").trim())
}

// The "## API Reference" section of a component's mdx as plain data — headings,
// paragraphs, lists and tables — so the studio's inspector can lay it out for a
// narrow column instead of rendering mdx. Fenced code and anything else is
// skipped.
export function parseApiReference(mdx: string): ApiBlock[] {
  const lines = mdx.split("\n")
  const start = lines.findIndex((line) => SECTION_RE.test(line))
  if (start === -1) return []

  const blocks: ApiBlock[] = []
  let paragraph: string[] = []
  let list: string[] = []
  let inFence = false

  const flush = () => {
    if (paragraph.length) {
      blocks.push({ type: "text", text: paragraph.join(" ") })
      paragraph = []
    }
    if (list.length) {
      blocks.push({ type: "list", items: list })
      list = []
    }
  }

  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i]!
    if (line.trimStart().startsWith("```")) {
      flush()
      inFence = !inFence
      continue
    }
    if (inFence) continue
    if (H2_RE.test(line) && !line.startsWith("###")) break

    const heading = HEADING_RE.exec(line)
    if (heading) {
      flush()
      blocks.push({ type: "heading", text: heading[1]! })
      continue
    }

    if (
      line.trimStart().startsWith("|") &&
      SEPARATOR_RE.test(lines[i + 1] ?? "")
    ) {
      flush()
      const columns = splitRow(line)
      const rows: string[][] = []
      i += 2
      while (i < lines.length && lines[i]!.trimStart().startsWith("|")) {
        rows.push(splitRow(lines[i]!))
        i++
      }
      i--
      blocks.push({ type: "table", columns, rows })
      continue
    }

    const item = /^\s*[-*]\s+(.*)$/.exec(line)
    if (item) {
      if (paragraph.length) flush()
      list.push(item[1]!)
      continue
    }

    if (line.trim() === "") {
      flush()
      continue
    }
    // continuation of a list item, or a paragraph line
    if (list.length) list[list.length - 1] += ` ${line.trim()}`
    else paragraph.push(line.trim())
  }
  flush()
  return blocks
}

export function getApiReference(slug: string): ApiBlock[] {
  return parseApiReference(
    readFileSync(
      join(
        /*turbopackIgnore: true*/ process.cwd(),
        "src/content/docs/components",
        `${slug}.mdx`
      ),
      "utf-8"
    )
  )
}
