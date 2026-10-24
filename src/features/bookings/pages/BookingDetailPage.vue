<script setup lang="ts">
import { computed, onMounted } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { ArrowLeft } from "lucide-vue-next";
import { useAuthStore } from "~/features/auth/states/authStore";
import { formatDate, formatDateTime, formatKm, formatRupiah } from "~/helpers/toolsHelper";
import PageHeader from "~/features/common/components/PageHeader.vue";
import EmptyState from "~/features/common/components/EmptyState.vue";
import LoadingState from "~/features/common/components/LoadingState.vue";
import StatusBadge from "~/features/common/components/StatusBadge.vue";
import BookingActions from "../components/BookingActions.vue";
import { BOOKING_STATUS_META } from "../bookingStatus";
import { useBookingsStore } from "../states/bookingsStore";

const route = useRoute();
const auth = useAuthStore();
const store = useBookingsStore();
const bookingId = computed(() => Number(route.params.bookingId));

const load = () => store.fetchBooking(bookingId.value);
onMounted(load);
</script>

<template>
  <RouterLink to="/bookings" class="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-petrol-700"><ArrowLeft :size="16" /> Semua booking</RouterLink>

  <LoadingState v-if="store.isBookingsLoading && !store.booking" />
  <EmptyState v-else-if="!store.booking" title="Booking tidak ditemukan" description="Booking mungkin tidak ada atau bukan milik Anda." />

  <template v-else>
    <PageHeader title="Detail booking" :subtitle="store.booking.code" />

    <article class="card max-w-2xl overflow-hidden">
      <div class="flex flex-wrap items-center justify-between gap-3 bg-petrol-900 px-6 py-5 text-white">
        <div>
          <p class="text-xs text-petrol-200">Jadwal servis</p>
          <p class="display text-2xl">{{ formatDate(store.booking.booking_date) }}, {{ store.booking.time_slot }}</p>
        </div>
        <StatusBadge :label="BOOKING_STATUS_META[store.booking.status].label" :tone="BOOKING_STATUS_META[store.booking.status].tone" />
      </div>

      <div class="ticket-divider" />

      <dl class="grid gap-x-8 gap-y-4 px-6 py-5 text-sm sm:grid-cols-2">
        <div><dt class="text-ink/55">Layanan</dt><dd class="font-bold">{{ store.booking.service_name }}</dd></div>
        <div><dt class="text-ink/55">Estimasi jasa</dt><dd class="font-bold">{{ formatRupiah(store.booking.estimated_price) }}</dd></div>
        <div><dt class="text-ink/55">Kendaraan</dt><dd class="font-bold">{{ store.booking.plate_number }}, {{ store.booking.vehicle_brand }} {{ store.booking.vehicle_model }}</dd></div>
        <div><dt class="text-ink/55">Kilometer</dt><dd class="font-bold">{{ formatKm(store.booking.odometer ?? store.booking.vehicle_odometer) }}</dd></div>
        <div v-if="auth.isAdmin"><dt class="text-ink/55">Pelanggan</dt><dd class="font-bold">{{ store.booking.customer_name }}<span v-if="store.booking.customer_phone" class="font-normal text-ink/60">, {{ store.booking.customer_phone }}</span></dd></div>
        <div><dt class="text-ink/55">Dibuat</dt><dd class="font-bold">{{ formatDateTime(store.booking.created_at) }}</dd></div>
        <div v-if="store.booking.complaint" class="sm:col-span-2"><dt class="text-ink/55">Keluhan</dt><dd>{{ store.booking.complaint }}</dd></div>
        <div v-if="store.booking.admin_note" class="sm:col-span-2"><dt class="text-ink/55">Catatan bengkel</dt><dd>{{ store.booking.admin_note }}</dd></div>
      </dl>

      <div class="ticket-divider" />
      <div class="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
        <BookingActions :booking="store.booking" @changed="load" />
        <RouterLink v-if="store.booking.status === 'completed'" to="/history" class="text-sm font-semibold text-petrol-700 underline">Lihat riwayat dan invoice</RouterLink>
      </div>
    </article>
  </template>
</template>
