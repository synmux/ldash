---
name: skilld-skilld
description: 'Generate AI agent skills from npm package documentation. ALWAYS use when writing code importing "skilld". Consult for debugging, best practices, or modifying skilld.'
metadata:
  version: 2.0.0
  generated_by: cached
  generated_at: 2026-05-16
---

# skilld-dev/skilld `skilld@2.0.0`

**Tags:** latest: 2.0.0

**References:** [package.json](./.skilld/pkg/package.json) • [README](./.skilld/pkg/README.md) • [Docs](./.skilld/docs/_INDEX.md) • [Issues](./.skilld/issues/_INDEX.md) • [Releases](./.skilld/releases/_INDEX.md)

## Search

Use `skilld search "query" -p skilld` instead of grepping `.skilld/` directories. Run `skilld search --guide -p skilld` for full syntax, filters, and operators.

<!-- skilld:api-changes -->

## API Changes

This section documents version-specific API changes — prioritize recent major/minor releases to understand what's new in v2.0.0.

- NEW: `skilld prepare` — new command (v1.5.0) for restoring references and syncing shipped skills in package.json hooks [source](./.skilld/releases/v1.5.0.md#features)

- NEW: `skilld author` — new command system (v1.5.0) for maintainers to generate and publish skills directly with their packages [source](./.skilld/releases/v1.5.0.md#features)

- NEW: `skilld list --outdated` — flag added (v1.4.0) to filter and display only skills with available version updates [source](./.skilld/releases/v1.4.0.md#features)

- NEW: `skilld search --filter` — flag added (v1.5.0) for filtering search results by type (e.g., issue, discussion, release) using JSON syntax [source](./.skilld/releases/v1.5.0.md#features)

- NEW: `skilld search --limit` — flag added (v1.5.0) to cap the number of search results returned [source](./.skilld/releases/v1.5.0.md#features)

- NEW: `skilld search --guide` — flag added (v1.5.0) to display full search syntax, filters, and operators for advanced queries [source](./.skilld/releases/v1.5.0.md#features)

- NEW: `skilld cache --stats` — flag added (v1.6.0) to display cache statistics including size and age of LLM-generated sections [source](./.skilld/releases/v1.6.0.md#features)

- NEW: `skilld cache --clean` — flag added (v1.6.0) to remove stale and expired cache entries [source](./.skilld/releases/v1.6.0.md#features)

- NEW: No agent mode — workflow added (v1.1.0) allowing skilld to run without an agent CLI, generating portable prompts for any LLM instead [source](./.skilld/releases/v1.1.0.md#features)

- NEW: AI OAuth providers — authentication flow added (v1.3.0) with UX rework to support multiple LLM provider logins [source](./.skilld/releases/v1.3.0.md#features)

- NEW: Private GitHub repo fallback — feature added (v1.2.0) allowing skill docs and sync to resolve from private GitHub repositories [source](./.skilld/releases/v1.2.0.md#features)

- NEW: Incremental search index updates — search system improved (v1.3.0) to rebuild only changed docs instead of all-or-nothing rebuilds, reducing sync time [source](./.skilld/releases/v1.3.0.md#features)

- NEW: LLM-generated sections — skills now support optional sections for Best Practices, API Changes, and custom prompts curated by LLMs instead of raw docs [source](./.skilld/pkg/README.md:L34)

**Also changed:** Dangling symlink handling · Isolated lockfile cache copies · Skip LLM on full cache hit · jsonc-parser for surgical edits

<!-- /skilld:api-changes -->

<!-- skilld:best-practices -->

## Best Practices

- Be selective about skill installation — only add skills for packages your agent actually struggles with, not every dependency. Unnecessary skills add context overhead without benefit [source](./.skilld/docs/index.md#what-should-your-agent-be-better-at)

- Use `skilld prepare` in your `package.json` prepare script to auto-restore symlinks, auto-install shipped skills, and get notified of outdated packages on every install [source](./.skilld/../README.md:L101:L112)

- Add LLM enhancements (`Best Practices`, `API Changes`, custom prompts) only when the base skill needs refinement — skillD works effectively without any LLM if docs are clear [source](./.skilld/../README.md:L59:L66)

- Use `skilld search "query"` with the `-p` package flag for semantic search across docs instead of reading files manually — retriv embeddings surface exact answers faster [source](./.skilld/../README.md:L159:L161)

- Organise skills via curated collections when you install multiple related packages — one command pulls the full set aligned with best practices from trusted curators like @harlan-zw or vercel-labs [source](./.skilld/docs/collections.md#featured)

- Target specific agents with `skilld add npm:package --agent claude-code` (or cursor, gemini-cli, etc.) to install skills into the right agent directory without manual setup [source](./.skilld/../README.md:L165)

- For no-agent workflows, choose "No agent" when prompted — you get a base SKILL.md immediately, plus PROMPT\_\*.md files you can paste into ChatGPT/Claude web, then assemble the outputs with `skilld author assemble` [source](./.skilld/../README.md:L59:L66)

- Use `--force` flag when debugging skill generation or cache issues — it clears all caches and regenerates from scratch, avoiding stale LLM output or partial doc fetches [source](./.skilld/../README.md:L245)

- Eject skills as portable, self-contained directories for sharing via git repos using `skilld author eject vue --out ./skills/` — consumers then install via `skilld add gh:owner/repo` with zero LLM cost [source](./.skilld/../README.md:L225:L236)

- Ship skills directly in npm packages (skills/ directory) so consumers get them automatically via `skilld prepare` — no LLM needed on their end and zero opt-in required [source](./.skilld/../README.md:L252:L286)

- Use `--debug` flag to save raw LLM output to logs/ for each SKILL.md section, useful for inspecting generated best practices, API changes, or verifying prompt output before assembly [source](./.skilld/../README.md:L250)

- Run `skilld install --agent gemini-cli` to sync skill references across multiple agents — the doc cache is shared, avoiding duplicate downloads and keeping all agents in sync [source](./.skilld/../README.md:L72)

- Follow the skill evaluation pattern: before invoking a skill, check YES/NO relevance to the current task — only invoke skills that actually apply, preventing wasted context on tangential skills [source](./.skilld/docs/index.md#what-should-your-agent-be-better-at)

- Treat all skill content (especially GitHub issues used for enhancements) as untrusted input — skilld runs in permissioned environments and sanitises prompt injection vectors, but always vet skills from untrusted sources [source](./.skilld/../README.md:L129:L134)
<!-- /skilld:best-practices -->
