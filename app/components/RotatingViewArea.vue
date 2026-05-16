<!--
  RotatingViewArea — wraps the currently active view in a transition
  and binds pause-on-hover semantics so a curious viewer can stop the
  rotation without opening settings.

  The map below is the canonical registry of view components — adding
  a new view means adding an entry here plus updating
  `shared/viewIds.ts`.
-->
<script setup lang="ts">
import { computed, defineAsyncComponent } from "vue";
import type { ViewId } from "#shared/viewIds";
import { VIEW_LABELS } from "#shared/viewIds";

const props = defineProps<{ view: ViewId }>();
const emit = defineEmits<{ (e: "pause"): void; (e: "resume"): void }>();

// Lazy-load each view component so its code only ships when first shown.
const viewMap: Record<ViewId, ReturnType<typeof defineAsyncComponent>> = {
  byProject: defineAsyncComponent(() => import("./views/ByProjectView.vue")),
  byTeam: defineAsyncComponent(() => import("./views/ByTeamView.vue")),
  byCycle: defineAsyncComponent(() => import("./views/ByCycleView.vue")),
  upcoming: defineAsyncComponent(() => import("./views/UpcomingView.vue")),
  myIssues: defineAsyncComponent(() => import("./views/MyIssuesView.vue")),
  assignedToMe: defineAsyncComponent(() =>
    import("./views/AssignedToMeView.vue")
  ),
  inProgress: defineAsyncComponent(() => import("./views/InProgressView.vue")),
  backlog: defineAsyncComponent(() => import("./views/BacklogView.vue")),
};

const component = computed(() => viewMap[props.view]);
const label = computed(() => VIEW_LABELS[props.view]);
</script>

<template>
  <section
    class="rounded-2xl bg-ctp-mantle/40 p-5 ring-1 ring-ctp-surface0"
    @mouseenter="emit('pause')"
    @mouseleave="emit('resume')"
  >
    <header class="mb-4 flex items-baseline justify-between">
      <h2
        class="text-sm font-semibold uppercase tracking-wider text-ctp-subtext1"
      >
        {{ label }}
      </h2>
      <span class="text-xs text-ctp-overlay1">hover to pause</span>
    </header>

    <Transition name="fade-slide" mode="out-in">
      <component :is="component" :key="view" />
    </Transition>
  </section>
</template>
