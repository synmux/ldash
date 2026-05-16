---
name: nitropack-skilld
description: 'ALWAYS use when writing code importing "nitropack". Consult for debugging, best practices, or modifying nitropack, nitro.'
metadata:
  version: 2.13.4
  generated_by: Anthropic · Haiku 4.5
  generated_at: 2026-05-16
---

# nitrojs/nitro `nitropack@2.13.4`

**Tags:** latest: 2.13.4

**References:** [package.json](./.skilld/pkg/package.json) • [README](./.skilld/pkg/README.md) • [Docs](./.skilld/docs/_INDEX.md) • [Issues](./.skilld/issues/_INDEX.md) • [Discussions](./.skilld/discussions/_INDEX.md) • [Releases](./.skilld/releases/_INDEX.md)

## Search

Use `skilld search "query" -p nitropack` instead of grepping `.skilld/` directories. Run `skilld search --guide -p nitropack` for full syntax, filters, and operators.

<!-- skilld:api-changes -->

## API Changes — Nitro v2.13.3

This section documents API changes in the v2.x series — focus on deprecations, experimental APIs, and breaking changes that LLMs trained on older data may get wrong.

## API Changes

DEPRECATED: `defineNitroConfig()` — Moved import location. Use `defineNitroConfig()` from `nitropack/config` instead of the core export [source](./.skilld/pkg/./dist/core/index.d.ts:L65:L68)

DEPRECATED: `NitroRuntimeConfig` type — Moved to `nitropack/types`. Import from `nitropack/types` instead of the core export [source](./.skilld/pkg/./dist/core/index.d.ts:L70:L82)

DEPRECATED: `NitroRuntimeConfigApp` type — Moved to `nitropack/types`. Import from `nitropack/types` instead of the core export [source](./.skilld/pkg/./dist/core/index.d.ts:L93:L97)

DEPRECATED: `NitroRuntimeHooks` type — Moved to `nitropack/types`. Import from `nitropack/types` instead of the core export [source](./.skilld/pkg/./dist/core/index.d.ts:L83:L92)

NEW: `runTask()` (experimental) — Execute a task at runtime. Returns `Promise<{ result: unknown }>`. Part of experimental tasks API requiring `experimental.tasks: true` in config [source](./.skilld/pkg/./dist/core/index.d.ts:L16:L19)

NEW: `listTasks()` (experimental) — List all available tasks with metadata. Returns `Promise<Record<string, { meta: { description: string } }>>`. Part of experimental tasks API requiring `experimental.tasks: true` in config [source](./.skilld/pkg/./dist/core/index.d.ts:L20:L25)

NEW: `defineTask()` (experimental) — Define a task handler. Accepts `{ meta?: { name?, description? }, run(event: TaskEvent) }`. File-based tasks go in `tasks/[name].ts`. Nested directories supported with `:` separator (e.g. `tasks/db/migrate.ts` → `db:migrate`) [source](./.skilld/docs/1.docs/50.tasks.md:L36:L59)

NEW: `defineRouteMeta()` (experimental) — Build-time macro to define route metadata for OpenAPI and other integrations. Supports `openAPI` property with OpenAPI Operation Object. No runtime overhead — metadata statically extracted during build [source](./.skilld/docs/1.docs/5.routing.md:L326:L339)

DEPRECATED: `srcDir` config option — Use `serverDir` instead. The `srcDir` option has been removed in favour of `serverDir` for clarity on its purpose [source](./.skilld/docs/1.docs/50.configuration.md:L105:L106)

DEPRECATED: `edgio` preset — Preset has been deprecated and should not be used for new projects [source](./.skilld/releases/v2.12.5.md:L27)

NEW: `ssrRoutes` config option — Introduced in v2.12.0. Controls which routes participate in server-side rendering [source](./.skilld/releases/v2.12.0.md:L17)

NEW: Dev presets — Introduced in v2.12.0. Allow preset-specific development server configuration. Example: `cloudflare` dev preset for local Cloudflare development [source](./.skilld/releases/v2.12.0.md:L13:L14)

NEW: Vercel skew protection support — Added in v2.13.0. Configure with Vercel preset to protect against deployment skew issues [source](./.skilld/releases/v2.13.0.md:L13)

NEW: Bun runtime support — Added in v2.13.0 and v2.12.9. Set `NITRO_BUN_IDLE_TIMEOUT` env variable to configure idle timeout [source](./.skilld/releases/v2.13.0.md:L14)

