---
name: vue-router-skilld
description: 'ALWAYS use when writing code importing "vue-router". Consult for debugging, best practices, or modifying vue-router, vue router, router.'
metadata:
  version: 5.0.7
  generated_by: cached
  generated_at: 2026-05-16
---

# vuejs/router `vue-router@5.0.7`

**Tags:** next: 4.0.13, legacy: 3.6.5, edge: 4.4.0-alpha.3

**References:** [package.json](./.skilld/pkg/package.json) • [README](./.skilld/pkg/README.md) • [Docs](./.skilld/docs/_INDEX.md) • [Issues](./.skilld/issues/_INDEX.md) • [Discussions](./.skilld/discussions/_INDEX.md) • [Releases](./.skilld/releases/_INDEX.md)

## Search

Use `skilld search "query" -p vue-router` instead of grepping `.skilld/` directories. Run `skilld search --guide -p vue-router` for full syntax, filters, and operators.

<!-- skilld:api-changes -->

## API Changes — vue-router v5.0.7

## Importing from vue-router/unplugin

With v5, the unplugin-vue-router package has been merged into core vue-router. Update your import paths for file-based routing and related utilities. See [Migrating from unplugin-vue-router](#migrating-from-unplugin-vue-router) below.

## API Changes

This section documents version-specific API changes prioritising recent major/minor releases.

- BREAKING (experimental): `miss()` now throws internally and returns `never` — stopping further loader execution immediately [source](./.skilld/releases/v5.0.3.md:L11:12)

- BREAKING (experimental): `new NavigationResult(to)` — deprecated in v5.0.3, use `reroute(to)` instead for controlling navigation within data loaders [source](./.skilld/releases/v5.0.3.md:L13:14)

- BREAKING (experimental): `selectNavigationResult()` removed — was used to choose between multiple navigation results from parallel data loaders, now handled by `reroute()` [source](./.skilld/releases/v5.0.3.md:L14)

- DEPRECATED: `next()` callback in navigation guards — still works but deprecated with warning in v5.0.3, return values directly instead [source](./.skilld/releases/v5.0.3.md:L23)

- NEW (experimental): `reroute()` — control navigation from within a data loader, accepts route locations or `false` to cancel, throws internally to stop execution [source](./.skilld/docs/data-loaders/navigation-aware.md:L10:12)

- NEW: Import path changes for data loaders — `defineBasicLoader`, `defineColadaLoader` from `vue-router/experimental` (previously `unplugin-vue-router/data-loaders/*`) [source](./.skilld/docs/guide/migration/v4-to-v5.md:L59:67)

- NEW: `DataLoaderPlugin` from `vue-router/experimental` — replaces `unplugin-vue-router/data-loaders` for setup [source](./.skilld/docs/guide/migration/v4-to-v5.md:L66)

- NEW: Vite plugin path change — `import VueRouter from 'vue-router/vite'` replaces `unplugin-vue-router/vite` [source](./.skilld/docs/guide/migration/v4-to-v5.md:L40:42)

- NEW: Build tool plugin path change — `import VueRouter from 'vue-router/unplugin'` for Webpack, Rollup, esbuild (previously `unplugin-vue-router`) [source](./.skilld/docs/guide/migration/v4-to-v5.md:L45:56)

- NEW: Unplugin utilities exports moved — `VueRouterAutoImports`, `EditableTreeNode`, `createTreeNodeValue`, `createRoutesContext`, `getFileBasedRouteName`, `getPascalCaseRouteName` import from `vue-router/unplugin` [source](./.skilld/docs/guide/migration/v4-to-v5.md:L74:82)

- NEW (experimental): Query parameters optional by default — params no longer required for route matching [source](./.skilld/releases/v5.0.0.md:L14)

- NEW (experimental): Data loaders feature — native data fetching and loader system for routes [source](./.skilld/releases/v5.0.0.md:L16)

- BREAKING: Runtime error on missing param parsers — v5.0.0 enforces param parser definitions [source](./.skilld/releases/v5.0.0.md:L20)

- BREAKING (IIFE build only): `@vue/devtools-api` removed from IIFE build — upgraded to v8 which has no IIFE export; CJS/ESM not affected [source](./.skilld/releases/v5.0.0.md:L9)

- BREAKING (experimental): `_parent` support in nested folders — new metadata control for route structure with default non-matchable behaviour [source](./.skilld/releases/v5.0.3.md:L20)

**Also changed:** Route JSON schema generation added v5.0.0 · Volar plugin support v5.0.0 · Aliases generation from resolver override v5.0.3 · Auto-routes support v5.0.4

## Migrating from unplugin-vue-router

If you were using unplugin-vue-router v4 for file-based routing:

### Update Imports

**Vite plugin:**

```ts
// OLD
import VueRouter from "unplugin-vue-router/vite";

// NEW
import VueRouter from "vue-router/vite";
```

**Other build tools (Webpack, Rollup, esbuild):**

```ts
import VueRouter from "vue-router/unplugin";

VueRouter.webpack({
  /* ... */
});
VueRouter.rollup({
  /* ... */
});
// etc.
```

**Data loaders:**

```ts
// OLD
import { defineBasicLoader } from "unplugin-vue-router/data-loaders/basic";
import { defineColadaLoader } from "unplugin-vue-router/data-loaders/pinia-colada";
import { DataLoaderPlugin } from "unplugin-vue-router/data-loaders";

// NEW
import { defineBasicLoader, DataLoaderPlugin } from "vue-router/experimental";
import { defineColadaLoader } from "vue-router/experimental/pinia-colada";
```

**Utilities for custom integrations:**

```ts
// OLD
import {
  VueRouterAutoImports,
  EditableTreeNode,
  createTreeNodeValue,
  createRoutesContext,
  getFileBasedRouteName,
  getPascalCaseRouteName,
} from "unplugin-vue-router";

// NEW
import {
  VueRouterAutoImports,
  EditableTreeNode,
  createTreeNodeValue,
  createRoutesContext,
  getFileBasedRouteName,
  getPascalCaseRouteName,
} from "vue-router/unplugin";
```

**TypeScript types:**

```ts
// OLD
import type { Options, EditableTreeNode } from "unplugin-vue-router";

// NEW
import type { Options, EditableTreeNode } from "vue-router/unplugin";
```

**Volar plugins in `tsconfig.json`:**

```jsonc
{
  "compilerOptions": {
    "rootDir": ".",
  },
  "vueCompilerOptions": {
    "plugins": [
      // OLD
      // "unplugin-vue-router/volar/sfc-typed-router",
      // "unplugin-vue-router/volar/sfc-route-blocks",

      // NEW
      "vue-router/volar/sfc-typed-router",
      "vue-router/volar/sfc-route-blocks",
    ],
  },
}
```

### Generate Types File

Move the generated types to `src/route-map.d.ts`:

```ts
// vite.config.ts
import VueRouter from "vue-router/vite";

export default defineConfig({
  plugins: [
    VueRouter({
      dts: "src/route-map.d.ts",
    }),
  ],
});
```

Remove the old client types reference from `env.d.ts` or `tsconfig.json`:

```ts
// Remove these
/// <reference types="unplugin-vue-router/client" />
```

## No Breaking Changes for Vue Router 4 Users (without file-based routing)

If you were using Vue Router 4 **without** unplugin-vue-router, upgrade without code changes — Vue Router 5 is backwards compatible. The only exception is the IIFE build no longer including `@vue/devtools-api` (v7 → v8).

<!-- /skilld:api-changes -->

<!-- skilld:best-practices -->

## Vue Router v5.0.7 — Best Practices

## Best Practices

- **Guard against infinite redirects by checking the target route name** — In `beforeEach`, always verify the destination route name to prevent redirecting users to `/login` repeatedly when they're already there [source](./.skilld/docs/guide/advanced/navigation-guards.md#global-before-guards)

- **Use `beforeResolve` for data fetching before navigation confirmation** — Unlike `beforeEach`, this guard runs after async components resolve, making it ideal for permission checks and operations that must complete before displaying a route [source](./.skilld/docs/guide/advanced/navigation-guards.md#global-resolve-guards)

- **Watch specific route properties instead of the entire route object** — Watching `route.params.id` is more efficient and clearer than watching the full `route` since route is a complex reactive object [source](./.skilld/docs/guide/advanced/composition-api.md#accessing-the-router-and-current-route-inside-setup)

- **Check if params actually changed before refetching in `beforeRouteUpdate`** — Routes can change without param mutations (query or hash-only changes), so verify `to.params.id !== from.params.id` before costly operations [source](./.skilld/docs/guide/advanced/composition-api.md#navigation-guards)

- **Prefer file-based routing plugins to generate typed routes** — Manual `RouteRecordInfo` configuration is tedious and error-prone; use Nuxt's file-based routing or equivalent to auto-generate type-safe route maps [source](./.skilld/docs/guide/advanced/typed-routes.md#manual-configuration)

- **Return `savedPosition` in `scrollBehavior` to replicate native browser back/forward** — When users navigate backward, returning the saved scroll position provides the expected UX without custom logic [source](./.skilld/docs/guide/advanced/scroll-behavior.md#scroll-behavior)

- **Use Promises in `scrollBehavior` to delay scrolling until transitions complete** — Scroll-before-transition causes visual artifacts; wrap the scroll resolution in a Promise that waits for your page transition to finish [source](./.skilld/docs/guide/advanced/scroll-behavior.md#delaying-the-scroll)

- **Do not use Vue async components as route components** — Route components must be plain functions that return a Promise, not `<Suspense>`-wrapped async components, as Vue Router's lazy loading logic differs from async component handling [source](./.skilld/docs/guide/advanced/lazy-loading.md#relationship-to-async-components)

- **Use `route.meta` merge instead of iterating `route.matched`** — Vue Router automatically merges all `meta` fields from parent to child in `route.meta`, eliminating the need for `to.matched.some(record => record.meta.requiresAuth)` boilerplate [source](./.skilld/docs/guide/advanced/meta.md#route-meta-fields)

- **Await `router.push()` to reliably detect navigation completion** — Navigations are asynchronous; only check the resolved value (truthy = failure, falsy = success) after awaiting to know if a route change actually occurred [source](./.skilld/docs/guide/advanced/navigation-failures.md#detecting-navigation-failures)

- **Use `Symbol` for dynamic route names to avoid accidental overwrites** — When adding routes at runtime with `router.addRoute()`, Symbol names prevent name collisions that would silently remove existing routes [source](./.skilld/docs/guide/advanced/dynamic-routing.md#removing-routes)

- **Decouple route components using the `props` option instead of `$route`** — Pass route params as props (boolean, object, or function mode) to make components reusable, testable, and route-agnostic [source](./.skilld/docs/guide/essentials/passing-props.md#passing-props-to-route-components)

- **Keep the `props` function stateless — it only evaluates on route changes** — If you need state for deriving props, wrap the component in a stateful parent; evaluating state inside the props function produces stale values [source](./.skilld/docs/guide/essentials/passing-props.md#function-mode)
<!-- /skilld:best-practices -->
