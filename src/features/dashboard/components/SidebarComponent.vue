<script setup lang="ts">
import { computed, type Component } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { BellRing, CalendarClock, Car, History, LayoutDashboard, UserRound, Users, Wrench, X } from "lucide-vue-next";
import { useAuthStore } from "~/features/auth/states/authStore";
import { getNavItems, isNavActive } from "../navigation";

defineProps<{ open: boolean }>();
defineEmits<{ close: [] }>();

const ICONS: Record<string, Component> = { LayoutDashboard, CalendarClock, Car, Wrench, History, BellRing, Users, UserRound };

const auth = useAuthStore();
const route = useRoute();
const items = computed(() => getNavItems(auth.user?.role ?? null));
</script>

<template>
  <div v-if="open" class="fixed inset-0 z-30 bg-petrol-950/50 lg:hidden print:hidden" @click="$emit('close')" />

  <aside
    class="fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-petrol-900 text-white transition-transform lg:translate-x-0 print:hidden"
    :class="open ? 'translate-x-0' : '-translate-x-full'"
    aria-label="Menu utama"
  >
    <div class="flex items-center justify-between px-5 py-5">
      <div class="flex items-center gap-3">
        <img src="/logo.svg" alt="" class="h-9 w-9" />
        <span class="display text-lg">BengkelKu</span>
      </div>
      <button class="rounded-md p-1 text-petrol-200 hover:bg-petrol-800 lg:hidden" aria-label="Tutup menu" @click="$emit('close')"><X :size="18" /></button>
    </div>

    <nav class="flex-1 space-y-1 px-3 py-2">
      <RouterLink
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors"
        :class="isNavActive(item.to, route.path) ? 'bg-signal-400 text-petrol-950' : 'text-petrol-100 hover:bg-petrol-800'"
        @click="$emit('close')"
      >
        <component :is="ICONS[item.icon]" :size="18" />
        {{ item.label }}
      </RouterLink>
    </nav>

    <p class="px-5 py-4 text-xs text-petrol-200">Buka Senin sampai Sabtu, 08.00 sampai 17.00</p>
  </aside>
</template>
