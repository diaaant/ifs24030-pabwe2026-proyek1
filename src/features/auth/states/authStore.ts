import { defineStore } from "pinia";
import { getAccessToken, putAccessToken, removeAccessToken, runApi } from "~/helpers/apiHelper";
import { notifyResult } from "~/helpers/actionHelper";
import { userApi } from "~/features/users/api/userApi";
import { authApi } from "../api/authApi";
import type { LoginPayload, RegisterPayload, User } from "../types";

const USER_KEY = "bengkelku_user";

const readStoredUser = (): User | null => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) ?? "null");
  } catch {
    return null;
  }
};

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthLogin: boolean;
  isAuthRegister: boolean;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({ user: null, token: null, isAuthLogin: false, isAuthRegister: false }),

  getters: {
    isLoggedIn: (state) => Boolean(state.token && state.user),
    isAdmin: (state) => state.user?.role === "admin",
  },

  actions: {
    /** Pulihkan sesi dari localStorage saat aplikasi dibuka. */
    restoreSession() {
      this.token = getAccessToken();
      this.user = this.token ? readStoredUser() : null;
    },

    setUser(user: User) {
      this.user = user;
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    },

    startSession(token: string, user: User) {
      putAccessToken(token);
      this.token = token;
      this.setUser(user);
    },

    clearSession() {
      removeAccessToken();
      localStorage.removeItem(USER_KEY);
      this.token = null;
      this.user = null;
    },

    async login(payload: LoginPayload) {
      this.isAuthLogin = true;
      const result = await runApi(() => authApi.login(payload));
      this.isAuthLogin = false;

      if (result.ok) this.startSession(result.data.token, result.data.user);
      notifyResult(result, result.ok ? `Selamat datang, ${result.data.user.name}` : undefined);
      return result;
    },

    async register(payload: RegisterPayload) {
      this.isAuthRegister = true;
      const result = await runApi(() => authApi.register(payload));
      this.isAuthRegister = false;

      if (result.ok) this.startSession(result.data.token, result.data.user);
      notifyResult(result, result.ok ? "Akun berhasil dibuat" : undefined);
      return result;
    },

    /** Sinkronkan profil dengan server; sesi dihapus bila token sudah tidak berlaku. */
    async refreshProfile() {
      const result = await runApi(() => userApi.me());
      if (result.ok) this.setUser(result.data);
      else if (result.status === 401) this.clearSession();
      return result;
    },

    logout() {
      this.clearSession();
    },
  },
});
