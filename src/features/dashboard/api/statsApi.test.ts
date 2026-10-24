import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("~/helpers/apiHelper", () => ({ apiRequest: vi.fn() }));

import { apiRequest } from "~/helpers/apiHelper";
import { statsApi } from "./statsApi";

beforeEach(() => vi.clearAllMocks());

describe("statsApi", () => {
  it("memanggil endpoint ringkasan dashboard", () => {
    statsApi.dashboard();
    expect(apiRequest).toHaveBeenCalledWith("/stats/dashboard");
  });
});
