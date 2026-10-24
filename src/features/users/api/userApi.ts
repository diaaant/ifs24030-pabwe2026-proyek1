import { apiRequest } from "~/helpers/apiHelper";
import type { User } from "~/features/auth/types";
import type { PasswordPayload, ProfilePayload, UserQuery } from "../types";

export const userApi = {
  me: () => apiRequest<User>("/users/me"),

  updateMe: (payload: ProfilePayload) => apiRequest<User>("/users/me", { method: "PUT", body: payload }),

  changePassword: (payload: PasswordPayload) =>
    apiRequest<null>("/users/me/password", { method: "PUT", body: payload }),

  list: (query: UserQuery = {}) => apiRequest<User[]>("/users", { query }),
};
