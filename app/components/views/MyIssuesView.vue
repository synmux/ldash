<!--
  MyIssuesView — issues *created by* the viewer.

  Distinct from "Assigned to Me": this is issues you opened, regardless
  of who is now working on them. Useful for tracking the work you've
  scoped.
-->
<script setup lang="ts">
import { computed, inject, type Ref } from "vue";
import type { DashboardPayload } from "#shared/types";
import { sortMostImportant } from "~/utils/sort";
import IssueList from "../IssueList.vue";

const data = inject<Ref<DashboardPayload | null>>("dashboardData");

const issues = computed(() => {
  const payload = data?.value;
  if (!payload) return [];
  const mine = payload.issues.filter((i) => i.creator.id === payload.viewer.id);
  return sortMostImportant(mine);
});
</script>

<template>
  <IssueList :issues="issues" empty-label="You haven't created any open issues." />
</template>
