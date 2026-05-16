<!--
  MostImportantStrip — persistent panel at the top of the dashboard.

  Always visible above the rotating view area. Displays the top N
  issues (configurable in settings) sorted by the "most important"
  rule from `app/utils/sort.ts`.
-->
<script setup lang="ts">
import { computed, inject, type Ref } from "vue";
import type { DashboardPayload } from "#shared/types";
import { sortMostImportant } from "~/utils/sort";
import { useDashboardConfig } from "~/composables/useDashboardConfig";
import IssueCard from "./IssueCard.vue";

const data = inject<Ref<DashboardPayload | null>>("dashboardData");
const { mostImportantCount } = useDashboardConfig();

const items = computed(() => {
  const all = data?.value?.issues ?? [];
  return sortMostImportant(all).slice(0, mostImportantCount.value);
});
</script>

<template>
  <section
    class="rounded-2xl bg-ctp-crust/80 p-5 ring-1 ring-ctp-surface0 backdrop-blur"
    aria-labelledby="mi-heading"
  >
    <header class="mb-4 flex items-baseline justify-between">
      <h2
        id="mi-heading"
        class="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-accent"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          class="h-4 w-4"
          aria-hidden="true"
        >
          <path
            d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.83-4.401z"
          />
        </svg>
        Most Important
      </h2>
      <span class="text-xs text-ctp-overlay1">
        Top {{ items.length }} · due then priority
      </span>
    </header>

    <ul v-if="items.length > 0" class="flex flex-col gap-3">
      <li v-for="issue in items" :key="issue.id">
        <IssueCard :issue="issue" />
      </li>
    </ul>
    <div v-else class="py-6 text-center text-ctp-overlay1">
      Nothing to show — once issues load they'll appear here.
    </div>
  </section>
</template>
