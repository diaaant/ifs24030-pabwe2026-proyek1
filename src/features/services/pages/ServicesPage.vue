<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { RouterLink } from "vue-router";
import { Clock, Pencil, Plus, Repeat, Trash2 } from "lucide-vue-next";
import { useAuthStore } from "~/features/auth/states/authStore";
import { formatKm, formatRupiah, showConfirmDialog } from "~/helpers/toolsHelper";
import PageHeader from "~/features/common/components/PageHeader.vue";
import EmptyState from "~/features/common/components/EmptyState.vue";
import LoadingState from "~/features/common/components/LoadingState.vue";
import StatusBadge from "~/features/common/components/StatusBadge.vue";
import ServiceFormModal from "../modals/ServiceFormModal.vue";
import { useServicesStore } from "../states/servicesStore";
import type { Service, ServiceVehicleType } from "../types";

const auth = useAuthStore();
const store = useServicesStore();

const vehicleType = ref<ServiceVehicleType | "">("");
const showInactive = ref(false);
const isModalOpen = ref(false);
const editing = ref<Service | null>(null);

const TYPE_LABEL: Record<ServiceVehicleType, string> = { motor: "Motor", mobil: "Mobil", semua: "Motor dan mobil" };
const FILTERS: { value: ServiceVehicleType | ""; label: string }[] = [
  { value: "", label: "Semua" },
  { value: "motor", label: "Motor" },
  { value: "mobil", label: "Mobil" },
];

const load = () =>
  store.fetchServices({ vehicle_type: vehicleType.value, include_inactive: showInactive.value ? "true" : "false" });

onMounted(load);
watch([vehicleType, showInactive], load);

const openForm = (service: Service | null = null) => {
  editing.value = service;
  isModalOpen.value = true;
};

const onSaved = () => {
  isModalOpen.value = false;
  load();
};

const remove = async (service: Service) => {
  const confirmed = await showConfirmDialog(`Hapus layanan "${service.name}"? Layanan yang pernah dibooking hanya dinonaktifkan.`, {
    title: "Hapus layanan",
    confirmText: "Hapus",
    danger: true,
  });
  if (!confirmed) return;
  const result = await store.removeService(service.id);
  if (result.ok) load();
};

const intervalText = (service: Service): string =>
  [service.interval_days ? `${service.interval_days} hari` : null, service.interval_km ? formatKm(service.interval_km) : null]
    .filter(Boolean)
    .join(" atau ");
</script>

<template>
  <PageHeader title="Layanan servis" :subtitle="auth.isAdmin ? 'Kelola daftar layanan, harga, dan interval servis ulang.' : 'Pilih layanan yang sesuai dengan kendaraan Anda.'">
    <button v-if="auth.isAdmin" class="btn-primary" @click="openForm()"><Plus :size="16" /> Tambah layanan</button>
  </PageHeader>

  <div class="mb-5 flex flex-wrap items-center gap-3">
    <div class="inline-flex rounded-lg border border-line bg-white p-1" role="group" aria-label="Filter jenis kendaraan">
      <button v-for="filter in FILTERS" :key="filter.value" class="rounded-md px-3 py-1.5 text-sm font-semibold" :class="vehicleType === filter.value ? 'bg-petrol-900 text-white' : 'text-ink/70'" @click="vehicleType = filter.value">
        {{ filter.label }}
      </button>
    </div>
    <label v-if="auth.isAdmin" class="flex items-center gap-2 text-sm"><input v-model="showInactive" type="checkbox" class="h-4 w-4 accent-petrol-700" /> Tampilkan layanan nonaktif</label>
  </div>

  <LoadingState v-if="store.isServicesLoading && !store.services.length" />
  <EmptyState v-else-if="!store.services.length" title="Belum ada layanan" description="Layanan akan tampil di sini setelah ditambahkan oleh admin." />

  <div v-else class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
    <article v-for="service in store.services" :key="service.id" class="card flex flex-col gap-3 p-5" :class="{ 'opacity-60': !service.is_active }">
      <div class="flex items-start justify-between gap-2">
        <h2 class="text-base font-bold text-petrol-900">{{ service.name }}</h2>
        <StatusBadge :label="service.is_active ? TYPE_LABEL[service.vehicle_type] : 'Nonaktif'" :tone="service.is_active ? 'info' : 'neutral'" />
      </div>
      <p class="text-sm text-ink/65">{{ service.description }}</p>
      <p class="display text-2xl text-petrol-900">{{ formatRupiah(service.price) }}</p>
      <ul class="space-y-1 text-sm text-ink/70">
        <li class="flex items-center gap-2"><Clock :size="14" /> Sekitar {{ service.duration_minutes }} menit</li>
        <li v-if="intervalText(service)" class="flex items-center gap-2"><Repeat :size="14" /> Ulangi setiap {{ intervalText(service) }}</li>
      </ul>
      <div class="mt-auto flex gap-2 pt-1">
        <template v-if="auth.isAdmin">
          <button class="btn-secondary btn-sm flex-1" @click="openForm(service)"><Pencil :size="14" /> Ubah</button>
          <button class="btn-secondary btn-sm text-red-700" :aria-label="`Hapus ${service.name}`" @click="remove(service)"><Trash2 :size="14" /></button>
        </template>
        <RouterLink v-else-if="service.is_active" :to="`/bookings/new?service=${service.id}`" class="btn-signal btn-sm flex-1">Pesan layanan ini</RouterLink>
      </div>
    </article>
  </div>

  <ServiceFormModal :open="isModalOpen" :service="editing" @close="isModalOpen = false" @saved="onSaved" />
</template>
