<script setup lang="ts">
import { computed, onMounted, watch } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { useInput } from "~/hooks/useInput";
import { formatRupiah, toISODate } from "~/helpers/toolsHelper";
import PageHeader from "~/features/common/components/PageHeader.vue";
import FormField from "~/features/common/components/FormField.vue";
import { useVehiclesStore } from "~/features/vehicles/states/vehiclesStore";
import { useServicesStore } from "~/features/services/states/servicesStore";
import { useBookingsStore } from "../states/bookingsStore";
import { nextOpenDate } from "../bookingDates";

const route = useRoute();
const router = useRouter();
const vehicles = useVehiclesStore();
const services = useServicesStore();
const bookings = useBookingsStore();

const { values, errors, setValues, setFieldErrors, clearErrors } = useInput({
  vehicle_id: 0,
  service_id: 0,
  booking_date: nextOpenDate(),
  time_slot: "",
  odometer: "" as number | "",
  complaint: "",
});

const today = toISODate(new Date());
const selectedVehicle = computed(() => vehicles.vehicles.find((item) => item.id === values.vehicle_id));
const selectedService = computed(() => services.services.find((item) => item.id === values.service_id));

/** Hanya tampilkan layanan yang cocok dengan jenis kendaraan terpilih. */
const availableServices = computed(() =>
  services.services.filter((item) => !selectedVehicle.value || item.vehicle_type === "semua" || item.vehicle_type === selectedVehicle.value.vehicle_type)
);

onMounted(async () => {
  await Promise.all([vehicles.fetchVehicles({ limit: 100 }), services.fetchServices()]);

  const vehicleId = Number(route.query.vehicle);
  const serviceId = Number(route.query.service);
  if (vehicles.vehicles.some((item) => item.id === vehicleId)) values.vehicle_id = vehicleId;
  if (services.services.some((item) => item.id === serviceId)) values.service_id = serviceId;
  if (!values.vehicle_id && vehicles.vehicles.length === 1) values.vehicle_id = vehicles.vehicles[0].id;
  await bookings.fetchAvailability(values.booking_date);
});

watch(() => values.vehicle_id, () => {
  if (selectedService.value && !availableServices.value.includes(selectedService.value)) values.service_id = 0;
});

watch(() => values.booking_date, async (date) => {
  values.time_slot = "";
  if (date) await bookings.fetchAvailability(date);
});

const submit = async () => {
  clearErrors();
  const found = [];
  if (!values.vehicle_id) found.push({ field: "vehicle_id", message: "Pilih kendaraan" });
  if (!values.service_id) found.push({ field: "service_id", message: "Pilih layanan" });
  if (!values.time_slot) found.push({ field: "time_slot", message: "Pilih jam servis" });
  if (found.length) return setFieldErrors(found);

  const result = await bookings.createBooking({
    vehicle_id: values.vehicle_id,
    service_id: values.service_id,
    booking_date: values.booking_date,
    time_slot: values.time_slot,
    odometer: values.odometer === "" ? null : Number(values.odometer),
    complaint: values.complaint.trim() || null,
  });

  if (result.ok) await router.replace(`/bookings/${result.data.id}`);
  else {
    setFieldErrors(result.errors);
    if (result.errors.some((item) => item.field === "time_slot")) await bookings.fetchAvailability(values.booking_date);
  }
};
</script>

