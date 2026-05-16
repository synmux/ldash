/**
 * Sorting helpers for the dashboard.
 *
 * The headline rule — "Most Important" — sorts by:
 *   1. Due date ascending, with `null` due dates last (most urgent
 *      deadlines first).
 *   2. Priority ascending after remapping `0` (No priority) to a value
 *      that sorts last — Linear encodes 1 = Urgent, 2 = High, 3 = Medium,
 *      4 = Low, 0 = No priority, so we treat `0` as `5` to push it to
 *      the bottom while keeping 1 (Urgent) on top.
 *   3. `updatedAt` descending, as a stable tie-breaker.
 *
 * The function is pure and immutable: it returns a new array.
 */

import type { DashboardIssue, Priority } from "#shared/types";

/**
 * Remap Linear's priority encoding so "No priority" (0) sorts last and
 * "Urgent" (1) sorts first. Everything else keeps its natural order.
 */
function priorityRank(p: Priority): number {
  return p === 0 ? 5 : p;
}

/** Numeric due-date key for sorting; null becomes +Infinity (last). */
function dueKey(d: string | null): number {
  if (!d) return Number.POSITIVE_INFINITY;
  // `YYYY-MM-DD` parses correctly via Date.parse on every modern runtime.
  const t = Date.parse(d);
  return Number.isNaN(t) ? Number.POSITIVE_INFINITY : t;
}

/** Numeric updatedAt key for sorting; falsy becomes 0 (oldest). */
function updatedKey(s: string): number {
  const t = Date.parse(s);
  return Number.isNaN(t) ? 0 : t;
}

/**
 * Returns a NEW array sorted by the most-important rule.
 * Original input is not mutated.
 */
export function sortMostImportant(issues: DashboardIssue[]): DashboardIssue[] {
  return [...issues].sort((a, b) => {
    // 1. Due date ascending, null last.
    const da = dueKey(a.dueDate);
    const db = dueKey(b.dueDate);
    if (da !== db) return da - db;

    // 2. Priority ascending (1 first, 0 last).
    const pa = priorityRank(a.priority);
    const pb = priorityRank(b.priority);
    if (pa !== pb) return pa - pb;

    // 3. Updated-at descending (newer first).
    return updatedKey(b.updatedAt) - updatedKey(a.updatedAt);
  });
}
