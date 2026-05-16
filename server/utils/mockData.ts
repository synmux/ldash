/**
 * Mock dataset for the dashboard.
 *
 * Used by `/api/issues` whenever `NUXT_LINEAR_API_KEY` is not set, so
 * the dashboard works out of the box without a Linear account.
 *
 * The data is *deterministic* (no Math.random in the structure itself,
 * only time-relative due dates) so screenshots and visual reviews stay
 * stable. Edit freely to test edge cases — overdue issues, very long
 * titles, missing assignees, archived projects, etc.
 */

import type {
  DashboardCycle,
  DashboardIssue,
  DashboardPayload,
  DashboardProject,
  DashboardTeam,
  DashboardUser,
  Priority,
  WorkflowStateType,
} from "#shared/types";

/** Helper: returns an ISO date string (YYYY-MM-DD) offset from today. */
function daysFromNow(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Helper: ISO timestamp offset from now, used for `updatedAt`. */
function hoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

// ─── Fixtures ────────────────────────────────────────────────────────

const viewer: DashboardUser = {
  id: "user-demo",
  name: "Demo User",
  avatarUrl: null,
};

const otherUser: DashboardUser = {
  id: "user-2",
  name: "Riley Chen",
  avatarUrl: null,
};

const thirdUser: DashboardUser = {
  id: "user-3",
  name: "Sam Park",
  avatarUrl: null,
};

const teams: DashboardTeam[] = [
  { id: "team-eng", key: "ENG", name: "Engineering", color: "#89b4fa" },
  { id: "team-dsn", key: "DSN", name: "Design", color: "#cba6f7" },
  { id: "team-ops", key: "OPS", name: "Operations", color: "#f9e2af" },
];

const projects: DashboardProject[] = [
  { id: "proj-1", name: "Q2 Platform Migration", color: "#94e2d5" },
  { id: "proj-2", name: "Design System v2", color: "#f5c2e7" },
  { id: "proj-3", name: "Onboarding Refresh", color: "#fab387" },
  { id: "proj-4", name: "Reliability Initiatives", color: "#a6e3a1" },
];

const activeCycles: DashboardCycle[] = [
  {
    id: "cycle-eng-12",
    number: 12,
    name: "Cycle 12",
    startsAt: hoursAgo(24 * 5),
    endsAt: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(),
    teamId: "team-eng",
  },
  {
    id: "cycle-dsn-7",
    number: 7,
    name: "Cycle 7",
    startsAt: hoursAgo(24 * 3),
    endsAt: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000).toISOString(),
    teamId: "team-dsn",
  },
];

/**
 * Small factory keeping issue construction terse.
 * Order of arguments mirrors how the data flows in a typical view:
 *   team → identifier → title → priority → due → state → assignee → project → cycle
 */
function makeIssue(args: {
  id: string;
  team: DashboardTeam;
  identifier: string;
  title: string;
  priority: Priority;
  dueOffset: number | null;
  stateType: WorkflowStateType;
  stateName: string;
  stateColor: string;
  assignee: DashboardUser | null;
  creator?: DashboardUser;
  project: DashboardProject | null;
  cycle: DashboardCycle | null;
  updatedHoursAgo: number;
}): DashboardIssue {
  return {
    id: args.id,
    identifier: args.identifier,
    title: args.title,
    url: `https://linear.app/example/issue/${args.identifier}`,
    priority: args.priority,
    dueDate: args.dueOffset === null ? null : daysFromNow(args.dueOffset),
    updatedAt: hoursAgo(args.updatedHoursAgo),
    state: {
      id: `state-${args.stateType}`,
      name: args.stateName,
      type: args.stateType,
      color: args.stateColor,
    },
    assignee: args.assignee,
    creator: args.creator ?? viewer,
    project: args.project,
    team: args.team,
    cycle: args.cycle,
  };
}

const [eng, dsn, ops] = teams;
const [proj1, proj2, proj3, proj4] = projects;
const [engCycle, dsnCycle] = activeCycles;

/**
 * ~30 mock issues covering every priority, every workflow state category,
 * overdue / due soon / no due date, with and without assignee/project/cycle.
 * Add more here to exercise the layout.
 */
