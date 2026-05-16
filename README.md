# ldash

A kiosk-style Linear dashboard for a vertical monitor. Built with Nuxt 4,
Tailwind v4, and deployed to Cloudflare Workers. Catppuccin Mocha palette
with a lime green accent.

A persistent **Most Important** strip stays pinned at the top, sorted by
due date then priority. Below it, the dashboard automatically rotates
through eight views every 30 seconds (configurable):

- **By Project** — issues grouped by project
- **By Team** — issues grouped by team
- **Current Cycle** — active sprint issues per team
- **Upcoming** — anything due in the next 14 days
- **My Issues** — issues you created
- **Assigned to Me** — issues assigned to you
- **In Progress** — workflow state = "started"
- **Backlog** — workflow state = "backlog"

Everything is configurable from a slide-out settings panel: poll
interval, rotation duration, which views participate in the rotation,
how big the Most Important strip is, the upcoming horizon, and so on.
Settings persist to `localStorage`.

## Quick start

```bash
bun install
bun run dev
```

Open http://localhost:3000. With no Linear API key configured, the
dashboard runs against a deterministic mock dataset (30 issues, 3 teams,
4 projects, 2 active cycles) so you can see exactly how it looks before
plugging in real data. The header shows a `MOCK` pill in this mode.

### Live data

Get a personal API key from Linear's settings → API. Pass it via the
`NUXT_LINEAR_API_KEY` env var:

```bash
NUXT_LINEAR_API_KEY="lin_api_xxx" bun run dev
```

The header switches to a `LIVE` pill. The key stays on the server — it's
read via Nuxt's `runtimeConfig` and used only inside the `/api/issues`
endpoint that proxies to Linear. The browser never sees it.

## Deploy to Cloudflare Workers

```bash
bunx wrangler secret put NUXT_LINEAR_API_KEY  # one-time, stores the secret
bun run deploy                                # build + wrangler deploy
```

The repo ships with `wrangler.jsonc` pre-configured (entry point, assets
binding, `nodejs_compat`, observability). `bun run preview` runs a local
Cloudflare-style preview.

## Architecture in a paragraph

The server exposes a single endpoint, `GET /api/issues`, that returns a
denormalised snapshot of viewer, teams, projects, active cycles, and the
working set of open issues (up to ~250). The client polls this endpoint
on a configurable interval and renders every view by filtering that one
payload locally. Mock or live is a server-side decision based on
`runtimeConfig.linearApiKey`; the wire format is identical either way,
distinguished only by a `source: "mock" | "live"` field on the payload.

```
┌──────────────────┐  poll every 10 min   ┌────────────────────────────┐
│ Browser          │ ───────────────────► │ Cloudflare Worker          │
│ Vue components   │                      │ Nitro                      │
│ filter & render  │ ◄─────────────────── │ /api/issues                │
└──────────────────┘   DashboardPayload   │                            │
                                          │   ┌─────────┐    ┌──────┐  │
                                          │   │ Linear  │ or │ mock │  │
                                          │   │ SDK     │    │ data │  │
                                          │   └─────────┘    └──────┘  │
                                          └────────────────────────────┘
```

## Editing & extending

Every file carries a header comment describing its purpose and the flow
of data through it. The highlights:

- **`app/config.ts`** — all default values (poll interval, rotation
  duration, lime accent hex, enabled views, upcoming horizon). Edit here
  to change defaults; the settings panel UI is layered on top.
- **`app/assets/css/main.css`** — Tailwind v4 `@theme` block with the
  full Catppuccin Mocha palette plus the `--color-accent` override. No
  `tailwind.config.js` needed.
- **`app/utils/sort.ts`** — the canonical "most important" rule. Due
  date ascending (nulls last), then priority (0 / No-priority bumped to
  last so 1 / Urgent ranks first), then `updatedAt` descending as a
  tie-break.
- **`server/utils/mockData.ts`** — the demo dataset. Add issues here to
  test edge cases (overdue, no assignee, very long titles).
- **`shared/types.ts`** — the wire contract between server and client.
- **`shared/viewIds.ts`** — the registry of views (id → label).

### Adding a view

1. Add an id to `VIEW_IDS` in `shared/viewIds.ts` plus a label and a
   one-sentence description.
2. Create `app/components/views/MyNewView.vue` following the pattern of
   the existing eight — `inject('dashboardData')`, filter, render
   `IssueList` or `GroupedIssueList`.
3. Register it in the `viewMap` inside
   `app/components/RotatingViewArea.vue`.
4. Add the id to `DEFAULTS.enabledViews` in `app/config.ts` if you want
   it on by default.

### Tweaking the theme

Catppuccin Mocha tokens (`--color-ctp-*`) and the lime accent
(`--color-accent`) live in `app/assets/css/main.css`. To swap to a
different accent, edit the CSS variable and mirror the same value into
`LIME_ACCENT` in `app/config.ts` (which is used when you need the colour
in TS/JS rather than as a Tailwind utility).

## Tech notes

- **Polling, not subscriptions** — Linear's API doesn't expose GraphQL
  subscriptions; webhooks are the only push mechanism. For a single-user
  kiosk, polling at 10-minute intervals is well within Linear's rate
  limits and avoids the complexity of webhook plumbing on Workers. The
  poll interval is configurable in the settings panel.
- **Tailwind v4** — uses the CSS-first `@theme` block via
  `@tailwindcss/vite`. No `tailwind.config.js`, no PostCSS.
- **One snapshot at a time** — every view derives from the same payload
  so the UI is internally consistent. The trade-off is a soft cap of
  ~250 issues per fetch; if your workspace is larger you'll want to add
  pagination in `server/utils/linear.ts`.
- **No tests** — verification is manual via the dev server and a real
  browser, per the original spec.

## Tech stack

- [Nuxt 4](https://nuxt.com) (Vue 3, Composition API)
- [Tailwind v4](https://tailwindcss.com)
- [@linear/sdk](https://www.npmjs.com/package/@linear/sdk)
- [@catppuccin/palette](https://www.npmjs.com/package/@catppuccin/palette)
- [Nitro](https://nitro.unjs.io) + `cloudflare_module` preset
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/) for
  Cloudflare Workers deployment

## Scripts

| Command              | What it does                                  |
| -------------------- | --------------------------------------------- |
| `bun run dev`        | Nuxt dev server with Cloudflare emulation     |
| `bun run build`      | Production Nuxt build for Cloudflare Workers  |
| `bun run preview`    | Build then run local Cloudflare-style preview |
| `bun run deploy`     | Build then deploy via Wrangler                |
| `bun run cf-typegen` | Regenerate Cloudflare binding types           |
