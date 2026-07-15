"use client"

import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Page } from "@/registry/bases/base/workspaceui/page"
import {
  EMPLOYEES,
  PAYMENT_TYPE_LABEL,
  emptyPayment,
  formatCurrency,
  isComplete,
  type OffcyclePayment,
  type PaymentType,
} from "./data"

export function OffcyclePaymentForm() {
  const [payment, setPayment] = useState<OffcyclePayment>(emptyPayment)
  const [submitted, setSubmitted] = useState(false)

  const patch = (changes: Partial<OffcyclePayment>) =>
    setPayment((prev) => ({ ...prev, ...changes }))

  const employee = EMPLOYEES.find((e) => e.id === payment.employeeId)
  const amount = Number(payment.amount) || 0

  if (submitted) {
    return (
      <Page title="Off-cycle Payment" subtitle="Submitted for approval" hasPadding>
        <Card className="mx-auto max-w-md bg-primary/5 text-center ring-primary/40">
          <CardHeader>
            <CardTitle className="text-lg">Payment queued</CardTitle>
            <CardDescription>
              {formatCurrency(amount)} to {employee?.name} is pending approval.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Button
              variant="outline"
              onClick={() => {
                setPayment(emptyPayment())
                setSubmitted(false)
              }}
            >
              New payment
            </Button>
          </CardFooter>
        </Card>
      </Page>
    )
  }

  return (
    <Page
      title="Off-cycle Payment"
      subtitle="One-off payment outside the regular payroll run"
      badge={<Badge variant="outline">Draft</Badge>}
      hasPadding
    >
      <form
        className="mx-auto flex max-w-2xl flex-col gap-6"
        onSubmit={(e) => {
          e.preventDefault()
          if (isComplete(payment)) setSubmitted(true)
        }}
      >
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="employee">Employee</FieldLabel>
            <Select
              value={payment.employeeId}
              onValueChange={(v) => patch({ employeeId: v ?? "" })}
            >
              <SelectTrigger id="employee">
                <SelectValue placeholder="Select an employee" />
              </SelectTrigger>
              <SelectContent>
                {EMPLOYEES.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.name} · {e.role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel htmlFor="type">Payment type</FieldLabel>
            <Select
              value={payment.type}
              onValueChange={(v) => patch({ type: v as PaymentType })}
            >
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(
                  Object.keys(PAYMENT_TYPE_LABEL) as PaymentType[]
                ).map((t) => (
                  <SelectItem key={t} value={t}>
                    {PAYMENT_TYPE_LABEL[t]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel htmlFor="amount">Amount (USD)</FieldLabel>
            <Input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={payment.amount}
              onChange={(e) => patch({ amount: e.target.value })}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="payDate">Pay date</FieldLabel>
            <Input
              id="payDate"
              type="date"
              value={payment.payDate}
              onChange={(e) => patch({ payDate: e.target.value })}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="reason">Reason</FieldLabel>
            <Textarea
              id="reason"
              placeholder="Why is this payment being made outside the regular run?"
              value={payment.reason}
              onChange={(e) => patch({ reason: e.target.value })}
            />
          </Field>
        </FieldGroup>

        <Card size="sm">
          <CardContent className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total payment</span>
            <span className="text-xl font-semibold tracking-tight">
              {formatCurrency(amount)}
            </span>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={!isComplete(payment)}>
            Submit for approval
          </Button>
        </div>
      </form>
    </Page>
  )
}
