import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  ApiError,
  apiRequest,
  buildUrl,
  getAccessToken,
  putAccessToken,
  removeAccessToken,
  runApi,
} from "./apiHelper";

const mockFetch = (status: number, body: unknown, jsonFails = false) => {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: jsonFails ? () => Promise.reject(new Error("bukan json")) : () => Promise.resolve(body),
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
};

beforeEach(() => localStorage.clear());
afterEach(() => vi.unstubAllGlobals());

describe("penyimpanan token", () => {
  it("menyimpan, membaca, dan menghapus token", () => {
    expect(getAccessToken()).toBeNull();
    putAccessToken("abc");
    expect(getAccessToken()).toBe("abc");
    removeAccessToken();
    expect(getAccessToken()).toBeNull();
  });
});

describe("buildUrl", () => {
  it("menyusun query string dan melewati nilai kosong", () => {
    const url = buildUrl("/vehicles", { page: 2, search: "", status: undefined, type: null, active: false });
    expect(url).toBe(`${BENGKELKU_API_URL}/vehicles?page=2&active=false`);
  });

  it("tanpa query tidak menambahkan tanda tanya", () => {
    expect(buildUrl("/services")).toBe(`${BENGKELKU_API_URL}/services`);
  });
});

describe("apiRequest", () => {
  it("menyertakan token Bearer dan mengembalikan payload", async () => {
    putAccessToken("token-1");
    const fetchMock = mockFetch(200, { success: true, message: "OK", data: [1] });

    const response = await apiRequest<number[]>("/vehicles", { query: { page: 1 } });

    expect(response.data).toEqual([1]);
    expect(fetchMock).toHaveBeenCalledWith(
      `${BENGKELKU_API_URL}/vehicles?page=1`,
      expect.objectContaining({
        method: "GET",
        body: undefined,
        headers: { Accept: "application/json", Authorization: "Bearer token-1" },
      })
    );
  });

  it("mengirim body JSON dengan Content-Type", async () => {
    const fetchMock = mockFetch(201, { success: true, message: "OK", data: null });

    await apiRequest("/vehicles", { method: "POST", body: { a: 1 } });

    expect(fetchMock.mock.calls[0][1]).toMatchObject({
      method: "POST",
      body: JSON.stringify({ a: 1 }),
      headers: { "Content-Type": "application/json" },
    });
  });

  it("tidak mengirim Authorization bila auth=false atau token kosong", async () => {
    putAccessToken("token-1");
    const fetchMock = mockFetch(200, { success: true, message: "OK", data: null });

    await apiRequest("/auth/login", { auth: false });
    await apiRequest("/x").then(() => removeAccessToken());
    removeAccessToken();
    await apiRequest("/y");

    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBeUndefined();
    expect(fetchMock.mock.calls[2][1].headers.Authorization).toBeUndefined();
  });

  it("mengubah gangguan jaringan menjadi ApiError status 0", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));

    await expect(apiRequest("/x")).rejects.toMatchObject({ name: "ApiError", status: 0 });
  });

  it("melempar ApiError berisi pesan dan error per field", async () => {
    mockFetch(422, { message: "Validasi gagal", errors: [{ field: "email", message: "Tidak valid" }] });

    await expect(apiRequest("/x")).rejects.toMatchObject({
      status: 422,
      message: "Validasi gagal",
      errors: [{ field: "email", message: "Tidak valid" }],
    });
  });

  it("memakai pesan bawaan saat respons error bukan JSON", async () => {
    mockFetch(500, null, true);

    await expect(apiRequest("/x")).rejects.toMatchObject({ status: 500, message: "Terjadi kesalahan pada server", errors: [] });
  });

  it("menghapus token saat 401 pada request terautentikasi saja", async () => {
    putAccessToken("kedaluwarsa");
    mockFetch(401, { message: "Token tidak valid" });

    await expect(apiRequest("/users/me", { auth: false })).rejects.toBeInstanceOf(ApiError);
    expect(getAccessToken()).toBe("kedaluwarsa");

    await expect(apiRequest("/users/me")).rejects.toBeInstanceOf(ApiError);
    expect(getAccessToken()).toBeNull();
  });
});

describe("runApi", () => {
  it("membungkus respons sukses", async () => {
    const result = await runApi(() => Promise.resolve({ success: true, message: "Siap", data: 5, meta: undefined }));
    expect(result).toEqual({ ok: true, data: 5, meta: undefined, message: "Siap" });
  });

  it("membungkus ApiError sebagai hasil gagal", async () => {
    const result = await runApi(() => Promise.reject(new ApiError("Gagal", 409, [{ field: "a", message: "b" }])));
    expect(result).toEqual({ ok: false, message: "Gagal", errors: [{ field: "a", message: "b" }], status: 409 });
  });

  it("melempar ulang error yang bukan ApiError", async () => {
    await expect(runApi(() => Promise.reject(new Error("bug")))).rejects.toThrow("bug");
  });
});
