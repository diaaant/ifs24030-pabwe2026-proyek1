export interface ProfilePayload {
  name: string;
  phone: string | null;
}

export interface PasswordPayload {
  current_password: string;
  new_password: string;
}

export interface UserQuery {
  page?: number;
  limit?: number;
  search?: string;
}
