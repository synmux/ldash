---
name: linear-sdk-skilld
description: 'ALWAYS use when writing code importing "@linear/sdk". Consult for debugging, best practices, or modifying @linear/sdk, linear/sdk, linear sdk, linear.'
metadata:
  version: 84.0.0
  generated_by: Anthropic · Haiku 4.5
  generated_at: 2026-05-16
---

# linear/linear `@linear/sdk@84.0.0`

**Tags:** latest: 84.0.0

**References:** [package.json](./.skilld/pkg/package.json) • [README](./.skilld/pkg/README.md) • [Docs](./.skilld/docs/_INDEX.md) • [Issues](./.skilld/issues/_INDEX.md) • [Releases](./.skilld/releases/_INDEX.md)

## Search

Use `skilld search "query" -p @linear/sdk` instead of grepping `.skilld/` directories. Run `skilld search --guide -p @linear/sdk` for full syntax, filters, and operators.

<!-- skilld:api-changes -->

## API Changes

This section documents version-specific API changes between v83.0.0 and v84.0.0 — the current stable release.

## Detailed Changes

### Breaking Changes (v84.0.0)

- BREAKING: `OrganizationUpdateInput.customersConfiguration` — type changed from `JSONObject` to `CustomersConfigurationInput`. Old code using JSONObject will compile but produce runtime type errors [source](./.skilld/releases/@linear/sdk@84.0.0.md:L11)

- BREAKING: `OrganizationUpdateInput.themeSettings` — type changed from `JSONObject` to `OrganizationThemeSettingsInput`. Old code using JSONObject will compile but produce runtime type errors [source](./.skilld/releases/@linear/sdk@84.0.0.md:L13)

- BREAKING: `Mutation.integrationSalesforce()` — required argument `codeVerifier: StringOrganizationUpdateInput.aiProviderConfiguration` — field removed entirely. Code using this field will fail to compile [source](./.skilld/releases/@linear/sdk@84.0.0.md:L81)

### Breaking Changes (v83.0.0 → v84.0.0 Migration)

- BREAKING: `AiConversationNavigateToPageToolCallArgs.entityType` — field removed. Replace with new `entities` field structure [source](./.skilld/releases/@linear/sdk@83.0.0.md:L11)

- BREAKING: `AiConversationNavigateToPageToolCallArgs.identifier` — field removed. Use `entities` array instead [source](./.skilld/releases/@linear/sdk@83.0.0.md:L13)

- BREAKING: `AiConversationNavigateToPageToolCallResult.newTab` — field removed. Use `urls` array instead [source](./.skilld/releases/@linear/sdk@83.0.0.md:L15)

- BREAKING: `AiConversationNavigateToPageToolCallResult.url` — field removed. Multi-URL support now via `urls` array [source](./.skilld/releases/@linear/sdk@83.0.0.md:L17)

### New Types & Inputs (v84.0.0)

- NEW: `CustomersConfigurationInput` — new input type for configuring customer data sources in organizations [source](./.skilld/releases/@linear/sdk@84.0.0.md:L37)

- NEW: `OrganizationThemeSettingsInput` — new input type for organization theme and branding settings [source](./.skilld/releases/@linear/sdk@84.0.0.md:L39)

- NEW: `AiConversationErrorPart` — new union member in `AiConversationPart` for error handling in AI conversations [source](./.skilld/releases/@linear/sdk@84.0.0.md:L31)

- NEW: `AiConversationPartType.error` — new enum value to support error parts in conversation history [source](./.skilld/releases/@linear/sdk@84.0.0.md:L19)

- NEW: `DocumentSortInput` and sort types — new sorting infrastructure for documents in `Query.documents` with createdAt, creator, project, title, and updatedAt sort options [source](./.skilld/releases/@linear/sdk@84.0.0.md:L117)

- NEW: `WorkflowTriggerType.schedule` — new enum value enabling scheduled workflow triggers (cron-based) [source](./.skilld/releases/@linear/sdk@84.0.0.md:L109)

### New Mutation Arguments & Fields (v84.0.0)

- NEW: `Query.documents()` — added `sort: [DocumentSortInput!]` argument for flexible document sorting [source](./.skilld/releases/@linear/sdk@84.0.0.md:L95)

- NEW: `Mutation.integrationGitlabConnect()` — added optional arguments `expiresAt: String`, `readonly: Boolean`, and `validationProjectPath: String` for enhanced GitLab integration control [source](./.skilld/releases/@linear/sdk@84.0.0.md:L89-L93)

- NEW: `ReleaseCreateInput` and `ReleaseUpdateInput` — added timestamp fields `completedAt`, `createdAt`, and `startedAt` for manual release date management [source](./.skilld/releases/@linear/sdk@84.0.0.md:L97-L105)

- NEW: `TeamSecuritySettingsInput.agentSkillsManagement` — new security setting for controlling agent skills access in teams [source](./.skilld/releases/@linear/sdk@84.0.0.md:L29)

### API Graduation from Experimental (v84.0.0)

