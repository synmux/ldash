/**
 * useDashboardConfig — the user-controlled tuning surface.
 *
 * Wraps the constants in `app/config.ts` with reactive refs and a
 * write-back layer that persists changes to `localStorage`. Returned
 * refs are shared across all components via Nuxt's per-instance state
 * (`useState`) so flipping a setting in the panel re-renders everything
 * that depends on it.
 *
 * SSR-safe: localStorage is only touched on the client (`import.meta.client`
 * guard inside `onMounted`). The first server-side render uses the
 * defaults from `app/config.ts`.
 *
 * Public API:
 *   - pollIntervalMs:      Ref<number>
 *   - viewRotationMs:      Ref<number>
 *   - autoCycle:           Ref<boolean>
 *   - enabledViews:        Ref<ViewId[]>
 *   - mostImportantCount:  Ref<number>
 *   - upcomingHorizonDays: Ref<number>
 *   - reset():             void   — restore defaults
 */

import { onMounted, watch } from "vue";
import { DEFAULTS, type DashboardConfig } from "~/config";
import { VIEW_IDS, type ViewId } from "#shared/viewIds";

/** Coerce any unknown blob into a `DashboardConfig`, falling back to defaults. */
function parseStored(raw: unknown): DashboardConfig {
  const safe = (raw && typeof raw === "object" ? raw : {}) as Partial<DashboardConfig>;
  const enabled = Array.isArray(safe.enabledViews)
    ? safe.enabledViews.filter((v): v is ViewId =>
        (VIEW_IDS as readonly string[]).includes(v as string)
      )
    : [...DEFAULTS.enabledViews];

  return {
    pollIntervalMs: clampNum(safe.pollIntervalMs, DEFAULTS.pollIntervalMs, 30_000, 60 * 60_000),
    viewRotationMs: clampNum(safe.viewRotationMs, DEFAULTS.viewRotationMs, 3_000, 10 * 60_000),
    autoCycle: typeof safe.autoCycle === "boolean" ? safe.autoCycle : DEFAULTS.autoCycle,
    enabledViews: enabled.length > 0 ? enabled : [...DEFAULTS.enabledViews],
    mostImportantCount: clampNum(safe.mostImportantCount, DEFAULTS.mostImportantCount, 1, 20),
    upcomingHorizonDays: clampNum(safe.upcomingHorizonDays, DEFAULTS.upcomingHorizonDays, 1, 90),
  };
}

function clampNum(value: unknown, fallback: number, min: number, max: number): number {
  const n = typeof value === "number" && Number.isFinite(value) ? value : fallback;
  return Math.min(max, Math.max(min, n));
}

export function useDashboardConfig() {
  // Per-app singletons via `useState` — each consumer gets the same refs.
  const pollIntervalMs = useState<number>("ldash:pollIntervalMs", () => DEFAULTS.pollIntervalMs);
  const viewRotationMs = useState<number>("ldash:viewRotationMs", () => DEFAULTS.viewRotationMs);
  const autoCycle = useState<boolean>("ldash:autoCycle", () => DEFAULTS.autoCycle);
  const enabledViews = useState<ViewId[]>("ldash:enabledViews", () => [
    ...DEFAULTS.enabledViews,
  ]);
  const mostImportantCount = useState<number>(
    "ldash:mostImportantCount",
    () => DEFAULTS.mostImportantCount
  );
  const upcomingHorizonDays = useState<number>(
    "ldash:upcomingHorizonDays",
    () => DEFAULTS.upcomingHorizonDays
  );

  // Hydration + persistence must run exactly once per app lifecycle,
  // even though this composable can be called from multiple components
  // (each with its own `onMounted` hook). We track the one-shot flag
  // with `useState` so the value is shared across every caller. The
  // first mounted consumer wins; later consumers no-op.
  const hydrated = useState<boolean>("ldash:configHydrated", () => false);

  onMounted(() => {
    if (!import.meta.client) return;
    if (hydrated.value) return;
    hydrated.value = true;

    try {
      const raw = window.localStorage.getItem(DEFAULTS.storageKey);
      if (raw) {
        const parsed = parseStored(JSON.parse(raw));
        pollIntervalMs.value = parsed.pollIntervalMs;
        viewRotationMs.value = parsed.viewRotationMs;
        autoCycle.value = parsed.autoCycle;
        enabledViews.value = parsed.enabledViews;
        mostImportantCount.value = parsed.mostImportantCount;
        upcomingHorizonDays.value = parsed.upcomingHorizonDays;
      }
    } catch {
      // Corrupt JSON in localStorage — silently fall back to defaults.
    }

    // Persist whenever any setting changes. Deep watch covers the array.
    // This watcher is attached to the *first* caller's scope; because
    // `hydrated` is a per-app flag, subsequent callers skip this block,
    // ensuring only one writer at a time.
    watch(
      [
        pollIntervalMs,
        viewRotationMs,
        autoCycle,
        enabledViews,
        mostImportantCount,
        upcomingHorizonDays,
      ],
      () => {
        try {
          const snapshot: DashboardConfig = {
            pollIntervalMs: pollIntervalMs.value,
            viewRotationMs: viewRotationMs.value,
            autoCycle: autoCycle.value,
            enabledViews: [...enabledViews.value],
            mostImportantCount: mostImportantCount.value,
            upcomingHorizonDays: upcomingHorizonDays.value,
          };
          window.localStorage.setItem(DEFAULTS.storageKey, JSON.stringify(snapshot));
        } catch {
          // localStorage might be full or disabled — non-fatal.
        }
      },
      { deep: true }
    );
  });

  function reset(): void {
    pollIntervalMs.value = DEFAULTS.pollIntervalMs;
    viewRotationMs.value = DEFAULTS.viewRotationMs;
    autoCycle.value = DEFAULTS.autoCycle;
    enabledViews.value = [...DEFAULTS.enabledViews];
    mostImportantCount.value = DEFAULTS.mostImportantCount;
    upcomingHorizonDays.value = DEFAULTS.upcomingHorizonDays;
  }

  return {
    pollIntervalMs,
    viewRotationMs,
    autoCycle,
    enabledViews,
    mostImportantCount,
    upcomingHorizonDays,
    reset,
  };
}