<template>
  <PageHeader title="Booking servis" subtitle="Pilih kendaraan, layanan, lalu jam yang masih tersedia." />

  <div v-if="!vehicles.isVehiclesLoading && !vehicles.vehicles.length" class="card mb-6 border-signal-400 bg-signal-300/20 p-5">
    <p class="font-semibold text-petrol-900">Anda belum memiliki kendaraan.</p>
    <RouterLink to="/vehicles" class="mt-2 inline-block text-sm font-semibold text-petrol-700 underline">Tambahkan kendaraan terlebih dahulu</RouterLink>
  </div>

  <form class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]" novalidate @submit.prevent="submit">
    <div class="card space-y-5 p-5 sm:p-6">
      <div class="grid gap-4 sm:grid-cols-2">
        <FormField label="Kendaraan" for="vehicle_id" :error="errors.vehicle_id">
          <select id="vehicle_id" v-model.number="values.vehicle_id" class="input" :class="{ 'input-error': errors.vehicle_id }">
            <option :value="0" disabled>Pilih kendaraan</option>
            <option v-for="item in vehicles.vehicles" :key="item.id" :value="item.id">{{ item.plate_number }}, {{ item.brand }} {{ item.model }}</option>
          </select>
        </FormField>
        <FormField label="Layanan" for="service_id" :error="errors.service_id">
          <select id="service_id" v-model.number="values.service_id" class="input" :class="{ 'input-error': errors.service_id }">
            <option :value="0" disabled>Pilih layanan</option>
            <option v-for="item in availableServices" :key="item.id" :value="item.id">{{ item.name }}</option>
          </select>
        </FormField>
      </div>

      <FormField label="Tanggal" for="booking_date" :error="errors.booking_date" hint="Bengkel buka Senin sampai Sabtu">
        <input id="booking_date" v-model="values.booking_date" type="date" :min="today" class="input sm:max-w-xs" :class="{ 'input-error': errors.booking_date }" />
      </FormField>

      <fieldset>
        <legend class="mb-1.5 text-sm font-semibold">Jam servis</legend>
        <p v-if="bookings.availability?.closed" class="rounded-lg bg-red-50 p-3 text-sm text-red-800">Bengkel libur pada hari Minggu. Pilih tanggal lain.</p>
        <div v-else class="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <button
            v-for="slot in bookings.availability?.slots ?? []"
            :key="slot.time"
            type="button"
            :disabled="slot.available === 0"
            :aria-pressed="values.time_slot === slot.time"
            class="rounded-lg border px-3 py-2 text-left text-sm disabled:cursor-not-allowed disabled:bg-paper disabled:text-ink/35"
            :class="values.time_slot === slot.time ? 'border-petrol-900 bg-petrol-900 text-white' : 'border-line bg-white'"
            @click="values.time_slot = slot.time"
          >
            <span class="block font-bold tabular-nums">{{ slot.time }}</span>
            <span class="text-xs opacity-75">{{ slot.available === 0 ? "Penuh" : `Sisa ${slot.available}` }}</span>
          </button>
        </div>
        <p v-if="errors.time_slot" class="mt-1.5 text-xs font-medium text-red-700" role="alert">{{ errors.time_slot }}</p>
      </fieldset>

      <FormField label="Kilometer saat ini" for="odometer" :error="errors.odometer" hint="Opsional, membantu teknisi menyiapkan suku cadang">
        <input id="odometer" v-model.number="values.odometer" type="number" min="0" class="input sm:max-w-xs" />
      </FormField>
      <FormField label="Keluhan atau catatan" for="complaint" :error="errors.complaint">
        <textarea id="complaint" v-model="values.complaint" rows="3" class="input" placeholder="Contoh: Terdengar bunyi dari roda depan saat mengerem" />
      </FormField>
    </div>

    <aside class="card h-fit space-y-4 p-5 lg:sticky lg:top-24">
      <h2 class="text-base font-bold text-petrol-900">Ringkasan booking</h2>
      <dl class="space-y-2 text-sm">
        <div class="flex justify-between gap-3"><dt class="text-ink/60">Kendaraan</dt><dd class="text-right font-semibold">{{ selectedVehicle?.plate_number ?? "-" }}</dd></div>
        <div class="flex justify-between gap-3"><dt class="text-ink/60">Layanan</dt><dd class="text-right font-semibold">{{ selectedService?.name ?? "-" }}</dd></div>
        <div class="flex justify-between gap-3"><dt class="text-ink/60">Jadwal</dt><dd class="text-right font-semibold">{{ values.booking_date }} {{ values.time_slot }}</dd></div>
        <div class="flex justify-between gap-3"><dt class="text-ink/60">Durasi</dt><dd class="text-right font-semibold">{{ selectedService ? `${selectedService.duration_minutes} menit` : "-" }}</dd></div>
      </dl>
      <div class="ticket-divider" />
      <div class="flex items-baseline justify-between">
        <span class="text-sm text-ink/60">Estimasi jasa</span>
        <span class="display text-xl text-petrol-900">{{ selectedService ? formatRupiah(selectedService.price) : "-" }}</span>
      </div>
      <p class="text-xs text-ink/55">Biaya akhir dapat berubah bila ada suku cadang yang diganti.</p>
      <button type="submit" class="btn-primary w-full" :disabled="bookings.isBookingSaving">{{ bookings.isBookingSaving ? "Memproses..." : "Buat booking" }}</button>
    </aside>
  </form>
</template>