**Also changed:** OpenAPI experimental API (v2.12.0+) · `NitroConfig.experimental.openAPI` option · `NitroConfig.experimental.tasks` option · Cloudflare durable object `publish` method (v2.11.10+) experimental · OpenAPI extensible properties (v2.11.9+) · `dotenv` config for `loadOptions()` (v2.11.9+) · `workspaceDir` config option (v2.11.12+) · Type imports resolved for absolute paths (v2.11.13+) · `tsConfig` added to `types:extend` hook (v2.11.13+)

<!-- /skilld:api-changes -->

<!-- skilld:best-practices -->

## Best Practices

### Cloudflare Workers Deployment

1. **Use `nitro.preset: "cloudflare_module"`** for Cloudflare Workers on modern versions. The module preset is the recommended approach, generating production builds compatible with the Workers runtime. Pair it with `nitro.cloudflare.wrangler` in your Nuxt config to define bindings (D1, KV, R2, etc.) inline rather than using a separate `wrangler.json` at the repo root — this prevents Wrangler auto-discovery from duplicating configuration during the build.

2. **Separate dev and deploy Wrangler configs** using `nitro.cloudflareDev.configPath` to point a non-standard-named config file (e.g., `wrangler.dev.jsonc`) for Miniflare bindings. The built-in `cloudflare-dev` preset in nitropack 2.13+ handles top-level await without the legacy `nitro-cloudflare-dev` module, eliminating `globalThis.__env__` race conditions.

3. **Bind only emulated services locally** — D1, KV, R2, metadata, and vars — in the dev config. Keep AI, BROWSER, IMAGES, and analytics bindings commented or omitted; `getPlatformProxy()` automatically switches to authenticated edge-preview for unemulated services, triggering remote authentication rather than failing.

### Configuration & Build

4. **Pin Nitropack version in package.json** rather than using loose semver ranges. Preset changes and Wrangler integration behaviours shift between minor versions; explicit pinning prevents surprise build failures in CI/CD.

5. **Run `wrangler types` as part of the build step.** Generate `worker-configuration.d.ts` to ensure TypeScript sees the correct Cloudflare binding types. Include this in your `build` script after the Nuxt build completes.

6. **Use `nitro.rollupConfig`** to define shared Rollup options (e.g., external dependencies, plugin chains) rather than duplicating config across preset-specific blocks. This centralises build metadata and prevents preset-specific build regressions.

### Middleware & Routing

7. **Avoid adding middleware to `server/middleware/` for simple route guards.** Use route-level middleware in your pages/layouts (Nuxt's `defineRouteMiddleware`) instead; it's tree-shakeable and composable, whereas server middleware runs for _every_ request. Server middleware is best reserved for cross-cutting concerns (logging, security headers, authentication checks on protected routes).

8. **Define API routes under `server/routes/api/`** using the `defineEventHandler` pattern. Routes are file-based and auto-discovered; keep them flat or shallow (max 2-3 levels) to avoid route collision bugs with dynamic parameters.

### Performance & Caching

9. **Set explicit `Cache-Control` headers on cacheable assets** in event handlers using `setHeader(event, 'Cache-Control', 'public, max-age=...')`. Cloudflare caches based on these headers; omitting them means every request hits your origin.

10. **Disable automatic SSR rendering for heavy or dynamic pages** when edge-side rendering is sufficient. Use `routeRules` to set `ssr: false` on routes where client-side hydration alone is acceptable (e.g., dashboards, logged-in-only pages). This reduces payload size and origin latency.

11. **Prefer streaming responses for large payloads.** Use `sendStream()` or Node streams in event handlers rather than buffering entire responses in memory. Cloudflare Workers have a response size limit; streaming sidesteps it.

### Type Safety & Runtime

12. **Export server types separately from client code.** Define a `server/types/index.ts` barrel exporting event handler types and use dynamic `ReturnType<typeof getHandler>` in your frontend code to keep server internals inaccessible to client bundles. This prevents accidental client-side exposure of sensitive utilities.

13. **Validate environment variables at runtime using Zod or similar.** Nitropack injects `process.env` and `NUXT_PUBLIC_*` vars at build time; validate them in a top-level `server/utils/env.ts` utility so misconfigurations fail fast during deployment, not during a cold start.

14. **Use `useAsyncData` with explicit cache keys in layouts/pages.** Nitropack pairs well with Nuxt's data-fetching composables; always pass `key: 'unique-identifier'` to avoid cache collisions across routes. Pair with `server/routes/api/` endpoints to centralise data logic.

---

**Source guidance:** Patterns derived from nitropack 2.13.4 documentation (Cloudflare integration, config patterns), Nuxt 4 async data patterns, and Cloudflare Workers best practices. Each point prioritises production reliability, type safety, and edge-platform idioms.

<!-- /skilld:best-practices -->
