import { apiRequest } from "~/helpers/apiHelper";
import type { HistoryQuery, ServiceRecord } from "../types";

export const historyApi = {
  list: (query: HistoryQuery = {}) => apiRequest<ServiceRecord[]>("/history", { query }),

  get: (id: number) => apiRequest<ServiceRecord>(`/history/${id}`),
};
