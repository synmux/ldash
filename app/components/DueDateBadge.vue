<!--
  DueDateBadge — pill showing the due date with colour reflecting urgency.

  Urgency mapping (centralised in `app/utils/format.ts → dueUrgency`):
    overdue → red
    soon (≤3d)  → peach
    week (≤7d)  → yellow
    later (≤14d) → blue
    far  → muted text, no fill
    none → no badge at all
-->
<script setup lang="ts">
import { computed } from "vue";
import { dueLabel, dueUrgency, type DueUrgency } from "~/utils/format";

const props = defineProps<{ dueDate: string | null }>();

const urgency = computed<DueUrgency>(() => dueUrgency(props.dueDate));
const label = computed(() => dueLabel(props.dueDate));

const STYLE_MAP: Record<Exclude<DueUrgency, "none">, string> = {
  overdue: "bg-ctp-red/20 text-ctp-red ring-ctp-red/40",
  soon: "bg-ctp-peach/15 text-ctp-peach ring-ctp-peach/40",
  week: "bg-ctp-yellow/15 text-ctp-yellow ring-ctp-yellow/40",
  later: "bg-ctp-blue/15 text-ctp-blue ring-ctp-blue/40",
  far: "bg-ctp-surface0 text-ctp-subtext0 ring-ctp-overlay0/40",
};
</script>

<template>
  <span
    v-if="urgency !== 'none'"
    :class="STYLE_MAP[urgency]"
    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      class="h-3 w-3"
      aria-hidden="true"
    >
      <path
        fill-rule="evenodd"
        d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18h-10.5A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2zM3.5 8v7.25c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25V8h-13z"
        clip-rule="evenodd"
      />
    </svg>
    {{ label }}
  </span>
</template>
