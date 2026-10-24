import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import PaginationBar from "./PaginationBar.vue";

const meta = (page: number, totalPages: number) => ({ page, limit: 10, total: totalPages * 10, totalPages });

describe("PaginationBar", () => {
  it("tersembunyi bila hanya satu halaman", () => {
    expect(mount(PaginationBar, { props: { meta: meta(1, 1) } }).find("nav").exists()).toBe(false);
  });

  it("mengirim nomor halaman baru", async () => {
    const wrapper = mount(PaginationBar, { props: { meta: meta(2, 3) } });

    await wrapper.find('[aria-label="Halaman berikutnya"]').trigger("click");
    await wrapper.find('[aria-label="Halaman sebelumnya"]').trigger("click");

    expect(wrapper.emitted("change")).toEqual([[3], [1]]);
  });

  it("menonaktifkan tombol di batas halaman", () => {
    const first = mount(PaginationBar, { props: { meta: meta(1, 3) } });
    expect(first.find('[aria-label="Halaman sebelumnya"]').attributes("disabled")).toBeDefined();

    const last = mount(PaginationBar, { props: { meta: meta(3, 3) } });
    expect(last.find('[aria-label="Halaman berikutnya"]').attributes("disabled")).toBeDefined();
  });
});
