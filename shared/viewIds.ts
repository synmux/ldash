/**
 * Canonical list of dashboard views and their display labels.
 *
 * Adding a new view is a four-step process:
 *   1. Add an id here (and to VIEW_LABELS / VIEW_DESCRIPTIONS).
 *   2. Create `app/components/views/<NewView>.vue`.
 *   3. Register it in the `viewMap` inside
 *      `app/components/RotatingViewArea.vue`.
 *   4. Add it to `DEFAULTS.enabledViews` in `app/config.ts` if it should
 *      ship enabled by default.
 *
 * The order in VIEW_IDS is the canonical rotation order; the cycler
 * iterates this list in sequence (filtering to whatever the user has
 * enabled).
 */

export const VIEW_IDS = [
  "byProject",
  "byTeam",
  "byCycle",
  "upcoming",
  "myIssues",
  "assignedToMe",
  "inProgress",
  "backlog",
] as const;

export type ViewId = (typeof VIEW_IDS)[number];

/** Short label rendered in the view indicator and settings panel. */
export const VIEW_LABELS: Record<ViewId, string> = {
  byProject: "By Project",
  byTeam: "By Team",
  byCycle: "Current Cycle",
  upcoming: "Upcoming",
  myIssues: "My Issues",
  assignedToMe: "Assigned to Me",
  inProgress: "In Progress",
  backlog: "Backlog",
};

/** One-sentence description used in tooltips / settings help text. */
export const VIEW_DESCRIPTIONS: Record<ViewId, string> = {
  byProject: "Open issues grouped by project.",
  byTeam: "Open issues grouped by team.",
  byCycle: "Issues in the active cycle for each team.",
  upcoming: "Issues due within the upcoming horizon.",
  myIssues: "Issues you created.",
  assignedToMe: "Issues assigned to you.",
  inProgress: "Issues currently in a 'Started' workflow state.",
  backlog: "Issues sitting in 'Backlog' workflow states.",
};
