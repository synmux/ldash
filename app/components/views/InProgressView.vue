<!--
  InProgressView — issues whose workflow state has category "started".

  These are the things that are actively being worked on across all
  teams and projects, sorted by the "most important" rule.
-->
<script setup lang="ts">
import { computed, inject, type Ref } from "vue";
import type { DashboardPayload } from "#shared/types";
import { sortMostImportant } from "~/utils/sort";
import IssueList from "../IssueList.vue";

const data = inject<Ref<DashboardPayload | null>>("dashboardData");

const issues = computed(() => {
  const all = data?.value?.issues ?? [];
  return sortMostImportant(all.filter((i) => i.state.type === "started"));
});
</script>

<template>
  <IssueList :issues="issues" empty-label="Nothing in progress." />
</template>
