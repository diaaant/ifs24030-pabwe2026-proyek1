import tailwindcss from "@tailwindcss/vite";

const customPort = Number(process.env.APP_PORT || process.env.PORT) || 3000;
const apiBaseUrl = process.env.VITE_API_BASEURL || "http://localhost:8000/api";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: false },
  telemetry: false,
  // SPA mode: routing dan penyimpanan token dijalankan di sisi klien
  ssr: false,
  // Kode aplikasi berada di src/
  srcDir: "src/",
  // Rute dideklarasikan di src/routes.ts dan dipasang lewat src/router.options.ts
  pages: true,
  css: ["~/index.css"],
  modules: ["@pinia/nuxt"],
  vite: {
    plugins: [tailwindcss()],
    define: {
      BENGKELKU_API_URL: JSON.stringify(apiBaseUrl),
    },
    build: {
      chunkSizeWarningLimit: 1500,
    },
  },
  devServer: {
    port: customPort,
  },
  nitro: {
    devPort: customPort,
  },
  app: {
    head: {
      title: "BengkelKu",
      htmlAttrs: { lang: "id" },
      meta: [
        {
          name: "description",
          content:
            "Booking servis, riwayat perawatan, dan pengingat servis kendaraan Anda.",
        },
      ],
      link: [
        { rel: "icon", type: "image/svg+xml", href: "/logo.svg" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&display=swap",
        },
      ],
      bodyAttrs: {
        class: "bg-paper text-ink font-sans antialiased min-h-screen",
      },
    },
  },
});
