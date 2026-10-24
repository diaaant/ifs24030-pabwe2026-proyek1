import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import BaseModal from "./BaseModal.vue";

describe("BaseModal", () => {
  it("tidak merender apa pun saat tertutup", () => {
    expect(mount(BaseModal, { props: { open: false, title: "Judul" } }).find('[role="dialog"]').exists()).toBe(false);
  });

  it("menampilkan judul, isi, dan footer", () => {
    const wrapper = mount(BaseModal, {
      props: { open: true, title: "Tambah" },
      slots: { default: "<p>Isi</p>", footer: "<button>Simpan</button>" },
    });

    expect(wrapper.find('[role="dialog"]').attributes("aria-label")).toBe("Tambah");
    expect(wrapper.text()).toContain("Isi");
    expect(wrapper.text()).toContain("Simpan");
  });

  it("menutup lewat tombol, klik latar, dan tombol Escape", async () => {
    const wrapper = mount(BaseModal, { props: { open: true, title: "Tambah" }, attachTo: document.body });

    await wrapper.find('[aria-label="Tutup"]').trigger("click");
    await wrapper.trigger("mousedown");
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));

    expect(wrapper.emitted("close")).toHaveLength(3);
    await wrapper.setProps({ open: false });
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(wrapper.emitted("close")).toHaveLength(3);
    wrapper.unmount();
  });
});
