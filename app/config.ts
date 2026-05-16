/**
 * Central tuning surface for the dashboard.
 *
 * This file is the *first* place to look (and edit) when you want to
 * change a default. The runtime settings panel layers user overrides on
 * top of these values via `useDashboardConfig`, persisting choices in
 * `localStorage[DEFAULTS.storageKey]`.
 *
 * To rebrand the accent colour, edit `LIME_ACCENT` here AND mirror the
 * same hex into `--color-accent` inside `app/assets/css/main.css`. The
 * mirror is a one-line edit and is intentionally explicit so a contributor
 * grepping for the colour value finds both call sites.
 */

import { VIEW_IDS, type ViewId } from "#shared/viewIds";

/**
 * Lime green accent used everywhere the design calls for emphasis.
 * The Catppuccin Mocha `green` (#a6e3a1) is soft and minty; the user
 * specifically asked for *lime*, so we override with a more saturated
 * yellow-green. Tweak to taste — anything in the lime-300 / lime-400
 * range works well over the dark Mocha base.
 */
export const LIME_ACCENT = "#cdff5a";

/**
 * Bundle of defaults consumed by `useDashboardConfig`.
 *
 * Every field here MUST also be wired into the settings panel UI; if you
 * add a knob, expose it there too so users can tune it at runtime
 * without editing source.
 */
export const DEFAULTS = {
  /**
   * How often the dashboard refetches `/api/issues`, in milliseconds.
   * Default: 10 minutes. Linear's rate limits are generous enough that
   * this could be cranked lower, but 10 minutes is plenty for a wall
   * display and keeps us a long way from any quota.
   */
  pollIntervalMs: 10 * 60 * 1000,

  /**
   * How long each view stays on screen before the cycler advances, in
   * milliseconds. Default: 30 seconds.
   */
  viewRotationMs: 30 * 1000,

  /**
   * Number of issues to display in the persistent "Most Important" strip
   * at the top of the dashboard. Anywhere from 3 to ~12 looks good on a
   * vertical monitor.
   */
  mostImportantCount: 8,

  /**
   * Whether the dashboard auto-rotates between views by default.
   * Users can pause/resume from the settings panel or by hovering the
   * rotating area.
   */
  autoCycle: true,

  /**
   * Which views participate in the rotation by default.
   * Order in this array does NOT determine rotation order — `VIEW_IDS`
   * does. This array only flags which views are *enabled*.
   */
  enabledViews: [...VIEW_IDS] as ViewId[],

  /**
   * Horizon for the "Upcoming" view, in days. Anything with a due date
   * within this many days from "now" qualifies. Issues with no due date
   * are excluded from this view (they appear in other views instead).
   */
  upcomingHorizonDays: 14,

  /**
   * localStorage key. Bumping the version suffix invalidates all stored
   * preferences if you ever ship a breaking change to the config shape.
   */
  storageKey: "ldash:config:v1",
} as const;

export type DashboardConfig = {
  pollIntervalMs: number;
  viewRotationMs: number;
  mostImportantCount: number;
  autoCycle: boolean;
  enabledViews: ViewId[];
  upcomingHorizonDays: number;
};
