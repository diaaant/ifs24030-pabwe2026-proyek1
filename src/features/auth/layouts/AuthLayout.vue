<script setup lang="ts">
import { RouterView } from "vue-router";
import OdometerDisplay from "~/features/common/components/OdometerDisplay.vue";
</script>

<template>
  <div class="grid min-h-screen lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
    <aside class="relative hidden flex-col justify-between overflow-hidden bg-petrol-900 p-12 text-white lg:flex">
      <div class="flex items-center gap-3">
        <img src="/logo.svg" alt="" class="h-10 w-10" />
        <span class="display text-xl">BengkelKu</span>
      </div>

      <div class="space-y-8">
        <h1 class="display max-w-md text-4xl leading-tight">Servis terjadwal, kendaraan tetap prima.</h1>
        <p class="max-w-sm text-base text-petrol-100">
          Pesan jam servis, simpan riwayat perawatan, dan terima pengingat sebelum kilometer atau tanggal servis berikutnya terlewat.
        </p>
        <div class="space-y-2">
          <OdometerDisplay :value="48215" />
          <p class="text-sm text-petrol-200">Kilometer tercatat otomatis di setiap servis.</p>
        </div>
      </div>

      <p class="text-sm text-petrol-200">Buka Senin sampai Sabtu, pukul 08.00 sampai 17.00.</p>
    </aside>

    <main class="flex items-center justify-center px-5 py-10 sm:px-10">
      <div class="w-full max-w-md">
        <div class="mb-8 flex items-center gap-3 lg:hidden">
          <img src="/logo.svg" alt="" class="h-9 w-9" />
          <span class="display text-lg text-petrol-900">BengkelKu</span>
        </div>
        <RouterView />
      </div>
    </main>
  </div>
</template>
