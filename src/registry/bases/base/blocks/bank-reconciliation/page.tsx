"use client"

import * as React from "react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
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
  OPENING_BALANCE,
  STATEMENT_BALANCE,
  STATEMENT_DATE,
  TRANSACTIONS,
  clearedBalance,
  formatCurrency,
  formatSigned,
  type Transaction,
} from "./data"

export function BankReconciliation() {
  const [transactions, setTransactions] =
    React.useState<Transaction[]>(TRANSACTIONS)

  function toggle(id: string) {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, cleared: !t.cleared } : t))
    )
  }

  const cleared = clearedBalance(OPENING_BALANCE, transactions)
  const difference = STATEMENT_BALANCE - cleared
  const reconciled = Math.abs(difference) < 0.005

  return (
    <Page
      title="Bank reconciliation"
      subtitle={`Statement as of ${STATEMENT_DATE}`}
      badge={
        <Badge variant={reconciled ? "secondary" : "outline"}>
          {reconciled ? "Reconciled" : "Not reconciled"}
        </Badge>
      }
      hasPadding
    >
      <div className="flex flex-col gap-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <SummaryCard
            label="Statement balance"
            value={formatCurrency(STATEMENT_BALANCE)}
          />
          <SummaryCard label="Cleared balance" value={formatCurrency(cleared)} />
          <SummaryCard
            label="Difference"
            value={formatSigned(difference)}
            emphasize={!reconciled}
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10" />
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((t) => (
              <TableRow key={t.id}>
                <TableCell>
                  <Checkbox
                    checked={t.cleared}
                    onCheckedChange={() => toggle(t.id)}
                    aria-label={`Mark ${t.description} cleared`}
                  />
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {t.date}
                </TableCell>
                <TableCell>{t.description}</TableCell>
                <TableCell
                  className={
                    "text-right " +
                    (t.amount < 0 ? "text-destructive" : "text-foreground")
                  }
                >
                  {formatSigned(t.amount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Page>
  )
}

function SummaryCard({
  label,
  value,
  emphasize,
}: {
  label: string
  value: string
  emphasize?: boolean
}) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle
          className={
            "text-2xl tracking-tight " +
            (emphasize ? "text-destructive" : "")
          }
        >
          {value}
        </CardTitle>
      </CardHeader>
    </Card>
  )
}
