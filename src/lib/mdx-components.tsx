import defaultMdxComponents from "fumadocs-ui/mdx"
import { Steps, Step } from "fumadocs-ui/components/steps"
import { Tab, Tabs } from "fumadocs-ui/components/tabs"
import { TypeTable } from "fumadocs-ui/components/type-table"

import { ComponentPreview } from "@/components/component-preview"
import { ComponentSource } from "@/components/component-source"
import { ComponentTree } from "@/components/component-tree"

export const mdxComponents = {
  ...defaultMdxComponents,
  Steps,
  Step,
  Tab,
  Tabs,
  TypeTable,
  ComponentPreview,
  ComponentSource,
  ComponentTree,
}
