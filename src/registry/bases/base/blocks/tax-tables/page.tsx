"use client"

import { useMemo, useState } from "react"

import { Badge } from "@/components/ui/badge"
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
import { Page } from "@/registry/bases/base/workspaceui/page"
import {
  FILING_STATUS_LABEL,
  JURISDICTIONS,
  TAX_BRACKETS,
  TAX_YEAR,
  formatRange,
  formatRate,
} from "./data"

const ALL = "all"

export function TaxTables() {
  const [jurisdiction, setJurisdiction] = useState(ALL)

  const rows = useMemo(
    () =>
      jurisdiction === ALL
        ? TAX_BRACKETS
        : TAX_BRACKETS.filter((b) => b.jurisdiction === jurisdiction),
    [jurisdiction]
  )

  return (
    <Page
      title="Tax tables"
      subtitle={`${JURISDICTIONS.length} jurisdictions · ${TAX_BRACKETS.length} brackets`}
      badge={<Badge variant="secondary">Tax year {TAX_YEAR}</Badge>}
      hasPadding
    >
      <div className="flex flex-col gap-4">
        <Select
          value={jurisdiction}
          onValueChange={(v) => setJurisdiction(v ?? ALL)}
        >
          <SelectTrigger className="w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All jurisdictions</SelectItem>
            {JURISDICTIONS.map((j) => (
              <SelectItem key={j} value={j}>
                {j}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Jurisdiction</TableHead>
              <TableHead>Filing status</TableHead>
              <TableHead>Income range</TableHead>
              <TableHead className="text-right">Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((b) => (
              <TableRow key={b.id}>
                <TableCell className="font-medium">{b.jurisdiction}</TableCell>
                <TableCell className="text-muted-foreground">
                  {FILING_STATUS_LABEL[b.filingStatus]}
                </TableCell>
                <TableCell>{formatRange(b.minIncome, b.maxIncome)}</TableCell>
                <TableCell className="text-right">
                  <Badge variant="outline">{formatRate(b.rate)}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Page>
  )
}
