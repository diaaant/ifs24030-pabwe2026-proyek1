<script setup lang="ts">
import { onMounted, reactive, watch } from "vue";
import { RouterLink } from "vue-router";
import { ReceiptText } from "lucide-vue-next";
import { formatDate, formatKm, formatRupiah } from "~/helpers/toolsHelper";
import { useAuthStore } from "~/features/auth/states/authStore";
import { useVehiclesStore } from "~/features/vehicles/states/vehiclesStore";
import PageHeader from "~/features/common/components/PageHeader.vue";
import EmptyState from "~/features/common/components/EmptyState.vue";
import LoadingState from "~/features/common/components/LoadingState.vue";
import PaginationBar from "~/features/common/components/PaginationBar.vue";
import { useHistoryStore } from "../states/historyStore";

const auth = useAuthStore();
const store = useHistoryStore();
const vehicles = useVehiclesStore();

const filters = reactive({ page: 1, vehicle_id: 0 });

const load = () => store.fetchHistory({ page: filters.page, limit: 8, vehicle_id: filters.vehicle_id || undefined });

onMounted(() => {
  vehicles.fetchVehicles({ limit: 100 });
  load();
});

watch(() => filters.vehicle_id, () => {
  filters.page = 1;
  load();
});

const goToPage = (page: number) => {
  filters.page = page;
  load();
};
</script>

<template>
  <PageHeader title="Riwayat servis" subtitle="Catatan perawatan setiap kendaraan, lengkap dengan invoice yang dapat dicetak.">
    <select v-model.number="filters.vehicle_id" class="input w-auto" aria-label="Filter kendaraan">
      <option :value="0">Semua kendaraan</option>
      <option v-for="vehicle in vehicles.vehicles" :key="vehicle.id" :value="vehicle.id">{{ vehicle.plate_number }}</option>
    </select>
  </PageHeader>

  <LoadingState v-if="store.isHistoryLoading && !store.records.length" />
  <EmptyState v-else-if="!store.records.length" title="Belum ada riwayat servis" description="Riwayat muncul setelah booking servis selesai dikerjakan." />

  <ul v-else class="space-y-3">
    <li v-for="record in store.records" :key="record.id" class="card p-4 sm:p-5">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div class="min-w-0">
          <p class="text-xs font-semibold tabular-nums text-ink/50">{{ record.invoice_number }}</p>
          <p class="text-base font-bold text-petrol-900">{{ record.service_name }}</p>
          <p class="text-sm text-ink/65">{{ record.plate_number }}, {{ formatDate(record.service_date) }}, {{ formatKm(record.odometer) }}</p>
          <p v-if="auth.isAdmin" class="text-sm text-ink/65">Pelanggan: {{ record.customer_name }}</p>
        </div>
        <p class="display text-xl text-petrol-900">{{ formatRupiah(record.total_cost) }}</p>
      </div>
      <p class="mt-3 text-sm text-ink/75">{{ record.work_done }}</p>
      <div class="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3 text-sm">
        <p v-if="record.next_service_date || record.next_service_km" class="text-ink/60">
          Servis berikutnya: {{ [record.next_service_date ? formatDate(record.next_service_date) : null, record.next_service_km ? formatKm(record.next_service_km) : null].filter(Boolean).join(" atau ") }}
        </p>
        <RouterLink :to="`/history/${record.id}`" class="ml-auto inline-flex items-center gap-1 font-semibold text-petrol-700"><ReceiptText :size="14" /> Lihat invoice</RouterLink>
      </div>
    </li>
  </ul>

  <PaginationBar v-if="store.meta" :meta="store.meta" @change="goToPage" />
</template>
