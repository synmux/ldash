<!--
  ByCycleView — issues belonging to the active cycle for each team.

  We filter to issues whose `cycle.id` is in the payload's
  `activeCycles` list, then group by team so the consumer can see each
  team's current sprint at a glance.
-->
<script setup lang="ts">
import { computed, inject, type Ref } from "vue";
import type { DashboardPayload } from "#shared/types";
import { groupByTeam } from "~/utils/groupBy";
import GroupedIssueList from "../GroupedIssueList.vue";

const data = inject<Ref<DashboardPayload | null>>("dashboardData");

const groups = computed(() => {
  const payload = data?.value;
  if (!payload) return [];
  const activeCycleIds = new Set(payload.activeCycles.map((c) => c.id));
  const inCycle = payload.issues.filter(
    (i) => i.cycle && activeCycleIds.has(i.cycle.id)
  );
  return groupByTeam(inCycle);
});
</script>

<template>
  <GroupedIssueList
    :groups="groups"
    empty-label="No issues in the current cycle."
  />
</template>
