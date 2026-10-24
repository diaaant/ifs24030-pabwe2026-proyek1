<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import { RouterLink } from "vue-router";
import { Pencil, Plus, Search, Trash2 } from "lucide-vue-next";
import { useAuthStore } from "~/features/auth/states/authStore";
import { showConfirmDialog } from "~/helpers/toolsHelper";
import PageHeader from "~/features/common/components/PageHeader.vue";
import EmptyState from "~/features/common/components/EmptyState.vue";
import LoadingState from "~/features/common/components/LoadingState.vue";
import PaginationBar from "~/features/common/components/PaginationBar.vue";
import OdometerDisplay from "~/features/common/components/OdometerDisplay.vue";
import StatusBadge from "~/features/common/components/StatusBadge.vue";
import VehicleFormModal from "../modals/VehicleFormModal.vue";
import { useVehiclesStore } from "../states/vehiclesStore";
import type { Vehicle } from "../types";

const auth = useAuthStore();
const store = useVehiclesStore();

const filters = reactive({ page: 1, search: "", vehicle_type: "" as "" | "motor" | "mobil" });
const isModalOpen = ref(false);
const editing = ref<Vehicle | null>(null);
let searchTimer: ReturnType<typeof setTimeout> | undefined;

const load = () => store.fetchVehicles({ ...filters, limit: 9 });

onMounted(load);
onBeforeUnmount(() => clearTimeout(searchTimer));

watch(() => filters.search, () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    filters.page = 1;
    load();
  }, 300);
});
watch(() => filters.vehicle_type, () => {
  filters.page = 1;
  load();
});

const openForm = (vehicle: Vehicle | null = null) => {
  editing.value = vehicle;
  isModalOpen.value = true;
};

const onSaved = () => {
  isModalOpen.value = false;
  load();
};

const goToPage = (page: number) => {
  filters.page = page;
  load();
};

const remove = async (vehicle: Vehicle) => {
  const confirmed = await showConfirmDialog(`Hapus ${vehicle.plate_number} (${vehicle.brand} ${vehicle.model})?`, {
    title: "Hapus kendaraan",
    confirmText: "Hapus",
    danger: true,
  });
  if (!confirmed) return;
  const result = await store.removeVehicle(vehicle.id);
  if (result.ok) load();
};
</script>

<template>
  <PageHeader :title="auth.isAdmin ? 'Semua kendaraan' : 'Kendaraan saya'" subtitle="Data kendaraan dipakai untuk booking servis dan pengingat perawatan.">
    <button class="btn-primary" @click="openForm()"><Plus :size="16" /> Tambah kendaraan</button>
  </PageHeader>

  <div class="mb-5 flex flex-wrap gap-3">
    <div class="relative min-w-60 flex-1">
      <Search :size="16" class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink/40" />
      <input v-model="filters.search" class="input pl-9" placeholder="Cari nomor polisi, merek, atau model" aria-label="Cari kendaraan" />
    </div>
    <select v-model="filters.vehicle_type" class="input w-auto" aria-label="Jenis kendaraan">
      <option value="">Semua jenis</option>
      <option value="motor">Motor</option>
      <option value="mobil">Mobil</option>
    </select>
  </div>

  <LoadingState v-if="store.isVehiclesLoading && !store.vehicles.length" />
  <EmptyState v-else-if="!store.vehicles.length" title="Belum ada kendaraan" description="Tambahkan kendaraan pertama agar bisa membuat booking servis.">
    <button class="btn-primary" @click="openForm()"><Plus :size="16" /> Tambah kendaraan</button>
  </EmptyState>

  <div v-else class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
    <article v-for="vehicle in store.vehicles" :key="vehicle.id" class="card flex flex-col gap-4 p-5">
      <div class="flex items-start justify-between gap-2">
        <RouterLink :to="`/vehicles/${vehicle.id}`" class="min-w-0">
          <p class="display text-xl text-petrol-900">{{ vehicle.plate_number }}</p>
          <p class="truncate text-sm text-ink/65">{{ vehicle.brand }} {{ vehicle.model }}, {{ vehicle.year }}</p>
        </RouterLink>
        <StatusBadge :label="vehicle.vehicle_type === 'motor' ? 'Motor' : 'Mobil'" tone="info" />
      </div>
      <OdometerDisplay :value="vehicle.odometer" compact />
      <p v-if="auth.isAdmin" class="text-xs text-ink/55">Pemilik: {{ vehicle.owner_name }}</p>
      <div class="mt-auto flex gap-2">
        <RouterLink :to="`/bookings/new?vehicle=${vehicle.id}`" class="btn-signal btn-sm flex-1">Booking servis</RouterLink>
        <button class="btn-secondary btn-sm" :aria-label="`Ubah ${vehicle.plate_number}`" @click="openForm(vehicle)"><Pencil :size="14" /></button>
        <button class="btn-secondary btn-sm text-red-700" :aria-label="`Hapus ${vehicle.plate_number}`" @click="remove(vehicle)"><Trash2 :size="14" /></button>
      </div>
    </article>
  </div>

  <PaginationBar v-if="store.meta" :meta="store.meta" @change="goToPage" />
  <VehicleFormModal :open="isModalOpen" :vehicle="editing" @close="isModalOpen = false" @saved="onSaved" />
</template>
