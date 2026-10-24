import { defineStore } from "pinia";
import { runApi, type PageMeta } from "~/helpers/apiHelper";
import { notifyResult } from "~/helpers/actionHelper";
import type { ServiceRecord } from "~/features/history/types";
import { vehicleApi } from "../api/vehicleApi";
import type { Vehicle, VehiclePayload, VehicleQuery } from "../types";

interface VehiclesState {
  vehicles: Vehicle[];
  meta: PageMeta | null;
  vehicle: Vehicle | null;
  vehicleHistory: ServiceRecord[];
  isVehiclesLoading: boolean;
  isVehicleSaving: boolean;
}

export const useVehiclesStore = defineStore("vehicles", {
  state: (): VehiclesState => ({
    vehicles: [],
    meta: null,
    vehicle: null,
    vehicleHistory: [],
    isVehiclesLoading: false,
    isVehicleSaving: false,
  }),

  actions: {
    async fetchVehicles(query: VehicleQuery = {}) {
      this.isVehiclesLoading = true;
      const result = await runApi(() => vehicleApi.list(query));
      this.isVehiclesLoading = false;

      if (result.ok) {
        this.vehicles = result.data;
        this.meta = result.meta ?? null;
      } else {
        notifyResult(result);
      }
      return result;
    },

    async fetchVehicle(id: number) {
      this.isVehiclesLoading = true;
      const [detail, history] = await Promise.all([
        runApi(() => vehicleApi.get(id)),
        runApi(() => vehicleApi.history(id)),
      ]);
      this.isVehiclesLoading = false;

      this.vehicle = detail.ok ? detail.data : null;
      this.vehicleHistory = history.ok ? history.data : [];
      if (!detail.ok) notifyResult(detail);
      return detail;
    },

    async addVehicle(payload: VehiclePayload) {
      this.isVehicleSaving = true;
      const result = await runApi(() => vehicleApi.create(payload));
      this.isVehicleSaving = false;

      notifyResult(result, "Kendaraan ditambahkan");
      return result;
    },

    async changeVehicle(id: number, payload: VehiclePayload) {
      this.isVehicleSaving = true;
      const result = await runApi(() => vehicleApi.update(id, payload));
      this.isVehicleSaving = false;

      notifyResult(result, "Kendaraan diperbarui");
      return result;
    },

    async removeVehicle(id: number) {
      const result = await runApi(() => vehicleApi.remove(id));
      notifyResult(result, "Kendaraan dihapus");
      return result;
    },
  },
});
