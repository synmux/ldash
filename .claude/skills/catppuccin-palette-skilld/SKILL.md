---
name: catppuccin-palette-skilld
description: 'ALWAYS use when writing code importing "@catppuccin/palette". Consult for debugging, best practices, or modifying @catppuccin/palette, catppuccin/palette, catppuccin palette, palette.'
metadata:
  version: 1.8.0
  generated_by: Anthropic · Haiku 4.5
  generated_at: 2026-05-16
---

# catppuccin/palette `@catppuccin/palette@1.8.0`

**Tags:** latest: 1.8.0, beta: 2.0.0-beta.1

**References:** [package.json](./.skilld/pkg/package.json) • [README](./.skilld/pkg/README.md) • [Docs](./.skilld/docs/_INDEX.md) • [Issues](./.skilld/issues/_INDEX.md) • [Releases](./.skilld/releases/_INDEX.md)

## Search

Use `skilld search "query" -p @catppuccin/palette` instead of grepping `.skilld/` directories. Run `skilld search --guide -p @catppuccin/palette` for full syntax, filters, and operators.

<!-- skilld:api-changes -->

## API Changes

This section documents version-specific API changes in @catppuccin/palette — prioritizing recent major/minor releases from v1.5.0 onwards.

## Recent Major Changes (v1.5+)

