import { defineStore } from "pinia";
import { runApi, type PageMeta } from "~/helpers/apiHelper";
import { notifyResult } from "~/helpers/actionHelper";
import { bookingApi } from "../api/bookingApi";
import type {
  Availability,
  Booking,
  BookingPayload,
  BookingQuery,
  CompletePayload,
  StatusChange,
} from "../types";

interface BookingsState {
  bookings: Booking[];
  meta: PageMeta | null;
  booking: Booking | null;
  availability: Availability | null;
  isBookingsLoading: boolean;
  isBookingSaving: boolean;
}

export const useBookingsStore = defineStore("bookings", {
  state: (): BookingsState => ({
    bookings: [],
    meta: null,
    booking: null,
    availability: null,
    isBookingsLoading: false,
    isBookingSaving: false,
  }),

  actions: {
    async fetchBookings(query: BookingQuery = {}) {
      this.isBookingsLoading = true;
      const result = await runApi(() => bookingApi.list(query));
      this.isBookingsLoading = false;

      if (result.ok) {
        this.bookings = result.data;
        this.meta = result.meta ?? null;
      } else {
        notifyResult(result);
      }
      return result;
    },

    async fetchBooking(id: number) {
      this.isBookingsLoading = true;
      const result = await runApi(() => bookingApi.get(id));
      this.isBookingsLoading = false;

      this.booking = result.ok ? result.data : null;
      if (!result.ok) notifyResult(result);
      return result;
    },

    async fetchAvailability(date: string) {
      const result = await runApi(() => bookingApi.availability(date));
      this.availability = result.ok ? result.data : null;
      if (!result.ok) notifyResult(result);
      return result;
    },

    async createBooking(payload: BookingPayload) {
      this.isBookingSaving = true;
      const result = await runApi(() => bookingApi.create(payload));
      this.isBookingSaving = false;

      notifyResult(result, "Booking berhasil dibuat");
      return result;
    },

    async cancelBooking(id: number) {
      const result = await runApi(() => bookingApi.cancel(id));
      notifyResult(result, "Booking dibatalkan");
      return result;
    },

    async changeStatus(id: number, status: StatusChange, adminNote?: string | null) {
      const result = await runApi(() => bookingApi.changeStatus(id, status, adminNote));
      notifyResult(result, "Status booking diperbarui");
      return result;
    },

    async completeBooking(id: number, payload: CompletePayload) {
      this.isBookingSaving = true;
      const result = await runApi(() => bookingApi.complete(id, payload));
      this.isBookingSaving = false;

      notifyResult(result, "Servis selesai dan riwayat tersimpan");
      return result;
    },
  },
});
