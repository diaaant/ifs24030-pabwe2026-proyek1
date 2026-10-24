<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { useAuthStore } from "~/features/auth/states/authStore";
import { formatDate, formatKm } from "~/helpers/toolsHelper";
import PageHeader from "~/features/common/components/PageHeader.vue";
import EmptyState from "~/features/common/components/EmptyState.vue";
import LoadingState from "~/features/common/components/LoadingState.vue";
import StatusBadge from "~/features/common/components/StatusBadge.vue";
import OdometerDisplay from "~/features/common/components/OdometerDisplay.vue";
import { REMINDER_STATUS_META, describeRemaining } from "../reminderStatus";
import { useRemindersStore } from "../states/remindersStore";
import type { ReminderStatus } from "../types";

const auth = useAuthStore();
const store = useRemindersStore();
const activeFilter = ref<ReminderStatus | "">("");

onMounted(() => store.fetchReminders());

const FILTERS: { value: ReminderStatus | ""; label: string }[] = [
  { value: "", label: "Semua" },
  { value: "overdue", label: "Terlambat" },
  { value: "soon", label: "Segera" },
  { value: "ok", label: "Aman" },
  { value: "no_history", label: "Belum ada riwayat" },
];

const visible = computed(() => store.reminders.filter((item) => !activeFilter.value || item.status === activeFilter.value));
</script>

<template>
  <PageHeader title="Pengingat servis" :subtitle="auth.isAdmin ? 'Pelanggan yang perlu dihubungi untuk servis berikutnya.' : 'Dihitung dari servis terakhir: tanggal atau kilometer, mana yang lebih dulu.'" />

  <div class="mb-5 flex flex-wrap gap-2" role="group" aria-label="Filter status pengingat">
    <button v-for="filter in FILTERS" :key="filter.value" class="rounded-full border px-3.5 py-1.5 text-sm font-semibold" :class="activeFilter === filter.value ? 'border-petrol-900 bg-petrol-900 text-white' : 'border-line bg-white text-ink/70'" @click="activeFilter = filter.value">
      {{ filter.label }}
    </button>
  </div>

  <LoadingState v-if="store.isRemindersLoading && !store.reminders.length" />
  <EmptyState v-else-if="!visible.length" title="Tidak ada pengingat" description="Tidak ada kendaraan pada kategori ini." />

  <div v-else class="grid gap-4 md:grid-cols-2">
    <article v-for="item in visible" :key="item.vehicle_id" class="card flex flex-col gap-3 p-5" :class="{ 'border-red-300': item.status === 'overdue' }">
      <div class="flex items-start justify-between gap-2">
        <div>
          <p class="display text-lg text-petrol-900">{{ item.plate_number }}</p>
          <p class="text-sm text-ink/65">{{ item.brand }} {{ item.model }}<span v-if="auth.isAdmin">, {{ item.owner_name }}</span></p>
        </div>
        <StatusBadge :label="REMINDER_STATUS_META[item.status].label" :tone="REMINDER_STATUS_META[item.status].tone" />
      </div>

      <OdometerDisplay :value="item.odometer" compact />

      <div v-if="item.status === 'no_history'" class="text-sm text-ink/65">Belum pernah servis di BengkelKu. Pesan servis pertama untuk mulai mencatat.</div>
      <dl v-else class="space-y-1 text-sm">
        <div class="flex justify-between gap-3"><dt class="text-ink/55">Servis terakhir</dt><dd class="text-right font-semibold">{{ item.last_service_name }}, {{ formatDate(item.last_service_date!) }}</dd></div>
        <div v-if="item.next_service_date" class="flex justify-between gap-3"><dt class="text-ink/55">Jadwal berikutnya</dt><dd class="font-semibold">{{ formatDate(item.next_service_date) }}</dd></div>
        <div v-if="item.next_service_km" class="flex justify-between gap-3"><dt class="text-ink/55">Kilometer berikutnya</dt><dd class="font-semibold">{{ formatKm(item.next_service_km) }}</dd></div>
        <p class="pt-1 font-semibold" :class="item.status === 'overdue' ? 'text-red-700' : 'text-petrol-700'">{{ describeRemaining(item.days_left, item.km_left).join(", ") }}</p>
      </dl>

      <RouterLink v-if="!auth.isAdmin" :to="`/bookings/new?vehicle=${item.vehicle_id}`" class="btn-signal btn-sm mt-auto self-start">Booking servis</RouterLink>
    </article>
  </div>
</template>
