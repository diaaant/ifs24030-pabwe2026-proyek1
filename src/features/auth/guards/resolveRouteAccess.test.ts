import { describe, expect, it } from "vitest";
import { resolveRouteAccess } from "./resolveRouteAccess";

describe("resolveRouteAccess", () => {
  it.each([
    ["belum login membuka halaman terproteksi", { path: "/vehicles", isLoggedIn: false, role: null }, "/auth/login"],
    ["belum login membuka halaman login", { path: "/auth/login", isLoggedIn: false, role: null }, null],
    ["sudah login membuka halaman login", { path: "/auth/login", isLoggedIn: true, role: "customer" }, "/"],
    ["sudah login membuka halaman biasa", { path: "/vehicles", isLoggedIn: true, role: "customer" }, null],
    ["pelanggan membuka halaman admin", { path: "/users", isLoggedIn: true, role: "customer", allowedRoles: ["admin"] }, "/"],
    ["admin membuka halaman admin", { path: "/users", isLoggedIn: true, role: "admin", allowedRoles: ["admin"] }, null],
    ["role tidak diketahui membuka halaman admin", { path: "/users", isLoggedIn: true, role: null, allowedRoles: ["admin"] }, "/"],
  ] as const)("%s", (_label, context, expected) => {
    expect(resolveRouteAccess({ ...context, allowedRoles: context.allowedRoles ? [...context.allowedRoles] : undefined })).toBe(expected);
  });
});
