<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { RouterView, useRouter } from "vue-router";
import { useAuthStore } from "~/features/auth/states/authStore";
import { showConfirmDialog } from "~/helpers/toolsHelper";
import NavbarComponent from "../components/NavbarComponent.vue";
import SidebarComponent from "../components/SidebarComponent.vue";

const auth = useAuthStore();
const router = useRouter();
const isSidebarOpen = ref(false);

// Segarkan profil; bila token sudah tidak berlaku, store menghapus sesi.
onMounted(() => auth.refreshProfile());

watch(
  () => auth.isLoggedIn,
  (isLoggedIn) => {
    if (!isLoggedIn) router.replace("/auth/login");
  }
);

const logout = async () => {
  const confirmed = await showConfirmDialog("Anda akan keluar dari BengkelKu.", { title: "Keluar?", confirmText: "Keluar" });
  if (confirmed) auth.logout();
};
</script>

<template>
  <div class="min-h-screen lg:pl-64 print:pl-0">
    <SidebarComponent :open="isSidebarOpen" @close="isSidebarOpen = false" />
    <div class="flex min-h-screen flex-col">
      <NavbarComponent @toggle-sidebar="isSidebarOpen = true" @logout="logout" />
      <main class="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-8 sm:py-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>
