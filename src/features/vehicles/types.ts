export type VehicleType = "motor" | "mobil";

export interface Vehicle {
  id: number;
  user_id: number;
  owner_name: string;
  plate_number: string;
  brand: string;
  model: string;
  year: number;
  vehicle_type: VehicleType;
  color: string | null;
  odometer: number;
  created_at: string;
}

export interface VehiclePayload {
  plate_number: string;
  brand: string;
  model: string;
  year: number;
  vehicle_type: VehicleType;
  color: string | null;
  odometer: number;
}

export interface VehicleQuery {
  page?: number;
  limit?: number;
  search?: string;
  vehicle_type?: VehicleType | "";
}
