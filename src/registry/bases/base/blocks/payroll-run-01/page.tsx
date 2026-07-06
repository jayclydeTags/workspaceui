"use client"

import { Badge } from "@/components/ui/badge"
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
  PAYROLL_RUN,
  PAYSLIPS,
  STATUS_LABEL,
  formatCurrency,
  netPay,
  type PayrollStatus,
} from "./data"

const STATUS_VARIANT: Record<
  PayrollStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  draft: "outline",
  processing: "default",
  paid: "secondary",
}

export function PayrollRun01() {
  const totalGross = PAYSLIPS.reduce((sum, p) => sum + p.gross, 0)
  const totalDeductions = PAYSLIPS.reduce((sum, p) => sum + p.deductions, 0)
  const totalNet = totalGross - totalDeductions

  return (
    <Page
      title={`Payroll · ${PAYROLL_RUN.period}`}
      subtitle={`${PAYSLIPS.length} employees · pay date ${PAYROLL_RUN.payDate}`}
      badge={
        <Badge variant={STATUS_VARIANT[PAYROLL_RUN.status]}>
          {STATUS_LABEL[PAYROLL_RUN.status]}
        </Badge>
      }
      hasPadding
    >
      <div className="flex flex-col gap-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <SummaryCard label="Gross pay" value={formatCurrency(totalGross)} />
          <SummaryCard
            label="Deductions"
            value={formatCurrency(totalDeductions)}
          />
          <SummaryCard label="Net pay" value={formatCurrency(totalNet)} />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Gross</TableHead>
              <TableHead className="text-right">Deductions</TableHead>
              <TableHead className="text-right">Net</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {PAYSLIPS.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.employee}</TableCell>
                <TableCell className="text-muted-foreground">{p.role}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(p.gross)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(p.deductions)}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(netPay(p))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2}>Total</TableCell>
              <TableCell className="text-right">
                {formatCurrency(totalGross)}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(totalDeductions)}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(totalNet)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </Page>
  )
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  )
}
