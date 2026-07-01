import { buildSearchIndexPayload } from "@/lib/search"

export async function loader() {
  const payload = await buildSearchIndexPayload()

  return new Response(JSON.stringify(payload), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=300",
    },
  })
}
