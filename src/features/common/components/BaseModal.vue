<script setup lang="ts">
import { X } from "lucide-vue-next";
import { onBeforeUnmount, watch } from "vue";

const props = defineProps<{ open: boolean; title: string }>();
const emit = defineEmits<{ close: [] }>();

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape") emit("close");
};

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) document.addEventListener("keydown", onKeydown);
    else document.removeEventListener("keydown", onKeydown);
  },
  { immediate: true }
);

onBeforeUnmount(() => document.removeEventListener("keydown", onKeydown));
</script>

<template>
  <div v-if="open" class="fixed inset-0 z-40 flex items-end justify-center bg-petrol-950/60 p-0 sm:items-center sm:p-4" @mousedown.self="emit('close')">
    <section class="flex max-h-[92vh] w-full max-w-lg flex-col rounded-t-2xl bg-white shadow-xl sm:rounded-2xl" role="dialog" aria-modal="true" :aria-label="title">
      <header class="flex items-center justify-between border-b border-line px-5 py-4">
        <h2 class="display text-lg text-petrol-900">{{ title }}</h2>
        <button class="rounded-md p-1 text-ink/60 hover:bg-paper" aria-label="Tutup" @click="emit('close')"><X :size="18" /></button>
      </header>
      <div class="overflow-y-auto px-5 py-4"><slot /></div>
      <footer v-if="$slots.footer" class="flex justify-end gap-2 border-t border-line px-5 py-3"><slot name="footer" /></footer>
    </section>
  </div>
</template>
