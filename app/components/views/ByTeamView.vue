<!--
  ByTeamView — issues grouped by team.
-->
<script setup lang="ts">
import { computed, inject, type Ref } from "vue";
import type { DashboardPayload } from "#shared/types";
import { groupByTeam } from "~/utils/groupBy";
import GroupedIssueList from "../GroupedIssueList.vue";

const data = inject<Ref<DashboardPayload | null>>("dashboardData");

const groups = computed(() => groupByTeam(data?.value?.issues ?? []));
</script>

<template>
  <GroupedIssueList :groups="groups" empty-label="No open issues." />
</template>
