<script setup lang="ts">
import { computed, onMounted } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { ArrowLeft, Printer } from "lucide-vue-next";
import { formatDate, formatKm, formatRupiah } from "~/helpers/toolsHelper";
import EmptyState from "~/features/common/components/EmptyState.vue";
import LoadingState from "~/features/common/components/LoadingState.vue";
import { useHistoryStore } from "../states/historyStore";

const route = useRoute();
const store = useHistoryStore();
const historyId = computed(() => Number(route.params.historyId));

onMounted(() => store.fetchRecord(historyId.value));

const print = () => window.print();
</script>

<template>
  <div class="mb-4 flex items-center justify-between print:hidden">
    <RouterLink to="/history" class="inline-flex items-center gap-1 text-sm font-semibold text-petrol-700"><ArrowLeft :size="16" /> Riwayat servis</RouterLink>
    <button v-if="store.record" class="btn-primary" @click="print"><Printer :size="16" /> Cetak invoice</button>
  </div>

  <LoadingState v-if="store.isHistoryLoading && !store.record" />
  <EmptyState v-else-if="!store.record" title="Invoice tidak ditemukan" description="Invoice mungkin tidak ada atau bukan milik Anda." />

  <article v-else class="card mx-auto max-w-3xl p-8 print:max-w-none print:border-0 print:p-0">
    <header class="flex flex-wrap items-start justify-between gap-4">
      <div class="flex items-center gap-3">
        <img src="/logo.svg" alt="" class="h-11 w-11" />
        <div>
          <p class="display text-xl text-petrol-900">BengkelKu</p>
          <p class="text-xs text-ink/55">Servis kendaraan terjadwal</p>
        </div>
      </div>
      <div class="text-right">
        <p class="display text-lg text-petrol-900">Invoice</p>
        <p class="text-sm font-semibold tabular-nums">{{ store.record.invoice_number }}</p>
        <p class="text-sm text-ink/60">{{ formatDate(store.record.service_date) }}</p>
      </div>
    </header>

    <div class="ticket-divider my-6" />

    <section class="grid gap-6 text-sm sm:grid-cols-2">
      <div>
        <p class="text-ink/55">Pelanggan</p>
        <p class="font-bold">{{ store.record.customer_name }}</p>
        <p>{{ store.record.customer_email }}</p>
        <p v-if="store.record.customer_phone">{{ store.record.customer_phone }}</p>
      </div>
      <div>
        <p class="text-ink/55">Kendaraan</p>
        <p class="font-bold">{{ store.record.plate_number }}</p>
        <p>{{ store.record.vehicle_brand }} {{ store.record.vehicle_model }}</p>
        <p>Kilometer saat servis: {{ formatKm(store.record.odometer) }}</p>
      </div>
    </section>

    <table class="mt-6 w-full text-sm">
      <thead>
        <tr class="border-b border-line text-left text-ink/55"><th class="py-2 font-semibold">Rincian</th><th class="py-2 text-right font-semibold">Biaya</th></tr>
      </thead>
      <tbody>
        <tr class="border-b border-line"><td class="py-3"><p class="font-semibold">Jasa: {{ store.record.service_name }}</p><p class="text-ink/65">{{ store.record.work_done }}</p></td><td class="py-3 text-right tabular-nums">{{ formatRupiah(store.record.labor_cost) }}</td></tr>
        <tr class="border-b border-line"><td class="py-3 font-semibold">Suku cadang dan bahan</td><td class="py-3 text-right tabular-nums">{{ formatRupiah(store.record.parts_cost) }}</td></tr>
      </tbody>
      <tfoot>
        <tr><td class="pt-4 text-base font-bold">Total</td><td class="display pt-4 text-right text-xl text-petrol-900">{{ formatRupiah(store.record.total_cost) }}</td></tr>
      </tfoot>
    </table>

    <p v-if="store.record.notes" class="mt-6 rounded-lg bg-paper p-3 text-sm"><span class="font-semibold">Catatan:</span> {{ store.record.notes }}</p>
    <p v-if="store.record.next_service_date || store.record.next_service_km" class="mt-4 text-sm text-ink/65">
      Servis berikutnya disarankan pada
      {{ [store.record.next_service_date ? formatDate(store.record.next_service_date) : null, store.record.next_service_km ? formatKm(store.record.next_service_km) : null].filter(Boolean).join(" atau ") }}.
    </p>
  </article>
</template>
