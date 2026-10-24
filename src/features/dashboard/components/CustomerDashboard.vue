<script setup lang="ts">
import { computed, onMounted } from "vue";
import { RouterLink } from "vue-router";
import { Plus } from "lucide-vue-next";
import { formatDate, formatRupiah } from "~/helpers/toolsHelper";
import { BOOKING_STATUS_META } from "~/features/bookings/bookingStatus";
import { useBookingsStore } from "~/features/bookings/states/bookingsStore";
import { useRemindersStore } from "~/features/reminders/states/remindersStore";
import { REMINDER_STATUS_META, describeRemaining } from "~/features/reminders/reminderStatus";
import StatusBadge from "~/features/common/components/StatusBadge.vue";
import type { CustomerDashboard } from "../types";

defineProps<{ data: CustomerDashboard }>();

const bookings = useBookingsStore();
const reminders = useRemindersStore();

onMounted(() => {
  bookings.fetchBookings({ limit: 50 });
  reminders.fetchReminders();
});

const ACTIVE = ["pending", "confirmed", "in_progress"];
const upcoming = computed(() =>
  bookings.bookings
    .filter((item) => ACTIVE.includes(item.status))
    .sort((a, b) => `${a.booking_date}${a.time_slot}`.localeCompare(`${b.booking_date}${b.time_slot}`))
    .slice(0, 4)
);
</script>

<template>
  <div class="space-y-6">
    <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div class="card p-5"><p class="text-sm text-ink/60">Kendaraan terdaftar</p><p class="display mt-2 text-3xl text-petrol-900">{{ data.totals.vehicles }}</p></div>
      <div class="card p-5"><p class="text-sm text-ink/60">Booking aktif</p><p class="display mt-2 text-3xl text-petrol-900">{{ data.totals.active_bookings }}</p></div>
      <div class="card p-5"><p class="text-sm text-ink/60">Servis selesai</p><p class="display mt-2 text-3xl text-petrol-900">{{ data.totals.services_done }}</p></div>
      <div class="card p-5"><p class="text-sm text-ink/60">Total biaya servis</p><p class="display mt-2 text-2xl text-petrol-900">{{ formatRupiah(data.totals.total_spent) }}</p></div>
    </section>

    <section class="grid gap-6 lg:grid-cols-2">
      <div class="card p-5">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-base font-bold text-petrol-900">Pengingat servis</h2>
          <RouterLink to="/reminders" class="text-sm font-semibold text-petrol-700 underline">Lihat semua</RouterLink>
        </div>
        <ul v-if="reminders.dueReminders.length" class="space-y-3">
          <li v-for="item in reminders.dueReminders.slice(0, 3)" :key="item.vehicle_id" class="flex items-start justify-between gap-3">
            <div>
              <p class="text-sm font-bold">{{ item.plate_number }} <span class="font-normal text-ink/60">{{ item.brand }} {{ item.model }}</span></p>
              <p class="text-xs text-ink/60">{{ describeRemaining(item.days_left, item.km_left).join(", ") }}</p>
            </div>
            <StatusBadge :label="REMINDER_STATUS_META[item.status].label" :tone="REMINDER_STATUS_META[item.status].tone" />
          </li>
        </ul>
        <p v-else class="text-sm text-ink/60">Tidak ada servis yang perlu dijadwalkan dalam waktu dekat.</p>
      </div>

      <div class="card p-5">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-base font-bold text-petrol-900">Booking mendatang</h2>
          <RouterLink to="/bookings/new" class="btn-signal btn-sm"><Plus :size="14" /> Booking servis</RouterLink>
        </div>
        <ul v-if="upcoming.length" class="space-y-3">
          <li v-for="item in upcoming" :key="item.id">
            <RouterLink :to="`/bookings/${item.id}`" class="flex items-start justify-between gap-3 rounded-lg p-2 hover:bg-paper">
              <div>
                <p class="text-sm font-bold">{{ item.service_name }}</p>
                <p class="text-xs text-ink/60">{{ item.plate_number }}, {{ formatDate(item.booking_date) }} pukul {{ item.time_slot }}</p>
              </div>
              <StatusBadge :label="BOOKING_STATUS_META[item.status].label" :tone="BOOKING_STATUS_META[item.status].tone" />
            </RouterLink>
          </li>
        </ul>
        <p v-else class="text-sm text-ink/60">Belum ada jadwal servis. Pesan jam servis pertama Anda.</p>
      </div>
    </section>
  </div>
</template>
