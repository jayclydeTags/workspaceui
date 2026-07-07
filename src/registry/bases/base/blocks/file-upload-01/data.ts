// ── Types ──────────────────────────────────────────────────────────────────

export type AttachmentStatus = "uploading" | "done" | "error"

export interface FileAttachment {
  id: string
  name: string
  size: number // bytes
  progress: number // 0–100, only meaningful while status is "uploading"
  status: AttachmentStatus
}

// ── Helpers ──────────────────────────────────────────────────────────────────

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  const units = ["KB", "MB", "GB"]
  let value = bytes / 1024
  let i = 0
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024
    i++
  }
  return `${value.toFixed(value < 10 ? 1 : 0)} ${units[i]}`
}

export const extLabel = (name: string) =>
  (name.split(".").pop() ?? "").toUpperCase()

// ── Mock data ──────────────────────────────────────────────────────────────

export const ATTACHMENTS: FileAttachment[] = [
  { id: "1", name: "Q3-financials.pdf", size: 2_411_520, progress: 100, status: "done" },
  { id: "2", name: "logo-final.png", size: 184_320, progress: 100, status: "done" },
  { id: "3", name: "vendor-contract.docx", size: 96_240, progress: 62, status: "uploading" },
  { id: "4", name: "warehouse-photo.jpg", size: 5_242_880, progress: 100, status: "error" },
]
