import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("sweetalert2", () => ({ default: { fire: vi.fn() } }));

import Swal from "sweetalert2";
import {
  emptyToNull,
  formatCompactRupiah,
  formatDate,
  formatDateTime,
  formatKm,
  formatMonthShort,
  formatNumber,
  formatRupiah,
  getInitials,
  showConfirmDialog,
  showErrorDialog,
  showSuccessDialog,
  showToast,
  toISODate,
} from "./toolsHelper";

const fire = vi.mocked(Swal.fire);

beforeEach(() => fire.mockReset());

describe("dialog", () => {
  it("menampilkan dialog sukses dan error", () => {
    showSuccessDialog("Tersimpan");
    showErrorDialog("Gagal menyimpan");

    expect(fire).toHaveBeenNthCalledWith(1, expect.objectContaining({ icon: "success", title: "Berhasil", text: "Tersimpan" }));
    expect(fire).toHaveBeenNthCalledWith(2, expect.objectContaining({ icon: "error", text: "Gagal menyimpan" }));
  });

  it("menampilkan toast dengan ikon bawaan dan khusus", () => {
    showToast("Halo");
    showToast("Gagal", "error");

    expect(fire).toHaveBeenNthCalledWith(1, expect.objectContaining({ toast: true, icon: "success", title: "Halo" }));
    expect(fire).toHaveBeenNthCalledWith(2, expect.objectContaining({ icon: "error" }));
  });

  it("konfirmasi mengembalikan pilihan pengguna", async () => {
    fire.mockResolvedValueOnce({ isConfirmed: true } as never);
    expect(await showConfirmDialog("Lanjut?")).toBe(true);
    expect(fire).toHaveBeenLastCalledWith(expect.objectContaining({ icon: "question", title: "Konfirmasi", focusCancel: false }));

    fire.mockResolvedValueOnce({ isConfirmed: false } as never);
    expect(await showConfirmDialog("Hapus?", { title: "Hapus", confirmText: "Hapus", danger: true })).toBe(false);
    expect(fire).toHaveBeenLastCalledWith(expect.objectContaining({ icon: "warning", confirmButtonText: "Hapus", focusCancel: true }));
  });
});

describe("format", () => {
  it("memformat angka dan mata uang Indonesia", () => {
    expect(formatRupiah(1250000)).toMatch(/^Rp\s1\.250\.000$/);
    expect(formatNumber(12500)).toBe("12.500");
    expect(formatKm(5000)).toBe("5.000 km");
  });

  it("meringkas rupiah untuk label grafik", () => {
    expect(formatCompactRupiah(1250000)).toBe("1,3 jt");
    expect(formatCompactRupiah(125000)).toBe("125 rb");
    expect(formatCompactRupiah(500)).toBe("500");
  });

  it("memformat tanggal dan waktu", () => {
    expect(formatDate("2026-10-21")).toBe("21 Okt 2026");
    expect(formatDate("2026-10-21 02:00:00")).toBe("21 Okt 2026");
    expect(formatDateTime("2026-10-21 02:30:00")).toMatch(/2026/);
    expect(formatMonthShort("2026-05")).toBe("Mei");
  });

  it("toISODate memakai tanggal lokal", () => {
    expect(toISODate(new Date(2026, 0, 5))).toBe("2026-01-05");
  });

  it("getInitials mengambil maksimal dua huruf", () => {
    expect(getInitials("budi santoso wijaya")).toBe("BS");
    expect(getInitials("  rotua ")).toBe("R");
  });

  it("emptyToNull mengubah string kosong menjadi null", () => {
    expect(emptyToNull({ a: "", b: "x", c: 0 })).toEqual({ a: null, b: "x", c: 0 });
  });
});
