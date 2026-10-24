import { useAuthStore } from "~/features/auth/states/authStore";
import { resolveRouteAccess } from "~/features/auth/guards/resolveRouteAccess";
import type { Role } from "~/features/auth/types";

/** Penjaga rute global: pengalihan login dan pembatasan role diputuskan oleh resolveRouteAccess. */
export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore();

  const redirect = resolveRouteAccess({
    path: to.path,
    isLoggedIn: auth.isLoggedIn,
    role: auth.user?.role ?? null,
    allowedRoles: to.meta.roles as Role[] | undefined,
  });

  if (redirect) return navigateTo(redirect);
});
