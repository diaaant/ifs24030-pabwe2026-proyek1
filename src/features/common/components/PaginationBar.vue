<script setup lang="ts">
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import type { PageMeta } from "~/helpers/apiHelper";

defineProps<{ meta: PageMeta }>();
defineEmits<{ change: [page: number] }>();
</script>

<template>
  <nav v-if="meta.totalPages > 1" class="mt-4 flex items-center justify-between gap-3 text-sm" aria-label="Halaman">
    <p class="text-ink/60">Halaman {{ meta.page }} dari {{ meta.totalPages }} ({{ meta.total }} data)</p>
    <div class="flex gap-2">
      <button class="btn-secondary btn-sm" :disabled="meta.page <= 1" aria-label="Halaman sebelumnya" @click="$emit('change', meta.page - 1)">
        <ChevronLeft :size="16" />
      </button>
      <button class="btn-secondary btn-sm" :disabled="meta.page >= meta.totalPages" aria-label="Halaman berikutnya" @click="$emit('change', meta.page + 1)">
        <ChevronRight :size="16" />
      </button>
    </div>
  </nav>
</template>
