<!--
  ByProjectView — issues grouped by project.

  Issues with no project land in a "(no project)" bucket that always
  sorts last. Within each group, issues are ordered by the
  "most important" rule.
-->
<script setup lang="ts">
import { computed, inject, type Ref } from "vue";
import type { DashboardPayload } from "#shared/types";
import { groupByProject } from "~/utils/groupBy";
import GroupedIssueList from "../GroupedIssueList.vue";

const data = inject<Ref<DashboardPayload | null>>("dashboardData");

const groups = computed(() => groupByProject(data?.value?.issues ?? []));
</script>

<template>
  <GroupedIssueList :groups="groups" empty-label="No open issues." />
</template>
