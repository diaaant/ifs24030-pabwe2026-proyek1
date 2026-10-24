<script setup lang="ts">
import { watch } from "vue";
import { useInput } from "~/hooks/useInput";
import { emptyToNull } from "~/helpers/toolsHelper";
import BaseModal from "~/features/common/components/BaseModal.vue";
import FormField from "~/features/common/components/FormField.vue";
import { useVehiclesStore } from "../states/vehiclesStore";
import type { Vehicle, VehiclePayload, VehicleType } from "../types";

const props = defineProps<{ open: boolean; vehicle: Vehicle | null }>();
const emit = defineEmits<{ close: []; saved: [] }>();

const store = useVehiclesStore();
const { values, errors, reset, setFieldErrors } = useInput({
  plate_number: "",
  brand: "",
  model: "",
  year: new Date().getFullYear(),
  vehicle_type: "motor" as VehicleType,
  color: "",
  odometer: 0,
});

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) return;
    const { vehicle } = props;
    reset(vehicle ? { ...vehicle, color: vehicle.color ?? "" } : {});
  },
  { immediate: true }
);

const submit = async () => {
  const payload = emptyToNull({
    plate_number: values.plate_number.trim(),
    brand: values.brand.trim(),
    model: values.model.trim(),
    year: Number(values.year),
    vehicle_type: values.vehicle_type,
    color: values.color.trim(),
    odometer: Number(values.odometer) || 0,
  }) as VehiclePayload;

  const result = props.vehicle ? await store.changeVehicle(props.vehicle.id, payload) : await store.addVehicle(payload);
  if (result.ok) emit("saved");
  else setFieldErrors(result.errors);
};
</script>

<template>
  <BaseModal :open="open" :title="vehicle ? 'Ubah kendaraan' : 'Tambah kendaraan'" @close="emit('close')">
    <form id="vehicle-form" class="grid gap-4 sm:grid-cols-2" novalidate @submit.prevent="submit">
      <FormField label="Nomor polisi" for="plate_number" :error="errors.plate_number" class="sm:col-span-2">
        <input id="plate_number" v-model="values.plate_number" class="input uppercase" :class="{ 'input-error': errors.plate_number }" placeholder="BK 1234 AB" />
      </FormField>
      <FormField label="Jenis" for="vehicle_type" :error="errors.vehicle_type">
        <select id="vehicle_type" v-model="values.vehicle_type" class="input">
          <option value="motor">Motor</option>
          <option value="mobil">Mobil</option>
        </select>
      </FormField>
      <FormField label="Tahun" for="year" :error="errors.year">
        <input id="year" v-model.number="values.year" type="number" class="input" :class="{ 'input-error': errors.year }" />
      </FormField>
      <FormField label="Merek" for="brand" :error="errors.brand">
        <input id="brand" v-model="values.brand" class="input" :class="{ 'input-error': errors.brand }" placeholder="Honda" />
      </FormField>
      <FormField label="Model" for="model" :error="errors.model">
        <input id="model" v-model="values.model" class="input" :class="{ 'input-error': errors.model }" placeholder="Beat" />
      </FormField>
      <FormField label="Warna" for="color" :error="errors.color">
        <input id="color" v-model="values.color" class="input" placeholder="Putih" />
      </FormField>
      <FormField label="Kilometer saat ini" for="odometer" :error="errors.odometer">
        <input id="odometer" v-model.number="values.odometer" type="number" min="0" class="input" :class="{ 'input-error': errors.odometer }" />
      </FormField>
    </form>
    <template #footer>
      <button type="button" class="btn-secondary" @click="emit('close')">Batal</button>
      <button type="submit" form="vehicle-form" class="btn-primary" :disabled="store.isVehicleSaving">{{ store.isVehicleSaving ? "Menyimpan..." : "Simpan" }}</button>
    </template>
  </BaseModal>
</template>
