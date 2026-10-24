import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import process from "process";
import { fileURLToPath } from "node:url";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const port = Number(env.APP_PORT || env.PORT) || 3000;

  return {
    plugins: [vue(), tailwindcss()],
    resolve: {
      alias: {
        "~": fileURLToPath(new URL("./src", import.meta.url)),
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: { port },
    preview: { port },
    define: {
      BENGKELKU_API_URL: JSON.stringify(
        env.VITE_API_BASEURL || "http://localhost:8000/api"
      ),
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/setupTests.ts",
      include: ["src/**/*.test.ts"],
      coverage: {
        provider: "v8",
        reporter: ["text", "json-summary", "html", "lcov"],
        // Lapisan logika (helper, hook, API, state, guard) wajib 100%.
        include: [
          "src/helpers/**/*.ts",
          "src/hooks/**/*.ts",
          "src/features/**/api/*.ts",
          "src/features/**/states/*.ts",
          "src/features/**/guards/*.ts",
        ],
        exclude: ["**/*.test.ts", "**/*.d.ts", "src/test-utils.ts"],
        thresholds: {
          lines: 100,
          functions: 100,
          branches: 100,
          statements: 100,
        },
      },
    },
  };
});
