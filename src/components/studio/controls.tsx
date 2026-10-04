"use client"

import { useId, useState } from "react"

import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { ControlDef } from "@/components/studio/types"

interface ControlProps {
  name: string
  def: ControlDef
  value: unknown
  onChange: (value: unknown) => void
}

const UNSET = "__unset__"

export function Control({ name, def, value, onChange }: ControlProps) {
  const id = useId()
  const label = def.label ?? name

  const heading = (
    <div className="flex items-baseline justify-between gap-2">
      <Label htmlFor={id}>{label}</Label>
      <code className="text-xs text-muted-foreground">{name}</code>
    </div>
  )
  const description = def.description && (
    <p className="text-xs text-muted-foreground">{def.description}</p>
  )

  if (def.type === "boolean") {
    return (
      <div className="grid gap-1.5">
        <div className="flex items-center gap-2">
          <Checkbox
            id={id}
            aria-label={label}
            checked={value === true}
            onCheckedChange={(checked) => onChange(checked)}
          />
          <Label htmlFor={id} className="flex-1">
            {label}
          </Label>
          <code className="text-xs text-muted-foreground">{name}</code>
        </div>
        {description}
      </div>
    )
  }

  return (
    <div className="grid gap-1.5">
      {heading}
      {def.type === "text" &&
        (def.multiline ? (
          <Textarea
            id={id}
            value={typeof value === "string" ? value : ""}
            placeholder={def.placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
        ) : (
          <Input
            id={id}
            value={typeof value === "string" ? value : ""}
            placeholder={def.placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
        ))}
      {def.type === "number" && (
        <DraftInput
          id={id}
          value={value}
          type="number"
          inputMode="decimal"
          min={def.min}
          max={def.max}
          step={def.step}
          format={(v) => (typeof v === "number" ? String(v) : "")}
          parse={(text) => {
            if (text.trim() === "") return { ok: true, value: undefined }
            const n = Number(text)
            return Number.isFinite(n) ? { ok: true, value: n } : { ok: false }
          }}
          onChange={onChange}
        />
      )}
      {def.type === "numbers" && (
        <DraftInput
          id={id}
          value={value}
          placeholder="e.g. 31, 34, 33, 38"
          format={(v) => (Array.isArray(v) ? v.join(", ") : "")}
          parse={(text) => {
            const parts = text
              .split(",")
              .map((part) => part.trim())
              .filter(Boolean)
            const numbers = parts.map(Number)
            return numbers.every(Number.isFinite)
              ? { ok: true, value: numbers }
              : { ok: false }
          }}
          onChange={onChange}
        />
      )}
      {def.type === "select" && (
        <Select
          value={typeof value === "string" ? value : UNSET}
          onValueChange={(next) => onChange(next === UNSET ? undefined : next)}
          items={[
            ...(def.allowUnset ? [{ value: UNSET, label: "Unset" }] : []),
            ...def.options.map((option) => ({ value: option, label: option })),
          ]}
        >
          <SelectTrigger id={id} className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {def.allowUnset && <SelectItem value={UNSET}>Unset</SelectItem>}
            {def.options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {description}
    </div>
  )
}

type Parsed = { ok: true; value: unknown } | { ok: false }

// A text field that edits a non-string value. It keeps its own draft so
// in-progress input ("1.", "31, ") isn't clobbered by the parsed value being
// re-formatted, and resyncs only when the value changes from outside (Reset).
function DraftInput({
  value,
  format,
  parse,
  onChange,
  ...props
}: Omit<React.ComponentProps<typeof Input>, "value" | "onChange"> & {
  value: unknown
  format: (value: unknown) => string
  parse: (text: string) => Parsed
  onChange: (value: unknown) => void
}) {
  const [draft, setDraft] = useState(() => format(value))
  const [committed, setCommitted] = useState(value)
  const [invalid, setInvalid] = useState(false)

  if (JSON.stringify(committed) !== JSON.stringify(value)) {
    setCommitted(value)
    setDraft(format(value))
    setInvalid(false)
  }

  return (
    <Input
      {...props}
      value={draft}
      aria-invalid={invalid || undefined}
      onChange={(e) => {
        const text = e.target.value
        setDraft(text)
        const parsed = parse(text)
        setInvalid(!parsed.ok)
        if (parsed.ok) {
          setCommitted(parsed.value)
          onChange(parsed.value)
        }
      }}
    />
  )
}
