// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  // Tailwind v4 is wired up via its dedicated Vite plugin — no PostCSS
  // setup, no JS config file. Design tokens live in
  // `app/assets/css/main.css` (the `@theme` block).
  vite: {
    plugins: [tailwindcss()],
  },

  css: ["~/assets/css/main.css"],

  app: {
    head: {
      title: "Linear Dashboard",
      meta: [
        { charset: "utf-8" },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        {
          name: "description",
          content:
            "Kiosk-style dashboard for your most important Linear issues.",
        },
      ],
    },
  },

  /*
   * Linear API key, surfaced through Nuxt's `useRuntimeConfig()`.
   *
   *   - At build/dev time the default is the empty string, so the
   *     server endpoint falls back to mock data.
   *   - At runtime, the environment variable `NUXT_LINEAR_API_KEY`
   *     overrides this (Nuxt's convention: every `runtimeConfig` key
   *     can be set from an env var named NUXT_<UPPER_SNAKE_CASE_KEY>).
   *   - Because it sits under the top-level `runtimeConfig` (not
   *     `public`), the value is private — never sent to the browser.
   *
   * To run with a real key locally:
   *   NUXT_LINEAR_API_KEY="lin_api_xxx" bun run dev
   *
   * To deploy with a real key on Cloudflare:
   *   bunx wrangler secret put NUXT_LINEAR_API_KEY
   */
  runtimeConfig: {
    linearApiKey: "",
  },

  nitro: {
    preset: "cloudflare_module",

    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
    },
  },

  modules: ["nitro-cloudflare-dev"],
});
