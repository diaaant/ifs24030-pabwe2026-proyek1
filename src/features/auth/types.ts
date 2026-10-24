export type Role = "customer" | "admin";

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: Role;
  created_at: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string | null;
  password: string;
}

export interface AuthResult {
  user: User;
  token: string;
}
