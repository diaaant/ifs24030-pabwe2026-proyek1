import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import StatusBadge from "./StatusBadge.vue";

describe("StatusBadge", () => {
  it("menampilkan label dengan warna sesuai tone", () => {
    const wrapper = mount(StatusBadge, { props: { label: "Selesai", tone: "success" } });

    expect(wrapper.text()).toBe("Selesai");
    expect(wrapper.classes()).toContain("bg-emerald-100");
  });

  it("memakai tone netral secara bawaan", () => {
    expect(mount(StatusBadge, { props: { label: "x" } }).classes()).toContain("bg-slate-100");
  });
});
