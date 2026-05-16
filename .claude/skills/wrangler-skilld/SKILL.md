---
name: wrangler-skilld
description: 'Command-line interface for all things Cloudflare Workers. ALWAYS use when writing code importing "wrangler". Consult for debugging, best practices, or modifying wrangler, workers-sdk, workers sdk.'
metadata:
  version: 4.92.0
  generated_by: cached
  generated_at: 2026-05-16
---

# cloudflare/workers-sdk `wrangler@4.92.0`

**Tags:** wrangler@2.2.4: 2.2.4, legacy: 3.114.17, latest: 4.92.0

**References:** [package.json](./.skilld/pkg/package.json) • [README](./.skilld/pkg/README.md) • [Docs](./.skilld/docs/_INDEX.md) • [Issues](./.skilld/issues/_INDEX.md) • [Discussions](./.skilld/discussions/_INDEX.md) • [Releases](./.skilld/releases/_INDEX.md)

## Search

Use `skilld search "query" -p wrangler` instead of grepping `.skilld/` directories. Run `skilld search --guide -p wrangler` for full syntax, filters, and operators.

<!-- skilld:api-changes -->

## API Changes — wrangler v4.92.0

This section documents version-specific API changes from recent v4.x releases. Focus on recent major/minor releases that introduce new commands, bindings, configuration properties, and breaking changes.

## API Changes

