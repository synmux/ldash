<!--
  ViewIndicator — list of pill buttons showing every enabled view.
  The active view is filled with the lime accent. Below the pills, a
  thin progress bar tracks the rotation timer.

  Clicking a pill jumps to that view (and the cycler restarts the
  dwell window).
-->
<script setup lang="ts">
import { computed } from "vue";
import { VIEW_LABELS, type ViewId } from "#shared/viewIds";

const props = defineProps<{
  views: ViewId[];
  currentView: ViewId;
  progress: number;
  isPaused: boolean;
}>();

const emit = defineEmits<{ (e: "select", view: ViewId): void }>();

const progressWidth = computed(
  () => `${Math.max(0, Math.min(100, props.progress * 100))}%`
);
</script>

<template>
  <div class="space-y-2">
    <div class="flex flex-wrap items-center gap-1.5">
      <button
        v-for="view in views"
        :key="view"
        type="button"
        :class="
          view === currentView
            ? 'bg-accent text-ctp-crust ring-accent'
            : 'bg-ctp-surface0 text-ctp-subtext0 ring-ctp-surface1 hover:bg-ctp-surface1 hover:text-ctp-text'
        "
        class="rounded-full px-3 py-1 text-xs font-medium ring-1 transition"
        @click="emit('select', view)"
      >
        {{ VIEW_LABELS[view] }}
      </button>
      <span
        v-if="isPaused"
        class="ml-2 inline-flex items-center gap-1 rounded-full bg-ctp-surface0 px-2 py-0.5 text-[10px] uppercase tracking-wider text-ctp-overlay2"
      >
        Paused
      </span>
    </div>

    <div class="h-0.5 w-full overflow-hidden rounded-full bg-ctp-surface0">
      <div
        class="h-full rounded-full bg-accent transition-[width] duration-100 ease-linear"
        :style="{ width: progressWidth }"
      />
    </div>
  </div>
</template>
