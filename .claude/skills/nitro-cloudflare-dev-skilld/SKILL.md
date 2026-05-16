---
name: nitro-cloudflare-dev-skilld
description: 'ALWAYS use when writing code importing "nitro-cloudflare-dev". Consult for debugging, best practices, or modifying nitro-cloudflare-dev, nitro cloudflare dev.'
metadata:
  version: 0.2.2
  generated_by: Anthropic · Haiku 4.5
  generated_at: 2026-05-16
---

# pi0/nitro-cloudflare-dev `nitro-cloudflare-dev@0.2.2`

**Tags:** latest: 0.2.2

**References:** [package.json](./.skilld/pkg/package.json) • [README](./.skilld/pkg/README.md) • [Releases](./.skilld/releases/_INDEX.md)

## Search

Use `skilld search "query" -p nitro-cloudflare-dev` instead of grepping `.skilld/` directories. Run `skilld search --guide -p nitro-cloudflare-dev` for full syntax, filters, and operators.

<!-- skilld:api-changes -->

## API Changes

This section documents version-specific API changes in nitro-cloudflare-dev v0.2.2 and migration notes from earlier versions.

- BREAKING: `shamefullyPatchR2Buckets` option removed in v0.2.0 — R2 bucket patching is no longer available as a configuration option, use native Cloudflare R2 APIs instead [source](./.skilld/releases/v0.2.0.md#refactors)

**Also changed:** `wrangler.json` and `wrangler.jsonc` support added v0.2.2 · `environment` config added v0.1.5 · `configPath` and `silent` options added v0.1.2

<!-- /skilld:api-changes -->

<!-- skilld:best-practices -->

## Best Practices

- Register the module as `"nitro-cloudflare-dev"` in Nuxt's `modules` array or call `nitroCloudflareDev` as a Nitro module — the module detects the context (Nuxt vs direct Nitro) automatically and handles lifecycle hooks appropriately [source](./.skilld/pkg/README.md:L16:31)

- Omit `configPath` to enable automatic discovery of `wrangler.json`, `wrangler.jsonc`, or `wrangler.toml` starting from your project's source directory — no explicit configuration required for standard setups [source](./.skilld/pkg/dist/index.mjs:L14:19)

- Only set the `environment` option when using multiple Cloudflare environments (e.g., staging vs production) — conditional inclusion in proxy options prevents undefined environment configurations [source](./.skilld/pkg/dist/index.mjs:L45:46)

- Access Cloudflare context via `event.context.cloudflare` in handlers for consistent, well-typed access to `env`, `request`, and `ctx` — this approach maintains parity with production Cloudflare Workers code [source](./.skilld/pkg/dist/index.d.ts:L6:12)

- Use `event.context.cf` directly when you only need geolocation and security metadata — it mirrors the native Workers API for minimal overhead [source](./.skilld/pkg/dist/runtime/plugin.dev.mjs:L13)

- Call `event.context.waitUntil()` for background operations (migrations, cleanup) during request handling — bindings are automatically propagated to both the context and underlying Node.js request object [source](./.skilld/pkg/dist/runtime/plugin.dev.mjs:L14:25)

- Rely on automatic `.gitignore` updates — the module adds `.wrangler/state/v3` to `.gitignore` on first run, preventing accidental commits of local state [source](./.skilld/pkg/dist/index.mjs:L25:35)

- Set `silent: true` in `cloudflareDev` config for CI/CD environments to suppress the initialization banner and reduce log noise [source](./.skilld/pkg/dist/index.mjs:L37:46)

- Configure `persistDir` only when using a non-standard layout — the default `.wrangler/state/v3` is compatible with most projects and kept out of version control [source](./.skilld/pkg/README.md:L44)

- Install `wrangler` as a dev dependency explicitly — the module provides a helpful error message at runtime if `wrangler` is missing, but will not function [source](./.skilld/pkg/dist/runtime/plugin.dev.mjs:L34:39)

- Expect the plugin to gracefully downgrade to stub implementations if `getPlatformProxy` fails — stub proxies prevent runtime crashes and allow basic development without Cloudflare bindings [source](./.skilld/pkg/dist/runtime/plugin.dev.mjs:L2:4)

- Use `wrangler.json` or `wrangler.jsonc` (introduced in v0.2.2) for tooling compatibility and comments support — `wrangler.toml` remains supported but JSON formats integrate better with IDEs [source](./.skilld/releases/_INDEX.md:L8)

- Pass config through `nitro.cloudflareDev` (Nitro) or `nitro.cloudflareDev` under Nuxt's `nitro` block — direct modification of `runtimeConfig.wrangler` is handled internally and should not be done manually [source](./.skilld/pkg/README.md:L40:47)
<!-- /skilld:best-practices -->
