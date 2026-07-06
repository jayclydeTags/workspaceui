"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
  PAY_PERIODS,
  STATUS_LABEL,
  nextPeriod,
  type PeriodStatus,
} from "./data"

const STATUS_VARIANT: Record<
  PeriodStatus,
  "default" | "secondary" | "outline"
> = {
  paid: "secondary",
  processing: "default",
  upcoming: "outline",
}

export function PayrollCalendar01() {
  const next = nextPeriod(PAY_PERIODS)

  return (
    <Page
      title="Payroll Calendar"
      subtitle="Monthly pay schedule · timesheet cutoffs and pay dates"
      badge={<Badge variant="secondary">2026</Badge>}
      hasPadding
    >
      <div className="flex flex-col gap-6">
        {next && (
          <Card size="sm" className="bg-primary/5 ring-primary/40">
            <CardHeader>
              <CardDescription>Next pay date</CardDescription>
              <CardTitle className="text-2xl tracking-tight">
                {next.payDate}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {next.period} · timesheets lock {next.cutoff}
            </CardContent>
          </Card>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Period</TableHead>
              <TableHead>Range</TableHead>
              <TableHead>Cutoff</TableHead>
              <TableHead>Pay date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {PAY_PERIODS.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.period}</TableCell>
                <TableCell className="text-muted-foreground">
                  {p.start} – {p.end}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {p.cutoff}
                </TableCell>
                <TableCell>{p.payDate}</TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[p.status]}>
                    {STATUS_LABEL[p.status]}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Page>
  )
}
