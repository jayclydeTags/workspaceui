import type { ComponentProps } from "react"
import NextLink from "next/link"
import NextImage from "next/image"

import { cn } from "@/lib/utils"
import { Heading } from "@/components/mdx-heading"
import { Accordion, Accordions } from "@/components/mdx-accordion"
import { Callout } from "@/components/callout"
import { CodeBlock, Pre, CodeBlockTab, CodeBlockTabs, CodeBlockTabsList, CodeBlockTabsTrigger } from "@/components/codeblock"
import { ComponentPreview } from "@/components/component-preview"
import { ComponentsIndex } from "@/components/components-index"
import { ComponentSource } from "@/components/component-source"
import { ComponentTree } from "@/components/component-tree"
import { File, Files, Folder } from "@/components/files"
import { Step, Steps } from "@/components/steps"
import { Tab, Tabs } from "@/components/mdx-tabs"
import { TypeTable } from "@/components/type-table"

function MdxLink({ href = "#", children, ...props }: ComponentProps<"a">) {
  const isExternal = /^\w+:/.test(href) || href.startsWith("//")
  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noreferrer noopener" {...props}>
        {children}
      </a>
    )
  }
  return (
    <NextLink href={href} {...props}>
      {children}
    </NextLink>
  )
}

export const mdxComponents = {
  h1: (props: ComponentProps<"h1">) => (
    <Heading as="h1" className="mt-2 text-3xl font-bold tracking-tight" {...props} />
  ),
  h2: (props: ComponentProps<"h2">) => (
    <Heading
      as="h2"
      className="mt-10 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0"
      {...props}
    />
  ),
  h3: (props: ComponentProps<"h3">) => (
    <Heading as="h3" className="mt-8 text-xl font-semibold tracking-tight" {...props} />
  ),
  h4: (props: ComponentProps<"h4">) => (
    <Heading as="h4" className="mt-6 text-lg font-semibold tracking-tight" {...props} />
  ),
  h5: (props: ComponentProps<"h5">) => <Heading as="h5" className="mt-6 font-semibold" {...props} />,
  h6: (props: ComponentProps<"h6">) => <Heading as="h6" className="mt-6 font-semibold" {...props} />,
  p: (props: ComponentProps<"p">) => <p className="leading-7 [&:not(:first-child)]:mt-4" {...props} />,
  ul: (props: ComponentProps<"ul">) => <ul className="my-4 ml-6 list-disc [&>li]:mt-1.5" {...props} />,
  ol: (props: ComponentProps<"ol">) => <ol className="my-4 ml-6 list-decimal [&>li]:mt-1.5" {...props} />,
  blockquote: (props: ComponentProps<"blockquote">) => (
    <blockquote className="mt-4 border-l-2 pl-4 text-muted-foreground italic" {...props} />
  ),
  hr: (props: ComponentProps<"hr">) => <hr className="my-6 border-border" {...props} />,
  a: MdxLink,
  img: (props: ComponentProps<typeof NextImage>) => (
    <NextImage
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 900px"
      className={cn("rounded-lg", props.className)}
      {...props}
    />
  ),
  table: (props: ComponentProps<"table">) => (
    <div className="my-6 w-full overflow-x-auto">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  thead: (props: ComponentProps<"thead">) => <thead className="border-b" {...props} />,
  tr: (props: ComponentProps<"tr">) => <tr className="border-b last:border-0" {...props} />,
  th: (props: ComponentProps<"th">) => (
    <th className="px-3 py-2 text-left font-medium" {...props} />
  ),
  td: (props: ComponentProps<"td">) => <td className="px-3 py-2" {...props} />,
  pre: (props: ComponentProps<"pre">) => (
    <CodeBlock {...props}>
      <Pre>{props.children}</Pre>
    </CodeBlock>
  ),
  CodeBlockTab,
  CodeBlockTabs,
  CodeBlockTabsList,
  CodeBlockTabsTrigger,
  Accordion,
  Accordions,
  Callout,
  ComponentPreview,
  ComponentsIndex,
  ComponentSource,
  ComponentTree,
  File,
  Files,
  Folder,
  Step,
  Steps,
  Tab,
  Tabs,
  TypeTable,
}
