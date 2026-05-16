<!--
  Root shell.
  Adds the `dark` class for any Tailwind dark variants we use, then
  hands control to the router so `app/pages/index.vue` renders.
-->
<script setup lang="ts">
// `useHead` adds the `dark` class to <html> so Tailwind's `dark:`
// variants resolve consistently regardless of OS preference. The
// Catppuccin Mocha palette is intrinsically dark, so this is correct
// to do unconditionally.
useHead({
  htmlAttrs: { class: "dark" },
});
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>
