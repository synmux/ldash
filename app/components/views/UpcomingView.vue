<!--
  UpcomingView — issues with a due date inside the configurable horizon
  (default 14 days). Sorted by the "most important" rule.

  Issues with NO due date are excluded from this view; they appear in
  other views instead.
-->
<script setup lang="ts">
import { computed, inject, type Ref } from "vue";
import type { DashboardPayload } from "#shared/types";
import { sortMostImportant } from "~/utils/sort";
import { useDashboardConfig } from "~/composables/useDashboardConfig";
import IssueList from "../IssueList.vue";

const data = inject<Ref<DashboardPayload | null>>("dashboardData");
const { upcomingHorizonDays } = useDashboardConfig();

const issues = computed(() => {
  const all = data?.value?.issues ?? [];
  const now = new Date();
  now.setUTCHours(0, 0, 0, 0);
  const horizonMs = upcomingHorizonDays.value * 24 * 60 * 60 * 1000;
  const cutoff = now.getTime() + horizonMs;

  const upcoming = all.filter((i) => {
    if (!i.dueDate) return false;
    const t = Date.parse(`${i.dueDate}T00:00:00Z`);
    return !Number.isNaN(t) && t <= cutoff;
  });
  return sortMostImportant(upcoming);
});
</script>

<template>
  <IssueList :issues="issues" empty-label="Nothing due in the next horizon." />
</template>
