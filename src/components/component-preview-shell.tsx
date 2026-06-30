import { Tabs, TabsList, TabsTrigger, TabsContent } from "fumadocs-ui/components/tabs"
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock"

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
  return (
    <Tabs defaultValue="preview" className={cn("overflow-hidden rounded-xl border border-border", className)}>
      <TabsList>
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
      </TabsList>
      <TabsContent value="preview">
        <div
          className="flex min-h-[350px] items-center justify-center p-8"
          style={{
            backgroundImage: "radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        >
          {children}
        </div>
      </TabsContent>
      <TabsContent value="code">
        <DynamicCodeBlock lang="tsx" code={code} codeblock={{ allowCopy: true, className: "my-0 rounded-none border-none shadow-none" }} />
      </TabsContent>
    </Tabs>
  )
}
