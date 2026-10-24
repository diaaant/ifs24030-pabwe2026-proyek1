import type { VehicleType } from "~/features/vehicles/types";

export type ReminderStatus = "overdue" | "soon" | "ok" | "no_history";

export interface Reminder {
  vehicle_id: number;
  user_id: number;
  owner_name: string;
  plate_number: string;
  brand: string;
  model: string;
  vehicle_type: VehicleType;
  odometer: number;
  last_service_date: string | null;
  last_service_name: string | null;
  next_service_date: string | null;
  next_service_km: number | null;
  status: ReminderStatus;
  days_left: number | null;
  km_left: number | null;
}
