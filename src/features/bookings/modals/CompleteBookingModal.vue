<script setup lang="ts">
import { watch } from "vue";
import { useInput } from "~/hooks/useInput";
import { formatRupiah } from "~/helpers/toolsHelper";
import BaseModal from "~/features/common/components/BaseModal.vue";
import FormField from "~/features/common/components/FormField.vue";
import { useBookingsStore } from "../states/bookingsStore";
import type { Booking } from "../types";

const props = defineProps<{ open: boolean; booking: Booking }>();
const emit = defineEmits<{ close: []; saved: [] }>();

const store = useBookingsStore();
const { values, errors, reset, setFieldErrors } = useInput({ odometer: 0, work_done: "", parts_cost: 0, labor_cost: 0, notes: "" });

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) return;
    const { booking } = props;
    reset({ odometer: Math.max(booking.odometer ?? 0, booking.vehicle_odometer), labor_cost: booking.estimated_price });
  },
  { immediate: true }
);

const submit = async () => {
  const result = await store.completeBooking(props.booking.id, {
    odometer: Number(values.odometer),
    work_done: values.work_done.trim(),
    parts_cost: Number(values.parts_cost) || 0,
    labor_cost: Number(values.labor_cost) || 0,
    notes: values.notes.trim() || null,
  });
  if (result.ok) emit("saved");
  else setFieldErrors(result.errors);
};
</script>

<template>
  <BaseModal :open="open" title="Selesaikan servis" @close="emit('close')">
    <p class="mb-4 text-sm text-ink/65">{{ booking.plate_number }}, {{ booking.service_name }}. Data ini menjadi riwayat servis dan dasar pengingat berikutnya.</p>
    <form id="complete-form" class="grid gap-4 sm:grid-cols-2" novalidate @submit.prevent="submit">
      <FormField label="Kilometer saat servis" for="odometer" :error="errors.odometer" class="sm:col-span-2">
        <input id="odometer" v-model.number="values.odometer" type="number" min="0" class="input" :class="{ 'input-error': errors.odometer }" />
      </FormField>
      <FormField label="Pekerjaan yang dilakukan" for="work_done" :error="errors.work_done" class="sm:col-span-2">
        <textarea id="work_done" v-model="values.work_done" rows="3" class="input" :class="{ 'input-error': errors.work_done }" placeholder="Contoh: Ganti oli mesin 0,8 liter dan bersihkan filter udara" />
      </FormField>
      <FormField label="Biaya suku cadang (Rp)" for="parts_cost" :error="errors.parts_cost">
        <input id="parts_cost" v-model.number="values.parts_cost" type="number" min="0" step="1000" class="input" />
      </FormField>
      <FormField label="Biaya jasa (Rp)" for="labor_cost" :error="errors.labor_cost">
        <input id="labor_cost" v-model.number="values.labor_cost" type="number" min="0" step="1000" class="input" />
      </FormField>
      <FormField label="Catatan untuk pelanggan" for="notes" :error="errors.notes" class="sm:col-span-2">
        <textarea id="notes" v-model="values.notes" rows="2" class="input" />
      </FormField>
      <p class="text-sm font-bold text-petrol-900 sm:col-span-2">Total tagihan: {{ formatRupiah((Number(values.parts_cost) || 0) + (Number(values.labor_cost) || 0)) }}</p>
    </form>
    <template #footer>
      <button type="button" class="btn-secondary" @click="emit('close')">Batal</button>
      <button type="submit" form="complete-form" class="btn-primary" :disabled="store.isBookingSaving">{{ store.isBookingSaving ? "Menyimpan..." : "Simpan dan selesaikan" }}</button>
    </template>
  </BaseModal>
</template>
