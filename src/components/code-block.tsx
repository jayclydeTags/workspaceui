import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { codeToHtml } from "shiki"

import { cn } from "@/lib/utils"
import { CopyButton } from "@/components/copy-button"

interface CodeBlockProps {
  code: string
  lang?: string
  filename?: string
  collapsible?: boolean
}

export function CodeBlock({ code, lang = "tsx", filename, collapsible = false }: CodeBlockProps) {
  const [html, setHtml] = useState("")
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    codeToHtml(code, {
      lang,
      themes: { light: "github-light", dark: "github-dark" },
      defaultColor: false,
    }).then(setHtml)
  }, [code, lang])

  const collapsed = collapsible && !expanded
  const showHeader = !!filename || collapsible

  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-muted/30">
      {showHeader && (
        <div className="flex items-center justify-between border-b border-border px-4 py-2">
          <span className="text-xs text-muted-foreground">{filename ?? ""}</span>
          <div className="flex items-center gap-1">
            {collapsible && (
              <button
                onClick={() => setExpanded((e) => !e)}
                className="flex items-center gap-1 rounded px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {expanded ? (
                  <>
                    <ChevronUp className="size-3" />
                    Collapse
                  </>
                ) : (
                  <>
                    <ChevronDown className="size-3" />
                    Expand
                  </>
                )}
              </button>
            )}
            <CopyButton value={code} />
          </div>
        </div>
      )}

      <div className="relative">
        <div
          className={cn(
            "overflow-x-auto p-4 text-sm [&_.shiki]:bg-transparent! [&_pre]:bg-transparent!",
            collapsed && "max-h-[350px] overflow-hidden"
          )}
          dangerouslySetInnerHTML={{ __html: html }}
        />
        {collapsed && (
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background/90 to-transparent" />
        )}
        {!showHeader && <CopyButton value={code} className="absolute right-3 top-3" />}
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
