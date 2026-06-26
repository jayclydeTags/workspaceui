import { useEffect } from "react"

export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} – WorkspaceUI` : "WorkspaceUI"
    return () => {
      document.title = "WorkspaceUI"
    }
  }, [title])
}
