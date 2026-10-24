<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { formatCompactRupiah, formatMonthShort, formatRupiah } from "~/helpers/toolsHelper";
import { BOOKING_STATUS_META } from "~/features/bookings/bookingStatus";
import StatusBadge from "~/features/common/components/StatusBadge.vue";
import type { BookingStatus } from "~/features/bookings/types";
import type { AdminDashboard } from "../types";
import BarChart from "./BarChart.vue";

const props = defineProps<{ data: AdminDashboard }>();

const toBars = (points: { month: string; total: number }[]) =>
  points.map((point) => ({ label: formatMonthShort(point.month), value: point.total }));

const bookingBars = computed(() => toBars(props.data.bookings_per_month));
const revenueBars = computed(() => toBars(props.data.revenue_per_month));
const maxPopular = computed(() => Math.max(1, ...props.data.popular_services.map((service) => service.total)));
const statuses = computed(() => Object.entries(props.data.status_counts) as [BookingStatus, number][]);
</script>

<template>
  <div class="space-y-6">
    <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div class="card p-5">
        <p class="text-sm text-ink/60">Booking hari ini</p>
        <p class="display mt-2 text-3xl text-petrol-900">{{ data.totals.today_bookings }}</p>
      </div>
      <RouterLink to="/bookings" class="card border-signal-400 bg-signal-300/20 p-5">
        <p class="text-sm text-ink/70">Menunggu konfirmasi</p>
        <p class="display mt-2 text-3xl text-petrol-900">{{ data.totals.pending_bookings }}</p>
      </RouterLink>
      <div class="card p-5">
        <p class="text-sm text-ink/60">Pelanggan terdaftar</p>
        <p class="display mt-2 text-3xl text-petrol-900">{{ data.totals.customers }}</p>
        <p class="mt-1 text-xs text-ink/55">{{ data.totals.vehicles }} kendaraan</p>
      </div>
      <div class="card p-5">
        <p class="text-sm text-ink/60">Total pendapatan servis</p>
        <p class="display mt-2 text-2xl text-petrol-900">{{ formatRupiah(data.totals.revenue) }}</p>
      </div>
    </section>

    <section class="grid gap-6 lg:grid-cols-2">
      <div class="card p-5">
        <h2 class="mb-4 text-base font-bold text-petrol-900">Booking per bulan</h2>
        <BarChart :items="bookingBars" />
      </div>
      <div class="card p-5">
        <h2 class="mb-4 text-base font-bold text-petrol-900">Pendapatan per bulan</h2>
        <BarChart :items="revenueBars" :format-value="formatCompactRupiah" bar-class="bg-signal-500" />
      </div>
    </section>

    <section class="grid gap-6 lg:grid-cols-2">
      <div class="card p-5">
        <h2 class="mb-4 text-base font-bold text-petrol-900">Layanan terpopuler</h2>
        <ul v-if="data.popular_services.length" class="space-y-3">
          <li v-for="service in data.popular_services" :key="service.id">
            <div class="flex justify-between text-sm"><span class="font-semibold">{{ service.name }}</span><span class="text-ink/60">{{ service.total }} booking</span></div>
            <div class="mt-1 h-2 rounded-full bg-paper"><div class="h-2 rounded-full bg-petrol-700" :style="{ width: `${(service.total / maxPopular) * 100}%` }" /></div>
          </li>
        </ul>
        <p v-else class="text-sm text-ink/60">Belum ada data booking.</p>
      </div>
      <div class="card p-5">
        <h2 class="mb-4 text-base font-bold text-petrol-900">Status booking</h2>
        <ul class="space-y-2.5">
          <li v-for="[status, total] in statuses" :key="status" class="flex items-center justify-between">
            <StatusBadge :label="BOOKING_STATUS_META[status].label" :tone="BOOKING_STATUS_META[status].tone" />
            <span class="text-sm font-bold tabular-nums">{{ total }}</span>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>
