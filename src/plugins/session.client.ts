import { useAuthStore } from "~/features/auth/states/authStore";

/** Pulihkan sesi login dari localStorage sebelum rute pertama dievaluasi. */
export default defineNuxtPlugin(() => {
  useAuthStore().restoreSession();
});
