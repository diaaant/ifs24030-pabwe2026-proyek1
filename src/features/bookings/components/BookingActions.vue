<script setup lang="ts">
import { computed, ref } from "vue";
import { useAuthStore } from "~/features/auth/states/authStore";
import { showConfirmDialog } from "~/helpers/toolsHelper";
import { getAvailableActions, STATUS_CHANGE_LABEL } from "../bookingStatus";
import { useBookingsStore } from "../states/bookingsStore";
import CompleteBookingModal from "../modals/CompleteBookingModal.vue";
import type { Booking, StatusChange } from "../types";

const props = defineProps<{ booking: Booking }>();
const emit = defineEmits<{ changed: [] }>();

const auth = useAuthStore();
const store = useBookingsStore();
const isCompleteOpen = ref(false);

const actions = computed(() => getAvailableActions(props.booking.status, auth.isAdmin));

const change = async (status: StatusChange) => {
  const result = await store.changeStatus(props.booking.id, status);
  if (result.ok) emit("changed");
};

const cancel = async () => {
  const confirmed = await showConfirmDialog(`Batalkan booking ${props.booking.code}?`, {
    title: "Batalkan booking",
    confirmText: "Ya, batalkan",
    danger: true,
  });
  if (!confirmed) return;

  const result = auth.isAdmin ? await store.changeStatus(props.booking.id, "cancelled") : await store.cancelBooking(props.booking.id);
  if (result.ok) emit("changed");
};

const onCompleted = () => {
  isCompleteOpen.value = false;
  emit("changed");
};
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <button v-for="status in actions.transitions" :key="status" class="btn-primary btn-sm" @click="change(status)">{{ STATUS_CHANGE_LABEL[status] }}</button>
    <button v-if="actions.canComplete" class="btn-signal btn-sm" @click="isCompleteOpen = true">Selesaikan servis</button>
    <button v-if="actions.canCancel" class="btn-secondary btn-sm text-red-700" @click="cancel">Batalkan</button>
    <CompleteBookingModal :open="isCompleteOpen" :booking="booking" @close="isCompleteOpen = false" @saved="onCompleted" />
  </div>
</template>
