import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("~/helpers/apiHelper", () => ({ apiRequest: vi.fn() }));

import { apiRequest } from "~/helpers/apiHelper";
import { vehicleApi } from "./vehicleApi";

const payload = { plate_number: "BK 1 A", brand: "Honda", model: "Beat", year: 2021, vehicle_type: "motor" as const, color: null, odometer: 0 };

beforeEach(() => vi.clearAllMocks());

describe("vehicleApi", () => {
  it("memanggil endpoint CRUD dan riwayat kendaraan", () => {
    vehicleApi.list({ search: "bk" });
    vehicleApi.list();
    vehicleApi.get(3);
    vehicleApi.create(payload);
    vehicleApi.update(3, payload);
    vehicleApi.remove(3);
    vehicleApi.history(3);

    expect(apiRequest).toHaveBeenNthCalledWith(1, "/vehicles", { query: { search: "bk" } });
    expect(apiRequest).toHaveBeenNthCalledWith(2, "/vehicles", { query: {} });
    expect(apiRequest).toHaveBeenNthCalledWith(3, "/vehicles/3");
    expect(apiRequest).toHaveBeenNthCalledWith(4, "/vehicles", { method: "POST", body: payload });
    expect(apiRequest).toHaveBeenNthCalledWith(5, "/vehicles/3", { method: "PUT", body: payload });
    expect(apiRequest).toHaveBeenNthCalledWith(6, "/vehicles/3", { method: "DELETE" });
    expect(apiRequest).toHaveBeenNthCalledWith(7, "/vehicles/3/history");
  });
});
