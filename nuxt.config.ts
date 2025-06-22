// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  modules: ["@nuxt/image", "shadcn-nuxt", "@nuxtjs/color-mode"],
  css: ["~/assets/css/app.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  shadcn: {
    prefix: "",
    componentDir: "./components/ui",
  },
  colorMode: {
    classSuffix: "",
  },

  app: {
    head: {
      link: [
        { rel: "icon", href: "/favicon.ico", sizes: "any" },
        { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
        { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },

        // Fonts
        { rel: "preconnect", href: "https://fonts.bunny.net" },
        {
          rel: "stylesheet",
          href: "https://fonts.bunny.net/css?family=instrument-sans:400,500,600",
        },
      ],
    },
  },
});
