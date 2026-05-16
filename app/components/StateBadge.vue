<!--
  StateBadge — workflow state pill, coloured from Linear's `state.color`.

  Linear ships any hex string here, including colours that aren't in the
  Catppuccin palette. We therefore render the colour inline rather than
  via a Tailwind token, with a subtle ring/background derived from it.
-->
<script setup lang="ts">
import { computed } from "vue";
import type { DashboardState } from "#shared/types";

const props = defineProps<{ state: DashboardState }>();

const swatchStyle = computed(() => ({
  backgroundColor: props.state.color,
}));

const wrapStyle = computed(() => ({
  /* 15% alpha tint of the state colour. Catppuccin's surfaces are dark
     so this reads as a subtle wash even with bright Linear colours. */
  backgroundColor: `${props.state.color}26`,
  color: props.state.color,
  boxShadow: `inset 0 0 0 1px ${props.state.color}55`,
}));
</script>

<template>
  <span
    :style="wrapStyle"
    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
  >
    <span :style="swatchStyle" class="h-1.5 w-1.5 rounded-full" />
    {{ state.name }}
  </span>
</template>
