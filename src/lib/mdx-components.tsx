import defaultMdxComponents from "fumadocs-ui/mdx"

import { Accordion, Accordions } from "@/components/accordion"
import { CodeBlock, CodeBlockTab, CodeBlockTabs, CodeBlockTabsList, CodeBlockTabsTrigger } from "@/components/codeblock"
import { ComponentPreview } from "@/components/component-preview"
import { ComponentSource } from "@/components/component-source"
import { ComponentTree } from "@/components/component-tree"
import { File, Files, Folder } from "@/components/files"
import { Step, Steps } from "@/components/steps"
import { Tab, Tabs } from "@/components/tabs"
import { TypeTable } from "@/components/type-table"

export const mdxComponents = {
  ...defaultMdxComponents,
  Accordion,
  Accordions,
  CodeBlock,
  CodeBlockTab,
  CodeBlockTabs,
  CodeBlockTabsList,
  CodeBlockTabsTrigger,
  ComponentPreview,
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
