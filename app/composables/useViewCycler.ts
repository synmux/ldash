/**
 * useViewCycler — auto-rotates the active view on a configurable timer.
 *
 * Reads `viewRotationMs`, `autoCycle`, and `enabledViews` from
 * `useDashboardConfig`. Skips any view ids that aren't enabled.
 *
 * Public API:
 *   - currentIndex: Ref<number>       (index into `enabledViews`)
 *   - currentView:  ComputedRef<ViewId>
 *   - isPaused:     Ref<boolean>
 *   - pause(), resume(), next(), prev()
 *   - progress:     Ref<number>       (0..1, fraction of current dwell elapsed)
 *
 * The progress value is updated each animation frame so the indicator
 * bar can animate smoothly without coupling to the dwell interval.
 */

import { computed, onScopeDispose, ref, watch } from "vue";
import { VIEW_IDS, type ViewId } from "#shared/viewIds";
import { useDashboardConfig } from "./useDashboardConfig";

export function useViewCycler() {
  const { viewRotationMs, autoCycle, enabledViews } = useDashboardConfig();

  const currentIndex = ref(0);
  const isPaused = ref(false);
  const progress = ref(0);

  /**
   * The ordered list of currently-enabled views. We respect the
   * canonical order in `VIEW_IDS`, not the order in `enabledViews`
   * (which is a *set*, not a sequence). That way toggling views on
   * and off doesn't shuffle their rotation order.
   */
  const orderedEnabled = computed<ViewId[]>(() =>
    VIEW_IDS.filter((id) => enabledViews.value.includes(id))
  );

  const currentView = computed<ViewId>(() => {
    const list = orderedEnabled.value;
    if (list.length === 0) return VIEW_IDS[0];
    return list[currentIndex.value % list.length] ?? list[0]!;
  });

  // ── Timer / progress state ─────────────────────────────────────────
  // We track a "dwell" timestamp so pausing freezes progress where it
  // was, and resuming continues from the same point.
  let dwellStart = 0; // ms timestamp when the current dwell began
  let elapsedBeforePause = 0; // ms accumulated before the last pause
  let raf = 0; // requestAnimationFrame handle

  function tick(now: number): void {
    if (!isPaused.value && autoCycle.value) {
      const total = elapsedBeforePause + (now - dwellStart);
      const ratio = total / viewRotationMs.value;
      progress.value = Math.min(1, ratio);
      if (ratio >= 1) {
        next();
      }
    }
    raf = requestAnimationFrame(tick);
  }

  function startDwell(): void {
    dwellStart = performance.now();
    elapsedBeforePause = 0;
    progress.value = 0;
  }

  function next(): void {
    const list = orderedEnabled.value;
    if (list.length === 0) return;
    currentIndex.value = (currentIndex.value + 1) % list.length;
    startDwell();
  }

  function prev(): void {
    const list = orderedEnabled.value;
    if (list.length === 0) return;
    currentIndex.value =
      (currentIndex.value - 1 + list.length) % list.length;
    startDwell();
  }

  /** Jump to a specific view by id. No-op if the view isn't enabled. */
  function goTo(view: ViewId): void {
    const idx = orderedEnabled.value.indexOf(view);
    if (idx < 0) return;
    currentIndex.value = idx;
    startDwell();
  }

  function pause(): void {
    if (isPaused.value) return;
    elapsedBeforePause += performance.now() - dwellStart;
    isPaused.value = true;
  }

  function resume(): void {
    if (!isPaused.value) return;
    dwellStart = performance.now();
    isPaused.value = false;
  }

  // Only spin the RAF loop on the client.
  if (import.meta.client) {
    startDwell();
    raf = requestAnimationFrame(tick);
  }

  // If the enabled list shrinks, clamp the current index.
  watch(orderedEnabled, (list) => {
    if (list.length === 0) return;
    if (currentIndex.value >= list.length) {
      currentIndex.value = 0;
      startDwell();
    }
  });

  // Reset the dwell window when the rotation interval changes so the
  // progress bar doesn't appear to skip or stall.
  watch(viewRotationMs, () => startDwell());

  // If the user flips autoCycle on, refresh the dwell so the first
  // view gets a full rotation window.
  watch(autoCycle, (v) => {
    if (v) startDwell();
  });

  onScopeDispose(() => {
    if (raf) cancelAnimationFrame(raf);
  });

  return {
    currentIndex,
    currentView,
    isPaused,
    progress,
    pause,
    resume,
    next,
    prev,
    goTo,
    orderedEnabled,
  };
}
