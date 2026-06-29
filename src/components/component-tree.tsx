import { CopyButton } from "@/components/copy-button"

export interface TreeNode {
  name: string
  children?: TreeNode[]
}

function buildLines(nodes: TreeNode[], prefix: string): string[] {
  return nodes.flatMap((node, i) => {
    const isLast = i === nodes.length - 1
    const connector = isLast ? "└─ " : "├─ "
    const childPrefix = prefix + (isLast ? "   " : "│  ")
    return [
      prefix + connector + node.name,
      ...(node.children ? buildLines(node.children, childPrefix) : []),
    ]
  })
}

function treeToText(root: TreeNode): string {
  return [root.name, ...buildLines(root.children ?? [], "")].join("\n")
}

function TreeLines({ nodes, prefix = "" }: { nodes: TreeNode[]; prefix?: string }) {
  return (
    <>
      {nodes.map((node, i) => {
        const isLast = i === nodes.length - 1
        const connector = isLast ? "└─ " : "├─ "
        const childPrefix = prefix + (isLast ? "   " : "│  ")
        return (
          <div key={node.name}>
            <div>
              <span className="select-none text-muted-foreground">{prefix}{connector}</span>
              <span className="text-primary">{node.name}</span>
            </div>
            {node.children && <TreeLines nodes={node.children} prefix={childPrefix} />}
          </div>
        )
      })}
    </>
  )
}

interface ComponentTreeProps {
  root: TreeNode
  description?: string
}

export function ComponentTree({ root, description }: ComponentTreeProps) {
  return (
    <div className="space-y-3">
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      <div className="relative rounded-lg border border-border bg-muted/30 px-4 py-3 font-mono text-sm">
        <CopyButton value={treeToText(root)} className="absolute right-3 top-3" />
        <div className="text-foreground">{root.name}</div>
        {root.children && <TreeLines nodes={root.children} />}
      </div>
    </div>
  )
}
