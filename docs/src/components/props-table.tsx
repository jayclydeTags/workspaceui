interface Prop {
  name: string
  type: string
  default?: string
  description: string
  required?: boolean
}

export function PropsTable({ props }: { props: Prop[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            <th className="px-4 py-3 text-left font-medium text-foreground">
              Prop
            </th>
            <th className="px-4 py-3 text-left font-medium text-foreground">
              Type
            </th>
            <th className="px-4 py-3 text-left font-medium text-foreground">
              Default
            </th>
            <th className="px-4 py-3 text-left font-medium text-foreground">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop) => (
            <tr
              key={prop.name}
              className="border-b border-border last:border-0 hover:bg-muted/20"
            >
              <td className="px-4 py-3">
                <code className="font-mono text-xs">
                  {prop.name}
                  {prop.required && (
                    <span className="ml-1 text-destructive">*</span>
                  )}
                </code>
              </td>
              <td className="px-4 py-3">
                <code className="font-mono text-xs text-muted-foreground">
                  {prop.type}
                </code>
              </td>
              <td className="px-4 py-3">
                {prop.default ? (
                  <code className="font-mono text-xs text-muted-foreground">
                    {prop.default}
                  </code>
                ) : (
                  <span className="text-muted-foreground/50">—</span>
                )}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {prop.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
