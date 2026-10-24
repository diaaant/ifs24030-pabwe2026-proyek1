import { createRouter, type RouterHistory } from "vue-router";
import { routes } from "./routes";

/** Pabrik router untuk pengujian (memory history) tanpa menjalankan Nuxt. */
export const createAppRouter = (history: RouterHistory) => createRouter({ history, routes });
