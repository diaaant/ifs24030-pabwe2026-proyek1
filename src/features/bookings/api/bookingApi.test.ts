import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("~/helpers/apiHelper", () => ({ apiRequest: vi.fn() }));

import { apiRequest } from "~/helpers/apiHelper";
import { bookingApi } from "./bookingApi";

const booking = { vehicle_id: 1, service_id: 2, booking_date: "2026-11-02", time_slot: "09:00", odometer: null, complaint: null };
const complete = { odometer: 100, work_done: "Ganti oli", parts_cost: 1, labor_cost: 2, notes: null };

beforeEach(() => vi.clearAllMocks());

describe("bookingApi", () => {
  it("memanggil endpoint booking", () => {
    bookingApi.list({ status: "pending" });
    bookingApi.list();
    bookingApi.get(5);
    bookingApi.availability("2026-11-02");
    bookingApi.create(booking);
    bookingApi.cancel(5);
    bookingApi.changeStatus(5, "confirmed", "Datang tepat waktu");
    bookingApi.changeStatus(5, "in_progress");
    bookingApi.complete(5, complete);

    expect(apiRequest).toHaveBeenNthCalledWith(1, "/bookings", { query: { status: "pending" } });
    expect(apiRequest).toHaveBeenNthCalledWith(2, "/bookings", { query: {} });
    expect(apiRequest).toHaveBeenNthCalledWith(3, "/bookings/5");
    expect(apiRequest).toHaveBeenNthCalledWith(4, "/bookings/availability", { query: { date: "2026-11-02" } });
    expect(apiRequest).toHaveBeenNthCalledWith(5, "/bookings", { method: "POST", body: booking });
    expect(apiRequest).toHaveBeenNthCalledWith(6, "/bookings/5/cancel", { method: "PATCH" });
    expect(apiRequest).toHaveBeenNthCalledWith(7, "/bookings/5/status", { method: "PATCH", body: { status: "confirmed", admin_note: "Datang tepat waktu" } });
    expect(apiRequest).toHaveBeenNthCalledWith(8, "/bookings/5/status", { method: "PATCH", body: { status: "in_progress", admin_note: null } });
    expect(apiRequest).toHaveBeenNthCalledWith(9, "/bookings/5/complete", { method: "POST", body: complete });
  });
});
