/**
 * useDashboardData — the polling Linear fetcher.
 *
 * Hits `/api/issues`, then re-hits it on a setInterval whose period is
 * `pollIntervalMs` from `useDashboardConfig`. Re-creates the timer when
 * the interval setting changes. Cleans up automatically when the
 * consuming component is unmounted.
 *
 * Public API:
 *   - data:           Ref<DashboardPayload | null>
 *   - loading:        Ref<boolean>
 *   - error:          Ref<Error | null>
 *   - lastFetchedAt:  Ref<Date | null>
 *   - isStale:        ComputedRef<boolean>  (≥ 1.5× poll interval since last fetch)
 *   - refresh():      Promise<void>
 *
 * The first fetch is client-side (`server: false`) — we don't waste
 * the SSR window on data that's about to be polled anyway, and it
 * keeps the worker cold-start latency low.
 */

import { computed, onScopeDispose, ref, watch } from "vue";
import type { DashboardPayload } from "#shared/types";
import { useDashboardConfig } from "./useDashboardConfig";

export function useDashboardData() {
  const { pollIntervalMs } = useDashboardConfig();

  const data = ref<DashboardPayload | null>(null);
  const loading = ref(false);
  const error = ref<Error | null>(null);
  const lastFetchedAt = ref<Date | null>(null);

  let timer: ReturnType<typeof setInterval> | null = null;

  /** Single round-trip fetch. Always sets `loading` even on failure. */
  async function refresh(): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      const payload = await $fetch<DashboardPayload>("/api/issues");
      data.value = payload;
      lastFetchedAt.value = new Date();
    } catch (e) {
      error.value = e instanceof Error ? e : new Error(String(e));
    } finally {
      loading.value = false;
    }
  }

  /** (Re)create the polling timer using the current interval. */
  function rearmTimer(): void {
    if (timer) clearInterval(timer);
    timer = setInterval(refresh, pollIntervalMs.value);
  }

  // Kick off on the client (avoids running on server render).
  if (import.meta.client) {
    void refresh();
    rearmTimer();
    // Reset the timer whenever the user changes the polling interval.
    watch(pollIntervalMs, rearmTimer);
  }

  onScopeDispose(() => {
    if (timer) clearInterval(timer);
  });

  const isStale = computed<boolean>(() => {
    if (!lastFetchedAt.value) return false;
    return (
      Date.now() - lastFetchedAt.value.getTime() >
      pollIntervalMs.value * 1.5
    );
  });

  return {
    data,
    loading,
    error,
    lastFetchedAt,
    isStale,
    refresh,
  };
}
