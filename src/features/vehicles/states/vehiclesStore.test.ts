import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../api/vehicleApi", () => ({
  vehicleApi: { list: vi.fn(), get: vi.fn(), history: vi.fn(), create: vi.fn(), update: vi.fn(), remove: vi.fn() },
}));
vi.mock("~/helpers/actionHelper", () => ({ notifyResult: vi.fn() }));

import { createMockPinia, okResponse, rejectWith } from "~/test-utils";
import { notifyResult } from "~/helpers/actionHelper";
import { vehicleApi } from "../api/vehicleApi";
import { useVehiclesStore } from "./vehiclesStore";
import type { Vehicle, VehiclePayload } from "../types";

const vehicle = { id: 1, plate_number: "BK 1 A" } as Vehicle;
const payload = { plate_number: "BK 1 A" } as VehiclePayload;
const meta = { page: 1, limit: 10, total: 1, totalPages: 1 };

beforeEach(() => {
  vi.clearAllMocks();
  createMockPinia({});
});

describe("vehiclesStore", () => {
  it("memuat daftar kendaraan", async () => {
    vi.mocked(vehicleApi.list).mockResolvedValueOnce(okResponse([vehicle], meta));
    const store = useVehiclesStore();

    await store.fetchVehicles({ search: "bk" });
    expect(store.vehicles).toEqual([vehicle]);
    expect(store.meta).toEqual(meta);
    expect(store.isVehiclesLoading).toBe(false);

    vi.mocked(vehicleApi.list).mockResolvedValueOnce(okResponse([vehicle]));
    await store.fetchVehicles();
    expect(store.meta).toBeNull();

    vi.mocked(vehicleApi.list).mockReturnValueOnce(rejectWith(500, "Gagal"));
    await store.fetchVehicles();
    expect(notifyResult).toHaveBeenCalledTimes(1);
  });

  it("memuat detail kendaraan beserta riwayatnya", async () => {
    vi.mocked(vehicleApi.get).mockResolvedValue(okResponse(vehicle));
    vi.mocked(vehicleApi.history).mockResolvedValue(okResponse([{ id: 9 } as never]));
    const store = useVehiclesStore();

    await store.fetchVehicle(1);

    expect(store.vehicle).toEqual(vehicle);
    expect(store.vehicleHistory).toHaveLength(1);
  });

  it("mengosongkan detail saat kendaraan tidak ditemukan", async () => {
    vi.mocked(vehicleApi.get).mockReturnValue(rejectWith(404, "Tidak ada"));
    vi.mocked(vehicleApi.history).mockReturnValue(rejectWith(404, "Tidak ada"));
    const store = useVehiclesStore();

    await store.fetchVehicle(2);

    expect(store.vehicle).toBeNull();
    expect(store.vehicleHistory).toEqual([]);
    expect(notifyResult).toHaveBeenCalledTimes(1);
  });

  it("menambah, mengubah, dan menghapus kendaraan", async () => {
    vi.mocked(vehicleApi.create).mockResolvedValue(okResponse(vehicle));
    vi.mocked(vehicleApi.update).mockResolvedValue(okResponse(vehicle));
    vi.mocked(vehicleApi.remove).mockResolvedValue(okResponse(null));
    const store = useVehiclesStore();

    expect((await store.addVehicle(payload)).ok).toBe(true);
    expect((await store.changeVehicle(1, payload)).ok).toBe(true);
    expect((await store.removeVehicle(1)).ok).toBe(true);
    expect(store.isVehicleSaving).toBe(false);
    expect(notifyResult).toHaveBeenNthCalledWith(1, expect.anything(), "Kendaraan ditambahkan");
    expect(notifyResult).toHaveBeenNthCalledWith(3, expect.anything(), "Kendaraan dihapus");
  });
});
