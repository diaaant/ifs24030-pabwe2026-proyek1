<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, watch } from "vue";
import { RouterLink } from "vue-router";
import { Plus, Search } from "lucide-vue-next";
import { useAuthStore } from "~/features/auth/states/authStore";
import { formatDate, formatRupiah } from "~/helpers/toolsHelper";
import PageHeader from "~/features/common/components/PageHeader.vue";
import EmptyState from "~/features/common/components/EmptyState.vue";
import LoadingState from "~/features/common/components/LoadingState.vue";
import PaginationBar from "~/features/common/components/PaginationBar.vue";
import StatusBadge from "~/features/common/components/StatusBadge.vue";
import BookingActions from "../components/BookingActions.vue";
import { BOOKING_STATUS_META, STATUS_FILTERS } from "../bookingStatus";
import { useBookingsStore } from "../states/bookingsStore";
import type { BookingStatus } from "../types";

const auth = useAuthStore();
const store = useBookingsStore();

const filters = reactive({ page: 1, status: "" as BookingStatus | "", search: "", date: "" });
let searchTimer: ReturnType<typeof setTimeout> | undefined;

const load = () => store.fetchBookings({ ...filters, limit: 8 });

onMounted(load);
onBeforeUnmount(() => clearTimeout(searchTimer));

const resetPageAndLoad = () => {
  filters.page = 1;
  load();
};

watch(() => [filters.status, filters.date], resetPageAndLoad);
watch(() => filters.search, () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(resetPageAndLoad, 300);
});

const goToPage = (page: number) => {
  filters.page = page;
  load();
};
</script>

<template>
  <PageHeader title="Booking servis" :subtitle="auth.isAdmin ? 'Konfirmasi jadwal, kerjakan, lalu catat hasil servis.' : 'Lacak status booking servis kendaraan Anda.'">
    <RouterLink to="/bookings/new" class="btn-signal"><Plus :size="16" /> Booking servis</RouterLink>
  </PageHeader>

  <div class="mb-3 flex flex-wrap gap-2" role="group" aria-label="Filter status">
    <button v-for="filter in STATUS_FILTERS" :key="filter.value" class="rounded-full border px-3.5 py-1.5 text-sm font-semibold" :class="filters.status === filter.value ? 'border-petrol-900 bg-petrol-900 text-white' : 'border-line bg-white text-ink/70'" @click="filters.status = filter.value">
      {{ filter.label }}
    </button>
  </div>
  <div class="mb-5 flex flex-wrap gap-3">
    <div class="relative min-w-60 flex-1">
      <Search :size="16" class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink/40" />
      <input v-model="filters.search" class="input pl-9" placeholder="Cari kode, nomor polisi, layanan, atau pelanggan" aria-label="Cari booking" />
    </div>
    <input v-model="filters.date" type="date" class="input w-auto" aria-label="Tanggal booking" />
  </div>

  <LoadingState v-if="store.isBookingsLoading && !store.bookings.length" />
  <EmptyState v-else-if="!store.bookings.length" title="Tidak ada booking" description="Ubah filter atau buat booking servis baru.">
    <RouterLink to="/bookings/new" class="btn-primary">Booking servis</RouterLink>
  </EmptyState>

  <ul v-else class="space-y-3">
    <li v-for="booking in store.bookings" :key="booking.id" class="card p-4 sm:p-5">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <RouterLink :to="`/bookings/${booking.id}`" class="min-w-0">
          <p class="text-xs font-semibold tabular-nums text-ink/50">{{ booking.code }}</p>
          <p class="text-base font-bold text-petrol-900">{{ booking.service_name }}</p>
          <p class="text-sm text-ink/65">{{ booking.plate_number }}, {{ booking.vehicle_brand }} {{ booking.vehicle_model }}</p>
          <p v-if="auth.isAdmin" class="text-sm text-ink/65">Pelanggan: {{ booking.customer_name }}</p>
        </RouterLink>
        <div class="text-right">
          <StatusBadge :label="BOOKING_STATUS_META[booking.status].label" :tone="BOOKING_STATUS_META[booking.status].tone" />
          <p class="mt-2 text-sm font-semibold">{{ formatDate(booking.booking_date) }}, {{ booking.time_slot }}</p>
          <p class="text-xs text-ink/55">Estimasi {{ formatRupiah(booking.estimated_price) }}</p>
        </div>
      </div>
      <div class="mt-4 border-t border-line pt-3"><BookingActions :booking="booking" @changed="load" /></div>
    </li>
  </ul>

  <PaginationBar v-if="store.meta" :meta="store.meta" @change="goToPage" />
</template>
