export type ServiceVehicleType = "motor" | "mobil" | "semua";

export interface Service {
  id: number;
  name: string;
  description: string | null;
  vehicle_type: ServiceVehicleType;
  price: number;
  duration_minutes: number;
  interval_days: number | null;
  interval_km: number | null;
  is_active: boolean;
}

export type ServicePayload = Omit<Service, "id">;

export interface ServiceQuery {
  vehicle_type?: ServiceVehicleType | "";
  include_inactive?: "true" | "false";
}
