<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, watch } from "vue";
import { Search } from "lucide-vue-next";
import { formatDate } from "~/helpers/toolsHelper";
import PageHeader from "~/features/common/components/PageHeader.vue";
import EmptyState from "~/features/common/components/EmptyState.vue";
import LoadingState from "~/features/common/components/LoadingState.vue";
import PaginationBar from "~/features/common/components/PaginationBar.vue";
import StatusBadge from "~/features/common/components/StatusBadge.vue";
import { useUsersStore } from "../states/usersStore";

const store = useUsersStore();
const filters = reactive({ page: 1, search: "" });
let searchTimer: ReturnType<typeof setTimeout> | undefined;

const load = () => store.fetchUsers({ ...filters, limit: 10 });

onMounted(load);
onBeforeUnmount(() => clearTimeout(searchTimer));

watch(() => filters.search, () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    filters.page = 1;
    load();
  }, 300);
});

const goToPage = (page: number) => {
  filters.page = page;
  load();
};
</script>

<template>
  <PageHeader title="Pelanggan" subtitle="Daftar akun yang terdaftar di BengkelKu." />

  <div class="relative mb-5 max-w-md">
    <Search :size="16" class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink/40" />
    <input v-model="filters.search" class="input pl-9" placeholder="Cari nama atau email" aria-label="Cari pelanggan" />
  </div>

  <LoadingState v-if="store.isUsersLoading && !store.users.length" />
  <EmptyState v-else-if="!store.users.length" title="Tidak ada pengguna ditemukan" description="Coba kata kunci pencarian yang lain." />

  <div v-else class="card overflow-x-auto">
    <table class="w-full min-w-[40rem] text-left text-sm">
      <thead class="border-b border-line text-ink/55">
        <tr><th class="px-4 py-3 font-semibold">Nama</th><th class="px-4 py-3 font-semibold">Email</th><th class="px-4 py-3 font-semibold">Telepon</th><th class="px-4 py-3 font-semibold">Role</th><th class="px-4 py-3 font-semibold">Bergabung</th></tr>
      </thead>
      <tbody>
        <tr v-for="user in store.users" :key="user.id" class="border-b border-line last:border-0">
          <td class="px-4 py-3 font-semibold text-petrol-900">{{ user.name }}</td>
          <td class="px-4 py-3">{{ user.email }}</td>
          <td class="px-4 py-3">{{ user.phone ?? "-" }}</td>
          <td class="px-4 py-3"><StatusBadge :label="user.role === 'admin' ? 'Admin' : 'Pelanggan'" :tone="user.role === 'admin' ? 'accent' : 'neutral'" /></td>
          <td class="px-4 py-3">{{ formatDate(user.created_at) }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <PaginationBar v-if="store.meta" :meta="store.meta" @change="goToPage" />
</template>
