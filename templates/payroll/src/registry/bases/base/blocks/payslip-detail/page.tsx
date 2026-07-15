"use client"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
  DEDUCTIONS,
  EARNINGS,
  EMPLOYEE,
  EMPLOYER_CONTRIBUTIONS,
  formatCurrency,
  sum,
  type LineItem,
} from "./data"

export function PayslipDetail() {
  const totalEarnings = sum(EARNINGS, "current")
  const totalDeductions = sum(DEDUCTIONS, "current")
  const netPay = totalEarnings - totalDeductions

  return (
    <Page
      title={`Payslip · ${EMPLOYEE.name}`}
      subtitle={`${EMPLOYEE.role} · ${EMPLOYEE.id} · ${EMPLOYEE.period}`}
      badge={<Badge variant="secondary">Paid {EMPLOYEE.payDate}</Badge>}
      hasPadding
    >
      <div className="flex flex-col gap-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <SummaryCard label="Earnings" value={formatCurrency(totalEarnings)} />
          <SummaryCard
            label="Deductions"
            value={formatCurrency(totalDeductions)}
          />
          <SummaryCard
            label="Net pay"
            value={formatCurrency(netPay)}
            emphasis
          />
        </div>

        <LineItemTable title="Earnings" items={EARNINGS} />
        <LineItemTable title="Deductions" items={DEDUCTIONS} />
        <LineItemTable
          title="Employer contributions"
          items={EMPLOYER_CONTRIBUTIONS}
        />
      </div>
    </Page>
  )
}

function LineItemTable({ title, items }: { title: string; items: LineItem[] }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead className="text-right">Current</TableHead>
            <TableHead className="text-right">YTD</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.label}>
              <TableCell className="font-medium">{item.label}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(item.current)}
              </TableCell>
              <TableCell className="text-right text-muted-foreground">
                {formatCurrency(item.ytd)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total</TableCell>
            <TableCell className="text-right">
              {formatCurrency(sum(items, "current"))}
            </TableCell>
            <TableCell className="text-right">
              {formatCurrency(sum(items, "ytd"))}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}

function SummaryCard({
  label,
  value,
  emphasis,
}: {
  label: string
  value: string
  emphasis?: boolean
}) {
  return (
    <Card size="sm" className={cn(emphasis && "bg-primary/5 ring-primary/40")}>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl tracking-tight">{value}</CardTitle>
      </CardHeader>
    </Card>
  )
}
