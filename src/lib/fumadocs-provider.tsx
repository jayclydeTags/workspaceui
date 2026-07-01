import { useMemo, type ReactNode, type ComponentProps } from "react"
import { Link as RouterLink, useLocation, useNavigate, useParams } from "react-router"
import { FrameworkProvider } from "fumadocs-core/framework"
import { RootProvider } from "fumadocs-ui/provider/base"

// Custom framework adapter — avoids fumadocs-core/framework/react-router which imports
// useRevalidator and pulls in a server chunk that uses cookie@1.1.1.

function usePathname() {
  return useLocation().pathname
}

function useParamsWrapper() {
  return useParams() as Record<string, string | string[]>
}

function useRouter() {
  const navigate = useNavigate()
  return useMemo(() => ({ push: (url: string) => navigate(url), refresh: () => {} }), [navigate])
}

function Link({ href, prefetch: _prefetch, ...props }: ComponentProps<"a"> & { prefetch?: boolean }) {
  return <RouterLink to={href ?? "#"} {...props} />
}

export function FumaProvider({ children }: { children: ReactNode }) {
  return (
    <FrameworkProvider
      usePathname={usePathname}
      useParams={useParamsWrapper}
      useRouter={useRouter}
      Link={Link}
    >
      <RootProvider search={{ options: { api: "/api/search.json", type: "static" } }}>{children}</RootProvider>
    </FrameworkProvider>
  )
}
