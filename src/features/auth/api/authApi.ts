import { apiRequest } from "~/helpers/apiHelper";
import type { AuthResult, LoginPayload, RegisterPayload } from "../types";

export const authApi = {
  login: (payload: LoginPayload) =>
    apiRequest<AuthResult>("/auth/login", { method: "POST", body: payload, auth: false }),

  register: (payload: RegisterPayload) =>
    apiRequest<AuthResult>("/auth/register", { method: "POST", body: payload, auth: false }),
};
