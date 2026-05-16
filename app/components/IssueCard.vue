<!--
  IssueCard — the canonical issue tile used everywhere on the dashboard.

  Props:
    - issue:  DashboardIssue  (required)
    - dense:  boolean          (smaller padding/font for grouped lists)

  Renders a clickable card that opens Linear in a new tab. Layout is
  optimised for portrait screens: full-width, generous vertical
  spacing, large hit targets.
-->
<script setup lang="ts">
import type { DashboardIssue } from "#shared/types";
import PriorityBadge from "./PriorityBadge.vue";
import DueDateBadge from "./DueDateBadge.vue";
import StateBadge from "./StateBadge.vue";
import AssigneeAvatar from "./AssigneeAvatar.vue";

defineProps<{ issue: DashboardIssue; dense?: boolean }>();
</script>

<template>
  <a
    :href="issue.url"
    target="_blank"
    rel="noopener"
    :class="
      dense
        ? 'block rounded-lg bg-ctp-mantle px-3 py-3 hover:bg-ctp-surface0'
        : 'block rounded-xl bg-ctp-mantle px-4 py-4 hover:bg-ctp-surface0'
    "
    class="ring-1 ring-ctp-surface0 transition hover:ring-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
  >
    <!-- Row 1: identifier + state + dueDate -->
    <div class="flex items-center gap-2 text-xs">
      <span
        class="rounded-md bg-ctp-surface0 px-1.5 py-0.5 font-mono text-ctp-subtext0"
        :style="{ borderLeft: `2px solid ${issue.team.color}` }"
        >{{ issue.identifier }}</span
      >
      <StateBadge :state="issue.state" />
      <DueDateBadge :due-date="issue.dueDate" />
      <span class="ml-auto">
        <PriorityBadge :priority="issue.priority" />
      </span>
    </div>

    <!-- Row 2: title -->
    <h3
      :class="dense ? 'text-base' : 'text-lg'"
      class="mt-2 font-semibold leading-snug text-ctp-text"
    >
      {{ issue.title }}
    </h3>

    <!-- Row 3: assignee + project + cycle -->
    <div class="mt-3 flex flex-wrap items-center gap-2 text-xs text-ctp-subtext0">
      <AssigneeAvatar :user="issue.assignee" size="sm" />
      <span v-if="issue.assignee">{{ issue.assignee.name }}</span>
      <span v-else class="italic text-ctp-overlay1">Unassigned</span>

      <span class="text-ctp-overlay0">·</span>
      <span
        class="inline-flex items-center gap-1.5 rounded-md bg-ctp-surface0 px-1.5 py-0.5"
        :style="{ color: issue.team.color }"
      >
        <span class="h-1.5 w-1.5 rounded-full" :style="{ backgroundColor: issue.team.color }" />
        {{ issue.team.key }}
      </span>

      <template v-if="issue.project">
        <span class="text-ctp-overlay0">·</span>
        <span
          class="inline-flex items-center gap-1.5 rounded-md bg-ctp-surface0 px-1.5 py-0.5"
          :style="{ color: issue.project.color }"
        >
          <span
            class="h-1.5 w-1.5 rounded-full"
            :style="{ backgroundColor: issue.project.color }"
          />
          {{ issue.project.name }}
        </span>
      </template>

      <template v-if="issue.cycle">
        <span class="text-ctp-overlay0">·</span>
        <span class="rounded-md bg-ctp-surface0 px-1.5 py-0.5 text-ctp-subtext1">
          Cycle {{ issue.cycle.number }}
        </span>
      </template>
    </div>
  </a>
</template>
