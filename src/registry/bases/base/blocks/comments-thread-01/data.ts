// ── Types ──────────────────────────────────────────────────────────────────

export interface Reply {
  id: string
  author: string
  initials: string
  time: string
  body: string
}

export interface Comment extends Reply {
  replies: Reply[]
}

export const CURRENT_USER = { name: "You", initials: "YO" }

// ── Mock data ──────────────────────────────────────────────────────────────

export const COMMENTS: Comment[] = [
  {
    id: "1",
    author: "Sarah Chen",
    initials: "SC",
    time: "2h ago",
    body: "Can we confirm the renewal terms before sending Invoice #1024? The discount looks off to me.",
    replies: [
      {
        id: "1-1",
        author: "Mike Johnson",
        initials: "MJ",
        time: "1h ago",
        body: "Good catch — it should be 15%, not 25%. Updating now.",
      },
    ],
  },
  {
    id: "2",
    author: "Emma Davis",
    initials: "ED",
    time: "45m ago",
    body: "Added the signed contract to the attachments tab for reference.",
    replies: [],
  },
  {
    id: "3",
    author: "David Lee",
    initials: "DL",
    time: "20m ago",
    body: "Approved on my end. Ready to send once the discount is fixed.",
    replies: [],
  },
]
