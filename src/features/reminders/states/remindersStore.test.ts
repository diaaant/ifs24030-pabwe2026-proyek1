import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../api/reminderApi", () => ({ reminderApi: { list: vi.fn() } }));
vi.mock("~/helpers/actionHelper", () => ({ notifyResult: vi.fn() }));

import { createMockPinia, okResponse, rejectWith } from "~/test-utils";
import { notifyResult } from "~/helpers/actionHelper";
import { reminderApi } from "../api/reminderApi";
import { useRemindersStore } from "./remindersStore";
import type { Reminder } from "../types";

const make = (status: Reminder["status"]) => ({ vehicle_id: 1, status }) as Reminder;

beforeEach(() => {
  vi.clearAllMocks();
  createMockPinia({});
});

describe("remindersStore", () => {
  it("memuat pengingat dan menyaring yang perlu tindakan", async () => {
    vi.mocked(reminderApi.list).mockResolvedValue(okResponse([make("overdue"), make("soon"), make("ok"), make("no_history")]));
    const store = useRemindersStore();

    await store.fetchReminders();

    expect(store.reminders).toHaveLength(4);
    expect(store.dueReminders.map((item) => item.status)).toEqual(["overdue", "soon"]);
    expect(store.isRemindersLoading).toBe(false);
  });

  it("melaporkan kegagalan", async () => {
    vi.mocked(reminderApi.list).mockReturnValue(rejectWith(500, "Gagal"));

    await useRemindersStore().fetchReminders("overdue");

    expect(notifyResult).toHaveBeenCalledTimes(1);
  });
});
