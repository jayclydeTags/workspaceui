"use client"

import * as React from "react"
import { CheckCircle2, Download, FileUp } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Page } from "@/registry/bases/base/workspaceui/page"
import {
  autoMap,
  parseCsv,
  SAMPLE_CSV,
  TARGET_FIELDS,
  toCsv,
  type ParsedCsv,
} from "./data"

const STEPS = ["Upload", "Map columns", "Done"] as const
const UNMAPPED = "__unmapped__"

export function ImportExport() {
  const [step, setStep] = React.useState(0)
  const [csvText, setCsvText] = React.useState("")
  const [parsed, setParsed] = React.useState<ParsedCsv>({
    headers: [],
    rows: [],
  })
  const [mapping, setMapping] = React.useState<Record<string, number>>({})

  function goToMapping() {
    const result = parseCsv(csvText)
    setParsed(result)
    setMapping(autoMap(result.headers, TARGET_FIELDS))
    setStep(1)
  }

  function reset() {
    setStep(0)
    setCsvText("")
    setParsed({ headers: [], rows: [] })
    setMapping({})
  }

  function exportCsv() {
    const blob = new Blob([toCsv(parsed.headers.length ? parsed.headers : TARGET_FIELDS.map((t) => t.key), parsed.rows)], {
      type: "text/csv",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "export.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Page
      title="Import / Export"
      subtitle="Bulk-load records from a CSV file"
      className="@container overflow-hidden"
      hasPadding
      actions={
        <Button size="sm" variant="outline" onClick={exportCsv}>
          <Download data-icon="inline-start" />
          Export CSV
        </Button>
      }
    >
      <div className="mx-auto flex h-full w-full max-w-2xl flex-col gap-6 overflow-auto">
        {/* ── Stepper ── */}
        <ol className="flex items-center gap-2 text-sm">
          {STEPS.map((label, i) => (
            <React.Fragment key={label}>
              <li className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex size-6 items-center justify-center rounded-full text-xs font-medium",
                    i < step && "bg-primary text-primary-foreground",
                    i === step &&
                      "border-2 border-primary text-foreground",
                    i > step && "border text-muted-foreground"
                  )}
                >
                  {i < step ? "✓" : i + 1}
                </span>
                <span
                  className={cn(
                    i === step ? "font-medium" : "text-muted-foreground"
                  )}
                >
                  {label}
                </span>
              </li>
              {i < STEPS.length - 1 && (
                <li aria-hidden className="h-px flex-1 bg-border" />
              )}
            </React.Fragment>
          ))}
        </ol>

        {/* ── Step 1: Upload ── */}
        {step === 0 && (
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="csv-input">Paste CSV data</FieldLabel>
              <Textarea
                id="csv-input"
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                placeholder="name,email,role,department&#10;Ada Lovelace,ada@acme.co,Admin,Engineering"
                rows={8}
                className="font-mono text-xs"
              />
            </Field>
            <div className="flex items-center justify-between gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setCsvText(SAMPLE_CSV)}
              >
                <FileUp data-icon="inline-start" />
                Load sample
              </Button>
              <Button onClick={goToMapping} disabled={csvText.trim() === ""}>
                Continue
              </Button>
            </div>
          </FieldGroup>
        )}

        {/* ── Step 2: Map columns ── */}
        {step === 1 && (
          <div className="flex flex-col gap-6">
            <FieldGroup>
              {TARGET_FIELDS.map((t) => (
                <Field key={t.key} orientation="horizontal">
                  <FieldLabel htmlFor={`map-${t.key}`} className="w-32 shrink-0">
                    {t.label}
                  </FieldLabel>
                  <Select
                    value={
                      mapping[t.key] >= 0 ? String(mapping[t.key]) : UNMAPPED
                    }
                    onValueChange={(v) =>
                      setMapping((prev) => ({
                        ...prev,
                        [t.key]: v === UNMAPPED ? -1 : Number(v),
                      }))
                    }
                  >
                    <SelectTrigger id={`map-${t.key}`} className="flex-1">
                      <SelectValue placeholder="Not mapped" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={UNMAPPED}>Not mapped</SelectItem>
                      {parsed.headers.map((h, i) => (
                        <SelectItem key={i} value={String(i)}>
                          {h}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              ))}
            </FieldGroup>

            {/* Preview */}
            <div className="overflow-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {TARGET_FIELDS.map((t) => (
                      <TableHead key={t.key}>{t.label}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parsed.rows.slice(0, 3).map((row, ri) => (
                    <TableRow key={ri}>
                      {TARGET_FIELDS.map((t) => (
                        <TableCell key={t.key} className="whitespace-nowrap">
                          {mapping[t.key] >= 0
                            ? (row[mapping[t.key]] ?? "")
                            : "—"}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between gap-2">
              <Button variant="outline" onClick={() => setStep(0)}>
                Back
              </Button>
              <Button onClick={() => setStep(2)} disabled={parsed.rows.length === 0}>
                Import {parsed.rows.length} records
              </Button>
            </div>
          </div>
        )}

        {/* ── Step 3: Done ── */}
        {step === 2 && (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <CheckCircle2 />
              </EmptyMedia>
              <EmptyTitle>Import complete</EmptyTitle>
              <EmptyDescription>
                Imported {parsed.rows.length} records successfully.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button onClick={reset}>Import another file</Button>
            </EmptyContent>
          </Empty>
        )}
      </div>
    </Page>
  )
}
