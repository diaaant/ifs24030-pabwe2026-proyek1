import type { VehicleType } from "~/features/vehicles/types";

export interface ServiceRecord {
  id: number;
  invoice_number: string;
  booking_id: number;
  booking_code: string;
  vehicle_id: number;
  user_id: number;
  service_date: string;
  odometer: number;
  work_done: string;
  parts_cost: number;
  labor_cost: number;
  total_cost: number;
  next_service_date: string | null;
  next_service_km: number | null;
  notes: string | null;
  complaint: string | null;
  plate_number: string;
  vehicle_brand: string;
  vehicle_model: string;
  vehicle_type: VehicleType;
  service_name: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
}

export interface HistoryQuery {
  page?: number;
  limit?: number;
  vehicle_id?: number;
}
