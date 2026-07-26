import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
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
    <Tabs defaultValue="preview" className={cn("mt-6", className)}>
      <TabsList>
        <TabsTrigger value="preview" className="flex-none">
          Preview
        </TabsTrigger>
        <TabsTrigger value="code" className="flex-none">
          Code
        </TabsTrigger>
      </TabsList>
      <TabsContent
        value="preview"
        className="flex min-h-[400px] items-center justify-center rounded-xl border bg-fd-background p-4 outline-none"
      >
        {children}
      </TabsContent>
      <TabsContent value="code">
        <DynamicCodeBlock
          lang="tsx"
          code={code}
          codeblock={{ allowCopy: true, className: "my-0" }}
        />
      </TabsContent>
    </Tabs>
  )
}
