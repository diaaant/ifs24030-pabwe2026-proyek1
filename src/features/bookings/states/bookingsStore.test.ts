import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../api/bookingApi", () => ({
  bookingApi: {
    list: vi.fn(), get: vi.fn(), availability: vi.fn(), create: vi.fn(),
    cancel: vi.fn(), changeStatus: vi.fn(), complete: vi.fn(),
  },
}));
vi.mock("~/helpers/actionHelper", () => ({ notifyResult: vi.fn() }));

import { createMockPinia, okResponse, rejectWith } from "~/test-utils";
import { notifyResult } from "~/helpers/actionHelper";
import { bookingApi } from "../api/bookingApi";
import { useBookingsStore } from "./bookingsStore";
import type { Availability, Booking, BookingPayload, CompletePayload } from "../types";

const booking = { id: 1, code: "BK-1" } as Booking;
const meta = { page: 1, limit: 10, total: 1, totalPages: 1 };

beforeEach(() => {
  vi.clearAllMocks();
  createMockPinia({});
});

describe("bookingsStore", () => {
  it("memuat daftar booking", async () => {
    vi.mocked(bookingApi.list).mockResolvedValueOnce(okResponse([booking], meta));
    const store = useBookingsStore();

    await store.fetchBookings({ status: "pending" });
    expect(store.bookings).toEqual([booking]);
    expect(store.meta).toEqual(meta);

    vi.mocked(bookingApi.list).mockResolvedValueOnce(okResponse([booking]));
    await store.fetchBookings();
    expect(store.meta).toBeNull();

    vi.mocked(bookingApi.list).mockReturnValueOnce(rejectWith(500, "Gagal"));
    await store.fetchBookings();
    expect(notifyResult).toHaveBeenCalledTimes(1);
    expect(store.isBookingsLoading).toBe(false);
  });

  it("memuat detail booking dan mengosongkannya saat gagal", async () => {
    vi.mocked(bookingApi.get).mockResolvedValueOnce(okResponse(booking));
    const store = useBookingsStore();

    await store.fetchBooking(1);
    expect(store.booking).toEqual(booking);

    vi.mocked(bookingApi.get).mockReturnValueOnce(rejectWith(404, "Tidak ada"));
    await store.fetchBooking(2);
    expect(store.booking).toBeNull();
    expect(notifyResult).toHaveBeenCalledTimes(1);
  });

  it("memuat ketersediaan slot", async () => {
    const availability: Availability = { date: "2026-11-02", closed: false, slots: [] };
    vi.mocked(bookingApi.availability).mockResolvedValueOnce(okResponse(availability));
    const store = useBookingsStore();

    await store.fetchAvailability("2026-11-02");
    expect(store.availability).toEqual(availability);

    vi.mocked(bookingApi.availability).mockReturnValueOnce(rejectWith(422, "Tanggal tidak valid"));
    await store.fetchAvailability("x");
    expect(store.availability).toBeNull();
  });

  it("membuat, membatalkan, mengubah status, dan menyelesaikan booking", async () => {
    vi.mocked(bookingApi.create).mockResolvedValue(okResponse(booking));
    vi.mocked(bookingApi.cancel).mockResolvedValue(okResponse(booking));
    vi.mocked(bookingApi.changeStatus).mockResolvedValue(okResponse(booking));
    vi.mocked(bookingApi.complete).mockResolvedValue(okResponse({ booking, history: {} as never }));
    const store = useBookingsStore();

    await store.createBooking({} as BookingPayload);
    await store.cancelBooking(1);
    await store.changeStatus(1, "confirmed", "ok");
    await store.completeBooking(1, {} as CompletePayload);

    expect(store.isBookingSaving).toBe(false);
    expect(bookingApi.changeStatus).toHaveBeenCalledWith(1, "confirmed", "ok");
    expect(notifyResult).toHaveBeenNthCalledWith(1, expect.anything(), "Booking berhasil dibuat");
    expect(notifyResult).toHaveBeenNthCalledWith(2, expect.anything(), "Booking dibatalkan");
    expect(notifyResult).toHaveBeenNthCalledWith(3, expect.anything(), "Status booking diperbarui");
    expect(notifyResult).toHaveBeenNthCalledWith(4, expect.anything(), "Servis selesai dan riwayat tersimpan");
  });
});
