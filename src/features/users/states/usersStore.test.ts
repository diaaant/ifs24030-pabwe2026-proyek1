import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../api/userApi", () => ({ userApi: { list: vi.fn(), updateMe: vi.fn(), changePassword: vi.fn() } }));
vi.mock("~/helpers/actionHelper", () => ({ notifyResult: vi.fn() }));

import { createMockPinia, okResponse, rejectWith } from "~/test-utils";
import { notifyResult } from "~/helpers/actionHelper";
import { useAuthStore } from "~/features/auth/states/authStore";
import { userApi } from "../api/userApi";
import { useUsersStore } from "./usersStore";

const user = { id: 1, name: "Budi", email: "b@x.id", phone: null, role: "customer" as const, created_at: "2026-10-01" };
const meta = { page: 1, limit: 10, total: 1, totalPages: 1 };

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  createMockPinia({});
});

describe("usersStore", () => {
  it("memuat daftar pengguna", async () => {
    vi.mocked(userApi.list).mockResolvedValue(okResponse([user], meta));
    const store = useUsersStore();

    await store.fetchUsers({ page: 1 });

    expect(store.users).toEqual([user]);
    expect(store.meta).toEqual(meta);
    expect(store.isUsersLoading).toBe(false);
  });

  it("menyimpan meta null bila API tidak mengirimnya, dan melaporkan kegagalan", async () => {
    vi.mocked(userApi.list).mockResolvedValueOnce(okResponse([user]));
    const store = useUsersStore();
    await store.fetchUsers();
    expect(store.meta).toBeNull();

    vi.mocked(userApi.list).mockReturnValueOnce(rejectWith(403, "Dilarang"));
    await store.fetchUsers();
    expect(notifyResult).toHaveBeenCalledWith(expect.objectContaining({ ok: false }));
  });

  it("memperbarui profil dan menyinkronkan sesi login", async () => {
    vi.mocked(userApi.updateMe).mockResolvedValue(okResponse({ ...user, name: "Nama Baru" }));
    const store = useUsersStore();

    await store.updateProfile({ name: "Nama Baru", phone: null });

    expect(useAuthStore().user?.name).toBe("Nama Baru");
    expect(store.isProfileSaving).toBe(false);
    expect(notifyResult).toHaveBeenCalledWith(expect.anything(), "Profil diperbarui");
  });

  it("tidak mengubah sesi saat pembaruan profil gagal", async () => {
    vi.mocked(userApi.updateMe).mockReturnValue(rejectWith(422, "Validasi gagal", [{ field: "name", message: "Terlalu pendek" }]));

    const result = await useUsersStore().updateProfile({ name: "A", phone: null });

    expect(result.ok).toBe(false);
    expect(useAuthStore().user).toBeNull();
  });

  it("mengubah kata sandi", async () => {
    vi.mocked(userApi.changePassword).mockResolvedValue(okResponse(null));

    const result = await useUsersStore().changePassword({ current_password: "a", new_password: "b" });

    expect(result.ok).toBe(true);
    expect(notifyResult).toHaveBeenCalledWith(expect.anything(), "Kata sandi diubah");
  });
});
