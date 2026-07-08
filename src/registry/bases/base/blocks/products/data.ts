// ── Types ──────────────────────────────────────────────────────────────────

export type ProductStatus = "draft" | "active" | "discontinued"

export interface Product {
  id: string
  sku: string
  name: string
  category: string
  price: number
  status: ProductStatus
}

export type ProductDraft = Omit<Product, "id">

// ── Helpers ──────────────────────────────────────────────────────────────────

export const emptyDraft = (): ProductDraft => ({
  sku: "",
  name: "",
  category: "",
  price: 0,
  status: "draft",
})

export const isValid = (d: ProductDraft): boolean =>
  d.sku.trim() !== "" && d.name.trim() !== "" && d.price > 0

export const formatCurrency = (amount: number): string =>
  amount.toLocaleString("en-US", { style: "currency", currency: "USD" })

// ── Mock data ──────────────────────────────────────────────────────────────

export const PRODUCTS: Product[] = [
  { id: "1", sku: "SKU-1001", name: "Aluminium Water Bottle 750ml", category: "Drinkware", price: 24.5, status: "active" },
  { id: "2", sku: "SKU-1002", name: "Canvas Tote Bag", category: "Bags", price: 18, status: "active" },
  { id: "3", sku: "SKU-1003", name: "Ceramic Mug 12oz", category: "Drinkware", price: 12.75, status: "discontinued" },
  { id: "4", sku: "SKU-1004", name: "Recycled Notebook A5", category: "Stationery", price: 8.25, status: "active" },
  { id: "5", sku: "SKU-1005", name: "Bamboo Pen Set", category: "Stationery", price: 15, status: "draft" },
  { id: "6", sku: "SKU-1006", name: "Insulated Lunch Box", category: "Kitchen", price: 32, status: "active" },
]
