---
name: types-node-skilld
description: 'TypeScript definitions for node. ALWAYS use when writing code importing "@types/node". Consult for debugging, best practices, or modifying @types/node, types/node, types node, DefinitelyTyped.'
metadata:
  version: 25.8.0
  generated_by: cached
  generated_at: 2026-05-16
---

# DefinitelyTyped/DefinitelyTyped `@types/node@25.8.0`

**Tags:** ts2.0: 12.12.6, ts2.1: 12.12.6, ts2.5: 12.12.6

**References:** [package.json](./.skilld/pkg/package.json) • [README](./.skilld/pkg/README.md) • [Issues](./.skilld/issues/_INDEX.md) • [Discussions](./.skilld/discussions/_INDEX.md) • [Releases](./.skilld/releases/_INDEX.md)

## Search

Use `skilld search "query" -p @types/node` instead of grepping `.skilld/` directories. Run `skilld search --guide -p @types/node` for full syntax, filters, and operators.

<!-- skilld:api-changes -->

## API Changes

This section documents version-specific API changes in @types/node v25.8.0, prioritizing recent major/minor releases and migration notes from v24 → v25.

### Breaking changes and removals

- BREAKING: `SlowBuffer` — removed in v25.0.0, use `Buffer.allocUnsafeSlow(size)` instead source

- BREAKING: `tls.createSecurePair()` — removed in v24.0.0, use `tls.TLSSocket` instead source

- BREAKING: `http.OutgoingMessage.prototype._headers` and `_headerNames` — deprecated in v25.0.0, use public methods (getHeader, setHeader, getHeaders, etc.) instead source

- BREAKING: `url.parse()` — runtime deprecated in v24.0.0, use WHATWG URL API instead source

- BREAKING: `process.noDeprecation` — changed from required `boolean` to optional `boolean?` in v22.19.3, affects type compatibility with code expecting a strict boolean source

### New and stabilised APIs

- NEW: `import.meta.main` — boolean value to detect if current module is entry point, stable in v24.2.0+ source

- NEW: `URLPattern` — exposed as a global in v24.0.0+, provides pattern matching for URLs similar to regular expressions source

- NEW: `Error.isError()` — static method to check if a value is an Error object, added in v24 via V8 13.4 source

- NEW: `Atomics.pause()` — pauses execution for specified duration, added in v24 via V8 13.4 source

- STABLE: Type stripping — became stable in v25.2.0, Node.js can now run TypeScript files with `.ts` extension without `--experimental-strip-types` flag source

### Runtime changes

- BREAKING: Web Storage enabled by default in v25.0.0 — `localStorage` is file-backed (requires `--localstorage-file`), unencrypted, 10MB quota, shared per process. Can be disabled with `NODE_OPTIONS="--no-experimental-webstorage"` source

- BREAKING: `--permission` flag replaces `--experimental-permission` in v24.0.0, indicating increasing stability of the Permission Model source

### Deprecations (still functional in v25.8.0)

- DEPRECATED: `ServerResponse.prototype.writeHeader()` — runtime deprecated in v25.0.0, use `ServerResponse.prototype.writeHead()` instead source

**Also changed:** `http/2` priority signaling removed in v24 · `AsyncLocalStorage` uses `AsyncContextFrame` by default v24 · V8 upgraded to 14.1 v25 · npm upgraded to 11.0.0 v24

<!-- /skilld:api-changes -->

<!-- skilld:best-practices -->

## Best Practices

- Always use the `node:` prefix when importing Node.js built-in modules — this syntax is supported since Node.js v14.18.0 and v12.20.0 and is the recommended standard for all new code [source](./.skilld/pkg/timers/promises.d.ts:L1)

- Prefer `fs/promises` and similar promise-based APIs over callback-based equivalents for modern asynchronous code — these modules provide better error handling and integrate naturally with async/await patterns [source](./.skilld/pkg/fs/promises.d.ts:L1)

- Use `EventEmitter` with typed generics to ensure event handlers are properly typed — extend `EventEmitter<TEventMap>` in custom classes for full type safety on event names and listener arguments [source](./.skilld/pkg/events.d.ts:L1:100)

- Configure `tsconfig.json` with `"lib": ["ESNext"]` to access the latest Node.js type definitions — many modern APIs like `Array.fromAsync` are only available when ESNext is included [source](./.skilld/discussions/discussion-74504.md)

- Use `Readable.from()` to create Node.js streams from any iterable or async iterable source — this utility handles the complexity of stream creation and is the idiomatic way to convert iterables to streams [source](./.skilld/pkg/stream.d.ts:L1:50)

- Prefer `AbortController` and `AbortSignal` for cancellation support in async operations — this is the modern Web standard pattern integrated throughout Node.js APIs like fetch, child_process, and timers [source](./.skilld/pkg/web-globals/abortcontroller.d.ts:L1)

- Type file system operation callbacks with `NodeJS.ErrnoException` for the error parameter — this ensures proper handling of filesystem-specific errors like ENOENT and EACCES [source](./.skilld/pkg/fs.d.ts:L1:50)

- Use `util.types` module for runtime type checking instead of manual `typeof` checks — it provides accurate checking for Buffer, Promise, RegExp, and other special types [source](./.skilld/pkg/util/types.d.ts:L1)

- Import web standard APIs like `fetch`, `Blob`, `TextEncoder`, and `URL` from `node:web-globals` or directly use the global scope in Node.js 18+ — @types/node provides full Web APIs interoperability [source](./.skilld/pkg/web-globals/fetch.d.ts:L1)

- Use `timers/promises` module to convert timer callbacks to promises — `await setTimeout(delay)` and `for await` with `setInterval()` provide cleaner syntax than traditional timer callbacks [source](./.skilld/pkg/timers/promises.d.ts:L1:60)

- Always check the `readonly` property flags in type definitions — many Node.js properties like `readableAborted` and `readableEnded` are read-only and should not be assigned [source](./.skilld/pkg/stream.d.ts:L1:200)

- Use `worker_threads` for CPU-intensive tasks and background work — the module provides typed Worker and MessagePort APIs for safe multi-threaded execution [source](./.skilld/pkg/worker_threads.d.ts:L1)

- Verify your TypeScript version supports the Node.js API you're using — @types/node v25.8.0 requires TypeScript 5.8 or higher as noted in the index comments [source](./.skilld/pkg/index.d.ts:L24:28)

- Use `module` declarations with the `node:` prefix pattern for type-safe module importing — this enables TypeScript to properly resolve and type-check your imports [source](./.skilld/pkg/buffer.d.ts:L1)
<!-- /skilld:best-practices -->