const issues: DashboardIssue[] = [
  // Urgent + overdue — drives the "Most Important" strip.
  makeIssue({
    id: "i-001",
    team: eng!,
    identifier: "ENG-101",
    title: "Production checkout 500s spiking",
    priority: 1,
    dueOffset: -1,
    stateType: "started",
    stateName: "In Progress",
    stateColor: "#f9e2af",
    assignee: viewer,
    project: proj4!,
    cycle: engCycle!,
    updatedHoursAgo: 1,
  }),
  makeIssue({
    id: "i-002",
    team: eng!,
    identifier: "ENG-102",
    title: "Migrate auth service to new IAM provider",
    priority: 1,
    dueOffset: 2,
    stateType: "started",
    stateName: "In Progress",
    stateColor: "#f9e2af",
    assignee: viewer,
    project: proj1!,
    cycle: engCycle!,
    updatedHoursAgo: 4,
  }),
  makeIssue({
    id: "i-003",
    team: eng!,
    identifier: "ENG-103",
    title: "Rate-limit the public webhook endpoint",
    priority: 2,
    dueOffset: 3,
    stateType: "started",
    stateName: "In Progress",
    stateColor: "#f9e2af",
    assignee: otherUser,
    project: proj4!,
    cycle: engCycle!,
    updatedHoursAgo: 12,
  }),
  makeIssue({
    id: "i-004",
    team: eng!,
    identifier: "ENG-104",
    title: "Investigate flaky integration test on PR pipeline",
    priority: 3,
    dueOffset: 7,
    stateType: "unstarted",
    stateName: "Todo",
    stateColor: "#89b4fa",
    assignee: thirdUser,
    project: null,
    cycle: engCycle!,
    updatedHoursAgo: 28,
  }),
  makeIssue({
    id: "i-005",
    team: eng!,
    identifier: "ENG-105",
    title: "Document the new feature flag SDK",
    priority: 4,
    dueOffset: 14,
    stateType: "backlog",
    stateName: "Backlog",
    stateColor: "#6c7086",
    assignee: viewer,
    creator: otherUser,
    project: proj1!,
    cycle: null,
    updatedHoursAgo: 72,
  }),
  makeIssue({
    id: "i-006",
    team: eng!,
    identifier: "ENG-106",
    title: "Audit npm dependencies for CVEs",
    priority: 2,
    dueOffset: null,
    stateType: "backlog",
    stateName: "Backlog",
    stateColor: "#6c7086",
    assignee: null,
    project: proj4!,
    cycle: null,
    updatedHoursAgo: 96,
  }),
  makeIssue({
    id: "i-007",
    team: eng!,
    identifier: "ENG-107",
    title: "Switch logger to structured JSON output",
    priority: 3,
    dueOffset: null,
    stateType: "unstarted",
    stateName: "Todo",
    stateColor: "#89b4fa",
    assignee: viewer,
    project: proj4!,
    cycle: engCycle!,
    updatedHoursAgo: 16,
  }),
  makeIssue({
    id: "i-008",
    team: eng!,
    identifier: "ENG-108",
    title: "Replace deprecated stripe checkout API",
    priority: 2,
    dueOffset: 10,
    stateType: "started",
    stateName: "In Progress",
    stateColor: "#f9e2af",
    assignee: otherUser,
    project: proj1!,
    cycle: engCycle!,
    updatedHoursAgo: 6,
  }),
  makeIssue({
    id: "i-009",
    team: eng!,
    identifier: "ENG-109",
    title: "Add Prom metrics for the websocket gateway",
    priority: 0,
    dueOffset: null,
    stateType: "backlog",
    stateName: "Backlog",
    stateColor: "#6c7086",
    assignee: null,
    project: null,
    cycle: null,
    updatedHoursAgo: 200,
  }),

  // Design team
  makeIssue({
    id: "i-010",
    team: dsn!,
    identifier: "DSN-31",
    title: "Refine empty states across the dashboard suite",
    priority: 2,
    dueOffset: 1,
    stateType: "started",
    stateName: "In Progress",
    stateColor: "#cba6f7",
    assignee: thirdUser,
    creator: otherUser,
    project: proj2!,
    cycle: dsnCycle!,
    updatedHoursAgo: 3,
  }),
  makeIssue({
    id: "i-011",
    team: dsn!,
    identifier: "DSN-32",
    title: "Audit colour contrast against WCAG 2.2",
    priority: 2,
    dueOffset: 5,
    stateType: "unstarted",
    stateName: "Todo",
    stateColor: "#cba6f7",
    assignee: viewer,
    creator: thirdUser,
    project: proj2!,
    cycle: dsnCycle!,
    updatedHoursAgo: 22,
  }),
  makeIssue({
    id: "i-012",
    team: dsn!,
    identifier: "DSN-33",
    title: "New onboarding illustrations",
    priority: 3,
    dueOffset: 12,
    stateType: "unstarted",
    stateName: "Todo",
    stateColor: "#cba6f7",
    assignee: otherUser,
    project: proj3!,
    cycle: null,
    updatedHoursAgo: 40,
  }),
  makeIssue({
    id: "i-013",
    team: dsn!,
    identifier: "DSN-34",
    title: "Iconography pass for settings screens",
    priority: 4,
    dueOffset: null,
    stateType: "backlog",
    stateName: "Backlog",
    stateColor: "#6c7086",
    assignee: null,
    project: proj2!,
    cycle: null,
    updatedHoursAgo: 80,
  }),
  makeIssue({
    id: "i-014",
    team: dsn!,
    identifier: "DSN-35",
    title: "Update marketing site hero animation",
    priority: 3,
    dueOffset: 4,
    stateType: "started",
    stateName: "In Progress",
    stateColor: "#cba6f7",
    assignee: viewer,
    creator: otherUser,
    project: null,
    cycle: dsnCycle!,
    updatedHoursAgo: 10,
  }),
  makeIssue({
    id: "i-015",
    team: dsn!,
    identifier: "DSN-36",
    title: "Document the new typography scale",
    priority: 4,
    dueOffset: null,
    stateType: "backlog",
    stateName: "Backlog",
    stateColor: "#6c7086",
    assignee: thirdUser,
    project: proj2!,
    cycle: null,
    updatedHoursAgo: 150,
  }),

  // Ops team
  makeIssue({
    id: "i-016",
    team: ops!,
    identifier: "OPS-12",
    title: "Renew TLS certificates before expiry",
    priority: 1,
    dueOffset: 4,
    stateType: "unstarted",
    stateName: "Todo",
    stateColor: "#f9e2af",
    assignee: otherUser,
    project: null,
    cycle: null,
    updatedHoursAgo: 2,
  }),
  makeIssue({
    id: "i-017",
    team: ops!,
    identifier: "OPS-13",
    title: "Roll out incident response runbook v2",
    priority: 2,
    dueOffset: 9,
    stateType: "started",
    stateName: "In Progress",
    stateColor: "#f9e2af",
    assignee: viewer,
    project: proj4!,
    cycle: null,
    updatedHoursAgo: 18,
  }),
  makeIssue({
    id: "i-018",
    team: ops!,
    identifier: "OPS-14",
    title: "Rotate database credentials in production",
    priority: 1,
    dueOffset: 0,
    stateType: "unstarted",
    stateName: "Todo",
    stateColor: "#f9e2af",
    assignee: viewer,
    creator: thirdUser,
    project: null,
    cycle: null,
    updatedHoursAgo: 5,
  }),
  makeIssue({
    id: "i-019",
    team: ops!,
    identifier: "OPS-15",
    title: "Disk-space alerts firing on log nodes",
    priority: 2,
    dueOffset: 2,
    stateType: "started",
    stateName: "In Progress",
    stateColor: "#f9e2af",
    assignee: thirdUser,
    project: proj4!,
    cycle: null,
    updatedHoursAgo: 7,
  }),
  makeIssue({
    id: "i-020",
    team: ops!,
    identifier: "OPS-16",
    title: "Quarterly access review",
    priority: 3,
    dueOffset: 13,
    stateType: "unstarted",
    stateName: "Todo",
    stateColor: "#f9e2af",
    assignee: null,
    project: null,
    cycle: null,
    updatedHoursAgo: 50,
  }),
  makeIssue({
    id: "i-021",
    team: ops!,
    identifier: "OPS-17",
    title: "Document on-call rotation policy",
    priority: 4,
    dueOffset: null,
    stateType: "backlog",
    stateName: "Backlog",
    stateColor: "#6c7086",
    assignee: viewer,
    project: null,
    cycle: null,
    updatedHoursAgo: 120,
  }),

  // More engineering — coverage for "Backlog" view and unassigned items.
  makeIssue({
    id: "i-022",
    team: eng!,
    identifier: "ENG-110",
    title: "Spike: edge caching for /api/issues",
    priority: 3,
    dueOffset: null,
    stateType: "backlog",
    stateName: "Backlog",
    stateColor: "#6c7086",
    assignee: null,
    project: proj1!,
    cycle: null,
    updatedHoursAgo: 90,
  }),
  makeIssue({
    id: "i-023",
    team: eng!,
    identifier: "ENG-111",
    title: "Pluggable theming for the marketing site",
    priority: 4,
    dueOffset: null,
    stateType: "backlog",
    stateName: "Backlog",
    stateColor: "#6c7086",
    assignee: viewer,
    creator: thirdUser,
    project: proj3!,
    cycle: null,
    updatedHoursAgo: 130,
  }),
  makeIssue({
    id: "i-024",
    team: eng!,
    identifier: "ENG-112",
    title: "Hard-delete inactive accounts older than 18 months",
    priority: 2,
    dueOffset: null,
    stateType: "backlog",
    stateName: "Backlog",
    stateColor: "#6c7086",
    assignee: null,
    project: null,
    cycle: null,
    updatedHoursAgo: 220,
  }),
  makeIssue({
    id: "i-025",
    team: eng!,
    identifier: "ENG-113",
    title: "Migrate analytics pipeline to Cloudflare Pipelines",
    priority: 3,
    dueOffset: 11,
    stateType: "unstarted",
    stateName: "Todo",
    stateColor: "#89b4fa",
    assignee: viewer,
    project: proj1!,
    cycle: engCycle!,
    updatedHoursAgo: 14,
  }),
  makeIssue({
    id: "i-026",
    team: eng!,
    identifier: "ENG-114",
    title: "Tracing for the GraphQL gateway",
    priority: 3,
    dueOffset: 8,
    stateType: "started",
    stateName: "In Progress",
    stateColor: "#f9e2af",
    assignee: otherUser,
    project: proj4!,
    cycle: engCycle!,
    updatedHoursAgo: 9,
  }),
  makeIssue({
    id: "i-027",
    team: dsn!,
    identifier: "DSN-37",
    title: "Refresh the empty-state illustrations for the inbox",
    priority: 3,
    dueOffset: null,
    stateType: "unstarted",
    stateName: "Todo",
    stateColor: "#cba6f7",
    assignee: thirdUser,
    project: proj2!,
    cycle: null,
    updatedHoursAgo: 36,
  }),
  makeIssue({
    id: "i-028",
    team: ops!,
    identifier: "OPS-18",
    title: "Failover drill for the EU region",
    priority: 2,
    dueOffset: 6,
    stateType: "unstarted",
    stateName: "Todo",
    stateColor: "#f9e2af",
    assignee: viewer,
    project: proj4!,
    cycle: null,
    updatedHoursAgo: 20,
  }),
  makeIssue({
    id: "i-029",
    team: eng!,
    identifier: "ENG-115",
    title: "Refactor the issue list rendering loop",
    priority: 0,
    dueOffset: null,
    stateType: "backlog",
    stateName: "Backlog",
    stateColor: "#6c7086",
    assignee: null,
    project: null,
    cycle: null,
    updatedHoursAgo: 300,
  }),
  makeIssue({
    id: "i-030",
    team: eng!,
    identifier: "ENG-116",
    title: "Investigate flapping Slack notifications",
    priority: 2,
    dueOffset: 1,
    stateType: "started",
    stateName: "In Progress",
    stateColor: "#f9e2af",
    assignee: viewer,
    creator: otherUser,
    project: null,
    cycle: engCycle!,
    updatedHoursAgo: 4,
  }),
];

/**
 * Returns the full mock payload, with `fetchedAt` stamped at call time
 * so the dashboard's "updated Xs ago" indicator behaves realistically.
 */
export function getMockPayload(): DashboardPayload {
  return {
    source: "mock",
    fetchedAt: new Date().toISOString(),
    viewer,
    teams,
    projects,
    activeCycles,
    issues,
  };
}
