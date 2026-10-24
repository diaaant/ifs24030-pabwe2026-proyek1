import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./toolsHelper", () => ({ showToast: vi.fn(), showErrorDialog: vi.fn() }));

import { notifyResult } from "./actionHelper";
import { showErrorDialog, showToast } from "./toolsHelper";

beforeEach(() => vi.clearAllMocks());

describe("notifyResult", () => {
  it("menampilkan toast sukses hanya bila ada pesan", () => {
    notifyResult({ ok: true, data: 1, message: "OK" }, "Tersimpan");
    expect(showToast).toHaveBeenCalledWith("Tersimpan");

    vi.clearAllMocks();
    notifyResult({ ok: true, data: 1, message: "OK" });
    expect(showToast).not.toHaveBeenCalled();
  });

  it("memakai toast untuk error validasi dan dialog untuk error lain", () => {
    notifyResult({ ok: false, message: "Validasi gagal", errors: [{ field: "a", message: "b" }], status: 422 });
    expect(showToast).toHaveBeenCalledWith("Validasi gagal", "error");

    notifyResult({ ok: false, message: "Server error", errors: [], status: 500 });
    expect(showErrorDialog).toHaveBeenCalledWith("Server error");
  });
});
