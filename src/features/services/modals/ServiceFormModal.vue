<script setup lang="ts">
import { watch } from "vue";
import { useInput } from "~/hooks/useInput";
import BaseModal from "~/features/common/components/BaseModal.vue";
import FormField from "~/features/common/components/FormField.vue";
import { useServicesStore } from "../states/servicesStore";
import type { Service, ServicePayload, ServiceVehicleType } from "../types";

const props = defineProps<{ open: boolean; service: Service | null }>();
const emit = defineEmits<{ close: []; saved: [] }>();

const store = useServicesStore();
const { values, errors, reset, setFieldErrors } = useInput({
  name: "",
  description: "",
  vehicle_type: "semua" as ServiceVehicleType,
  price: 0,
  duration_minutes: 60,
  interval_days: "" as number | "",
  interval_km: "" as number | "",
  is_active: true,
});

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) return;
    const { service } = props;
    reset(service ? { ...service, description: service.description ?? "", interval_days: service.interval_days ?? "", interval_km: service.interval_km ?? "" } : {});
  },
  { immediate: true }
);

const toNullableNumber = (value: number | "") => (value === "" ? null : Number(value));

const submit = async () => {
  const payload: ServicePayload = {
    name: values.name.trim(),
    description: values.description.trim() || null,
    vehicle_type: values.vehicle_type,
    price: Number(values.price),
    duration_minutes: Number(values.duration_minutes),
    interval_days: toNullableNumber(values.interval_days),
    interval_km: toNullableNumber(values.interval_km),
    is_active: values.is_active,
  };

  const result = props.service ? await store.changeService(props.service.id, payload) : await store.addService(payload);
  if (result.ok) emit("saved");
  else setFieldErrors(result.errors);
};
</script>

<template>
  <BaseModal :open="open" :title="service ? 'Ubah layanan' : 'Tambah layanan'" @close="emit('close')">
    <form id="service-form" class="grid gap-4 sm:grid-cols-2" novalidate @submit.prevent="submit">
      <FormField label="Nama layanan" for="name" :error="errors.name" class="sm:col-span-2">
        <input id="name" v-model="values.name" class="input" :class="{ 'input-error': errors.name }" />
      </FormField>
      <FormField label="Deskripsi" for="description" :error="errors.description" class="sm:col-span-2">
        <textarea id="description" v-model="values.description" rows="2" class="input" />
      </FormField>
      <FormField label="Untuk kendaraan" for="vehicle_type" :error="errors.vehicle_type">
        <select id="vehicle_type" v-model="values.vehicle_type" class="input">
          <option value="semua">Motor dan mobil</option>
          <option value="motor">Motor</option>
          <option value="mobil">Mobil</option>
        </select>
      </FormField>
      <FormField label="Harga jasa (Rp)" for="price" :error="errors.price">
        <input id="price" v-model.number="values.price" type="number" min="0" step="1000" class="input" :class="{ 'input-error': errors.price }" />
      </FormField>
      <FormField label="Durasi (menit)" for="duration_minutes" :error="errors.duration_minutes">
        <input id="duration_minutes" v-model.number="values.duration_minutes" type="number" min="10" class="input" :class="{ 'input-error': errors.duration_minutes }" />
      </FormField>
      <div class="hidden sm:block" />
      <FormField label="Servis ulang setiap (hari)" for="interval_days" :error="errors.interval_days" hint="Kosongkan bila tidak berlaku">
        <input id="interval_days" v-model.number="values.interval_days" type="number" min="1" class="input" />
      </FormField>
      <FormField label="Servis ulang setiap (km)" for="interval_km" :error="errors.interval_km" hint="Kosongkan bila tidak berlaku">
        <input id="interval_km" v-model.number="values.interval_km" type="number" min="1" class="input" />
      </FormField>
      <label class="flex items-center gap-2 text-sm font-semibold sm:col-span-2"><input v-model="values.is_active" type="checkbox" class="h-4 w-4 accent-petrol-700" /> Layanan aktif dan dapat dipesan</label>
    </form>
    <template #footer>
      <button type="button" class="btn-secondary" @click="emit('close')">Batal</button>
      <button type="submit" form="service-form" class="btn-primary" :disabled="store.isServiceSaving">{{ store.isServiceSaving ? "Menyimpan..." : "Simpan" }}</button>
    </template>
  </BaseModal>
</template>
