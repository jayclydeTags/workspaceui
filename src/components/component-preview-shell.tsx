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
      className={cn(
        "bg-fd-secondary my-4 flex flex-col gap-0 overflow-hidden rounded-xl border",
        className
      )}
    >
      <TabsList
        variant="line"
        className="w-full justify-start overflow-x-auto overflow-y-hidden px-4"
      >
        <TabsTrigger value="preview" className="flex-none">
          Preview
        </TabsTrigger>
        <TabsTrigger value="code" className="flex-none">
          Code
        </TabsTrigger>
      </TabsList>
      <TabsContent
        value="preview"
        className="bg-fd-background flex min-h-[350px] items-center justify-center rounded-xl p-4 outline-none"
      >
        {children}
      </TabsContent>
      <TabsContent
        value="code"
        className="bg-fd-background rounded-xl p-4 outline-none [&>figure:only-child]:-m-4 [&>figure:only-child]:border-none"
      >
        <DynamicCodeBlock
          lang="tsx"
          code={code}
          codeblock={{ allowCopy: true, className: "my-0" }}
        />
      </TabsContent>
    </Tabs>
  )
}
