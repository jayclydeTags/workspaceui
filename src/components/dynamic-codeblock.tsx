"use client"

import { createContext, use } from "react"
import { cn } from "@/lib/cn"
import { CodeBlock, Pre, type CodeBlockProps } from "@/components/codeblock"
import { useShikiDynamic } from "fumadocs-core/highlight/shiki/react"
import { defaultShikiFactory } from "fumadocs-core/highlight/shiki/full"

interface DynamicCodeBlockProps {
  lang: string
  code: string
  codeblock?: CodeBlockProps
}

const CodeblockPropsContext = createContext<CodeBlockProps | undefined>(undefined)

function DefaultPre(props: React.ComponentProps<"pre">) {
  const extraProps = use(CodeblockPropsContext)
  return (
    <CodeBlock
      {...extraProps}
      className={cn("my-0", props.className, extraProps?.className)}
    >
      <Pre>{props.children}</Pre>
    </CodeBlock>
  )
}

export function DynamicCodeBlock({ lang, code, codeblock }: DynamicCodeBlockProps) {
  const node = useShikiDynamic(
    () => defaultShikiFactory.getOrInit(),
    code,
    {
      lang,
      defaultColor: false,
      themes: { light: "github-light", dark: "github-dark" },
      components: { pre: DefaultPre },
    },
    [lang, code]
  )

  return (
    <CodeblockPropsContext value={codeblock}>
      {node ?? <DefaultPre>{code}</DefaultPre>}
    </CodeblockPropsContext>
  )
}

export type { DynamicCodeBlockProps }
