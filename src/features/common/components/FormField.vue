<script setup lang="ts">
defineProps<{ label: string; for?: string; error?: string; hint?: string }>();
</script>

<template>
  <div class="space-y-1.5">
    <label :for="$props.for" class="block text-sm font-semibold text-ink">{{ label }}</label>
    <slot />
    <p v-if="error" class="text-xs font-medium text-red-700" role="alert">{{ error }}</p>
    <p v-else-if="hint" class="text-xs text-ink/55">{{ hint }}</p>
  </div>
</template>
