/**
 * Reshapes a Linear SDK `Issue` into the flat `DashboardIssue` wire format.
 *
 * The Linear SDK returns relations (state, assignee, project, etc.) as
 * lazy `LinearFetch<T>` promises. We resolve all of them in parallel and
 * project only the fields the dashboard renders, so the client never
 * has to think about Linear's object graph.
 */

import type { Issue } from "@linear/sdk";
import type {
  DashboardCycle,
  DashboardIssue,
  DashboardProject,
  DashboardState,
  DashboardTeam,
  DashboardUser,
  Priority,
  WorkflowStateType,
} from "#shared/types";

/**
 * Linear's workflow state `type` is a string, but it's effectively an
 * enum. We map it into our narrower union and fall back to "unstarted"
 * if we see anything unexpected (forward-compatibility).
 */
const STATE_TYPES: ReadonlyArray<WorkflowStateType> = [
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

/** Clamp a Linear priority value into our 0..4 union. */
function coercePriority(raw: number | null | undefined): Priority {
  const p = Math.max(0, Math.min(4, Math.round(raw ?? 0)));
  return p as Priority;
}

export async function shapeIssue(issue: Issue): Promise<DashboardIssue> {
  // Resolve every lazy relation in parallel. Any of these can be null
  // depending on whether the issue has an assignee / project / cycle.
  const [state, assignee, creator, project, team, cycle] = await Promise.all([
    issue.state,
    issue.assignee,
    issue.creator,
    issue.project,
    issue.team,
    issue.cycle,
  ]);

  // `team` is required on every Linear issue. If somehow missing, fall
  // back to a sentinel; the UI will render a faint "(no team)" chip.
  const teamShaped: DashboardTeam = team
    ? {
        id: team.id,
        key: team.key,
        name: team.name,
        color: team.color ?? "#6c7086",
      }
    : { id: "no-team", key: "?", name: "(no team)", color: "#6c7086" };

  const stateShaped: DashboardState = state
    ? {
        id: state.id,
        name: state.name,
        type: coerceStateType(state.type),
        color: state.color ?? "#6c7086",
      }
    : {
        id: "unknown",
        name: "Unknown",
        type: "unstarted",
        color: "#6c7086",
      };

  const userOf = (u: typeof assignee): DashboardUser | null =>
    u
      ? {
          id: u.id,
          name: u.name,
          email: u.email,
          avatarUrl: u.avatarUrl ?? null,
        }
      : null;

  // Linear sometimes returns issues without a creator (e.g. system-
  // created); in that case fall back to a placeholder so the type
  // contract holds.
  const creatorShaped: DashboardUser =
    userOf(creator) ?? {
      id: "system",
      name: "System",
      avatarUrl: null,
    };

  const projectShaped: DashboardProject | null = project
    ? {
        id: project.id,
        name: project.name,
        color: project.color ?? "#6c7086",
      }
    : null;

  const cycleShaped: DashboardCycle | null = cycle
    ? {
        id: cycle.id,
        number: cycle.number,
        name: cycle.name ?? undefined,
        startsAt: cycle.startsAt.toISOString(),
        endsAt: cycle.endsAt.toISOString(),
        teamId: teamShaped.id,
      }
    : null;

  return {
    id: issue.id,
    identifier: issue.identifier,
    title: issue.title,
    url: issue.url,
    priority: coercePriority(issue.priority),
    // Linear returns `dueDate` as a `Date | null` already in `YYYY-MM-DD`
    // form for date-only fields. Stringify if it's still a Date.
    dueDate:
      issue.dueDate === null || issue.dueDate === undefined
        ? null
        : typeof issue.dueDate === "string"
          ? issue.dueDate
          : new Date(issue.dueDate).toISOString().slice(0, 10),
    updatedAt: issue.updatedAt.toISOString(),
    state: stateShaped,
    assignee: userOf(assignee),
    creator: creatorShaped,
    project: projectShaped,
    team: teamShaped,
    cycle: cycleShaped,
  };
}
