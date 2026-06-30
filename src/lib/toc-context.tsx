import { createContext, useContext, useState, type ReactNode } from "react"
import type { TOCItemType } from "fumadocs-core/toc"

type TocContextValue = {
  toc: TOCItemType[]
  setToc: (toc: TOCItemType[]) => void
}

const TocContext = createContext<TocContextValue>({ toc: [], setToc: () => {} })

export function TocProvider({ children }: { children: ReactNode }) {
  const [toc, setToc] = useState<TOCItemType[]>([])
  return <TocContext.Provider value={{ toc, setToc }}>{children}</TocContext.Provider>
}

export function useTocContext() {
  return useContext(TocContext)
}
