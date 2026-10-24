import { apiRequest } from "~/helpers/apiHelper";
import type {
  Availability,
  Booking,
  BookingPayload,
  BookingQuery,
  CompletePayload,
  StatusChange,
} from "../types";
import type { ServiceRecord } from "~/features/history/types";

export const bookingApi = {
  list: (query: BookingQuery = {}) => apiRequest<Booking[]>("/bookings", { query }),

  get: (id: number) => apiRequest<Booking>(`/bookings/${id}`),

  availability: (date: string) => apiRequest<Availability>("/bookings/availability", { query: { date } }),

  create: (payload: BookingPayload) => apiRequest<Booking>("/bookings", { method: "POST", body: payload }),

  cancel: (id: number) => apiRequest<Booking>(`/bookings/${id}/cancel`, { method: "PATCH" }),

  changeStatus: (id: number, status: StatusChange, adminNote?: string | null) =>
    apiRequest<Booking>(`/bookings/${id}/status`, {
      method: "PATCH",
      body: { status, admin_note: adminNote ?? null },
    }),

  complete: (id: number, payload: CompletePayload) =>
    apiRequest<{ booking: Booking; history: ServiceRecord }>(`/bookings/${id}/complete`, {
      method: "POST",
      body: payload,
    }),
};
