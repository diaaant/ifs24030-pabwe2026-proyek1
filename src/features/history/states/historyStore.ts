import { defineStore } from "pinia";
import { runApi, type PageMeta } from "~/helpers/apiHelper";
import { notifyResult } from "~/helpers/actionHelper";
import { historyApi } from "../api/historyApi";
import type { HistoryQuery, ServiceRecord } from "../types";

interface HistoryState {
  records: ServiceRecord[];
  meta: PageMeta | null;
  record: ServiceRecord | null;
  isHistoryLoading: boolean;
}

export const useHistoryStore = defineStore("history", {
  state: (): HistoryState => ({ records: [], meta: null, record: null, isHistoryLoading: false }),

  actions: {
    async fetchHistory(query: HistoryQuery = {}) {
      this.isHistoryLoading = true;
      const result = await runApi(() => historyApi.list(query));
      this.isHistoryLoading = false;

      if (result.ok) {
        this.records = result.data;
        this.meta = result.meta ?? null;
      } else {
        notifyResult(result);
      }
      return result;
    },

    async fetchRecord(id: number) {
      this.isHistoryLoading = true;
      const result = await runApi(() => historyApi.get(id));
      this.isHistoryLoading = false;

      this.record = result.ok ? result.data : null;
      if (!result.ok) notifyResult(result);
      return result;
    },
  },
});
