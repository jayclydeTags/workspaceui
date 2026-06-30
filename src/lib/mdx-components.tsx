import { CodeBlock, InlineCode } from "@/components/code-block"
import { Callout } from "@/components/callout"
import { Steps, Step } from "@/components/steps"
import { CodeTabs } from "@/components/code-tabs"
import { ComponentPreview } from "@/components/component-preview"
import { ComponentSource } from "@/components/component-source"
import { ComponentTree } from "@/components/component-tree"
import { PropsTable } from "@/components/props-table"
import { MdxPre } from "@/components/mdx-pre"

// HTML element overrides mirror the inline className patterns used in the old TSX pages.
// Named component overrides are used as <ComponentName /> in MDX files.
export const mdxComponents = {
  pre: MdxPre,
  h2: ({ children, ...props }: React.ComponentProps<"h2">) => (
    <h2 className="text-xl font-semibold" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: React.ComponentProps<"h3">) => (
    <h3 className="text-base font-medium" {...props}>
      {children}
    </h3>
  ),
  p: ({ children, ...props }: React.ComponentProps<"p">) => (
    <p className="text-muted-foreground" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }: React.ComponentProps<"ul">) => (
    <ul className="list-disc space-y-2 pl-4 text-sm text-muted-foreground" {...props}>
      {children}
    </ul>
  ),
  strong: ({ children, ...props }: React.ComponentProps<"strong">) => (
    <strong className="text-foreground" {...props}>
      {children}
    </strong>
  ),
  // className present → inside a fenced code block (Shiki adds e.g. "language-tsx")
  // className absent  → inline backtick code
  code: ({ className, children, ...props }: React.ComponentProps<"code">) =>
    className ? (
      <code className={className} {...props}>
        {children}
      </code>
    ) : (
      <code className="font-mono text-xs" {...props}>
        {children}
      </code>
    ),
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
