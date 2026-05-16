/**
 * Grouping helpers used by the "By Project" and "By Team" views.
 *
 * Each helper returns an array of `{ key, label, color, issues }` so
 * the consumer can render sections in a stable order (alphabetical by
 * label, with the "(none)" bucket pushed to the end).
 */

import type { DashboardIssue } from "#shared/types";
import { sortMostImportant } from "./sort";

export interface IssueGroup {
  /** Unique id for `:key` in v-for. */
  key: string;
  /** Display name of the group. */
  label: string;
  /** Hex colour for the group header chip. */
  color: string;
  /** Issues in the group, sorted by the most-important rule. */
  issues: DashboardIssue[];
}

const NONE_COLOR = "#6c7086";
const NONE_KEY = "__none__";

/**
 * Group issues by `project.id`. Issues without a project land in a
 * "(no project)" bucket that always sorts last.
 */
export function groupByProject(issues: DashboardIssue[]): IssueGroup[] {
  const map = new Map<string, IssueGroup>();
  for (const issue of issues) {
    const key = issue.project?.id ?? NONE_KEY;
    const label = issue.project?.name ?? "(no project)";
    const color = issue.project?.color ?? NONE_COLOR;
    const existing = map.get(key);
    if (existing) {
      existing.issues.push(issue);
    } else {
      map.set(key, { key, label, color, issues: [issue] });
    }
  }
  return finalize(map);
}

/** Group issues by `team.id`. Every issue has a team, so no fallback. */
export function groupByTeam(issues: DashboardIssue[]): IssueGroup[] {
  const map = new Map<string, IssueGroup>();
  for (const issue of issues) {
    const key = issue.team.id;
    const label = `${issue.team.key} · ${issue.team.name}`;
    const color = issue.team.color;
    const existing = map.get(key);
    if (existing) {
      existing.issues.push(issue);
    } else {
      map.set(key, { key, label, color, issues: [issue] });
    }
  }
  return finalize(map);
}

/**
 * Sort each group's issues by the most-important rule, then sort the
 * groups themselves alphabetically (with the (none) bucket last).
 */
function finalize(map: Map<string, IssueGroup>): IssueGroup[] {
  const groups = [...map.values()];
  for (const g of groups) {
    g.issues = sortMostImportant(g.issues);
  }
  groups.sort((a, b) => {
    if (a.key === NONE_KEY) return 1;
    if (b.key === NONE_KEY) return -1;
    return a.label.localeCompare(b.label);
  });
  return groups;
}
