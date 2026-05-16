<!--
  PriorityBadge — small coloured pill showing Linear priority.

  Mapping (Linear numeric → Catppuccin token):
    1 Urgent  → red
    2 High    → peach
    3 Medium  → yellow
    4 Low     → blue
    0 None    → overlay0 (muted)

  This component is the single source of truth for that mapping; if you
  want to rebrand priorities, edit `STYLE_MAP` below.
-->
<script setup lang="ts">
import { computed } from "vue";
import type { Priority } from "#shared/types";
import { priorityLabel } from "~/utils/format";

const props = defineProps<{ priority: Priority }>();

const STYLE_MAP: Record<Priority, { wrap: string; dot: string }> = {
  1: { wrap: "bg-ctp-red/15 text-ctp-red ring-ctp-red/40", dot: "bg-ctp-red" },
  2: {
    wrap: "bg-ctp-peach/15 text-ctp-peach ring-ctp-peach/40",
    dot: "bg-ctp-peach",
  },
  3: {
    wrap: "bg-ctp-yellow/15 text-ctp-yellow ring-ctp-yellow/40",
    dot: "bg-ctp-yellow",
  },
  4: { wrap: "bg-ctp-blue/15 text-ctp-blue ring-ctp-blue/40", dot: "bg-ctp-blue" },
  0: {
    wrap: "bg-ctp-surface0 text-ctp-overlay1 ring-ctp-overlay0/40",
    dot: "bg-ctp-overlay0",
  },
};

const cls = computed(() => STYLE_MAP[props.priority]);
const label = computed(() => priorityLabel(props.priority));
</script>

<template>
  <span
    :class="cls.wrap"
    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset"
  >
    <span :class="cls.dot" class="h-1.5 w-1.5 rounded-full" />
    {{ label }}
  </span>
</template>
