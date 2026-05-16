/**
 * Shared type definitions for the Linear dashboard wire format.
 *
 * These types are the contract between the server endpoint (`/api/issues`)
 * and the client. Because they live under `shared/`, Nuxt makes them
 * importable from both `app/` (client) and `server/` (Nitro) via the
 * generated `#shared` alias, e.g.
 *
 *   import type { DashboardPayload } from '#shared/types'
 *
 * Everything here is a *plain JSON-serialisable* snapshot — no Linear SDK
 * objects ever cross the wire, only the fields we actually render.
 * Keeping the surface this narrow makes mock data trivial to author and
 * makes the polling endpoint cheap to serialise.
 *
 * If you want a new field in the UI, add it here first, populate it in
 * `server/utils/shapeIssue.ts` (for live data) and `server/utils/mockData.ts`
 * (for the demo dataset), then consume it from any component.
 */

/**
 * Linear's numeric priority encoding.
 * The Linear API uses these literal numbers; we mirror them rather than
 * re-naming so the wire format stays loyal to upstream.
 *
 *   0 = No priority (sorts LAST for "most important")
 *   1 = Urgent      (sorts FIRST)
 *   2 = High
 *   3 = Medium
 *   4 = Low
 */
export type Priority = 0 | 1 | 2 | 3 | 4;

/**
 * Linear workflow state categories. Each team can define its own states,
 * but they always belong to one of these well-known categories.
 * We use the category (not the team-specific state name) for view filtering
 * so that "In progress" and "Backlog" views work consistently across teams.
 */
export type WorkflowStateType =
  | "backlog"
  | "unstarted"
  | "started"
  | "completed"
  | "canceled"
  | "triage";

/** A workflow state as rendered on an issue card. */
export interface DashboardState {
  id: string;
  name: string;
  type: WorkflowStateType;
  /** Hex colour string from Linear (e.g. "#5e6ad2"). Used for the state pill. */
  color: string;
}

/** A minimal user record, used for assignees, creators, and the viewer. */
export interface DashboardUser {
  id: string;
  name: string;
  /** Optional email; we only surface it for the viewer in the header. */
  email?: string;
  /** URL to an avatar image, if Linear has one for this user. */
  avatarUrl?: string | null;
}

/** A project that issues can belong to. */
export interface DashboardProject {
  id: string;
  name: string;
  /** Hex colour, used for chips and grouped headers. */
  color: string;
}

/** A team. Issues always belong to exactly one team. */
export interface DashboardTeam {
  id: string;
  /** e.g. "ENG" — used as the prefix in issue identifiers like "ENG-123". */
  key: string;
  name: string;
  /** Hex colour, used for chips and grouped headers. */
  color: string;
}

/** A cycle (sprint) belonging to a team. */
export interface DashboardCycle {
  id: string;
  /** Numeric cycle index within the team, e.g. 12. */
  number: number;
  /** Friendly name if the team named the cycle, otherwise undefined. */
  name?: string;
  /** ISO timestamp string. */
  startsAt: string;
  /** ISO timestamp string. */
  endsAt: string;
  /** Which team this cycle belongs to. */
  teamId: string;
}

/**
 * The shape of a single issue as rendered by the dashboard.
 * This is intentionally flat — we resolve all relations server-side so
 * the client never has to await anything.
 */
export interface DashboardIssue {
  id: string;
  /** Human-readable identifier like "ENG-42". */
  identifier: string;
  title: string;
  /** Permalink back to Linear. Clicking an issue card opens this. */
  url: string;
  priority: Priority;
  /**
   * Due date as an ISO 8601 *date* string (YYYY-MM-DD) when set, or null.
   * Linear returns dates without a time component; we preserve that.
   */
  dueDate: string | null;
  /** ISO timestamp of last update — used as a tie-break in sorts. */
  updatedAt: string;
  state: DashboardState;
  assignee: DashboardUser | null;
  creator: DashboardUser;
  project: DashboardProject | null;
  team: DashboardTeam;
  cycle: DashboardCycle | null;
}

/**
 * The complete payload returned by `GET /api/issues`.
 *
 * The client receives ONE of these per poll cycle and slices it eight
 * different ways to drive each view. That's the whole architecture in
 * a sentence.
 */
export interface DashboardPayload {
  /** Whether the server is hitting Linear or returning the mock fixture. */
  source: "live" | "mock";
  /** Server-side timestamp of when this snapshot was assembled. */
  fetchedAt: string;
  /** The authenticated user (mocked when running offline). */
  viewer: DashboardUser;
  teams: DashboardTeam[];
  projects: DashboardProject[];
  /** The currently active cycle for each team that has one. */
  activeCycles: DashboardCycle[];
  /** All open issues we know about. Views filter from this list. */
  issues: DashboardIssue[];
}
