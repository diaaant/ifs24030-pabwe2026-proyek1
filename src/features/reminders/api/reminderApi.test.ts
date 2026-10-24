import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("~/helpers/apiHelper", () => ({ apiRequest: vi.fn() }));

import { apiRequest } from "~/helpers/apiHelper";
import { reminderApi } from "./reminderApi";

beforeEach(() => vi.clearAllMocks());

describe("reminderApi", () => {
  it("memanggil endpoint pengingat dengan filter status opsional", () => {
    reminderApi.list("overdue");
    reminderApi.list();

    expect(apiRequest).toHaveBeenNthCalledWith(1, "/reminders", { query: { status: "overdue" } });
    expect(apiRequest).toHaveBeenNthCalledWith(2, "/reminders", { query: { status: undefined } });
  });
});
