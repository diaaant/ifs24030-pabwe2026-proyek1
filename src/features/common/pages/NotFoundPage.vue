<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<template>
  <main class="flex min-h-screen flex-col items-center justify-center gap-4 bg-paper px-6 text-center">
    <p class="display text-7xl text-petrol-900">404</p>
    <h1 class="text-xl font-bold text-petrol-900">Halaman tidak ditemukan</h1>
    <p class="max-w-sm text-sm text-ink/65">Alamat yang Anda buka tidak ada atau sudah dipindahkan.</p>
    <RouterLink to="/" class="btn-primary">Kembali ke beranda</RouterLink>
  </main>
</template>
