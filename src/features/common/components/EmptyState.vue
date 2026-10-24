<script setup lang="ts">
defineProps<{ title: string; description?: string }>();
</script>

<template>
  <div class="card flex flex-col items-center gap-2 px-6 py-12 text-center">
    <h2 class="text-base font-bold text-petrol-900">{{ title }}</h2>
    <p v-if="description" class="max-w-sm text-sm text-ink/60">{{ description }}</p>
    <div class="mt-3"><slot /></div>
  </div>
</template>
