import type { Config } from "@react-router/dev/config"

export default {
  appDirectory: "src/app",
  ssr: false,
  // Ship the full route manifest upfront instead of lazy "Fog of War"
  // discovery. Cold document loads of non-entry routes (e.g. the BlockPreview
  // iframe hitting /blocks/preview/:slug directly) can't discover their route
  // in SPA mode, so they 404. "initial" mode includes every route from the
  // start — fine for a small docs SPA, and fixes deep-link refreshes too.
  routeDiscovery: { mode: "initial" },
} satisfies Config
