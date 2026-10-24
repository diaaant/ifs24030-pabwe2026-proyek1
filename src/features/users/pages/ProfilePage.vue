<script setup lang="ts">
import { watch } from "vue";
import { useAuthStore } from "~/features/auth/states/authStore";
import { useInput } from "~/hooks/useInput";
import PageHeader from "~/features/common/components/PageHeader.vue";
import FormField from "~/features/common/components/FormField.vue";
import StatusBadge from "~/features/common/components/StatusBadge.vue";
import { useUsersStore } from "../states/usersStore";

const auth = useAuthStore();
const store = useUsersStore();

const profile = useInput({ name: auth.user?.name ?? "", phone: auth.user?.phone ?? "" });
const password = useInput({ current_password: "", new_password: "", confirm: "" });

watch(() => auth.user, (user) => {
  if (user) profile.reset({ name: user.name, phone: user.phone ?? "" });
});

const saveProfile = async () => {
  const result = await store.updateProfile({ name: profile.values.name.trim(), phone: profile.values.phone.trim() || null });
  if (!result.ok) profile.setFieldErrors(result.errors);
};

const savePassword = async () => {
  if (password.values.new_password !== password.values.confirm) {
    return password.setFieldErrors([{ field: "confirm", message: "Konfirmasi kata sandi tidak sama" }]);
  }
  const result = await store.changePassword({
    current_password: password.values.current_password,
    new_password: password.values.new_password,
  });
  if (result.ok) password.reset();
  else password.setFieldErrors(result.errors);
};
</script>

<template>
  <PageHeader title="Profil" subtitle="Perbarui data kontak dan kata sandi akun Anda." />

  <div class="grid max-w-4xl gap-6 lg:grid-cols-2">
    <form class="card space-y-4 p-5 sm:p-6" novalidate @submit.prevent="saveProfile">
      <div class="flex items-center justify-between">
        <h2 class="text-base font-bold text-petrol-900">Data akun</h2>
        <StatusBadge :label="auth.isAdmin ? 'Admin' : 'Pelanggan'" :tone="auth.isAdmin ? 'accent' : 'neutral'" />
      </div>
      <FormField label="Email" for="email"><input id="email" :value="auth.user?.email" class="input" disabled /></FormField>
      <FormField label="Nama lengkap" for="name" :error="profile.errors.name"><input id="name" v-model="profile.values.name" class="input" :class="{ 'input-error': profile.errors.name }" /></FormField>
      <FormField label="Nomor telepon" for="phone" :error="profile.errors.phone"><input id="phone" v-model="profile.values.phone" type="tel" class="input" :class="{ 'input-error': profile.errors.phone }" /></FormField>
      <button type="submit" class="btn-primary" :disabled="store.isProfileSaving">Simpan profil</button>
    </form>

    <form class="card space-y-4 p-5 sm:p-6" novalidate @submit.prevent="savePassword">
      <h2 class="text-base font-bold text-petrol-900">Ubah kata sandi</h2>
      <FormField label="Kata sandi saat ini" for="current_password" :error="password.errors.current_password"><input id="current_password" v-model="password.values.current_password" type="password" autocomplete="current-password" class="input" :class="{ 'input-error': password.errors.current_password }" /></FormField>
      <FormField label="Kata sandi baru" for="new_password" :error="password.errors.new_password" hint="Minimal 8 karakter, gabungan huruf dan angka"><input id="new_password" v-model="password.values.new_password" type="password" autocomplete="new-password" class="input" :class="{ 'input-error': password.errors.new_password }" /></FormField>
      <FormField label="Ulangi kata sandi baru" for="confirm" :error="password.errors.confirm"><input id="confirm" v-model="password.values.confirm" type="password" autocomplete="new-password" class="input" :class="{ 'input-error': password.errors.confirm }" /></FormField>
      <button type="submit" class="btn-primary" :disabled="store.isProfileSaving">Ubah kata sandi</button>
    </form>
  </div>
</template>
