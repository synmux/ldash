<!--
  AssigneeAvatar — small round avatar.

  Renders the user's `avatarUrl` if present, otherwise their initials in
  a coloured circle. Shows a faint placeholder for unassigned issues.
-->
<script setup lang="ts">
import { computed } from "vue";
import type { DashboardUser } from "#shared/types";
import { initials } from "~/utils/format";

const props = defineProps<{
  user: DashboardUser | null;
  /** Tailwind size class shorthand (`md` ≈ 24px, `lg` ≈ 32px). */
  size?: "sm" | "md" | "lg";
}>();

const SIZE_CLASS: Record<NonNullable<typeof props.size>, string> = {
  sm: "h-5 w-5 text-[10px]",
  md: "h-6 w-6 text-xs",
  lg: "h-8 w-8 text-sm",
};

const cls = computed(() => SIZE_CLASS[props.size ?? "md"]);
const fallback = computed(() => (props.user ? initials(props.user.name) : "?"));
</script>

<template>
  <span
    v-if="user?.avatarUrl"
    :class="cls"
    class="inline-block overflow-hidden rounded-full ring-1 ring-ctp-overlay0/40"
  >
    <img :src="user.avatarUrl" :alt="user.name" class="h-full w-full object-cover" />
  </span>
  <span
    v-else
    :class="cls"
    class="inline-flex items-center justify-center rounded-full bg-ctp-surface1 font-semibold text-ctp-subtext1 ring-1 ring-ctp-overlay0/40"
    :title="user?.name ?? 'Unassigned'"
  >
    {{ fallback }}
  </span>
</template>
