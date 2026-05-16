<!--
  / — the dashboard page.

  Composes:
    - useDashboardData (polling fetch)
    - useViewCycler    (rotation timer)
    - useDashboardConfig (transitively, through the two above)

  Provides reactive refs to descendants via `provide()` keys that the
  view components consume with `inject()`. The keys are colocated here
  for grep-ability.

  Layout is a single vertical column tuned for a portrait monitor:
    [ Header              ]
    [ Most Important strip ]
    [ View indicator + bar ]
    [ Rotating view area   ]
    [ Footer (build info)  ]
-->
<script setup lang="ts">
import { provide, ref, computed } from "vue";
import { useDashboardData } from "~/composables/useDashboardData";
import { useViewCycler } from "~/composables/useViewCycler";
import DashboardHeader from "~/components/DashboardHeader.vue";
import MostImportantStrip from "~/components/MostImportantStrip.vue";
import ViewIndicator from "~/components/ViewIndicator.vue";
import RotatingViewArea from "~/components/RotatingViewArea.vue";
import SettingsPanel from "~/components/SettingsPanel.vue";

const { data, loading, error, lastFetchedAt, isStale, refresh } = useDashboardData();
const {
  currentView,
  orderedEnabled,
  progress,
  isPaused,
  pause,
  resume,
  goTo,
} = useViewCycler();

// Expose state to descendants. Components inject these by key.
provide("dashboardData", data);
provide("dashboardLoading", loading);
provide("dashboardError", error);
provide("dashboardLastFetchedAt", lastFetchedAt);
provide("dashboardIsStale", isStale);

const settingsOpen = ref(false);

const hasError = computed(() => Boolean(error.value));
</script>

<template>
  <div class="min-h-dvh">
    <DashboardHeader
      @open-settings="settingsOpen = true"
      @refresh="refresh"
    />

    <!--
      The main column is narrowed and centred so the dashboard reads
      cleanly on both portrait monitors and ordinary windows. On a
      1080×1920 display, this fills most of the width with comfortable
      gutters.
    -->
    <main class="mx-auto flex max-w-2xl flex-col gap-5 px-4 py-5">
      <!-- Soft error banner — appears in addition to whatever stale
           data is already on screen. -->
      <div
        v-if="hasError"
        class="rounded-xl bg-ctp-red/10 px-4 py-3 text-sm text-ctp-red ring-1 ring-ctp-red/30"
      >
        Couldn't reach Linear:
        <span class="font-mono">{{ error?.message }}</span>
        — showing the last successful snapshot.
      </div>

      <MostImportantStrip />

      <div
        class="flex flex-col gap-3 rounded-2xl bg-ctp-mantle/40 p-4 ring-1 ring-ctp-surface0"
      >
        <ViewIndicator
          :views="orderedEnabled"
          :current-view="currentView"
          :progress="progress"
          :is-paused="isPaused"
          @select="goTo"
        />
      </div>

      <RotatingViewArea
        :view="currentView"
        @pause="pause"
        @resume="resume"
      />

      <footer class="pt-2 text-center text-xs text-ctp-overlay1">
        <span>ldash · Catppuccin Mocha · </span>
        <a
          href="https://linear.app"
          target="_blank"
          rel="noopener"
          class="text-accent hover:underline"
        >
          Linear
        </a>
      </footer>
    </main>

    <SettingsPanel :open="settingsOpen" @close="settingsOpen = false" />
  </div>
</template>
