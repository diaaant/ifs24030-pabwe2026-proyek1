import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../api/historyApi", () => ({ historyApi: { list: vi.fn(), get: vi.fn() } }));
vi.mock("~/helpers/actionHelper", () => ({ notifyResult: vi.fn() }));

import { createMockPinia, okResponse, rejectWith } from "~/test-utils";
import { notifyResult } from "~/helpers/actionHelper";
import { historyApi } from "../api/historyApi";
import { useHistoryStore } from "./historyStore";
import type { ServiceRecord } from "../types";

const record = { id: 1, invoice_number: "INV-1" } as ServiceRecord;
const meta = { page: 1, limit: 10, total: 1, totalPages: 1 };

beforeEach(() => {
  vi.clearAllMocks();
  createMockPinia({});
});

describe("historyStore", () => {
  it("memuat daftar riwayat", async () => {
    vi.mocked(historyApi.list).mockResolvedValueOnce(okResponse([record], meta));
    const store = useHistoryStore();

    await store.fetchHistory({ vehicle_id: 1 });
    expect(store.records).toEqual([record]);
    expect(store.meta).toEqual(meta);

    vi.mocked(historyApi.list).mockResolvedValueOnce(okResponse([record]));
    await store.fetchHistory();
    expect(store.meta).toBeNull();

    vi.mocked(historyApi.list).mockReturnValueOnce(rejectWith(500, "Gagal"));
    await store.fetchHistory();
    expect(notifyResult).toHaveBeenCalledTimes(1);
    expect(store.isHistoryLoading).toBe(false);
  });

  it("memuat detail riwayat dan mengosongkannya saat gagal", async () => {
    vi.mocked(historyApi.get).mockResolvedValueOnce(okResponse(record));
    const store = useHistoryStore();

    await store.fetchRecord(1);
    expect(store.record).toEqual(record);

    vi.mocked(historyApi.get).mockReturnValueOnce(rejectWith(404, "Tidak ada"));
    await store.fetchRecord(2);
    expect(store.record).toBeNull();
  });
});
