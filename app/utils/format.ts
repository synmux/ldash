/**
 * Tiny formatting helpers used across the dashboard.
 * No dependency on a date library — Intl handles relative time well
 * enough for our needs.
 */

import type { Priority } from "#shared/types";

const RTF = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
const DATE_FMT = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
});

/**
 * Human-readable relative time, e.g. "in 2 days", "3 hours ago".
 * Accepts ISO strings or Date objects. Returns "" if the input is null.
 */
export function relativeTime(input: string | Date | null | undefined): string {
  if (!input) return "";
  const target = input instanceof Date ? input : new Date(input);
  const diffMs = target.getTime() - Date.now();

  const seconds = Math.round(diffMs / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (Math.abs(seconds) < 60) return RTF.format(seconds, "second");
  if (Math.abs(minutes) < 60) return RTF.format(minutes, "minute");
  if (Math.abs(hours) < 24) return RTF.format(hours, "hour");
  return RTF.format(days, "day");
}

/**
 * Compact label for a due date: "Today", "Tomorrow", "in 3 days",
 * "5 days ago", or the absolute date for anything further out than a
 * week. Empty string for null.
 */
export function dueLabel(dueDate: string | null): string {
  if (!dueDate) return "";
  const target = new Date(`${dueDate}T00:00:00Z`);
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const diffDays = Math.round(
    (target.getTime() - today.getTime()) / (24 * 60 * 60 * 1000)
  );
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays === -1) return "Yesterday";
  if (Math.abs(diffDays) <= 7) return RTF.format(diffDays, "day");
  return DATE_FMT.format(target);
}

/**
 * How urgent a due date is. Drives the colour of the due-date chip.
 *   overdue → date is in the past
 *   soon    → due in the next 3 days
 *   week    → due in the next 7 days
 *   later   → due within 14 days
 *   far     → further out
 *   none    → no due date
 */
export type DueUrgency = "overdue" | "soon" | "week" | "later" | "far" | "none";

export function dueUrgency(dueDate: string | null): DueUrgency {
  if (!dueDate) return "none";
  const target = new Date(`${dueDate}T00:00:00Z`);
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const diffDays = Math.round(
    (target.getTime() - today.getTime()) / (24 * 60 * 60 * 1000)
  );
  if (diffDays < 0) return "overdue";
  if (diffDays <= 3) return "soon";
  if (diffDays <= 7) return "week";
  if (diffDays <= 14) return "later";
  return "far";
}

/** Short label for a Linear priority value. */
export function priorityLabel(p: Priority): string {
  switch (p) {
    case 1:
      return "Urgent";
    case 2:
      return "High";
    case 3:
      return "Medium";
    case 4:
      return "Low";
    default:
      return "No priority";
  }
}

/** First letters of each word in a name, capped at 2 letters. */
export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}
