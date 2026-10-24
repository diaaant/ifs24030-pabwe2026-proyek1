<script setup lang="ts">
import { computed } from "vue";
import type { Tone } from "~/features/bookings/bookingStatus";

const props = defineProps<{ label: string; tone?: Tone }>();

const TONE_CLASSES: Record<Tone, string> = {
  neutral: "bg-slate-100 text-slate-700",
  info: "bg-sky-100 text-sky-800",
  success: "bg-emerald-100 text-emerald-800",
  warning: "bg-amber-100 text-amber-900",
  danger: "bg-red-100 text-red-800",
  accent: "bg-signal-300/60 text-signal-700",
};

const toneClass = computed(() => TONE_CLASSES[props.tone ?? "neutral"]);
</script>

<template>
  <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold" :class="toneClass">
    {{ label }}
  </span>
</template>
