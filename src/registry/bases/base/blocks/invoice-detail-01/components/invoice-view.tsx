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
  STATUS_LABEL,
  formatCurrency,
  invoiceTotal,
  type Invoice,
  type InvoiceStatus,
} from "@/registry/bases/base/blocks/invoice-detail-01/data"

const STATUS_VARIANT: Record<InvoiceStatus, "default" | "secondary" | "destructive" | "outline"> = {
  paid: "secondary",
  pending: "outline",
  overdue: "destructive",
  draft: "outline",
}

export function InvoiceView({ invoice }: { invoice: Invoice }) {
  return (
    <Page
      title={invoice.customer}
      subtitle={`${invoice.number} · issued ${invoice.issuedDate} · due ${invoice.dueDate}`}
      badge={<Badge variant={STATUS_VARIANT[invoice.status]}>{STATUS_LABEL[invoice.status]}</Badge>}
      hasPadding
    >
      <div className="flex flex-col gap-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead className="text-right">Unit price</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoice.lineItems.map((li) => (
              <TableRow key={li.id}>
                <TableCell>{li.description}</TableCell>
                <TableCell className="text-right">{li.quantity}</TableCell>
                <TableCell className="text-right">{formatCurrency(li.unitPrice)}</TableCell>
                <TableCell className="text-right">{formatCurrency(li.quantity * li.unitPrice)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">{formatCurrency(invoiceTotal(invoice))}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>

        {invoice.notes && (
          <div className="text-sm text-muted-foreground">
            <p className="mb-1 font-medium text-foreground">Notes</p>
            <p>{invoice.notes}</p>
          </div>
        )}
      </div>
    </Page>
  )
}
