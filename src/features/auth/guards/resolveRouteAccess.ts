import type { Role } from "../types";

export interface AccessContext {
  path: string;
  isLoggedIn: boolean;
  role: Role | null;
  /** Role yang diizinkan untuk rute ini (kosong = semua pengguna yang sudah login). */
  allowedRoles?: Role[];
}

/**
 * Tentukan apakah navigasi perlu dialihkan.
 * @returns path tujuan pengalihan, atau null bila akses diizinkan.
 */
export const resolveRouteAccess = ({ path, isLoggedIn, role, allowedRoles }: AccessContext): string | null => {
  const isAuthRoute = path.startsWith("/auth");

  if (!isLoggedIn) return isAuthRoute ? null : "/auth/login";
  if (isAuthRoute) return "/";
  if (allowedRoles && (!role || !allowedRoles.includes(role))) return "/";
  return null;
};
