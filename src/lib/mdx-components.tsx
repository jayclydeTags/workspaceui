import { CodeBlock, InlineCode } from "@/components/code-block"
import { Callout } from "@/components/callout"
import { Steps, Step } from "@/components/steps"
import { CodeTabs } from "@/components/code-tabs"
import { ComponentPreview } from "@/components/component-preview"
import { ComponentSource } from "@/components/component-source"
import { ComponentTree } from "@/components/component-tree"
import { PropsTable } from "@/components/props-table"
import { MdxPre } from "@/components/mdx-pre"

// DocsBody handles prose typography — only override pre and named JSX components.
export const mdxComponents = {
  pre: MdxPre,
  CodeBlock,
  InlineCode,
  Callout,
  Steps,
  Step,
  CodeTabs,
  ComponentPreview,
  ComponentSource,
  ComponentTree,
  PropsTable,
}
