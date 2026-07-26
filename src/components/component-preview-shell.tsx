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
        "my-4 flex flex-col gap-0 overflow-hidden rounded-xl border bg-fd-secondary",
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
        className="flex min-h-[400px] items-center justify-center rounded-xl bg-fd-background p-4 outline-none"
      >
        {children}
      </TabsContent>
      <TabsContent
        value="code"
        // flex-1 (the TabsContent default) sets flex-basis: 0%, which makes the
        // browser ignore the h-[400px] utility entirely for sizing — height only
        // governs a flex item's main size when its flex-basis resolves to auto.
        // The inline style pins flex-basis back to auto so height (fixed, not a
        // floor) actually applies and the box can never grow past 400px.
        style={{ flex: "0 0 auto" }}
        className="flex h-[400px] flex-col overflow-hidden rounded-xl bg-fd-background p-4 outline-none [&>figure:only-child]:-m-4 [&>figure:only-child]:min-h-0 [&>figure:only-child]:flex-1 [&>figure:only-child]:overflow-hidden [&>figure:only-child]:border-none"
      >
        <DynamicCodeBlock
          lang="tsx"
          code={code}
          codeblock={{
            allowCopy: true,
            className: "my-0 flex min-h-0 flex-1 flex-col overflow-hidden",
            viewportProps: { className: "min-h-0 flex-1 max-h-none" },
          }}
        />
      </TabsContent>
    </Tabs>
  )
}
