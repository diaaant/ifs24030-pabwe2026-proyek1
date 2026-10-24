import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("~/helpers/apiHelper", () => ({ apiRequest: vi.fn() }));

import { apiRequest } from "~/helpers/apiHelper";
import { historyApi } from "./historyApi";

beforeEach(() => vi.clearAllMocks());

describe("historyApi", () => {
  it("memanggil endpoint riwayat servis", () => {
    historyApi.list({ vehicle_id: 2 });
    historyApi.list();
    historyApi.get(9);

    expect(apiRequest).toHaveBeenNthCalledWith(1, "/history", { query: { vehicle_id: 2 } });
    expect(apiRequest).toHaveBeenNthCalledWith(2, "/history", { query: {} });
    expect(apiRequest).toHaveBeenNthCalledWith(3, "/history/9");
  });
});
