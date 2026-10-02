"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { DynamicCodeBlock } from "@/components/docs/dynamic-codeblock"
import { cn } from "@/lib/utils"

interface ComponentPreviewShellProps {
  children: React.ReactNode
  code: string
  className?: string
}

export function ComponentPreviewShell({
  children,
  code,
  className,
}: ComponentPreviewShellProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className={cn(
        "mt-6 mb-12 flex flex-col overflow-clip rounded-2xl border bg-fd-background",
        className
      )}
    >
      <div className="flex h-[300px] items-center justify-center overflow-hidden p-4 [&>*]:max-h-full!">
        {children}
      </div>
      <div className="relative border-t">
        <div className={cn(!expanded && "max-h-[210px] overflow-clip")}>
          <DynamicCodeBlock
            lang="tsx"
            code={code}
            codeblock={{
              allowCopy: expanded,
              className: "my-0 rounded-none border-0 bg-muted/40",
              viewportProps: {
                className: cn(expanded ? "max-h-[289px]" : "max-h-[210px]"),
              },
            }}
          />
        </div>
        {!expanded && (
          <div className="absolute inset-0 flex items-center justify-center pb-4">
            <div className="absolute inset-0 bg-gradient-to-t from-fd-background via-fd-background/60 to-transparent" />
            <Button
              variant="outline"
              onClick={() => setExpanded(true)}
              className="relative"
            >
              View Code
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
