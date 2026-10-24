import { defineStore } from "pinia";
import { runApi } from "~/helpers/apiHelper";
import { notifyResult } from "~/helpers/actionHelper";
import { statsApi } from "../api/statsApi";
import type { Dashboard } from "../types";

interface StatsState {
  dashboard: Dashboard | null;
  isDashboardLoading: boolean;
}

export const useStatsStore = defineStore("stats", {
  state: (): StatsState => ({ dashboard: null, isDashboardLoading: false }),

  actions: {
    async fetchDashboard() {
      this.isDashboardLoading = true;
      const result = await runApi(() => statsApi.dashboard());
      this.isDashboardLoading = false;

      if (result.ok) this.dashboard = result.data;
      else notifyResult(result);
      return result;
    },
  },
});
