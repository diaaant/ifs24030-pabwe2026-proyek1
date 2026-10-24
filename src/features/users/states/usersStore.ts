import { defineStore } from "pinia";
import { runApi, type PageMeta } from "~/helpers/apiHelper";
import { notifyResult } from "~/helpers/actionHelper";
import { useAuthStore } from "~/features/auth/states/authStore";
import type { User } from "~/features/auth/types";
import { userApi } from "../api/userApi";
import type { PasswordPayload, ProfilePayload, UserQuery } from "../types";

interface UsersState {
  users: User[];
  meta: PageMeta | null;
  isUsersLoading: boolean;
  isProfileSaving: boolean;
}

export const useUsersStore = defineStore("users", {
  state: (): UsersState => ({ users: [], meta: null, isUsersLoading: false, isProfileSaving: false }),

  actions: {
    async fetchUsers(query: UserQuery = {}) {
      this.isUsersLoading = true;
      const result = await runApi(() => userApi.list(query));
      this.isUsersLoading = false;

      if (result.ok) {
        this.users = result.data;
        this.meta = result.meta ?? null;
      } else {
        notifyResult(result);
      }
      return result;
    },

    async updateProfile(payload: ProfilePayload) {
      this.isProfileSaving = true;
      const result = await runApi(() => userApi.updateMe(payload));
      this.isProfileSaving = false;

      if (result.ok) useAuthStore().setUser(result.data);
      notifyResult(result, "Profil diperbarui");
      return result;
    },

    async changePassword(payload: PasswordPayload) {
      this.isProfileSaving = true;
      const result = await runApi(() => userApi.changePassword(payload));
      this.isProfileSaving = false;

      notifyResult(result, "Kata sandi diubah");
      return result;
    },
  },
});
