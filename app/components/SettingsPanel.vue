<!--
  SettingsPanel — slide-out drawer with every runtime knob.

  Bound directly to the refs returned by `useDashboardConfig`, so
  changes apply (and persist) immediately. A `Reset to defaults`
  button at the bottom restores the values from `app/config.ts`.

  Layout is fixed to the right edge and sized for a vertical monitor.
-->
<script setup lang="ts">
import { useDashboardConfig } from "~/composables/useDashboardConfig";
import { VIEW_DESCRIPTIONS, VIEW_IDS, VIEW_LABELS, type ViewId } from "#shared/viewIds";

defineProps<{ open: boolean }>();
const emit = defineEmits<{ (e: "close"): void }>();

const {
  pollIntervalMs,
  viewRotationMs,
  autoCycle,
  enabledViews,
  mostImportantCount,
  upcomingHorizonDays,
  reset,
} = useDashboardConfig();

function toggleView(id: ViewId, checked: boolean): void {
  const set = new Set(enabledViews.value);
  if (checked) set.add(id);
  else set.delete(id);
  // Always keep at least one view enabled, otherwise the rotation
  // breaks. Re-add the first view in canonical order if everything
  // got unchecked.
  enabledViews.value =
    set.size === 0 ? [VIEW_IDS[0]] : VIEW_IDS.filter((v) => set.has(v));
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition duration-200"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <aside
        v-if="open"
        class="fixed inset-y-0 right-0 z-30 flex w-full max-w-md flex-col overflow-y-auto border-l border-ctp-surface0 bg-ctp-mantle p-6 shadow-2xl"
        role="dialog"
        aria-label="Dashboard settings"
      >
        <div class="mb-6 flex items-center justify-between">
          <h2 class="text-xl font-bold tracking-tight text-ctp-text">
            Settings
          </h2>
          <button
            type="button"
            class="rounded-md p-1.5 text-ctp-subtext0 ring-1 ring-ctp-surface0 hover:bg-ctp-surface0 hover:text-accent"
            aria-label="Close settings"
            @click="emit('close')"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              class="h-4 w-4"
            >
              <path
                d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22z"
              />
            </svg>
          </button>
        </div>

        <!-- ── Polling interval ────────────────────────────────────────── -->
        <section class="mb-6">
          <label class="flex items-center justify-between text-sm font-medium">
            <span>Refresh every</span>
            <span class="font-mono text-accent">
              {{ Math.round(pollIntervalMs / 60_000) }} min
            </span>
          </label>
          <input
            v-model.number="pollIntervalMs"
            type="range"
            :min="60_000"
            :max="60 * 60_000"
            :step="60_000"
            class="mt-2 w-full accent-[var(--color-accent)]"
          />
          <p class="mt-1 text-xs text-ctp-overlay1">
            How often the dashboard polls Linear.
          </p>
        </section>

        <!-- ── Rotation interval ───────────────────────────────────────── -->
        <section class="mb-6">
          <label class="flex items-center justify-between text-sm font-medium">
            <span>View rotation</span>
            <span class="font-mono text-accent">
              {{ Math.round(viewRotationMs / 1000) }} s
            </span>
          </label>
          <input
            v-model.number="viewRotationMs"
            type="range"
            :min="5_000"
            :max="120_000"
            :step="1_000"
            class="mt-2 w-full accent-[var(--color-accent)]"
          />
          <p class="mt-1 text-xs text-ctp-overlay1">
            How long each view stays on screen.
          </p>
        </section>

        <!-- ── Auto-cycle ──────────────────────────────────────────────── -->
        <section class="mb-6">
          <label class="flex items-center justify-between gap-3 text-sm font-medium">
            <span>Auto-cycle through views</span>
            <input
              v-model="autoCycle"
              type="checkbox"
              class="h-4 w-4 rounded border-ctp-surface1 bg-ctp-base accent-[var(--color-accent)]"
            />
          </label>
          <p class="mt-1 text-xs text-ctp-overlay1">
            Off = the dashboard stays on whichever view is selected.
          </p>
        </section>

        <!-- ── Most important count ────────────────────────────────────── -->
        <section class="mb-6">
          <label class="flex items-center justify-between text-sm font-medium">
            <span>Most Important strip size</span>
            <span class="font-mono text-accent">{{ mostImportantCount }}</span>
          </label>
          <input
            v-model.number="mostImportantCount"
            type="range"
            :min="3"
            :max="12"
            :step="1"
            class="mt-2 w-full accent-[var(--color-accent)]"
          />
        </section>

        <!-- ── Upcoming horizon ────────────────────────────────────────── -->
        <section class="mb-6">
          <label class="flex items-center justify-between text-sm font-medium">
            <span>Upcoming horizon</span>
            <span class="font-mono text-accent">{{ upcomingHorizonDays }} days</span>
          </label>
          <input
            v-model.number="upcomingHorizonDays"
            type="range"
            :min="1"
            :max="60"
            :step="1"
            class="mt-2 w-full accent-[var(--color-accent)]"
          />
        </section>

        <!-- ── Enabled views ───────────────────────────────────────────── -->
        <section class="mb-6">
          <h3 class="mb-2 text-sm font-medium">Views in rotation</h3>
          <ul class="flex flex-col gap-2">
            <li v-for="id in VIEW_IDS" :key="id">
              <label
                class="flex cursor-pointer items-start gap-3 rounded-lg bg-ctp-base/40 p-2 ring-1 ring-ctp-surface0 hover:bg-ctp-surface0"
              >
                <input
                  type="checkbox"
                  :checked="enabledViews.includes(id)"
                  class="mt-0.5 h-4 w-4 rounded border-ctp-surface1 bg-ctp-base accent-[var(--color-accent)]"
                  @change="toggleView(id, ($event.target as HTMLInputElement).checked)"
                />
                <div>
                  <div class="text-sm font-medium text-ctp-text">
                    {{ VIEW_LABELS[id] }}
                  </div>
                  <div class="text-xs text-ctp-overlay1">
                    {{ VIEW_DESCRIPTIONS[id] }}
                  </div>
                </div>
              </label>
            </li>
          </ul>
        </section>

        <button
          type="button"
          class="mt-auto rounded-md bg-ctp-surface0 px-3 py-2 text-sm text-ctp-subtext1 ring-1 ring-ctp-surface1 hover:bg-ctp-surface1 hover:text-accent"
          @click="reset"
        >
          Reset to defaults
        </button>
      </aside>
    </Transition>
  </Teleport>
</template>
