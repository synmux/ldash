<!--
  GroupedIssueList — sectioned list, used by "By Project" / "By Team"
  views and the "By Cycle" view's per-team grouping.

  Each group renders:
    - a header chip showing the group label + issue count
    - an IssueList beneath it
-->
<script setup lang="ts">
import type { IssueGroup } from "~/utils/groupBy";
import IssueList from "./IssueList.vue";

defineProps<{
  groups: IssueGroup[];
  /** Empty-state message used when ALL groups are empty (or none exist). */
  emptyLabel?: string;
}>();
</script>

<template>
  <div v-if="groups.length === 0" class="py-12 text-center text-ctp-overlay1">
    {{ emptyLabel ?? "Nothing here right now." }}
  </div>
  <div v-else class="flex flex-col gap-6">
    <section v-for="group in groups" :key="group.key">
      <header class="mb-3 flex items-baseline gap-3">
        <span
          class="inline-flex items-center gap-2 rounded-full bg-ctp-surface0 px-3 py-1 text-sm font-semibold"
          :style="{ color: group.color }"
        >
          <span
            class="h-2 w-2 rounded-full"
            :style="{ backgroundColor: group.color }"
          />
          {{ group.label }}
        </span>
        <span class="text-xs text-ctp-overlay1">{{ group.issues.length }} open</span>
      </header>
      <IssueList :issues="group.issues" dense />
    </section>
  </div>
</template>
