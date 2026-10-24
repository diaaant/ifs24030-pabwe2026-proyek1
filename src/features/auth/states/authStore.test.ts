import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../api/authApi", () => ({ authApi: { login: vi.fn(), register: vi.fn() } }));
vi.mock("~/features/users/api/userApi", () => ({ userApi: { me: vi.fn() } }));
vi.mock("~/helpers/actionHelper", () => ({ notifyResult: vi.fn() }));

import { createMockPinia, okResponse, rejectWith } from "~/test-utils";
import { notifyResult } from "~/helpers/actionHelper";
import { getAccessToken, putAccessToken } from "~/helpers/apiHelper";
import { userApi } from "~/features/users/api/userApi";
import { authApi } from "../api/authApi";
import { useAuthStore } from "./authStore";
import type { User } from "../types";

const user: User = { id: 1, name: "Budi", email: "budi@example.com", phone: null, role: "customer", created_at: "2026-10-01" };

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  createMockPinia({});
});

describe("restoreSession", () => {
  it("memulihkan token dan pengguna dari penyimpanan", () => {
    putAccessToken("t");
    localStorage.setItem("bengkelku_user", JSON.stringify(user));
    const store = useAuthStore();

    store.restoreSession();

    expect(store.token).toBe("t");
    expect(store.user).toEqual(user);
    expect(store.isLoggedIn).toBe(true);
    expect(store.isAdmin).toBe(false);
  });

  it("mengabaikan pengguna tersimpan bila tidak ada token", () => {
    localStorage.setItem("bengkelku_user", JSON.stringify(user));
    const store = useAuthStore();

    store.restoreSession();

    expect(store.user).toBeNull();
    expect(store.isLoggedIn).toBe(false);
  });

  it("menganggap data pengguna rusak atau kosong sebagai belum login", () => {
    putAccessToken("t");
    const store = useAuthStore();

    localStorage.setItem("bengkelku_user", "{rusak");
    store.restoreSession();
    expect(store.user).toBeNull();

    localStorage.removeItem("bengkelku_user");
    store.restoreSession();
    expect(store.user).toBeNull();
  });
});

describe("login dan register", () => {
  it("login berhasil memulai sesi", async () => {
    vi.mocked(authApi.login).mockResolvedValue(okResponse({ user: { ...user, role: "admin" as const }, token: "jwt" }));
    const store = useAuthStore();

    const result = await store.login({ email: user.email, password: "x" });

    expect(result.ok).toBe(true);
    expect(store.isAuthLogin).toBe(false);
    expect(store.isAdmin).toBe(true);
    expect(getAccessToken()).toBe("jwt");
    expect(notifyResult).toHaveBeenCalledWith(expect.anything(), "Selamat datang, Budi");
  });

  it("login gagal tidak membuat sesi", async () => {
    vi.mocked(authApi.login).mockReturnValue(rejectWith(401, "Email atau kata sandi salah"));
    const store = useAuthStore();

    const result = await store.login({ email: user.email, password: "salah" });

    expect(result.ok).toBe(false);
    expect(store.isLoggedIn).toBe(false);
    expect(notifyResult).toHaveBeenCalledWith(expect.anything(), undefined);
  });

  it("register berhasil dan gagal", async () => {
    vi.mocked(authApi.register).mockResolvedValueOnce(okResponse({ user, token: "jwt2" }));
    const store = useAuthStore();
    const payload = { name: "Budi", email: user.email, phone: null, password: "Rahasia123" };

    expect((await store.register(payload)).ok).toBe(true);
    expect(store.isAuthRegister).toBe(false);
    expect(store.token).toBe("jwt2");
    expect(notifyResult).toHaveBeenLastCalledWith(expect.anything(), "Akun berhasil dibuat");

    store.logout();
    vi.mocked(authApi.register).mockReturnValueOnce(rejectWith(409, "Email sudah terdaftar"));
    expect((await store.register(payload)).ok).toBe(false);
    expect(store.isLoggedIn).toBe(false);
  });
});

describe("refreshProfile dan logout", () => {
  it("memperbarui pengguna dari server", async () => {
    vi.mocked(userApi.me).mockResolvedValue(okResponse({ ...user, name: "Budi Baru" }));
    const store = useAuthStore();
    store.startSession("t", user);

    await store.refreshProfile();

    expect(store.user?.name).toBe("Budi Baru");
  });

  it("menghapus sesi saat token tidak berlaku, tetapi mempertahankannya pada error lain", async () => {
    const store = useAuthStore();
    store.startSession("t", user);

    vi.mocked(userApi.me).mockReturnValueOnce(rejectWith(500, "Server error"));
    await store.refreshProfile();
    expect(store.isLoggedIn).toBe(true);

    vi.mocked(userApi.me).mockReturnValueOnce(rejectWith(401, "Token tidak valid"));
    await store.refreshProfile();
    expect(store.isLoggedIn).toBe(false);
  });

  it("logout membersihkan token dan data pengguna", () => {
    const store = useAuthStore();
    store.startSession("t", user);

    store.logout();

    expect(getAccessToken()).toBeNull();
    expect(localStorage.getItem("bengkelku_user")).toBeNull();
    expect(store.user).toBeNull();
  });
});