Over 50 release management APIs transitioned from `[ALPHA]` or `[Internal]` status to stable in v84.0.0. These include core release lifecycle operations: `issueToReleaseCreate`, `issueToReleaseDelete`, `releaseArchive`, `releaseComplete`, `releasePipelineCreate`, `releaseSearch`, and related query fields. Old code checking for ALPHA status in documentation will need updating [source](./.skilld/releases/@linear/sdk@84.0.0.md:L173-L276)

### New Integration Features (v83.0.0)

- NEW: `Mutation.integrationGithubRemoveCodeAccess()` — new mutation for revoking GitHub code access permissions [source](./.skilld/releases/@linear/sdk@83.0.0.md:L123)

- NEW: `AiConversationNavigateToPageToolCallArgs.entities` — new field replacing `entityType`/`identifier` with structured entity references [source](./.skilld/releases/@linear/sdk@83.0.0.md:L65)

- NEW: `AiConversationNavigateToPageToolCallResult.urls` — new array field replacing single `url` for multi-URL navigation support [source](./.skilld/releases/@linear/sdk@83.0.0.md:L67)

## Summary

**Critical Updates:**

- 4 breaking changes requiring code updates for organization configuration and Salesforce integration
- 4 breaking AI conversation tool changes for tool call argument/result handling
- 50+ release management APIs stabilized from experimental status

**Recommended Actions:**

1. Update `OrganizationUpdateInput` usage to use new typed input objects instead of JSONObject
2. Add `codeVerifier` argument to `integrationSalesforce()` calls
3. Remove `aiProviderConfiguration` usage entirely
4. Update AI conversation tool call handlers to use new `entities` and `urls` structures
5. Review release management code using ALPHA fields — they are now stable public APIs
<!-- /skilld:api-changes -->

<!-- skilld:best-practices -->

## Best Practices

- Instantiate the SDK via `LinearClient` constructor with a configuration object — provides type-safe access to all API operations and normalizes authentication across apiKey, accessToken, or custom apiUrl [source](./.skilld/releases/@linear/sdk@84.0.0.md:L1-10)

- Use dedicated error subclasses (`RatelimitedLinearError`, `AuthenticationLinearError`, `InvalidInputLinearError`) instead of catching generic `LinearError` — each error type exposes specific metadata (rate limit windows, retry hints, user-presentable messages) for fine-grained error recovery [source](./.skilld/docs/API.md)

- Access rate limit metadata via `RatelimitedLinearError` properties — includes `retryAfter`, `requestsRemaining`, `complexityRemaining`, and reset timestamps to implement exponential backoff and quota-aware retry strategies [source](./.skilld/docs/API.md)

- Use `Connection.fetchNext()` and `Connection.fetchPrevious()` for manual pagination — implements Relay cursor-based pagination and automatically updates page info, avoiding manual cursor management [source](./.skilld/docs/API.md)

- Use `Request.paginate()` helper to fetch all nodes across multiple pages — automatically handles Relay pagination, cursor traversal, and accumulation in a single method call for simpler batch operations [source](./.skilld/docs/API.md)

- Set request headers with `client.setHeader(key, value)` before operations — client retains headers across subsequent requests, ideal for adding authorization headers, idempotency keys, or custom metadata [source](./.skilld/docs/API.md)

- Leverage Releases API for release management — v84.0.0 stabilizes release pipelines, stages, and notes (previously ALPHA), supporting continuous and scheduled release workflows [source](./.skilld/releases/@linear/sdk@84.0.0.md:L179-217)

- Use `ReleaseSync` mutations for CI/CD integration via access keys — automatically resolves issue and pull request references, associating them with releases without requiring explicit issue lookups [source](./.skilld/releases/@linear/sdk@84.0.0.md:L213-215)

- Store and reuse webhook secret in `LinearWebhookClient` constructor — verifies HMAC signatures automatically for all incoming payloads, preventing unauthorized requests [source](./.skilld/issues/issue-828.md:L20-24)

- Monitor `AgentActivity` events for AI coding sessions — activities capture thoughts, tool calls, errors, and user prompts; use the `signal` and `signalMetadata` fields to track agent behaviour and outcomes [source](./.skilld/releases/@linear/sdk@84.0.0.md:L45-47)

- Use `team.releasePipelines` to list release pipelines scoped to a team — enables team-specific release workflow configuration and access control without querying workspace-level pipelines [source](./.skilld/releases/@linear/sdk@84.0.0.md:L331)

- Prefer `DocumentCreateInput.releaseId` for release-related content — v84.0.0 stabilizes document-to-release associations (removed [Internal] marker), enabling release note generation and lifecycle tracking [source](./.skilld/releases/@linear/sdk@84.0.0.md:L129-137)

- Use typed webhook payloads from `LinearWebhookClient` — all event payloads are now fully typed in TypeScript, providing IDE autocompletion and compile-time safety for webhook handling [source](./.skilld/issues/issue-596.md:L1-15)
<!-- /skilld:best-practices -->
