<script setup lang="ts">
import { computed } from "vue";

export interface BarItem {
  label: string;
  value: number;
}

const props = withDefaults(
  defineProps<{ items: BarItem[]; formatValue?: (value: number) => string; barClass?: string }>(),
  { formatValue: (value: number) => String(value), barClass: "bg-petrol-700" }
);

const max = computed(() => Math.max(1, ...props.items.map((item) => item.value)));
const heightOf = (value: number) => `${Math.max(value > 0 ? 6 : 0, (value / max.value) * 100)}%`;
</script>

<template>
  <div class="flex h-48 items-end gap-3" role="img" :aria-label="items.map((item) => `${item.label}: ${formatValue(item.value)}`).join(', ')">
    <div v-for="item in items" :key="item.label" class="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
      <span class="text-xs font-semibold text-ink/70">{{ formatValue(item.value) }}</span>
      <div class="w-full flex-1 flex items-end">
        <div class="w-full rounded-t-md" :class="barClass" :style="{ height: heightOf(item.value) }" />
      </div>
      <span class="text-xs text-ink/55">{{ item.label }}</span>
    </div>
  </div>
</template>
