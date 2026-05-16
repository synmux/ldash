<!--
  RefreshIndicator — tiny widget showing the last refresh time and a
  spinner during in-flight polls. The text fades from "fresh" lime to
  muted overlay0 as it ages relative to the polling interval.
-->
<script setup lang="ts">
import { computed, onMounted, onScopeDispose, ref } from "vue";
import { useDashboardConfig } from "~/composables/useDashboardConfig";
import { relativeTime } from "~/utils/format";

const props = defineProps<{
  lastFetchedAt: Date | null;
  loading: boolean;
  isStale: boolean;
  source: "live" | "mock" | null;
}>();

const { pollIntervalMs } = useDashboardConfig();

// Tick a clock once a second so "updated 5s ago" updates without
// requiring a parent re-render.
const now = ref(Date.now());
let clock: ReturnType<typeof setInterval> | null = null;
onMounted(() => {
  if (!import.meta.client) return;
  clock = setInterval(() => {
    now.value = Date.now();
  }, 1000);
});
onScopeDispose(() => {
  if (clock) clearInterval(clock);
});

const ageMs = computed(() => {
  if (!props.lastFetchedAt) return 0;
  return now.value - props.lastFetchedAt.getTime();
});

const label = computed(() => {
  if (!props.lastFetchedAt) return "fetching…";
  return `Updated ${relativeTime(props.lastFetchedAt)}`;
});

const colourClass = computed(() => {
  if (props.isStale) return "text-ctp-red";
  // Within the first 25% of the interval feels "fresh" — show lime.
  if (ageMs.value < pollIntervalMs.value * 0.25) return "text-accent";
  if (ageMs.value < pollIntervalMs.value) return "text-ctp-subtext0";
  return "text-ctp-overlay1";
});
</script>

<template>
  <div class="flex items-center gap-2 text-xs" :class="colourClass">
    <span
      v-if="source"
      class="rounded-md px-1.5 py-0.5 font-mono uppercase tracking-wider ring-1 ring-inset"
      :class="
        source === 'live'
          ? 'bg-accent/10 text-accent ring-accent/40'
          : 'bg-ctp-surface0 text-ctp-subtext0 ring-ctp-overlay0/40'
      "
      >{{ source }}</span
    >

    <svg
      v-if="loading"
      class="h-3.5 w-3.5 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
      />
    </svg>

    <span>{{ label }}</span>
  </div>
</template>
