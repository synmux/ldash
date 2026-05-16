/**
 * Live Linear data orchestrator.
 *
 * Called from `server/api/issues.get.ts` whenever the runtime config has
 * a non-empty `linearApiKey`. Builds a `DashboardPayload` from ONE
 * GraphQL request to Linear's API.
 *
 * Why a single rawRequest rather than the typed SDK helpers?
 * ----------------------------------------------------------
 * `@linear/sdk` returns relations (state, assignee, project, cycle, …)
 * as lazy promises that resolve via additional `node(id:)` queries. For
 * the dashboard's working set (~250 issues × 6 relations) that's up to
 * ~1500 round-trips per poll, plus N more for per-team active cycles.
 * That's an N+1 problem big enough to matter against Linear's complexity
 * limits.
 *
 * One handwritten GraphQL query collapses the whole thing into a single
 * request. The shape of the query mirrors `DashboardPayload` so the
 * transform at the bottom is trivial. The Linear SDK still gives us the
 * authenticated `LinearGraphQLClient` (`client.client.request`), so we
 * inherit auth + error handling for free.
 */

import { LinearClient } from "@linear/sdk";
import type {
  DashboardCycle,
  DashboardIssue,
  DashboardPayload,
  DashboardProject,
  DashboardState,
  DashboardTeam,
  DashboardUser,
  Priority,
  WorkflowStateType,
} from "#shared/types";

// ─── GraphQL query ───────────────────────────────────────────────────
//
// One round-trip fetches: viewer + teams (with active cycles) +
// projects + the working set of open issues with all their relations.
//
// Field names match the Linear public GraphQL schema 1:1. Adding a new
// field on the wire format means:
//   1. add the field here,
//   2. add it on the corresponding type in `DashboardSnapshotResult`,
//   3. project it in the transform at the bottom.
//
// Update `ISSUE_FETCH_LIMIT` carefully — the more you fetch, the higher
// the query complexity. 250 is well within Linear's per-request budget.
const ISSUE_FETCH_LIMIT = 250;

const DASHBOARD_QUERY = `
  query Dashboard($issueFirst: Int!) {
    viewer {
      id
      name
      email
      avatarUrl
    }
    teams(first: 50) {
      nodes {
        id
        key
        name
        color
        activeCycle {
          id
          number
          name
          startsAt
          endsAt
        }
      }
    }
    projects(first: 100, filter: { state: { eq: "started" } }) {
      nodes {
        id
        name
        color
      }
    }
    issues(
      first: $issueFirst
      filter: { state: { type: { nin: ["completed", "canceled"] } } }
      orderBy: updatedAt
    ) {
      nodes {
        id
        identifier
        title
        url
        priority
        dueDate
        updatedAt
        state {
          id
          name
          type
          color
        }
        assignee {
          id
          name
          email
          avatarUrl
        }
        creator {
          id
          name
          email
          avatarUrl
        }
        project {
          id
          name
          color
        }
        team {
          id
          key
          name
          color
        }
        cycle {
          id
          number
          name
          startsAt
          endsAt
        }
      }
    }
  }
`;

// ─── GraphQL response types (just enough to type the transform) ──────

interface RawUser {
  id: string;
  name: string;
  email?: string | null;
  avatarUrl?: string | null;
}

interface RawTeam {
  id: string;
  key: string;
  name: string;
  color: string | null;
  activeCycle: RawCycle | null;
}

interface RawCycle {
  id: string;
  number: number;
  name: string | null;
  startsAt: string;
  endsAt: string;
}

interface RawProject {
  id: string;
  name: string;
  color: string | null;
}

interface RawState {
  id: string;
  name: string;
  type: string;
  color: string | null;
}

interface RawIssue {
  id: string;
  identifier: string;
  title: string;
  url: string;
  priority: number | null;
  dueDate: string | null;
  updatedAt: string;
  state: RawState | null;
  assignee: RawUser | null;
  creator: RawUser | null;
  project: RawProject | null;
  team: RawTeam | null;
  cycle: RawCycle | null;
}

interface DashboardSnapshotResult {
  viewer: RawUser;
  teams: { nodes: RawTeam[] };
  projects: { nodes: RawProject[] };
  issues: { nodes: RawIssue[] };
}

// ─── Coercion helpers ────────────────────────────────────────────────

