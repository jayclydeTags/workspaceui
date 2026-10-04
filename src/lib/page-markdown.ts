import type { source } from "@/lib/source"

type Page = NonNullable<ReturnType<typeof source.getPage>>

// Markdown export behind the "Copy Page" action: frontmatter + the processed
// mdx body, with the TypeTable/ComponentPreview stringify placeholders resolved.
export async function getPageMarkdown(page: Page): Promise<string> {
  const body = (await page.data.getText("processed"))
    // resolves `%%CODE_REF:NAME%%` markers left by the TypeTable/ComponentPreview
    // stringify overrides in source.config.ts for `code={someExportedConst}` refs
    .replace(/%%CODE_REF:(\w+)%%/g, (match, ref: string) => {
      const value = page.data._exports[ref]
      return typeof value === "string" ? `\`\`\`tsx\n${value}\n\`\`\`` : match
    })
    .replace(/\n{3,}/g, "\n\n")
    .trim()
  const frontmatter = (
    [
      ["title", page.data.title],
      ["description", page.data.description],
      ["url", page.url],
    ] as const
  )
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
    .join("\n")
  return `---\n${frontmatter}\n---\n\n${body}\n`
}
