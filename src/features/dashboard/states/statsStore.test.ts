import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../api/statsApi", () => ({ statsApi: { dashboard: vi.fn() } }));
vi.mock("~/helpers/actionHelper", () => ({ notifyResult: vi.fn() }));

import { createMockPinia, okResponse, rejectWith } from "~/test-utils";
import { notifyResult } from "~/helpers/actionHelper";
import { statsApi } from "../api/statsApi";
import { useStatsStore } from "./statsStore";
import type { Dashboard } from "../types";

beforeEach(() => {
  vi.clearAllMocks();
  createMockPinia({});
});

describe("statsStore", () => {
  it("memuat ringkasan dashboard", async () => {
    const dashboard = { role: "admin" } as Dashboard;
    vi.mocked(statsApi.dashboard).mockResolvedValue(okResponse(dashboard));
    const store = useStatsStore();

    await store.fetchDashboard();

    expect(store.dashboard).toEqual(dashboard);
    expect(store.isDashboardLoading).toBe(false);
  });

  it("melaporkan kegagalan", async () => {
    vi.mocked(statsApi.dashboard).mockReturnValue(rejectWith(500, "Gagal"));

    await useStatsStore().fetchDashboard();

    expect(notifyResult).toHaveBeenCalledTimes(1);
  });
});
