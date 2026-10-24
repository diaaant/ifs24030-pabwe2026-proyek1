<script setup lang="ts">
import { LogOut, Menu } from "lucide-vue-next";
import { useAuthStore } from "~/features/auth/states/authStore";
import { getInitials } from "~/helpers/toolsHelper";

defineEmits<{ "toggle-sidebar": []; logout: [] }>();

const auth = useAuthStore();
</script>

<template>
  <header class="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-white/90 px-4 py-3 backdrop-blur sm:px-8 print:hidden">
    <button class="rounded-md p-2 text-petrol-900 hover:bg-paper lg:hidden" aria-label="Buka menu" @click="$emit('toggle-sidebar')"><Menu :size="20" /></button>
    <span class="hidden text-sm text-ink/60 lg:block">{{ auth.isAdmin ? "Panel admin bengkel" : "Akun pelanggan" }}</span>

    <div v-if="auth.user" class="flex items-center gap-3">
      <div class="text-right leading-tight">
        <p class="text-sm font-semibold text-petrol-900">{{ auth.user.name }}</p>
        <p class="text-xs text-ink/55">{{ auth.user.email }}</p>
      </div>
      <span class="flex h-9 w-9 items-center justify-center rounded-full bg-petrol-900 text-xs font-bold text-signal-400" aria-hidden="true">{{ getInitials(auth.user.name) }}</span>
      <button class="btn-secondary btn-sm" @click="$emit('logout')"><LogOut :size="14" /> Keluar</button>
    </div>
  </header>
</template>
