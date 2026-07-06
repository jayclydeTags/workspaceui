"use client"

import { useMemo, useState } from "react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Page } from "@/registry/bases/base/workspaceui/page"
import {
  COMP_RECORDS,
  formatCurrency,
  formatPct,
} from "./data"

export function CompensationTable01() {
  const [query, setQuery] = useState("")

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return COMP_RECORDS
    return COMP_RECORDS.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.role.toLowerCase().includes(q) ||
        r.band.toLowerCase().includes(q)
    )
  }, [query])

  const totalBase = rows.reduce((sum, r) => sum + r.base, 0)
  const avgBase = rows.length ? Math.round(totalBase / rows.length) : 0

  return (
    <Page
      title="Compensation"
      subtitle={`${COMP_RECORDS.length} employees · annual base salary`}
      badge={<Badge variant="secondary">FY2026</Badge>}
      hasPadding
    >
      <div className="flex flex-col gap-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <SummaryCard label="Headcount" value={String(rows.length)} />
          <SummaryCard label="Total base" value={formatCurrency(totalBase)} />
          <SummaryCard label="Average base" value={formatCurrency(avgBase)} />
        </div>

        <Input
          placeholder="Search by name, role, or band…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-sm"
        />

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Band</TableHead>
              <TableHead className="text-right">Base</TableHead>
              <TableHead className="text-right">Last change</TableHead>
              <TableHead>Effective</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.name}</TableCell>
                <TableCell className="text-muted-foreground">{r.role}</TableCell>
                <TableCell>
                  <Badge variant="outline">{r.band}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(r.base)}
                </TableCell>
                <TableCell className="text-right">
                  {r.changePct > 0 ? (
                    <Badge variant="secondary">{formatPct(r.changePct)}</Badge>
                  ) : (
                    <span className="text-muted-foreground">
                      {formatPct(r.changePct)}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {r.lastAdjustment}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">
                {formatCurrency(totalBase)}
              </TableCell>
              <TableCell colSpan={2} />
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </Page>
  )
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl tracking-tight">{value}</CardTitle>
      </CardHeader>
    </Card>
  )
}
