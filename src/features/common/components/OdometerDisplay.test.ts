import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import OdometerDisplay from "./OdometerDisplay.vue";

describe("OdometerDisplay", () => {
  it("mengisi digit hingga enam angka", () => {
    const wrapper = mount(OdometerDisplay, { props: { value: 15700 } });

    expect(wrapper.findAll("span.tabular-nums").map((item) => item.text()).join("")).toBe("015700");
    expect(wrapper.attributes("aria-label")).toBe("15700 kilometer");
  });

  it("menampilkan lebih dari enam digit apa adanya dan tidak negatif", () => {
    expect(mount(OdometerDisplay, { props: { value: 1234567 } }).findAll("span.tabular-nums")).toHaveLength(7);
    expect(mount(OdometerDisplay, { props: { value: -5, compact: true } }).findAll("span.tabular-nums")[5].text()).toBe("0");
  });
});
