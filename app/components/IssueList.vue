<!--
  IssueList — flat vertical list of IssueCards.

  Used by views that don't need grouping (Upcoming, MyIssues,
  AssignedToMe, InProgress, Backlog). Provides an empty state.
-->
<script setup lang="ts">
import type { DashboardIssue } from "#shared/types";
import IssueCard from "./IssueCard.vue";

defineProps<{
  issues: DashboardIssue[];
  /** Empty-state message when there are no issues to show. */
  emptyLabel?: string;
  /** Dense layout for tight columns. */
  dense?: boolean;
}>();
</script>

<template>
  <div v-if="issues.length === 0" class="py-12 text-center text-ctp-overlay1">
    {{ emptyLabel ?? "Nothing here right now." }}
  </div>
  <ul v-else class="flex flex-col gap-3">
    <li v-for="issue in issues" :key="issue.id">
      <IssueCard :issue="issue" :dense="dense" />
    </li>
  </ul>
</template>
