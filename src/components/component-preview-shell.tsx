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
    <Tabs
      defaultValue="preview"
      className={cn("my-4 gap-0 overflow-hidden rounded-xl border", className)}
    >
      <TabsList variant="line" className="w-full justify-start px-4">
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
      </TabsList>
      <TabsContent
        value="preview"
        className="flex min-h-[350px] items-center justify-center border-t p-4"
      >
        {children}
      </TabsContent>
      <TabsContent value="code" className="border-t">
        <DynamicCodeBlock
          lang="tsx"
          code={code}
          codeblock={{ allowCopy: true, className: "my-0 rounded-none border-0" }}
        />
      </TabsContent>
    </Tabs>
  )
}
