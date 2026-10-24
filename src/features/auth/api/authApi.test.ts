import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("~/helpers/apiHelper", () => ({ apiRequest: vi.fn() }));

import { apiRequest } from "~/helpers/apiHelper";
import { authApi } from "./authApi";

beforeEach(() => vi.clearAllMocks());

describe("authApi", () => {
  it("login dan register tidak memakai token", () => {
    const login = { email: "a@b.id", password: "x" };
    const register = { name: "A", email: "a@b.id", phone: null, password: "x" };

    authApi.login(login);
    authApi.register(register);

    expect(apiRequest).toHaveBeenNthCalledWith(1, "/auth/login", { method: "POST", body: login, auth: false });
    expect(apiRequest).toHaveBeenNthCalledWith(2, "/auth/register", { method: "POST", body: register, auth: false });
  });
});
