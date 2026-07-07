"use client"

import * as React from "react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Page } from "@/registry/bases/base/workspaceui/page"
import {
  COMMENTS,
  CURRENT_USER,
  type Comment,
  type Reply,
} from "./data"

function CommentAvatar({ initials }: { initials: string }) {
  return (
    <Avatar className="size-8 shrink-0">
      <AvatarFallback className="text-xs">{initials}</AvatarFallback>
    </Avatar>
  )
}

function Composer({
  placeholder,
  submitLabel,
  onSubmit,
  autoFocus,
}: {
  placeholder: string
  submitLabel: string
  onSubmit: (body: string) => void
  autoFocus?: boolean
}) {
  const [value, setValue] = React.useState("")

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const body = value.trim()
    if (!body) return
    onSubmit(body)
    setValue("")
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2">
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        rows={2}
        className="resize-none"
      />
      <div className="flex justify-end">
        <Button type="submit" size="sm" disabled={!value.trim()}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}

function ReplyView({ reply }: { reply: Reply }) {
  return (
    <div className="flex gap-3">
      <CommentAvatar initials={reply.initials} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium">{reply.author}</span>
          <span className="text-xs text-muted-foreground">{reply.time}</span>
        </div>
        <p className="mt-0.5 text-sm break-words">{reply.body}</p>
      </div>
    </div>
  )
}

export function CommentsThread() {
  const [comments, setComments] = React.useState<Comment[]>(COMMENTS)
  const [replyingTo, setReplyingTo] = React.useState<string | null>(null)

  const total = comments.reduce((n, c) => n + 1 + c.replies.length, 0)

  function addComment(body: string) {
    setComments((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        author: CURRENT_USER.name,
        initials: CURRENT_USER.initials,
        time: "Just now",
        body,
        replies: [],
      },
    ])
  }

  function addReply(commentId: string, body: string) {
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? {
              ...c,
              replies: [
                ...c.replies,
                {
                  id: crypto.randomUUID(),
                  author: CURRENT_USER.name,
                  initials: CURRENT_USER.initials,
                  time: "Just now",
                  body,
                },
              ],
            }
          : c
      )
    )
    setReplyingTo(null)
  }

  return (
    <Page
      title="Comments"
      subtitle={`${total} comments`}
      className="@container overflow-hidden"
      hasPadding
    >
      <div className="flex h-full flex-col gap-6 overflow-auto">
        <ul className="flex flex-col gap-6">
          {comments.map((c) => (
            <li key={c.id} className="flex flex-col gap-3">
              <ReplyView reply={c} />

              {/* Replies + reply affordance, indented under the comment */}
              <div className="flex flex-col gap-3 pl-11">
                {c.replies.map((r) => (
                  <ReplyView key={r.id} reply={r} />
                ))}

                {replyingTo === c.id ? (
                  <Composer
                    placeholder={`Reply to ${c.author}…`}
                    submitLabel="Reply"
                    autoFocus
                    onSubmit={(body) => addReply(c.id, body)}
                  />
                ) : (
                  <div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs text-muted-foreground"
                      onClick={() => setReplyingTo(c.id)}
                    >
                      Reply
                    </Button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>

        {/* Top-level composer */}
        <div className="mt-auto flex gap-3 border-t pt-4">
          <CommentAvatar initials={CURRENT_USER.initials} />
          <div className="flex-1">
            <Composer
              placeholder="Add a comment…"
              submitLabel="Comment"
              onSubmit={addComment}
            />
          </div>
        </div>
      </div>
    </Page>
  )
}