- NEW: `oklch` color format — added in v1.8.0, all color objects now include `oklch: { l, c, h }` alongside `hex`, `rgb`, and `hsl`. Available in both `ColorFormat` (regular colors) and `AnsiColorFormat` (ANSI colors) [source](./.skilld/releases/v1.8.0.md#features)

- NEW: `ansiColors` and `ansiColorEntries` on flavor objects — v1.5.0 introduced complete ANSI color support. Every flavor now exposes `ansiColors: CatppuccinAnsiColors` (an object with 8 ANSI color names) and `ansiColorEntries` (typed entries helper) [source](./.skilld/releases/v1.5.0.md#features)

- NEW: `hsl` and `rgb` color formats for ANSI colors — v1.7.0 extended `AnsiColorFormat` to include `hsl: { h, s, l }` and `rgb: { r, g, b }` in addition to the original `hex` and `code` properties [source](./.skilld/releases/v1.7.0.md#features)

- NEW: `name` and `order` keys in ANSI colors — v1.6.0 added metadata to the ANSI color system. `AnsiColorGroups` now has `name` and `order` properties, and each `AnsiColorFormat` (normal and bright) includes a `name` property for the color group name [source](./.skilld/releases/v1.6.0.md#features)

- NEW: `version` exported from module — v1.4.0 added a `version` export (string) to the main exports. Access with `import { version } from "@catppuccin/palette"` [source](./.skilld/releases/v1.4.0.md#features)

- NEW: `emoji` property on flavor objects — v1.2.0 added an `emoji: string` property to each flavor (e.g., `flavors.mocha.emoji`). Requires Unicode 13.0 or later to render [source](./.skilld/releases/v1.2.0.md#features)

## Color Object Structure (v1.1+)

- NEW: `name` and `order` properties on color objects — v1.1.0 added metadata to `ColorFormat`. Every color now includes `name: string` (e.g., "Lavender") and `order: number` (position in the palette spec) [source](./.skilld/releases/v1.1.0.md#features)

## Version History

- **v1.8.0** (2026-03-21) [MINOR] — oklch color format support
- **v1.7.1** (2024-11-02) — bug fix: improved naming documentation for ANSI objects
- **v1.7.0** (2024-11-02) [MINOR] — hsl and rgb for ANSI colors
- **v1.6.0** (2024-11-01) [MINOR] — name and order for ANSI colors
- **v1.5.0** (2024-10-26) [MINOR] — ANSI colour support
- **v1.4.0** (2024-09-21) — version export
- **v1.3.0** (2024-09-08) [MINOR] — Apple Color List distribution format
- **v1.2.0** (2024-05-18) [MINOR] — emoji per flavor
- **v1.1.0** (2024-02-12) [MINOR] — color names and order
- **v1.0.0** (2023-12-28) [MAJOR] — complete rewrite (breaking changes from v0.x)

## Current Color Format Properties (v1.8.0)

The `ColorFormat` type for regular colors contains:

- `name: string` — colour name
- `order: number` — spec position
- `hex: string` — hexadecimal representation
- `rgb: { r, g, b }` — RGB representation
- `hsl: { h, s, l }` — HSL representation
- `oklch: { l, c, h }` — OKLCh representation (new in v1.8.0)
- `accent: boolean` — whether this is an accent colour

The `AnsiColorFormat` type for ANSI colours contains the same colour formats plus:

- `name: string` — ANSI colour group name
- `code: number` — ANSI colour code (0-15)

---

**Also changed:** flavors export structure · flavorEntries typed helper · color and ANSI colour access patterns

<!-- /skilld:api-changes -->

<!-- skilld:best-practices -->

## Best Practices

- Use `flavorEntries` over direct `flavors` object iteration for type-safe paired access to flavor names and data — provides full type inference with `[name, flavor]` tuples [source](/Users/dave/.skilld/references/@catppuccin/palette@1.8.0/docs/_INDEX.md), [ts-def](../../../../node_modules/@catppuccin/palette/esm/mod.d.ts:L269:L271)

- Access the `oklch` color format (v1.8.0+) for modern CSS colour interpolation and perceptually uniform colour spaces instead of HSL — use `oklch()` in CSS for better colour transitions [source](/Users/dave/.skilld/repos/catppuccin/palette/releases/v1.8.0.md:L14)

```ts
const { oklch } = flavor.colors.base;
// oklch: { l: 0.8369, c: 0.1054, h: 238.92 }
```

- When using Sass `_catppuccin.scss` map, wrap colour names in quotes — prevents CSS safe colours (`red`, `green`, `blue`) from being treated as keyword values instead of map lookups [source](/Users/dave/.skilld/references/@catppuccin/palette@1.8.0/docs/sass.md:L46:L52)

- Import individual flavor files (`_mocha.scss`, `_frappe.scss`, etc) for simpler projects instead of the combined map — avoids complexity when you only need one theme [source](/Users/dave/.skilld/references/@catppuccin/palette@1.8.0/docs/sass.md:L16:L39)

- Leverage CSS variable suffixes (`-rgb`, `-hsl`, `-oklch`) with functional notations for dynamic opacity — enables flexible alpha blending without re-specifying colours [source](/Users/dave/.skilld/references/@catppuccin/palette@1.8.0/docs/css.md:L29:L35)

```css
background: rgba(var(--ctp-mocha-base-rgb) / 0.9);
border-color: hsla(var(--ctp-frappe-red-hsl) / 0.75);
```

- Use the `accent` property to distinguish semantic colour roles — false for surfaces and text, true for action colours, guides styling decisions for interactive components [source](../../../../node_modules/@catppuccin/palette/esm/mod.d.ts:L167:L168)

- Check `flavor.dark` property to conditionally apply theme-specific logic — false for latte (light), true for frappe, macchiato, mocha (dark variants) [source](../../../../node_modules/@catppuccin/palette/esm/mod.d.ts:L48:L49)

- Import CSS from CDN (jsdelivr or unpkg) for simple use cases without bundler setup — reduces build complexity when palette is the only colour dependency [source](/Users/dave/.skilld/references/@catppuccin/palette@1.8.0/docs/css.md:L20:L24)

- Access ANSI color `normal` and `bright` variants separately for terminal theming — bright colours are not necessarily brighter but more bold and saturated [source](../../../../node_modules/@catppuccin/palette/esm/mod.d.ts:L180:L188)

- Respect the `order` property to preserve canonical palette order when sorting or displaying colours — defined by the official Catppuccin spec [source](../../../../node_modules/@catppuccin/palette/esm/mod.d.ts:L44:L45)

- Use `flavorEntries` with `.map()` instead of manually calling `Object.entries()` on `flavors` — the typed iterable ensures proper inference through the entire chain [source](../../../../node_modules/@catppuccin/palette/esm/mod.d.ts:L1:L3)

- Cache the separated `version` export at initialization — allows runtime version checks without re-parsing the full palette object [source](../../../../node_modules/@catppuccin/palette/esm/mod.d.ts:L263)

- Rely on readonly type declarations for immutability guarantees — all colour and flavour objects are frozen to prevent accidental mutations [source](../../../../node_modules/@catppuccin/palette/esm/mod.d.ts:L33), [changelog](../../../../.skilld/repos/catppuccin/palette/releases/v1.1.0.md:L104:L107)
<!-- /skilld:best-practices -->
