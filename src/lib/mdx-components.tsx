import type { ComponentProps } from "react"
import NextLink from "next/link"
import NextImage from "next/image"

import { cn } from "@/lib/utils"
import { Heading } from "@/components/mdx-heading"
import { Accordion, Accordions } from "@/components/mdx-accordion"
import { Callout } from "@/components/callout"
import {
  CodeBlock,
  Pre,
  CodeBlockTab,
  CodeBlockTabs,
  CodeBlockTabsList,
  CodeBlockTabsTrigger,
} from "@/components/codeblock"
import { CodeBlockCommand } from "@/components/code-block-command"
import { CodeTabs } from "@/components/code-tabs"
import { ComponentPreview } from "@/components/component-preview"
import { ComponentsIndex } from "@/components/components-index"
import { ComponentSource } from "@/components/component-source"
import { ComponentTree } from "@/components/component-tree"
import { File, Files, Folder } from "@/components/files"
import { Step, Steps } from "@/components/steps"
import { TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
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
  h1: (props: ComponentProps<"h1">) => <Heading as="h1" {...props} />,
  h2: (props: ComponentProps<"h2">) => <Heading as="h2" {...props} />,
  h3: (props: ComponentProps<"h3">) => <Heading as="h3" {...props} />,
  h4: (props: ComponentProps<"h4">) => <Heading as="h4" {...props} />,
  h5: (props: ComponentProps<"h5">) => <Heading as="h5" {...props} />,
  h6: (props: ComponentProps<"h6">) => <Heading as="h6" {...props} />,
  a: MdxLink,
  img: (props: ComponentProps<typeof NextImage>) => (
    <NextImage
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 900px"
      className={cn("rounded-lg", props.className)}
      {...props}
    />
  ),
  pre: (props: ComponentProps<"pre">) => (
    <CodeBlock {...props}>
      <Pre>{props.children}</Pre>
    </CodeBlock>
  ),
  // Plain markdown tables shrink-to-fit and wrap cell text by default (see
  // typeset.css); wide tables (long API reference descriptions) read better
  // scrolling horizontally at their natural width instead. Wrapping every
  // markdown table here means .mdx content stays pure markdown — no
  // per-table JSX wrapper needed.
  table: (props: ComponentProps<"table">) => (
    <div className="typeset-scroll">
      <table {...props} />
    </div>
  ),
  CodeBlockTab,
  CodeBlockTabs,
  CodeBlockTabsList,
  CodeBlockTabsTrigger,
  CodeBlockCommand,
  CodeTabs,
  TabsList,
  TabsTrigger,
  TabsContent,
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
  TypeTable,
}
