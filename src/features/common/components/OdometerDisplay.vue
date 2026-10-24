<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(defineProps<{ value: number; compact?: boolean }>(), { compact: false });

/** Minimal enam digit seperti panel odometer kendaraan. */
const digits = computed(() => String(Math.max(0, Math.round(props.value))).padStart(6, "0").split(""));
</script>

<template>
  <div class="inline-flex items-center gap-1.5" role="img" :aria-label="`${value} kilometer`">
    <div class="inline-flex gap-0.5 rounded-md bg-petrol-950 p-1">
      <span
        v-for="(digit, index) in digits"
        :key="index"
        class="flex items-center justify-center rounded-sm bg-petrol-900 font-bold tabular-nums text-signal-400"
        :class="compact ? 'h-6 w-4 text-xs' : 'h-8 w-5.5 text-base'"
      >
        {{ digit }}
      </span>
    </div>
    <span class="text-xs font-semibold text-ink/60">km</span>
  </div>
</template>
