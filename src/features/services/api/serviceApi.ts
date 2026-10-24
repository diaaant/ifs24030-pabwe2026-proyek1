import { apiRequest } from "~/helpers/apiHelper";
import type { Service, ServicePayload, ServiceQuery } from "../types";

export const serviceApi = {
  list: (query: ServiceQuery = {}) => apiRequest<Service[]>("/services", { query }),

  create: (payload: ServicePayload) => apiRequest<Service>("/services", { method: "POST", body: payload }),

  update: (id: number, payload: ServicePayload) =>
    apiRequest<Service>(`/services/${id}`, { method: "PUT", body: payload }),

  remove: (id: number) => apiRequest<{ deactivated: boolean }>(`/services/${id}`, { method: "DELETE" }),
};