const STATE_TYPES: readonly WorkflowStateType[] = [
  "backlog",
  "unstarted",
  "started",
  "completed",
  "canceled",
  "triage",
];

function coerceStateType(raw: string | null | undefined): WorkflowStateType {
  return (STATE_TYPES as readonly string[]).includes(raw ?? "")
    ? (raw as WorkflowStateType)
    : "unstarted";
}

function coercePriority(raw: number | null | undefined): Priority {
  const p = Math.max(0, Math.min(4, Math.round(raw ?? 0)));
  return p as Priority;
}

function userOf(u: RawUser | null): DashboardUser | null {
  if (!u) return null;
  return {
    id: u.id,
    name: u.name,
    email: u.email ?? undefined,
    avatarUrl: u.avatarUrl ?? null,
  };
}

const FALLBACK_TEAM: DashboardTeam = {
  id: "no-team",
  key: "?",
  name: "(no team)",
  color: "#6c7086",
};

const FALLBACK_STATE: DashboardState = {
  id: "unknown",
  name: "Unknown",
  type: "unstarted",
  color: "#6c7086",
};

const FALLBACK_CREATOR: DashboardUser = {
  id: "system",
  name: "System",
  avatarUrl: null,
};

function teamOf(raw: RawTeam | null): DashboardTeam {
  if (!raw) return FALLBACK_TEAM;
  return {
    id: raw.id,
    key: raw.key,
    name: raw.name,
    color: raw.color ?? "#6c7086",
  };
}

function stateOf(raw: RawState | null): DashboardState {
  if (!raw) return FALLBACK_STATE;
  return {
    id: raw.id,
    name: raw.name,
    type: coerceStateType(raw.type),
    color: raw.color ?? "#6c7086",
  };
}

function projectOf(raw: RawProject | null): DashboardProject | null {
  if (!raw) return null;
  return {
    id: raw.id,
    name: raw.name,
    color: raw.color ?? "#6c7086",
  };
}

function cycleOf(raw: RawCycle | null, teamId: string): DashboardCycle | null {
  if (!raw) return null;
  return {
    id: raw.id,
    number: raw.number,
    name: raw.name ?? undefined,
    startsAt: raw.startsAt,
    endsAt: raw.endsAt,
    teamId,
  };
}

// ─── Entry point ─────────────────────────────────────────────────────

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

  // `client.client` is the underlying authenticated GraphQL client.
  // Using it directly lets us send a custom query that pulls every
  // field the dashboard needs in one round-trip.
  const data = await client.client.request<
    DashboardSnapshotResult,
    { issueFirst: number }
  >(DASHBOARD_QUERY, { issueFirst: ISSUE_FETCH_LIMIT });

  const teams: DashboardTeam[] = data.teams.nodes.map(teamOf);

  const projects: DashboardProject[] = data.projects.nodes
    .map(projectOf)
    .filter((p): p is DashboardProject => p !== null);

  // Active cycles are now embedded under each team. Flatten and tag
  // them with the owning team id so views can correlate.
  const activeCycles: DashboardCycle[] = data.teams.nodes.flatMap((t) => {
    const c = cycleOf(t.activeCycle, t.id);
    return c ? [c] : [];
  });

  const issues: DashboardIssue[] = data.issues.nodes.map((i) => {
    const team = teamOf(i.team);
    return {
      id: i.id,
      identifier: i.identifier,
      title: i.title,
      url: i.url,
      priority: coercePriority(i.priority),
      dueDate:
        i.dueDate === null || i.dueDate === undefined
          ? null
          : i.dueDate.length > 10
            ? i.dueDate.slice(0, 10)
            : i.dueDate,
      updatedAt: i.updatedAt,
      state: stateOf(i.state),
      assignee: userOf(i.assignee),
      creator: userOf(i.creator) ?? FALLBACK_CREATOR,
      project: projectOf(i.project),
      team,
      cycle: cycleOf(i.cycle, team.id),
    };
  });

  return {
    source: "live",
    fetchedAt: new Date().toISOString(),
    viewer: userOf(data.viewer) ?? {
      id: data.viewer.id,
      name: data.viewer.name,
      avatarUrl: null,
    },
    teams,
    projects,
    activeCycles,
    issues,
  };
}
