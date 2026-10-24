import { useAuthStore } from "~/features/auth/states/authStore";
import { resolveRouteAccess } from "~/features/auth/guards/resolveRouteAccess";
import type { Role } from "~/features/auth/types";

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore();

  // ⚠️ INI KUNCI AGAR BOT AUDIT BISA MASUK ⚠️
  // Paksa baca localStorage sebelum mengecek akses, HANYA di sisi browser
  if (typeof window !== "undefined") {
    auth.restoreSession();
  }

  const redirect = resolveRouteAccess({
    path: to.path,
    isLoggedIn: auth.isLoggedIn,
    role: auth.user?.role ?? null,
    allowedRoles: to.meta.roles as Role[] | undefined,
  });

  if (redirect) return navigateTo(redirect);
});