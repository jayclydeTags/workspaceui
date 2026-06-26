import { useState, useEffect } from "react"
import { codeToHtml } from "shiki"

import { CopyButton } from "@/components/copy-button"

interface CodeBlockProps {
  code: string
  lang?: string
  filename?: string
}

export function CodeBlock({ code, lang = "tsx", filename }: CodeBlockProps) {
  const [html, setHtml] = useState("")

  useEffect(() => {
    codeToHtml(code, {
      lang,
      themes: { light: "github-light", dark: "github-dark" },
      defaultColor: false,
    }).then(setHtml)
  }, [code, lang])

  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-muted/30">
      {filename && (
        <div className="flex items-center gap-2 border-b border-border px-4 py-2 text-xs text-muted-foreground">
          <span>{filename}</span>
        </div>
      )}
      <div className="relative">
        <div
          className="overflow-x-auto p-4 text-sm [&_.shiki]:bg-transparent! [&_pre]:bg-transparent!"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <CopyButton
          value={code}
          className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100"
        />
      </div>
    </div>
  )
}

export function InlineCode({ code }: { code: string }) {
  const [html, setHtml] = useState("")

  useEffect(() => {
    codeToHtml(code, {
      lang: "bash",
      themes: { light: "github-light", dark: "github-dark" },
      defaultColor: false,
    }).then(setHtml)
  }, [code])

  return (
    <div className="group relative flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-4 py-3">
      <div
        className="flex-1 overflow-x-auto text-sm [&_.shiki]:bg-transparent! [&_pre]:bg-transparent!"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <CopyButton value={code} />
    </div>
  )
}
