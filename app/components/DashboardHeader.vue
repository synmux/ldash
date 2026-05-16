<!--
  DashboardHeader — top bar.

  Left:  app title + viewer name (from the payload).
  Right: a live wall-clock, the RefreshIndicator, and a Settings cog.
-->
<script setup lang="ts">
import { computed, inject, onMounted, onScopeDispose, ref, type Ref } from "vue";
import type { DashboardPayload } from "#shared/types";
import RefreshIndicator from "./RefreshIndicator.vue";

const emit = defineEmits<{ (e: "open-settings"): void; (e: "refresh"): void }>();

const data = inject<Ref<DashboardPayload | null>>("dashboardData");
const loading = inject<Ref<boolean>>("dashboardLoading");
const isStale = inject<Ref<boolean>>("dashboardIsStale");
const lastFetchedAt = inject<Ref<Date | null>>("dashboardLastFetchedAt");

const viewerName = computed(() => data?.value?.viewer.name ?? "");
const source = computed(() => data?.value?.source ?? null);

// Wall clock for the kiosk display.
const now = ref(new Date());
let clock: ReturnType<typeof setInterval> | null = null;
onMounted(() => {
  if (!import.meta.client) return;
  clock = setInterval(() => {
    now.value = new Date();
  }, 1000);
});
onScopeDispose(() => {
  if (clock) clearInterval(clock);
});

const time = computed(() =>
  now.value.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
);
const date = computed(() =>
  now.value.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  })
);
</script>

<template>
  <header
    class="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-ctp-surface0 bg-ctp-base/95 px-6 py-4 backdrop-blur"
  >
    <div class="flex items-baseline gap-3">
      <h1 class="text-2xl font-bold tracking-tight">
        <span class="text-accent">ldash</span>
        <span class="text-ctp-subtext0">·</span>
        <span class="text-ctp-text">Linear</span>
      </h1>
      <p v-if="viewerName" class="text-sm text-ctp-overlay2">{{ viewerName }}</p>
    </div>

    <div class="flex items-center gap-4">
      <div class="text-right leading-tight">
        <div class="font-mono text-lg text-ctp-text">{{ time }}</div>
        <div class="text-xs uppercase tracking-wider text-ctp-overlay1">
          {{ date }}
        </div>
      </div>

      <RefreshIndicator
        :last-fetched-at="lastFetchedAt?.value ?? null"
        :loading="loading?.value ?? false"
        :is-stale="isStale?.value ?? false"
        :source="source"
      />

      <button
        type="button"
        class="rounded-md p-1.5 text-ctp-subtext0 ring-1 ring-ctp-surface0 transition hover:bg-ctp-surface0 hover:text-accent"
        title="Refresh now"
        aria-label="Refresh now"
        @click="emit('refresh')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          class="h-4 w-4"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M15.312 11.424a5.5 5.5 0 0 1-9.339 2.366l-.94.94a.75.75 0 0 1-1.28-.53V11.5a.75.75 0 0 1 .75-.75h2.7a.75.75 0 0 1 .53 1.28l-.835.835a4 4 0 0 0 6.81-1.5.75.75 0 0 1 1.6.06zM4.688 8.576a5.5 5.5 0 0 1 9.339-2.366l.94-.94a.75.75 0 0 1 1.28.53V8.5a.75.75 0 0 1-.75.75h-2.7a.75.75 0 0 1-.53-1.28l.835-.835a4 4 0 0 0-6.81 1.5.75.75 0 0 1-1.6-.06z"
            clip-rule="evenodd"
          />
        </svg>
      </button>

      <button
        type="button"
        class="rounded-md p-1.5 text-ctp-subtext0 ring-1 ring-ctp-surface0 transition hover:bg-ctp-surface0 hover:text-accent"
        title="Settings"
        aria-label="Settings"
        @click="emit('open-settings')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          class="h-4 w-4"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M7.84 1.804A1 1 0 0 1 8.82 1h2.36a1 1 0 0 1 .98.804l.331 1.652a6.993 6.993 0 0 1 1.929 1.115l1.598-.54a1 1 0 0 1 1.186.447l1.18 2.044a1 1 0 0 1-.205 1.251l-1.267 1.113a7.047 7.047 0 0 1 0 2.228l1.267 1.113a1 1 0 0 1 .205 1.251l-1.18 2.044a1 1 0 0 1-1.186.447l-1.598-.54a6.993 6.993 0 0 1-1.929 1.115l-.33 1.652a1 1 0 0 1-.98.804H8.82a1 1 0 0 1-.98-.804l-.331-1.652a6.993 6.993 0 0 1-1.929-1.115l-1.598.54a1 1 0 0 1-1.186-.447l-1.18-2.044a1 1 0 0 1 .205-1.251l1.267-1.114a7.05 7.05 0 0 1 0-2.227L1.821 7.773a1 1 0 0 1-.205-1.251l1.18-2.044a1 1 0 0 1 1.186-.447l1.598.54A6.993 6.993 0 0 1 7.51 3.456l.33-1.652zM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
  </header>
</template>
