<script setup lang="ts">
import { RouterLink, useRouter } from "vue-router";
import { useAuthStore } from "../states/authStore";
import { useInput } from "~/hooks/useInput";
import { emptyToNull } from "~/helpers/toolsHelper";
import FormField from "~/features/common/components/FormField.vue";

const auth = useAuthStore();
const router = useRouter();
const { values, errors, setFieldErrors, clearErrors } = useInput({ name: "", email: "", phone: "", password: "", confirm: "" });

const validate = (): boolean => {
  const found = [];
  if (values.name.trim().length < 3) found.push({ field: "name", message: "Nama minimal 3 karakter" });
  if (!values.email.trim()) found.push({ field: "email", message: "Email wajib diisi" });
  if (values.password.length < 8) found.push({ field: "password", message: "Kata sandi minimal 8 karakter" });
  if (values.confirm !== values.password) found.push({ field: "confirm", message: "Konfirmasi kata sandi tidak sama" });
  setFieldErrors(found);
  return found.length === 0;
};

const submit = async () => {
  clearErrors();
  if (!validate()) return;

  const { name, email, phone, password } = values;
  const result = await auth.register(emptyToNull({ name: name.trim(), email: email.trim(), phone: phone.trim(), password }));
  if (result.ok) await router.replace("/");
  else setFieldErrors(result.errors);
};
</script>

<template>
  <section>
    <h2 class="display text-3xl text-petrol-900">Buat akun</h2>
    <p class="mt-2 text-sm text-ink/65">Daftarkan kendaraan dan pesan jam servis dalam hitungan menit.</p>

    <form class="mt-8 space-y-4" novalidate @submit.prevent="submit">
      <FormField label="Nama lengkap" for="name" :error="errors.name">
        <input id="name" v-model="values.name" autocomplete="name" class="input" :class="{ 'input-error': errors.name }" />
      </FormField>
      <FormField label="Email" for="email" :error="errors.email">
        <input id="email" v-model="values.email" type="email" autocomplete="email" class="input" :class="{ 'input-error': errors.email }" />
      </FormField>
      <FormField label="Nomor telepon" for="phone" :error="errors.phone" hint="Opsional, contoh 081234567890">
        <input id="phone" v-model="values.phone" type="tel" autocomplete="tel" class="input" :class="{ 'input-error': errors.phone }" />
      </FormField>
      <FormField label="Kata sandi" for="password" :error="errors.password" hint="Minimal 8 karakter, gabungan huruf dan angka">
        <input id="password" v-model="values.password" type="password" autocomplete="new-password" class="input" :class="{ 'input-error': errors.password }" />
      </FormField>
      <FormField label="Ulangi kata sandi" for="confirm" :error="errors.confirm">
        <input id="confirm" v-model="values.confirm" type="password" autocomplete="new-password" class="input" :class="{ 'input-error': errors.confirm }" />
      </FormField>
      <button type="submit" class="btn-primary w-full" :disabled="auth.isAuthRegister">
        {{ auth.isAuthRegister ? "Memproses..." : "Daftar" }}
      </button>
    </form>

    <p class="mt-6 text-center text-sm text-ink/65">
      Sudah punya akun?
      <RouterLink to="/auth/login" class="font-semibold text-petrol-700 underline">Masuk</RouterLink>
    </p>
  </section>
</template>
