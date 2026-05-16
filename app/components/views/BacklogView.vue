<!--
  BacklogView — issues whose workflow state has category "backlog".

  Sorted by the "most important" rule so the loudest items rise to the
  top even when nothing has a hard due date.
-->
<script setup lang="ts">
import { computed, inject, type Ref } from "vue";
import type { DashboardPayload } from "#shared/types";
import { sortMostImportant } from "~/utils/sort";
import IssueList from "../IssueList.vue";

const data = inject<Ref<DashboardPayload | null>>("dashboardData");

const issues = computed(() => {
  const all = data?.value?.issues ?? [];
  return sortMostImportant(all.filter((i) => i.state.type === "backlog"));
});
</script>

<template>
  <IssueList :issues="issues" empty-label="Backlog is empty." />
</template>
