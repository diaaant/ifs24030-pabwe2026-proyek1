import type { VehicleType } from "~/features/vehicles/types";

export type BookingStatus = "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";

export interface Booking {
  id: number;
  code: string;
  user_id: number;
  vehicle_id: number;
  service_id: number;
  booking_date: string;
  time_slot: string;
  odometer: number | null;
  complaint: string | null;
  estimated_price: number;
  status: BookingStatus;
  admin_note: string | null;
  created_at: string;
  plate_number: string;
  vehicle_brand: string;
  vehicle_model: string;
  vehicle_type: VehicleType;
  vehicle_odometer: number;
  service_name: string;
  service_duration: number;
  customer_name: string;
  customer_phone: string | null;
}

export interface BookingPayload {
  vehicle_id: number;
  service_id: number;
  booking_date: string;
  time_slot: string;
  odometer: number | null;
  complaint: string | null;
}

export interface CompletePayload {
  odometer: number;
  work_done: string;
  parts_cost: number;
  labor_cost: number;
  notes: string | null;
}

export interface Slot {
  time: string;
  capacity: number;
  booked: number;
  available: number;
}

export interface Availability {
  date: string;
  closed: boolean;
  slots: Slot[];
}

export interface BookingQuery {
  page?: number;
  limit?: number;
  status?: BookingStatus | "";
  date?: string;
  search?: string;
}

export type StatusChange = Extract<BookingStatus, "confirmed" | "in_progress" | "cancelled">;
