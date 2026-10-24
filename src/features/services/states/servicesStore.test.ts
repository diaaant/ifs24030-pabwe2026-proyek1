import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../api/serviceApi", () => ({ serviceApi: { list: vi.fn(), create: vi.fn(), update: vi.fn(), remove: vi.fn() } }));
vi.mock("~/helpers/actionHelper", () => ({ notifyResult: vi.fn() }));

import { createMockPinia, okResponse, rejectWith } from "~/test-utils";
import { notifyResult } from "~/helpers/actionHelper";
import { serviceApi } from "../api/serviceApi";
import { useServicesStore } from "./servicesStore";
import type { Service, ServicePayload } from "../types";

const service = { id: 1, name: "Ganti Oli" } as Service;
const payload = { name: "Ganti Oli" } as ServicePayload;

beforeEach(() => {
  vi.clearAllMocks();
  createMockPinia({});
});

describe("servicesStore", () => {
  it("memuat katalog layanan dan melaporkan kegagalan", async () => {
    vi.mocked(serviceApi.list).mockResolvedValueOnce(okResponse([service]));
    const store = useServicesStore();

    await store.fetchServices({ vehicle_type: "motor" });
    expect(store.services).toEqual([service]);
    expect(store.isServicesLoading).toBe(false);

    vi.mocked(serviceApi.list).mockReturnValueOnce(rejectWith(500, "Gagal"));
    await store.fetchServices();
    expect(notifyResult).toHaveBeenCalledTimes(1);
  });

  it("menambah dan mengubah layanan", async () => {
    vi.mocked(serviceApi.create).mockResolvedValue(okResponse(service));
    vi.mocked(serviceApi.update).mockResolvedValue(okResponse(service));
    const store = useServicesStore();

    await store.addService(payload);
    await store.changeService(1, payload);

    expect(store.isServiceSaving).toBe(false);
    expect(notifyResult).toHaveBeenNthCalledWith(1, expect.anything(), "Layanan ditambahkan");
    expect(notifyResult).toHaveBeenNthCalledWith(2, expect.anything(), "Layanan diperbarui");
  });

  it("menghapus layanan memakai pesan dari server saat sukses", async () => {
    vi.mocked(serviceApi.remove).mockResolvedValueOnce(okResponse({ deactivated: true }, undefined, "Dinonaktifkan"));
    const store = useServicesStore();

    const result = await store.removeService(1);
    expect(result.ok && result.data.deactivated).toBe(true);
    expect(notifyResult).toHaveBeenLastCalledWith(expect.anything(), "Dinonaktifkan");

    vi.mocked(serviceApi.remove).mockReturnValueOnce(rejectWith(404, "Tidak ada"));
    await store.removeService(9);
    expect(notifyResult).toHaveBeenLastCalledWith(expect.anything(), undefined);
  });
});
