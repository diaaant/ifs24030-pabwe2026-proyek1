import type { RouterConfig } from "@nuxt/schema";
import { routes } from "./routes";

// Nuxt memakai rute dari src/routes.ts, bukan dari folder pages/.
export default {
  routes: () => routes,
} satisfies RouterConfig;
