import { apiRequest } from "~/helpers/apiHelper";
import type { ServiceRecord } from "~/features/history/types";
import type { Vehicle, VehiclePayload, VehicleQuery } from "../types";

export const vehicleApi = {
  list: (query: VehicleQuery = {}) => apiRequest<Vehicle[]>("/vehicles", { query }),

  get: (id: number) => apiRequest<Vehicle>(`/vehicles/${id}`),

  create: (payload: VehiclePayload) => apiRequest<Vehicle>("/vehicles", { method: "POST", body: payload }),

  update: (id: number, payload: VehiclePayload) =>
    apiRequest<Vehicle>(`/vehicles/${id}`, { method: "PUT", body: payload }),

  remove: (id: number) => apiRequest<null>(`/vehicles/${id}`, { method: "DELETE" }),

  history: (id: number) => apiRequest<ServiceRecord[]>(`/vehicles/${id}/history`),
};
