<script setup lang="ts">
defineProps<{ title: string; description?: string }>();
</script>

<template>
  <div class="card flex flex-col items-center gap-2 px-6 py-12 text-center">
    <h2 class="text-base font-bold text-petrol-900">{{ title }}</h2>
    <!-- PERBAIKAN: text-ink/60 diubah menjadi text-ink/80 -->
    <p v-if="description" class="max-w-sm text-sm text-ink/80">{{ description }}</p>
    <div class="mt-3"><slot /></div>
  </div>
</template>