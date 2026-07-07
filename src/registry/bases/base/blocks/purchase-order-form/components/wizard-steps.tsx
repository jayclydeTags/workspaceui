import { Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import {
  VENDORS,
  emptyLineItem,
  formatCurrency,
  lineItemsTotal,
  type LineItem,
  type PODetails,
} from "@/registry/bases/base/blocks/purchase-order-form/data"

export function DetailsStep({
  details,
  onChange,
}: {
  details: PODetails
  onChange: (patch: Partial<PODetails>) => void
}) {
  return (
    <FieldGroup className="max-w-md">
      <Field>
        <FieldLabel htmlFor="po-vendor">Vendor</FieldLabel>
        <Select value={details.vendor} onValueChange={(v) => v && onChange({ vendor: v })}>
          <SelectTrigger id="po-vendor" className="w-full">
            <SelectValue placeholder="Select a vendor" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {VENDORS.map((v) => (
                <SelectItem key={v} value={v}>
                  {v}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      <Field>
        <FieldLabel htmlFor="po-requested-by">Requested by</FieldLabel>
        <Input
          id="po-requested-by"
          value={details.requestedBy}
          onChange={(e) => onChange({ requestedBy: e.target.value })}
          placeholder="e.g. Jamie Ortiz"
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="po-needed-by">Needed by</FieldLabel>
        <Input
          id="po-needed-by"
          type="date"
          value={details.neededBy}
          onChange={(e) => onChange({ neededBy: e.target.value })}
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="po-notes">Notes</FieldLabel>
        <Textarea
          id="po-notes"
          value={details.notes}
          onChange={(e) => onChange({ notes: e.target.value })}
          placeholder="Optional context for the approver"
        />
      </Field>
    </FieldGroup>
  )
}

export function LineItemsStep({
  items,
  onChange,
}: {
  items: LineItem[]
  onChange: (items: LineItem[]) => void
}) {
  function update(id: string, patch: Partial<LineItem>) {
    onChange(items.map((li) => (li.id === id ? { ...li, ...patch } : li)))
  }

  function remove(id: string) {
    onChange(items.filter((li) => li.id !== id))
  }

  return (
    <div className="flex flex-col gap-3">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead className="w-24 text-right">Qty</TableHead>
            <TableHead className="w-32 text-right">Unit cost</TableHead>
            <TableHead className="w-28 text-right">Amount</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((li) => (
            <TableRow key={li.id}>
              <TableCell>
                <Input
                  value={li.item}
                  onChange={(e) => update(li.id, { item: e.target.value })}
                  placeholder="Item name"
                  aria-label="Item"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  min={1}
                  value={li.quantity}
                  onChange={(e) => update(li.id, { quantity: Number(e.target.value) })}
                  className="text-right"
                  aria-label="Quantity"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={li.unitCost}
                  onChange={(e) => update(li.id, { unitCost: Number(e.target.value) })}
                  className="text-right"
                  aria-label="Unit cost"
                />
              </TableCell>
              <TableCell className="text-right">{formatCurrency(li.quantity * li.unitCost)}</TableCell>
              <TableCell>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Remove line item"
                  onClick={() => remove(li.id)}
                  disabled={items.length === 1}
                >
                  <Trash2 />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">{formatCurrency(lineItemsTotal(items))}</TableCell>
            <TableCell />
          </TableRow>
        </TableFooter>
      </Table>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="self-start"
        onClick={() => onChange([...items, emptyLineItem()])}
      >
        <Plus data-icon="inline-start" />
        Add line item
      </Button>
    </div>
  )
}

export function ReviewStep({ details, items }: { details: PODetails; items: LineItem[] }) {
  return (
    <div className="flex max-w-md flex-col gap-4 text-sm">
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5">
        <dt className="text-muted-foreground">Vendor</dt>
        <dd>{details.vendor || "—"}</dd>
        <dt className="text-muted-foreground">Requested by</dt>
        <dd>{details.requestedBy || "—"}</dd>
        <dt className="text-muted-foreground">Needed by</dt>
        <dd>{details.neededBy || "—"}</dd>
        {details.notes && (
          <>
            <dt className="text-muted-foreground">Notes</dt>
            <dd>{details.notes}</dd>
          </>
        )}
      </dl>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead className="text-right">Qty</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((li) => (
            <TableRow key={li.id}>
              <TableCell>{li.item || "—"}</TableCell>
              <TableCell className="text-right">{li.quantity}</TableCell>
              <TableCell className="text-right">{formatCurrency(li.quantity * li.unitCost)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell className="text-right">{formatCurrency(lineItemsTotal(items))}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}
