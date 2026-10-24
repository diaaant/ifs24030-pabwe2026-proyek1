<script setup lang="ts">
import { RouterLink, useRouter } from "vue-router";
import { useAuthStore } from "../states/authStore";
import { useInput } from "~/hooks/useInput";
import FormField from "~/features/common/components/FormField.vue";

const auth = useAuthStore();
const router = useRouter();
const { values, errors, setValues, setFieldErrors, clearErrors } = useInput({ email: "", password: "" });

const DEMO_ACCOUNTS = [
  { label: "Masuk sebagai admin", email: "admin@bengkelku.id", password: "Admin123!" },
  { label: "Masuk sebagai pelanggan", email: "budi@example.com", password: "Customer123" },
];

const validate = (): boolean => {
  const found = [];
  if (!values.email.trim()) found.push({ field: "email", message: "Email wajib diisi" });
  if (!values.password) found.push({ field: "password", message: "Kata sandi wajib diisi" });
  setFieldErrors(found);
  return found.length === 0;
};

const submit = async () => {
  clearErrors();
  if (!validate()) return;

  const result = await auth.login({ email: values.email.trim(), password: values.password });
  if (result.ok) await router.replace("/");
  else setFieldErrors(result.errors);
};
</script>

<template>
  <section>
    <h2 class="display text-3xl text-petrol-900">Masuk</h2>
    <p class="mt-2 text-sm text-ink/65">Kelola booking dan riwayat servis kendaraan Anda.</p>

    <form class="mt-8 space-y-5" novalidate @submit.prevent="submit">
      <FormField label="Email" for="email" :error="errors.email">
        <input id="email" v-model="values.email" type="email" autocomplete="email" class="input" :class="{ 'input-error': errors.email }" placeholder="nama@email.com" />
      </FormField>
      <FormField label="Kata sandi" for="password" :error="errors.password">
        <input id="password" v-model="values.password" type="password" autocomplete="current-password" class="input" :class="{ 'input-error': errors.password }" />
      </FormField>
      <button type="submit" class="btn-primary w-full" :disabled="auth.isAuthLogin">
        {{ auth.isAuthLogin ? "Memproses..." : "Masuk" }}
      </button>
    </form>

    <p class="mt-6 text-center text-sm text-ink/65">
      Belum punya akun?
      <RouterLink to="/auth/register" class="font-semibold text-petrol-700 underline">Daftar sekarang</RouterLink>
    </p>

    <div class="mt-8 rounded-xl border border-dashed border-line p-4">
      <p class="text-xs font-semibold text-ink/60">Akun demo (data contoh)</p>
      <div class="mt-3 flex flex-wrap gap-2">
        <button v-for="account in DEMO_ACCOUNTS" :key="account.email" type="button" class="btn-secondary btn-sm" @click="setValues({ email: account.email, password: account.password })">
          {{ account.label }}
        </button>
      </div>
    </div>
  </section>
</template>
