---
name: nuxt-skilld
description: 'Nuxt is a free and open-source framework with an intuitive and extendable way to create type-safe, performant and production-grade full-stack web applications and websites with Vue.js. ALWAYS use when writing code importing "nuxt". Consult for debugging, best practices, or modifying nuxt.'
metadata:
  version: 4.4.5
  generated_by: cached
  generated_at: 2026-05-16
---

# nuxt/nuxt `nuxt@4.4.5`

**Tags:** 1x: 1.4.5, 2x: 2.18.1, alpha: 4.0.0-alpha.4

**References:** [package.json](./.skilld/pkg/package.json) • [README](./.skilld/pkg/README.md) • [Docs](./.skilld/docs/_INDEX.md) • [Issues](./.skilld/issues/_INDEX.md) • [Discussions](./.skilld/discussions/_INDEX.md) • [Releases](./.skilld/releases/_INDEX.md)

## Search

Use `skilld search "query" -p nuxt` instead of grepping `.skilld/` directories. Run `skilld search --guide -p nuxt` for full syntax, filters, and operators.

<!-- skilld:api-changes -->

## Nuxt v4.4.5 API Changes

This section documents version-specific API changes in Nuxt v4, prioritizing recent minor releases and breaking changes.

## API Changes

- NEW: `createUseFetch()` factory — create custom `useFetch` instances with default options and custom merge logic [source](./.skilld/releases/v4.4.0.md#createusefetch-and-createuseasyncdata)

- NEW: `createUseAsyncData()` factory — create custom `useAsyncData` instances with preconfigured defaults [source](./.skilld/releases/v4.4.0.md#createusefetch-and-createuseasyncdata)

- NEW: `useAnnouncer()` composable — announce dynamic in-page changes to screen readers via `polite()` and `assertive()` methods; use with `<NuxtAnnouncer>` component [source](./.skilld/releases/v4.4.0.md#useannouncer-composable)

- NEW: `<NuxtAnnouncer>` component — render live region for dynamic announcements alongside `<NuxtRouteAnnouncer>` [source](./.skilld/releases/v4.4.0.md#useannouncer-composable)

- BREAKING: `useState` reset behavior — `clearNuxtState()` now resets to initial value instead of `undefined` [source](./.skilld/releases/v4.4.0.md#usestate-reset-to-default)

- BREAKING: `clearNuxtState` reset behavior — resets state to default value, aligning with `useAsyncData` [source](./.skilld/releases/v4.4.0.md#usestate-reset-to-default)

- NEW: `useCookie` `refresh` option — extend cookie expiration without changing value via `refresh: true` [source](./.skilld/releases/v4.4.0.md#refresh-option-for-usecookie)

- BREAKING: Vue Router v5 — upgraded from v4; removes dependency on `unplugin-vue-router` [source](./.skilld/releases/v4.4.0.md#vue-router-v5)

- NEW: `definePageMeta` `layout` object — pass `{ name, props }` to set typed layout props per-page [source](./.skilld/releases/v4.4.0.md#typed-layout-props-in-definepagemeta)

- NEW: `normalizeComponentNames` experimental option — normalise page component names to match route names [source](./.skilld/releases/v4.4.0.md#normalised-page-component-names-experimental)

- NEW: View Transitions Types support — define view transition types for different navigation patterns [source](./.skilld/releases/v4.4.0.md#view-transitions-types)

- NEW: `payloadExtraction: 'client'` mode — inline full payload in HTML response while generating `_payload.json` for client navigation [source](./.skilld/releases/v4.4.0.md#smarter-payload-handling-for-cached-routes)

- NEW: `routeRules` `appLayout` property — set layout centrally via route rules without scattering `definePageMeta` calls [source](./.skilld/releases/v4.3.0.md#route-rule-layouts)

- NEW: `useRoute().meta.groups` — route groups (parentheses-wrapped folders) now exposed in route meta [source](./.skilld/releases/v4.3.0.md#route-groups-in-page-meta)

- NEW: `setPageLayout()` with props — second parameter to pass typed props to layout [source](./.skilld/releases/v4.3.0.md#layout-props-with-setpagelayout)

- NEW: `#server` alias — clean imports from server directory (`import { helper } from '#server/utils/helper'`) with import protection [source](./.skilld/releases/v4.3.0.md#server-alias)

- NEW: ISR/SWR payload extraction — `routeRules` `isr`, `swr`, and `cache` now generate `_payload.json` for cached pages [source](./.skilld/releases/v4.3.0.md#isrswr-payload-extraction)

- NEW: Dev mode payload extraction — payload extraction now works in dev mode with `nitro.static: true` or per-route rule [source](./.skilld/releases/v4.3.0.md#dev-mode-payload-extraction)

- NEW: Module disabling — disable layer modules by passing `false` to options (`image: false`) [source](./.skilld/releases/v4.3.0.md#disable-modules-from-layers)

- DEPRECATED: `statusCode` → `status`, `statusMessage` → `statusText` — prepare for Nitro v3 and H3 v2 Web API naming [source](./.skilld/releases/v4.3.0.md#deprecations)

- NEW: `useAsyncData` AbortController signal — pass `{ signal }` from handler or to `refresh()/execute()` for fine-grained request cancellation [source](./.skilld/releases/v4.2.0.md#abort-control-for-data-fetching)

- NEW: Better error pages in dev — technical error overlay appears alongside custom error page [source](./.skilld/releases/v4.2.0.md#better-error-pages-in-development)

- NEW: Vite Environment API (experimental) — opt in via `experimental.viteEnvironmentApi: true` for Vite 6 multi-environment support [source](./.skilld/releases/v4.2.0.md#opt-in-vite-environment-api)

- NEW: `extractAsyncDataHandlers` (experimental) — extract async data handler functions into separate chunks for smaller client bundles on static sites [source](./.skilld/releases/v4.2.0.md#async-data-handler-extraction)

- NEW: `component.declarationPath` — specify custom declaration path for components [source](./.skilld/releases/v4.2.0.md#other-improvements)

- NEW: `setGlobalHead()` utility — new kit utility for easier global head management [source](./.skilld/releases/v4.2.0.md#other-improvements)

- NEW: `resolveModule` `extensions` option — resolve modules with custom file extensions [source](./.skilld/releases/v4.2.0.md#other-improvements)

- NEW: `moduleDependencies` — specify module dependencies with version constraints and configuration merging [source](./.skilld/releases/v4.1.0.md#module-dependencies-and-integration)

- NEW: `onInstall` hook — module lifecycle hook called on first installation [source](./.skilld/releases/v4.1.0.md#module-lifecycle-hooks)

- NEW: `onUpgrade` hook — module lifecycle hook called when upgraded to new version [source](./.skilld/releases/v4.1.0.md#module-lifecycle-hooks)

- NEW: `resolveFiles` `ignore` option — exclude specific files via glob patterns [source](./.skilld/releases/v4.1.0.md#enhanced-file-resolution)

- NEW: `getLayerDirectories()` utility — clean interface for accessing layer directories without private API access [source](./.skilld/releases/v4.1.0.md#layer-directories-utility)

- NEW: `addServerImports` single import — support single import object alongside array format [source](./.skilld/releases/v4.1.0.md#simplified-kit-utilities)

- NEW: `entryImportMap` (experimental) — use import maps for stable chunk hashing; auto-enabled, can be disabled [source](./.skilld/releases/v4.1.0.md#enhanced-chunk-stability)

- NEW: Rolldown support (experimental) — Rust-powered bundling available via `rolldown-vite` override [source](./.skilld/releases/v4.1.0.md#experimental-rolldown-support)

- NEW: `defineLazyHydrationComponent()` without auto-imports — lazy hydration macros work with `components: false` [source](./.skilld/releases/v4.1.0.md#improved-lazy-hydration)

- NEW: `NuxtPage` `rules` property — route rules now exposed on dedicated property [source](./.skilld/releases/v4.1.0.md#enhanced-page-rules)

**Also changed:** `future.compatibilityVersion: 5` opt-in for v5 breaking changes · `@nuxt/nitro-server` internal package extraction · TypeScript plugin support (experimental) via `experimental.typescriptPlugin` · Async plugin constructors in modules

<!-- /skilld:api-changes -->

<!-- skilld:best-practices -->

## Best Practices

- Avoid browser-only APIs during SSR by using SSR-friendly composables — direct access to `localStorage` or `window` in the setup phase causes hydration mismatches. Use [`useCookie`](/docs/4.x/api/composables/use-cookie), [`useState`](/docs/4.x/api/composables/use-state), or wrap browser code in `onMounted` or `<ClientOnly>` [source](./.skilld/docs/3.guide/2.best-practices/hydration.md#browser-only-apis-in-server-context)

- Lazy-load components with the `Lazy` prefix to reduce initial bundle size — import as `<LazyComponentName>` to dynamically load component code only when needed, useful for components not required on first render [source](./.skilld/docs/3.guide/2.best-practices/performance.md#lazy-loading-components)

- Use `hydrate-on-visible` attribute on components to defer hydration until viewport visibility — delays JavaScript initialisation for components below the fold, improving time-to-interactive for the critical path [source](./.skilld/docs/3.guide/2.best-practices/performance.md#lazy-hydration)

- Set `parallel: true` for asynchronous plugins to enable concurrent loading — by default, plugins load sequentially blocking the hydration phase; concurrent loading improves performance when you have multiple independent async plugins [source](./.skilld/docs/3.guide/2.best-practices/plugins.md#if-async-enable-parallel)

- Use lifecycle hooks (`onInstall`, `onUpgrade`) for one-time module setup tasks — defer expensive operations like database schema generation or config file creation from the module's setup function to avoid running them on every build [source](./.skilld/docs/3.guide/4.modules/6.best-practices.md#use-lifecycle-hooks)

- Minimise payload size with the `pick` option on data fetching — only extract fields you actually use in your template to reduce the amount of data serialized from server to client during hydration [source](./.skilld/docs/1.getting-started/10.data-fetching.md#minimize-payload-size)

- Always create explicit keys with `useAsyncData` to avoid unreliable auto-generated ones — auto-generated keys based on file and line number can cause data misses when using the composable inside custom wrappers or loops; provide a unique string key instead [source](./.skilld/docs/1.getting-started/10.data-fetching.md#keys)

- Use `$fetch` for client-only interactions and `useFetch` for SSR-safe initial data — `$fetch` makes direct network calls suitable for event handlers; `useFetch` prevents double-fetching by forwarding server data to the client in the payload [source](./.skilld/docs/1.getting-started/10.data-fetching.md#the-need-for-usefetch-and-useasyncdata)

- Wrap shared state in composables using `useState` instead of top-level refs — exporting `const state = ref()` directly causes state to leak across requests on the server; always wrap in a composable like `export const useState = () => useState('key')` [source](./.skilld/docs/1.getting-started/11.state-management.md#best-practices)

- Use `useSeoMeta` for type-safe SEO meta tags instead of `useHead` — provides full IDE autocomplete and typo prevention for common SEO properties like `ogTitle`, `twitterCard`, and `description` [source](./.skilld/docs/1.getting-started/08.seo-meta.md#useseo-meta)

- Avoid expensive plugin computations during hydration — large plugin setup blocks rendering and degrades UX; inspect and migrate plugin logic to composables or utilities whenever possible [source](./.skilld/docs/3.guide/2.best-practices/performance.md#overusing-plugins)

- Prefix module exports (components, composables, server routes) with your module name — prevents naming conflicts with other modules, Nuxt internals, or user code; use `/api/_moduleName/` for routes and `<ModuleNameButton>` for components [source](./.skilld/docs/3.guide/4.modules/6.best-practices.md#prefix-your-exports)

- Use computed or ref-based keys with `useAsyncData` for reactive data fetching — when combined with reactive dependencies, the data refetches automatically and old cached data is cleaned up if no other components reference it [source](./.skilld/docs/1.getting-started/10.data-fetching.md#reactive-keys)

- Favour composables over plugins for shared logic — plugins run globally during hydration and reduce performance; most utilities and helper functions can be used directly as composables without the overhead [source](./.skilld/docs/3.guide/2.best-practices/plugins.md#use-composition-whenever-possible)
<!-- /skilld:best-practices -->

Related: vue-skilld, vue-router-skilld
