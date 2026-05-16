<!--
  AssignedToMeView — issues whose assignee is the authenticated viewer.
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
  const mine = payload.issues.filter(
    (i) => i.assignee?.id === payload.viewer.id
  );
  return sortMostImportant(mine);
});
</script>

<template>
  <IssueList :issues="issues" empty-label="Nothing is assigned to you." />
</template>
