import { describe, expect, it } from "vitest";
import { createMemoryHistory } from "vue-router";
import { createAppRouter } from "./router";

describe("routes", () => {
  const router = createAppRouter(createMemoryHistory());

  it.each([
    ["/auth/login", "login"],
    ["/auth/register", "register"],
    ["/", "home"],
    ["/vehicles/3", "vehicle-detail"],
    ["/bookings/new", "booking-new"],
    ["/bookings/12", "booking-detail"],
    ["/history/4", "invoice"],
    ["/users", "users"],
    ["/halaman-tidak-ada", "not-found"],
  ])("%s dipetakan ke rute %s", (path, name) => {
    expect(router.resolve(path).name).toBe(name);
  });

  it("mengalihkan /auth ke halaman login", () => {
    expect(router.resolve("/auth").matched.length).toBeGreaterThan(0);
  });

  it("halaman pelanggan hanya dapat dibuka admin", () => {
    expect(router.resolve("/users").meta.roles).toEqual(["admin"]);
    expect(router.resolve("/vehicles").meta.roles).toBeUndefined();
  });

  it("setiap nama rute unik", () => {
    const names = router.getRoutes().map((route) => route.name).filter(Boolean);
    expect(new Set(names).size).toBe(names.length);
  });
});
