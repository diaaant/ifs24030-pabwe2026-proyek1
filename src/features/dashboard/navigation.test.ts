import { describe, expect, it } from "vitest";
import { getNavItems, isNavActive } from "./navigation";

describe("navigation", () => {
  it("menu Pelanggan hanya muncul untuk admin", () => {
    expect(getNavItems("admin").map((item) => item.label)).toContain("Pelanggan");
    expect(getNavItems("customer").map((item) => item.label)).not.toContain("Pelanggan");
    expect(getNavItems(null).map((item) => item.label)).not.toContain("Pelanggan");
  });

  it("menentukan menu aktif", () => {
    expect(isNavActive("/", "/")).toBe(true);
    expect(isNavActive("/", "/vehicles")).toBe(false);
    expect(isNavActive("/vehicles", "/vehicles")).toBe(true);
    expect(isNavActive("/vehicles", "/vehicles/3")).toBe(true);
    expect(isNavActive("/vehicles", "/vehicles-lain")).toBe(false);
  });
});
