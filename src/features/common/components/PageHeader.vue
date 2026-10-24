<script setup lang="ts">
defineProps<{ title: string; subtitle?: string }>();
</script>

<template>
  <header class="mb-6 flex flex-wrap items-end justify-between gap-3 print:hidden">
    <div class="min-w-0">
      <h1 class="display text-2xl text-petrol-900 sm:text-3xl">{{ title }}</h1>
      <p v-if="subtitle" class="mt-1 max-w-prose text-sm text-ink/65">{{ subtitle }}</p>
    </div>
    <div class="flex flex-wrap items-center gap-2"><slot /></div>
  </header>
</template>
