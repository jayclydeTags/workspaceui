import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/mdx-tabs"
import { DynamicCodeBlock } from "@/components/dynamic-codeblock"

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
    <Tabs defaultValue="preview" className={cn("overflow-hidden rounded-xl", className)}>
      <TabsList>
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
      </TabsList>
      <TabsContent value="preview">
        <div className="flex min-h-[350px] items-center justify-center">
          {children}
        </div>
      </TabsContent>
      <TabsContent value="code">
        <DynamicCodeBlock lang="tsx" code={code} codeblock={{ allowCopy: true, className: "my-0 rounded-none" }} />
      </TabsContent>
    </Tabs>
  )
}
