"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon } from "@hugeicons/core-free-icons"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { Page } from "@/registry/bases/base/workspaceui/page"
import { cn } from "@/lib/utils"
import { PRODUCTS, type Product, type ProductDraft } from "./data"
import { DataTable } from "./components/data-table"
import { DetailPanel } from "./components/detail-panel"

export function Products() {
  const [products, setProducts] = React.useState<Product[]>(PRODUCTS)
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const [creating, setCreating] = React.useState(false)
  const [deleting, setDeleting] = React.useState<Product | null>(null)

  const selected = products.find((p) => p.id === selectedId) ?? null
  const detailOpen = creating || selected !== null

  function openCreate() {
    setSelectedId(null)
    setCreating(true)
  }

  function selectProduct(product: Product) {
    setCreating(false)
    setSelectedId(product.id)
  }

  function closeDetail() {
    setCreating(false)
    setSelectedId(null)
  }

  function createProduct(draft: ProductDraft) {
    const id = crypto.randomUUID()
    setProducts((prev) => [{ ...draft, id }, ...prev])
    setCreating(false)
    setSelectedId(id)
  }

  function saveProduct(draft: ProductDraft) {
    if (!selectedId) return
    setProducts((prev) =>
      prev.map((p) => (p.id === selectedId ? { ...p, ...draft } : p))
    )
  }

  function confirmDelete() {
    if (!deleting) return
    setProducts((prev) => prev.filter((p) => p.id !== deleting.id))
    if (selectedId === deleting.id) setSelectedId(null)
    setDeleting(null)
  }

  return (
    <Page
      title="Products"
      subtitle={`${products.length} products`}
      className="@container overflow-hidden"
      actions={
        <Button size="sm" onClick={openCreate} disabled={creating}>
          <HugeiconsIcon
            icon={PlusSignIcon}
            strokeWidth={2}
            data-icon="inline-start"
          />
          New product
        </Button>
      }
    >
      <div className="flex h-full overflow-hidden">
        <div
          className={cn(
            "flex min-w-0 flex-1 flex-col",
            detailOpen && "hidden @2xl:flex"
          )}
        >
          {products.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>No products</EmptyTitle>
                <EmptyDescription>
                  Create a product to get started.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <DataTable
              products={products}
              selectedId={selectedId}
              onSelect={selectProduct}
              onDelete={setDeleting}
            />
          )}
        </div>

        {detailOpen && (
          <div className="flex w-full flex-col overflow-hidden @2xl:w-96 @2xl:border-l">
            <DetailPanel
              product={selected}
              creating={creating}
              onCreate={createProduct}
              onSave={saveProduct}
              onDelete={() => selected && setDeleting(selected)}
              onClose={closeDetail}
            />
          </div>
        )}
      </div>

      <AlertDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete product</AlertDialogTitle>
            <AlertDialogDescription>
              Delete <span className="font-medium">{deleting?.sku}</span>? This
              action can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Page>
  )
}
