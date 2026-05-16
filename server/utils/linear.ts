/**
 * Live Linear data orchestrator.
 *
 * Called from `server/api/issues.get.ts` whenever the runtime config has
 * a non-empty `linearApiKey`. Builds a `DashboardPayload` by running
 * several Linear queries in parallel and shaping the result.
 *
 * The function is intentionally one big top-level call so that polling
 * (every 10 minutes by default) is a single round-trip with at most a
 * handful of fan-out fetches. If your workspace has >250 open issues
 * you'll want to add pagination via `Connection.fetchNext()` here.
 */

import { LinearClient, LinearDocument } from "@linear/sdk";
import type {
  DashboardCycle,
  DashboardPayload,
  DashboardProject,
  DashboardTeam,
  DashboardUser,
} from "#shared/types";
import { shapeIssue } from "./shapeIssue";

/**
 * Build a `DashboardPayload` from a live Linear API key.
 *
 * Throws on auth / network failures so the API route can surface a
 * meaningful 5xx to the client instead of silently returning mock data.
 */
export async function getLivePayload(
  apiKey: string,
): Promise<DashboardPayload> {
  const client = new LinearClient({ apiKey });

  // Kick off the four top-level queries in parallel.
  const [viewerRaw, teamsConnection, projectsConnection, issuesConnection] =
    await Promise.all([
      client.viewer,
      client.teams({ first: 50 }),
      client.projects({
        first: 100,
        // `state` here is the Project state — only "started" projects
        // are typically interesting on a wall display.
        filter: { state: { eq: "started" } },
      }),
      client.issues({
        first: 250,
        // Exclude completed/cancelled issues — they would just be noise
        // on a "what should we work on now?" dashboard.
        filter: {
          state: { type: { nin: ["completed", "canceled"] } },
        },
        orderBy: LinearDocument.PaginationOrderBy.UpdatedAt,
      }),
    ]);

  // ── Viewer ────────────────────────────────────────────────────────
  const viewer: DashboardUser = {
    id: viewerRaw.id,
    name: viewerRaw.name,
    email: viewerRaw.email,
    avatarUrl: viewerRaw.avatarUrl ?? null,
  };

  // ── Teams ─────────────────────────────────────────────────────────
  const teams: DashboardTeam[] = teamsConnection.nodes.map((t) => ({
    id: t.id,
    key: t.key,
    name: t.name,
    color: t.color ?? "#6c7086",
  }));

  // ── Projects ──────────────────────────────────────────────────────
  const projects: DashboardProject[] = projectsConnection.nodes.map((p) => ({
    id: p.id,
    name: p.name,
    color: p.color ?? "#6c7086",
  }));

  // ── Active cycles ─────────────────────────────────────────────────
  // One active cycle per team, fetched in parallel.
  const cycleResults = await Promise.all(
    teamsConnection.nodes.map(async (team) => {
      const cycles = await team.cycles({
        filter: { isActive: { eq: true } },
        first: 1,
      });
      const cycle = cycles.nodes[0];
      if (!cycle) return null;
      const shaped: DashboardCycle = {
        id: cycle.id,
        number: cycle.number,
        name: cycle.name ?? undefined,
        startsAt: cycle.startsAt.toISOString(),
        endsAt: cycle.endsAt.toISOString(),
        teamId: team.id,
      };
      return shaped;
    }),
  );
  const activeCycles = cycleResults.filter(
    (c): c is DashboardCycle => c !== null,
  );

  // ── Issues ────────────────────────────────────────────────────────
  // Shape each issue (resolving its lazy relations) in parallel.
  const issues = await Promise.all(
    issuesConnection.nodes.map((issue) => shapeIssue(issue)),
  );

  return {
    source: "live",
    fetchedAt: new Date().toISOString(),
    viewer,
    teams,
    projects,
    activeCycles,
    issues,
  };
}
