import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("~/helpers/apiHelper", () => ({ apiRequest: vi.fn() }));

import { apiRequest } from "~/helpers/apiHelper";
import { userApi } from "./userApi";

beforeEach(() => vi.clearAllMocks());

describe("userApi", () => {
  it("memanggil endpoint profil dan daftar pengguna", () => {
    userApi.me();
    userApi.updateMe({ name: "Budi", phone: null });
    userApi.changePassword({ current_password: "a", new_password: "b" });
    userApi.list({ page: 2 });
    userApi.list();

    expect(apiRequest).toHaveBeenNthCalledWith(1, "/users/me");
    expect(apiRequest).toHaveBeenNthCalledWith(2, "/users/me", { method: "PUT", body: { name: "Budi", phone: null } });
    expect(apiRequest).toHaveBeenNthCalledWith(3, "/users/me/password", { method: "PUT", body: { current_password: "a", new_password: "b" } });
    expect(apiRequest).toHaveBeenNthCalledWith(4, "/users", { query: { page: 2 } });
    expect(apiRequest).toHaveBeenNthCalledWith(5, "/users", { query: {} });
  });
});
