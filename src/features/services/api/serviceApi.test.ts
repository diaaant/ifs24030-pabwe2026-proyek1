import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("~/helpers/apiHelper", () => ({ apiRequest: vi.fn() }));

import { apiRequest } from "~/helpers/apiHelper";
import { serviceApi } from "./serviceApi";

const payload = { name: "Ganti Oli", description: null, vehicle_type: "motor" as const, price: 65000, duration_minutes: 30, interval_days: 60, interval_km: 2000, is_active: true };

beforeEach(() => vi.clearAllMocks());

describe("serviceApi", () => {
  it("memanggil endpoint katalog layanan", () => {
    serviceApi.list({ vehicle_type: "motor" });
    serviceApi.list();
    serviceApi.create(payload);
    serviceApi.update(2, payload);
    serviceApi.remove(2);

    expect(apiRequest).toHaveBeenNthCalledWith(1, "/services", { query: { vehicle_type: "motor" } });
    expect(apiRequest).toHaveBeenNthCalledWith(2, "/services", { query: {} });
    expect(apiRequest).toHaveBeenNthCalledWith(3, "/services", { method: "POST", body: payload });
    expect(apiRequest).toHaveBeenNthCalledWith(4, "/services/2", { method: "PUT", body: payload });
    expect(apiRequest).toHaveBeenNthCalledWith(5, "/services/2", { method: "DELETE" });
  });
});
