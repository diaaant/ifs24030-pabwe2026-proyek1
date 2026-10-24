import { apiRequest } from "~/helpers/apiHelper";
import type { Dashboard } from "../types";

export const statsApi = {
  dashboard: () => apiRequest<Dashboard>("/stats/dashboard"),
};
