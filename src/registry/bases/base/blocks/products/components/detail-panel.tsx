import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon } from "@hugeicons/core-free-icons"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  emptyDraft,
  isValid,
  type Product,
  type ProductDraft,
  type ProductStatus,
} from "../data"

/** Side panel that shows and edits the product selected in the master list. */
export function DetailPanel({
  product,
  creating,
  onCreate,
  onSave,
  onDelete,
  onClose,
}: {
  /** The product being viewed/edited, or `null` when creating a new one. */
  product: Product | null
  creating: boolean
  onCreate: (draft: ProductDraft) => void
  onSave: (draft: ProductDraft) => void
  onDelete: () => void
  onClose: () => void
}) {
  const [draft, setDraft] = React.useState<ProductDraft>(emptyDraft)

  // Reseed whenever the selected product or create-mode changes — one form
  // handles both, keyed off `creating`/`product.id`. Adjusted during render
  // (not an effect) per https://react.dev/learn/you-might-not-need-an-effect.
  const activeKey = creating ? "new" : (product?.id ?? null)
  const [seededKey, setSeededKey] = React.useState<string | null>(null)
  if (activeKey !== seededKey) {
    setSeededKey(activeKey)
    setDraft(
      product
        ? {
            sku: product.sku,
            name: product.name,
            category: product.category,
            price: product.price,
            status: product.status,
          }
        : emptyDraft()
    )
  }

  const patch = (changes: Partial<ProductDraft>) =>
    setDraft((prev) => ({ ...prev, ...changes }))

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid(draft)) return
    if (creating) onCreate(draft)
    else onSave(draft)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-2 border-b p-4">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-medium">
            {creating ? "New product" : product?.name}
          </h3>
          {!creating && product && (
            <p className="text-xs text-muted-foreground">{product.sku}</p>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Close"
          onClick={onClose}
        >
          <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
        </Button>
      </div>

      <form
        id="product-detail-form"
        onSubmit={submit}
        className="flex-1 overflow-auto p-4"
      >
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="product-name">Name</FieldLabel>
            <Input
              id="product-name"
              value={draft.name}
              onChange={(e) => patch({ name: e.target.value })}
              placeholder="e.g. Ceramic Mug 12oz"
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="product-sku">SKU</FieldLabel>
            <Input
              id="product-sku"
              value={draft.sku}
              onChange={(e) => patch({ sku: e.target.value })}
              placeholder="e.g. SKU-1001"
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="product-category">Category</FieldLabel>
            <Input
              id="product-category"
              value={draft.category}
              onChange={(e) => patch({ category: e.target.value })}
              placeholder="e.g. Drinkware"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="product-price">Price ($)</FieldLabel>
            <Input
              id="product-price"
              type="number"
              min="0"
              step="0.01"
              value={draft.price || ""}
              onChange={(e) => patch({ price: Number(e.target.value) })}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="product-status">Status</FieldLabel>
            <Select
              value={draft.status}
              onValueChange={(v) =>
                patch({ status: (v as ProductStatus) ?? "draft" })
              }
            >
              <SelectTrigger id="product-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="discontinued">Discontinued</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>
      </form>

      <div className="flex items-center justify-between gap-2 border-t p-4">
        {creating ? (
          <span />
        ) : (
          <Button variant="outline" onClick={onDelete}>
            Delete
          </Button>
        )}
        <Button
          type="submit"
          form="product-detail-form"
          disabled={!isValid(draft)}
        >
          {creating ? "Create product" : "Save changes"}
        </Button>
      </div>
    </div>
  )
}
