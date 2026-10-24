import { defineStore } from "pinia";
import { runApi } from "~/helpers/apiHelper";
import { notifyResult } from "~/helpers/actionHelper";
import { serviceApi } from "../api/serviceApi";
import type { Service, ServicePayload, ServiceQuery } from "../types";

interface ServicesState {
  services: Service[];
  isServicesLoading: boolean;
  isServiceSaving: boolean;
}

export const useServicesStore = defineStore("services", {
  state: (): ServicesState => ({ services: [], isServicesLoading: false, isServiceSaving: false }),

  actions: {
    async fetchServices(query: ServiceQuery = {}) {
      this.isServicesLoading = true;
      const result = await runApi(() => serviceApi.list(query));
      this.isServicesLoading = false;

      if (result.ok) this.services = result.data;
      else notifyResult(result);
      return result;
    },

    async addService(payload: ServicePayload) {
      this.isServiceSaving = true;
      const result = await runApi(() => serviceApi.create(payload));
      this.isServiceSaving = false;

      notifyResult(result, "Layanan ditambahkan");
      return result;
    },

    async changeService(id: number, payload: ServicePayload) {
      this.isServiceSaving = true;
      const result = await runApi(() => serviceApi.update(id, payload));
      this.isServiceSaving = false;

      notifyResult(result, "Layanan diperbarui");
      return result;
    },

    async removeService(id: number) {
      const result = await runApi(() => serviceApi.remove(id));
      notifyResult(result, result.ok ? result.message : undefined);
      return result;
    },
  },
});
