import type { ApiBlock } from "@/lib/api-reference"

// Backtick spans become <code>; markdown links are reduced to their text.
function Inline({ text }: { text: string }) {
  const plain = text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\*\*/g, "")
  return plain.split("`").map((part, i) =>
    i % 2 === 1 ? (
      <code
        key={i}
        className="rounded bg-muted px-1 py-0.5 text-xs break-words"
      >
        {part}
      </code>
    ) : (
      part
    )
  )
}

const isEmpty = (value: string) => value === "" || value === "-"

// The API tables are 4-column markdown tables, too wide for the inspector, so
// each row becomes a stacked entry: name, type, description, default.
export function ApiReference({ blocks }: { blocks: ApiBlock[] }) {
  return (
    <div className="flex flex-col gap-3">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "heading":
            return (
              <h3 key={i} className="mt-2 text-xs font-medium">
                {block.text}
              </h3>
            )
          case "text":
            return (
              <p key={i} className="text-xs text-muted-foreground">
                <Inline text={block.text} />
              </p>
            )
          case "list":
            return (
              <ul
                key={i}
                className="list-disc ps-4 text-xs text-muted-foreground"
              >
                {block.items.map((item, j) => (
                  <li key={j}>
                    <Inline text={item} />
                  </li>
                ))}
              </ul>
            )
          case "table":
            return (
              <dl key={i} className="flex flex-col">
                {block.rows.map((row, r) => (
                  <ApiRow key={r} columns={block.columns} row={row} />
                ))}
              </dl>
            )
        }
      })}
    </div>
  )
}

function ApiRow({ columns, row }: { columns: string[]; row: string[] }) {
  const cell = (name: string) => {
    const index = columns.findIndex((c) => c.toLowerCase() === name)
    return index === -1 ? "" : (row[index] ?? "")
  }
  const type = cell("type")
  const description = cell("description")
  const fallback = columns.length > 0 && !type && !description
  const def = cell("default")

  return (
    <div className="flex flex-col gap-1 border-t py-2.5 first:border-t-0 first:pt-0">
      <dt className="text-xs font-medium">
        <Inline text={row[0] ?? ""} />
      </dt>
      <dd className="flex flex-col gap-1 text-xs text-muted-foreground">
        {!isEmpty(type) && (
          <span>
            <Inline text={type} />
          </span>
        )}
        {fallback &&
          row.slice(1).map(
            (value, i) =>
              !isEmpty(value) && (
                <span key={i}>
                  <Inline text={value} />
                </span>
              )
          )}
        {!isEmpty(description) && (
          <span>
            <Inline text={description} />
          </span>
        )}
        {!isEmpty(def) && (
          <span>
            Default: <Inline text={def} />
          </span>
        )}
      </dd>
    </div>
  )
}
