<script setup lang="ts">
import { onMounted } from "vue";
import { useAuthStore } from "~/features/auth/states/authStore";
import PageHeader from "~/features/common/components/PageHeader.vue";
import LoadingState from "~/features/common/components/LoadingState.vue";
import { useStatsStore } from "../states/statsStore";
import AdminDashboard from "../components/AdminDashboard.vue";
import CustomerDashboard from "../components/CustomerDashboard.vue";

const auth = useAuthStore();
const stats = useStatsStore();

onMounted(() => stats.fetchDashboard());
</script>

<template>
  <PageHeader
    :title="auth.isAdmin ? 'Ringkasan bengkel' : `Halo, ${auth.user?.name.split(' ')[0] ?? ''}`"
    :subtitle="auth.isAdmin ? 'Pantau booking, pendapatan, dan layanan yang paling sering dipesan.' : 'Pantau jadwal servis dan kondisi perawatan kendaraan Anda.'"
  />

  <LoadingState v-if="stats.isDashboardLoading && !stats.dashboard" />
  <AdminDashboard v-else-if="stats.dashboard?.role === 'admin'" :data="stats.dashboard" />
  <CustomerDashboard v-else-if="stats.dashboard?.role === 'customer'" :data="stats.dashboard" />
</template>
