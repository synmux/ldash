<!-- skilld -->

Before modifying code, evaluate each installed skill against the current task.
For each skill, determine YES/NO relevance and invoke all YES skills before proceeding.

<!-- /skilld -->

# ldash — agent notes

A Nuxt 4 + Tailwind v4 Linear dashboard deployed to Cloudflare Workers.
Kiosk-style, optimised for a vertical monitor, polls Linear and rotates
through eight views.

## Mental model

- **One server endpoint, many client views.** `/api/issues` returns the
  whole working set as a single `DashboardPayload`; every view filters
  that payload locally. Don't add per-view endpoints — extend the
  payload instead.
- **Mock-or-live is a server decision.** `server/api/issues.get.ts`
  reads `runtimeConfig.linearApiKey` (from `NUXT_LINEAR_API_KEY`).
  Empty → mock. Set → live. The API key never reaches the browser.
- **The "most important" rule lives in one place.** Sort logic is
  pure and centralised in `app/utils/sort.ts`. If you need to change
  what "most important" means, change it there and every consumer
  inherits.

## File map

```
app/
  config.ts                       canonical tuning surface (defaults)
  app.vue                         root shell, sets <html class="dark">
  pages/index.vue                 dashboard page, wires composables
  assets/css/main.css             Tailwind v4 + Catppuccin tokens
  composables/
    useDashboardConfig.ts         reactive settings + localStorage
    useDashboardData.ts           polling fetcher
    useViewCycler.ts              rotation timer, pause-on-hover
  components/
    DashboardHeader.vue           top bar (clock, source pill, refresh)
    MostImportantStrip.vue        persistent top section
    RotatingViewArea.vue          view registry + transition
    ViewIndicator.vue             pill row + progress bar
    SettingsPanel.vue             slide-out controls
    IssueCard.vue                 single ticket tile
    IssueList.vue                 flat list
    GroupedIssueList.vue          sectioned list
    PriorityBadge.vue             priority → colour mapping
    DueDateBadge.vue              due → urgency mapping
    StateBadge.vue                workflow state pill
    AssigneeAvatar.vue            avatar / initials
    RefreshIndicator.vue          last-fetched age + spinner
    views/
      ByProjectView.vue           grouped by project
      ByTeamView.vue              grouped by team
      ByCycleView.vue             active-cycle issues grouped by team
      UpcomingView.vue            due within horizon (default 14d)
      MyIssuesView.vue            creator = viewer
      AssignedToMeView.vue        assignee = viewer
      InProgressView.vue          state.type = "started"
      BacklogView.vue             state.type = "backlog"
  utils/
    sort.ts                       sortMostImportant
    groupBy.ts                    groupByProject, groupByTeam
    format.ts                     relativeTime, dueLabel, dueUrgency, …
server/
  api/issues.get.ts               single GET endpoint
  utils/
    linear.ts                     one GraphQL query + transform
    mockData.ts                   30 deterministic mock issues
shared/
  types.ts                        DashboardPayload + friends
  viewIds.ts                      VIEW_IDS, VIEW_LABELS
```

## Adding a new view

1. Add an id to `VIEW_IDS` in `shared/viewIds.ts`, plus label + description.
2. Create `app/components/views/MyNewView.vue` (follow the pattern in the
   existing eight — `inject('dashboardData')`, filter, render
   `IssueList` or `GroupedIssueList`).
3. Register the import in `viewMap` inside
   `app/components/RotatingViewArea.vue`.
4. Add the id to `DEFAULTS.enabledViews` in `app/config.ts` if it should
   ship enabled by default.

## Changing the accent / theme

- Catppuccin Mocha tokens and the lime accent live in
  `app/assets/css/main.css` (`@theme` block). Edit the `--color-accent`
  CSS variable there.
- If you need the accent value in TS/JS, edit `LIME_ACCENT` in
  `app/config.ts` to mirror the CSS value (the duplicate is intentional
  — both call sites are documented).

## Adding a setting

1. Add a field to `DEFAULTS` in `app/config.ts` and to the
   `DashboardConfig` type.
2. Expose a `useState` ref + read/write/reset wiring in
   `app/composables/useDashboardConfig.ts`.
3. Surface a control in `app/components/SettingsPanel.vue`.

## Local dev

```bash
bun install
bun run dev                                    # mock data
NUXT_LINEAR_API_KEY="lin_api_xxx" bun run dev  # live data
```

`/api/issues` is the only data endpoint. It returns the same shape in
both modes, distinguishable by `source: "mock" | "live"`.

## Cloudflare deploy

```bash
bunx wrangler secret put NUXT_LINEAR_API_KEY   # one-time, sets the secret
bun run deploy                                 # nuxt build && wrangler deploy
```

## Conventions

- Every file carries a header comment describing what it does and how
  it's wired up. **Keep this when editing.** The user explicitly asked
  for thorough documentation; default Claude sparse-comment habits do
  not apply here.
- Vue components are `<script setup lang="ts">`.
- Server utilities live under `server/utils/` so Nuxt auto-exposes
  them; client utilities under `app/utils/`.
- Shared types under `shared/` are imported via `#shared/...` from
  both client and server.
- Tailwind v4 CSS-first — no `tailwind.config.js`. Design tokens are
  added by editing the `@theme` block in `main.css`.
- No tests required (per spec). The dev server + a real browser is
  the verification loop.

## Things to NOT do

- Don't bundle `@linear/sdk` into the client. The browser polls our
  server endpoint; the SDK and the API key stay server-side.
- Don't add a `tailwind.config.js` — Tailwind v4 doesn't need one and
  mixing CSS-first config with a JS config splits the source of truth.
- Don't add per-view server endpoints. The single payload is the
  architecture; per-view endpoints fan out polling and lose snapshot
  consistency.
- Don't read `process.env.NUXT_LINEAR_API_KEY` directly. Always go
  through `useRuntimeConfig(event).linearApiKey` so Nuxt handles env
  var loading.
