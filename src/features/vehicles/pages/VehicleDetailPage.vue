<script setup lang="ts">
import { computed, onMounted } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { ArrowLeft, ReceiptText } from "lucide-vue-next";
import { formatDate, formatRupiah } from "~/helpers/toolsHelper";
import PageHeader from "~/features/common/components/PageHeader.vue";
import LoadingState from "~/features/common/components/LoadingState.vue";
import EmptyState from "~/features/common/components/EmptyState.vue";
import OdometerDisplay from "~/features/common/components/OdometerDisplay.vue";
import { useVehiclesStore } from "../states/vehiclesStore";

const route = useRoute();
const store = useVehiclesStore();
const vehicleId = computed(() => Number(route.params.vehicleId));

onMounted(() => store.fetchVehicle(vehicleId.value));
</script>

<template>
  <RouterLink to="/vehicles" class="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-petrol-700"><ArrowLeft :size="16" /> Semua kendaraan</RouterLink>

  <LoadingState v-if="store.isVehiclesLoading" />
  <EmptyState v-else-if="!store.vehicle" title="Kendaraan tidak ditemukan" description="Kendaraan mungkin sudah dihapus atau bukan milik Anda." />

  <template v-else>
    <PageHeader :title="store.vehicle.plate_number" :subtitle="`${store.vehicle.brand} ${store.vehicle.model}, ${store.vehicle.year}${store.vehicle.color ? `, ${store.vehicle.color}` : ''}`">
      <RouterLink :to="`/bookings/new?vehicle=${store.vehicle.id}`" class="btn-signal">Booking servis</RouterLink>
    </PageHeader>

    <section class="card mb-6 flex flex-wrap items-center justify-between gap-4 p-5">
      <div>
        <p class="mb-2 text-sm text-ink/60">Kilometer saat ini</p>
        <OdometerDisplay :value="store.vehicle.odometer" />
      </div>
      <div class="text-sm text-ink/65">
        <p>Pemilik: <span class="font-semibold text-ink">{{ store.vehicle.owner_name }}</span></p>
        <p>Jenis: <span class="font-semibold text-ink">{{ store.vehicle.vehicle_type === "motor" ? "Motor" : "Mobil" }}</span></p>
      </div>
    </section>

    <h2 class="mb-3 text-lg font-bold text-petrol-900">Riwayat servis</h2>
    <EmptyState v-if="!store.vehicleHistory.length" title="Belum ada riwayat servis" description="Riwayat akan muncul setelah servis pertama selesai dikerjakan." />
    <ol v-else class="space-y-3">
      <li v-for="record in store.vehicleHistory" :key="record.id" class="card p-4">
        <div class="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p class="font-bold text-petrol-900">{{ record.service_name }}</p>
            <p class="text-sm text-ink/60">{{ formatDate(record.service_date) }}, {{ record.odometer.toLocaleString("id-ID") }} km</p>
          </div>
          <p class="font-bold">{{ formatRupiah(record.total_cost) }}</p>
        </div>
        <p class="mt-2 text-sm text-ink/75">{{ record.work_done }}</p>
        <RouterLink :to="`/history/${record.id}`" class="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-petrol-700"><ReceiptText :size="14" /> Lihat invoice</RouterLink>
      </li>
    </ol>
  </template>
</template>
