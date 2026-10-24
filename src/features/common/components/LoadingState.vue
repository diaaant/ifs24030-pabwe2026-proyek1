<script setup lang="ts">
withDefaults(defineProps<{ label?: string }>(), { label: "Memuat data..." });
</script>

<template>
  <div class="flex items-center justify-center gap-3 py-16 text-sm text-ink/60" role="status">
    <span class="h-4 w-4 animate-spin rounded-full border-2 border-petrol-200 border-t-petrol-700" />
    {{ label }}
  </div>
</template>
