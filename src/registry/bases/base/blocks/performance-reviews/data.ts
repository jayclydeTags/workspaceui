// ── Types ──────────────────────────────────────────────────────────────────

export type ReviewStatus = "draft" | "in-review" | "completed"

/** 1–5, or 0 while the review is still a draft. */
export type Rating = 0 | 1 | 2 | 3 | 4 | 5

export interface Review {
  id: string
  employee: string
  reviewer: string
  period: string
  rating: Rating
  status: ReviewStatus
  notes: string
}

export type ReviewDraft = Omit<Review, "id">

export const REVIEW_STATUSES: ReviewStatus[] = [
  "draft",
  "in-review",
  "completed",
]

export const RATING_LABELS: Record<Exclude<Rating, 0>, string> = {
  1: "Needs improvement",
  2: "Developing",
  3: "Meets expectations",
  4: "Exceeds expectations",
  5: "Outstanding",
}

// ── Helpers ──────────────────────────────────────────────────────────────────

export const emptyDraft = (): ReviewDraft => ({
  employee: "",
  reviewer: "",
  period: "",
  rating: 0,
  status: "draft",
  notes: "",
})

/** A review can only be completed once it carries a rating. */
export const isValid = (d: ReviewDraft): boolean =>
  d.employee.trim() !== "" &&
  d.reviewer.trim() !== "" &&
  d.period.trim() !== "" &&
  (d.status !== "completed" || d.rating > 0)

/** Mean rating across rated reviews; 0 when none are rated. */
export function averageRating(reviews: Review[]): number {
  const rated = reviews.filter((r) => r.rating > 0)
  if (rated.length === 0) return 0
  const sum = rated.reduce((total, r) => total + r.rating, 0)
  return Math.round((sum / rated.length) * 10) / 10
}

// ── Mock data ──────────────────────────────────────────────────────────────

export const REVIEWS: Review[] = [
  { id: "1", employee: "Ava Chen", reviewer: "Dana Reyes", period: "H1 2026", rating: 4, status: "completed", notes: "Led the billing migration end to end." },
  { id: "2", employee: "Marcus Webb", reviewer: "Dana Reyes", period: "H1 2026", rating: 3, status: "completed", notes: "Steady delivery; grow on design reviews." },
  { id: "3", employee: "Priya Nair", reviewer: "Sam Iqbal", period: "H1 2026", rating: 5, status: "in-review", notes: "Owned the incident response rewrite." },
  { id: "4", employee: "Tom Okafor", reviewer: "Sam Iqbal", period: "H1 2026", rating: 0, status: "draft", notes: "" },
  { id: "5", employee: "Lena Fischer", reviewer: "Dana Reyes", period: "H2 2025", rating: 4, status: "completed", notes: "Consistently unblocked the team." },
]