- NEW: `wrangler ai-search` command namespace — v4.79.0 adds CLI commands for managing Cloudflare AI Search (open beta): `ai-search list`, `create`, `get`, `update`, `delete`, `search`, `stats` [source](./.skilld/releases/wrangler@4.79.0.md#minor-changes)

- NEW: `wrangler tunnel` commands — v4.75.0 adds a full set of commands for managing remotely-managed Cloudflare Tunnels: `tunnel create`, `list`, `info`, `delete`, `run`, `quick-start`. All marked experimental [source](./.skilld/releases/wrangler@4.75.0.md#minor-changes)

- NEW: `--secrets-file` parameter for `wrangler deploy` and `wrangler versions upload` — v4.74.0 adds support for uploading secrets in a single operation alongside Worker code, supporting both JSON and .env file formats [source](./.skilld/releases/wrangler@4.74.0.md#minor-changes)

- NEW: `--local` flag for all Workflows CLI commands — v4.79.0 adds `--local` flag targeting local dev server instead of Cloudflare API, used with `workflows list`, `trigger`, `instances describe`, `instances pause` [source](./.skilld/releases/wrangler@4.79.0.md#minor-changes)

- NEW: `stream` binding type — v4.76.0 recognises `stream` binding in configuration, deployment metadata, and type generation [source](./.skilld/releases/wrangler@4.76.0.md#minor-changes)

- NEW: `ai_search_namespaces` and `ai_search` binding types — v4.78.0 adds two new AI Search binding types: namespace binding (auto-provisioned) and instance binding (pre-existing). Both remote-only in local dev [source](./.skilld/releases/wrangler@4.78.0.md#minor-changes)

- NEW: `vpc_networks` binding support — v4.80.0 adds binding for routing Worker traffic through Cloudflare Tunnel or network, configured with `tunnel_id` or `network_id` [source](./.skilld/releases/wrangler@4.80.0.md#minor-changes)

- NEW: `X_BROWSER_HEADFUL` environment variable for headful browser rendering — v4.80.0 (experimental) enables visible browser mode during local development when set to `true` [source](./.skilld/releases/wrangler@4.80.0.md#minor-changes)

- BREAKING: `cf-requirements` support for Python workers removed — v4.77.0 removes support which "hasn't worked with the runtime for a while now" [source](./.skilld/releases/wrangler@4.77.0.md#patch-changes)

- NEW: Experimental `secrets` configuration property — v4.77.0, 4.70.0 add `secrets.required` array for declaring required secret names with validation during deploy and local dev [source](./.skilld/releases/wrangler@4.77.0.md#minor-changes)

- NEW: `wrangler containers registries credentials` command — v4.70.0 generates short-lived push/pull credentials for Cloudflare managed registry with `--push`, `--pull`, `--expiration-minutes` flags [source](./.skilld/releases/wrangler@4.70.0.md#minor-changes)

- NEW: `wrangler containers instances <application_id>` command — v4.74.0 lists all container instances for a given application with pagination support [source](./.skilld/releases/wrangler@4.74.0.md#minor-changes)

- NEW: `wrangler containers list` pagination and Dash API — v4.76.0 rewrites to use `/dash/applications` endpoint with paginated table output (ID, Name, State, Live Instances, Last Modified), supports `--per-page` and `--json` flags [source](./.skilld/releases/wrangler@4.76.0.md#minor-changes)

- NEW: `wrangler pages deployment delete` command — v4.64.0 adds ability to delete Pages deployments via CLI with `--force` flag to skip confirmation [source](./.skilld/releases/wrangler@4.64.0.md#minor-changes)

- NEW: Type generation for AI Search bindings — v4.80.0 generates `AiSearchNamespace` and `AiSearchInstance` types when running `wrangler types` [source](./.skilld/releases/wrangler@4.80.0.md#minor-changes)

- NEW: Type generation for Stream bindings — v4.76.0 generates Stream types in `wrangler types` output [source](./.skilld/releases/wrangler@4.76.0.md#minor-changes)

- NEW: Schema-based type generation for Pipeline bindings — v4.67.0 generates typed `Pipeline<T>` bindings from stream schema when using `wrangler types` [source](./.skilld/releases/wrangler@4.67.0.md#minor-changes)

- NEW: `escapeCodeTimeout` option for `onKeyPress` utility — v4.74.0 adds optional parameter controlling how long readline waits to disambiguate Esc from multi-byte escape sequences (default 500ms) [source](./.skilld/releases/wrangler@4.74.0.md#patch-changes)

- NEW: `WRANGLER_COMMAND` environment variable for custom build commands — v4.64.0 sets to `"dev"`, `"deploy"`, `"versions upload"`, or `"types"` based on invoked command [source](./.skilld/releases/wrangler@4.64.0.md#minor-changes)

**Also changed:** `--json` flag for `wrangler whoami` (v4.65.0) · `wrangler kv namespace delete <name>` positional argument (v4.65.0) · `wrangler pages dev` CF_PAGES environment variables (v4.65.0) · `--json` flag for `wrangler pages project list` (v4.64.0) · `--cert-verification-mode` for VPC services (v4.78.0) · TCP service type support for Workers VPC (v4.78.0) · Local Stream binding support in Miniflare (v4.78.0) · Workflows step limit configuration via `limits.steps` (v4.70.0) · Access Service Token authentication via environment variables (v4.78.0) · Inheritable bindings in type generation for named environments (v4.72.0) · Container egress interception enabled by default (v4.72.0) · Local explorer enabled by default (v4.76.0) · Interactive data catalog validation for R2 operations (v4.78.0) · Framework version validation in autoconfig (v4.79.0) · Autoconfig enabled by default for `wrangler deploy` (v4.68.0)

<!-- /skilld:api-changes -->

<!-- skilld:best-practices -->

## Best Practices

- Keep `compatibility_date` current (within 30 days of today) to access latest runtime features and bug fixes without code changes — new projects benefit from automatic runtime updates [source](./.skilld/docs/workers/best-practices/workers-best-practices.md#keep-your-compatibility-date-current)

- Always run `wrangler types` after changing bindings in your config to regenerate TypeScript definitions — hand-written `Env` interfaces drift from actual config and cause deploy-time type mismatches [source](./.skilld/docs/workers/best-practices/workers-best-practices.md#generate-binding-types-with-wrangler-types)

- Store secrets with `wrangler secret put` only; never add them to config files or source code — config is version-controlled and often committed publicly [source](./.skilld/docs/workers/best-practices/workers-best-practices.md#store-secrets-with-wrangler-secret-not-in-source)

- Define bindings per environment (production, staging, development) — bindings are not inherited from root config, so missing them per-environment causes undefined binding errors at runtime [source](./.skilld/docs/workers/best-practices/workers-best-practices.md#configure-environments-deliberately)

- Use custom domains when your Worker is the origin, and routes when it sits in front of an existing origin — routes require a proxied DNS record first, otherwise requests never reach your Worker [source](./.skilld/docs/workers/best-practices/workers-best-practices.md#set-up-custom-domains-or-routes-correctly)

- Access Cloudflare services via bindings (R2, KV, D1, Queues) instead of REST API calls — bindings are in-process, require no auth, add no network latency, and avoid quota throttling [source](./.skilld/docs/workers/best-practices/workers-best-practices.md#use-bindings-for-cloudflare-services-not-rest-apis)

- Use Queues for single-step fan-out work and Workflows for multi-step processes that persist state across retries — mixing async patterns causes cascading failures if a single step fails [source](./.skilld/docs/workers/best-practices/workers-best-practices.md#use-queues-and-workflows-for-async-and-background-work)

- Use Hyperdrive for all remote PostgreSQL/MySQL connections — every connection without Hyperdrive pays 300–500ms per request for TCP handshake and TLS negotiation [source](./.skilld/docs/workers/best-practices/workers-best-practices.md#use-hyperdrive-for-external-database-connections)

- Enable `observability.enabled` with `head_sampling_rate` before production deployment — without logs and traces, intermittent errors become undebuggable black boxes [source](./.skilld/docs/workers/best-practices/workers-best-practices.md#enable-workers-logs-and-traces)

- Always `await` or pass Promises to `ctx.waitUntil()` — floating promises are silently terminated by the runtime, causing swallowed errors and lost work [source](./.skilld/docs/workers/best-practices/workers-best-practices.md#always-await-or-waituntil-your-promises)

- Use Durable Objects with the Hibernation API for WebSocket connections — Workers alone cannot persist connections across isolate eviction [source](./.skilld/docs/workers/best-practices/workers-best-practices.md#use-durable-objects-for-websockets)

- Pass request-scoped state as function arguments only; never store it in module-level variables — Workers reuse isolates across requests, causing cross-request data leaks [source](./.skilld/docs/workers/best-practices/workers-best-practices.md#do-not-store-request-scoped-state-in-global-scope)

- Use service bindings for Worker-to-Worker calls instead of HTTP to public URLs — service bindings are zero-cost, bypass the internet, and support type-safe RPC methods [source](./.skilld/docs/workers/best-practices/workers-best-practices.md#use-service-bindings-for-worker-to-worker-communication)

- Use `crypto.randomUUID()` and `crypto.getRandomValues()` for security-sensitive tokens and IDs — `Math.random()` is predictable and unsuitable for cryptography [source](./.skilld/docs/workers/best-practices/workers-best-practices.md#use-web-crypto-for-secure-token-generation)
<!-- /skilld:best-practices -->
