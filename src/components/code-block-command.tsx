"use client"
import { useCopyButton } from "@fumadocs/base-ui/utils/use-copy-button"
import { Check, Clipboard, Terminal } from "lucide-react"
import { useRef } from "react"

import { useConfig } from "@/hooks/use-config"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"

export interface CodeBlockCommandProps {
  __npm__?: string
  __pnpm__?: string
  __yarn__?: string
  __bun__?: string
}

export function CodeBlockCommand({
  __npm__,
  __pnpm__,
  __yarn__,
  __bun__,
}: CodeBlockCommandProps) {
  const [config, setConfig] = useConfig()
  const preRef = useRef<HTMLPreElement>(null)

  const tabs = {
    npm: __npm__,
    pnpm: __pnpm__,
    yarn: __yarn__,
    bun: __bun__,
  }
  const available = Object.entries(tabs).filter(([, value]) => value)
  const value = tabs[config.packageManager]
    ? config.packageManager
    : available[0]?.[0]

  const [checked, onCopy] = useCopyButton(() => {
    void navigator.clipboard.writeText(preRef.current?.textContent ?? "")
  })

  return (
    <div className="relative my-4 overflow-hidden rounded-xl border bg-muted/40">
      <Tabs
        value={value}
        onValueChange={(v) =>
          setConfig({
            ...config,
            packageManager: v as "npm" | "pnpm" | "yarn" | "bun",
          })
        }
        className="gap-0"
      >
        <div className="flex items-center gap-2 border-b px-3 pt-1">
          <Terminal className="size-3.5 text-muted-foreground" />
          <TabsList variant="line" className="bg-transparent">
            {available.map(([key]) => (
              <TabsTrigger key={key} value={key}>
                {key}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {available.map(([key, command]) => (
          <TabsContent key={key} value={key} className="mt-0">
            <pre
              ref={preRef}
              className="mt-0 overflow-auto px-4 py-3.5 text-[0.8125rem]"
            >
              <code>{command}</code>
            </pre>
          </TabsContent>
        ))}
      </Tabs>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        className={cn(
          "absolute top-1.5 right-2 z-10 opacity-70 hover:opacity-100 focus-visible:opacity-100"
        )}
        onClick={onCopy}
      >
        <span className="sr-only">Copy</span>
        {checked ? <Check /> : <Clipboard />}
      </Button>
    </div>
  )
}
