export interface FieldError {
  field: string;
  message: string;
}

export interface PageMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: PageMeta;
  errors?: FieldError[];
}

export type QueryParams = Record<string, string | number | boolean | null | undefined>;

export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  query?: QueryParams;
  /** Sertakan header Authorization (default true). */
  auth?: boolean;
}

export type ActionResult<T> =
  | { ok: true; data: T; meta?: PageMeta; message: string }
  | { ok: false; message: string; errors: FieldError[]; status: number };

export class ApiError extends Error {
  status: number;
  errors: FieldError[];

  constructor(message: string, status: number, errors: FieldError[] = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

const TOKEN_KEY = "bengkelku_token";

export const getAccessToken = (): string | null => localStorage.getItem(TOKEN_KEY);

export const putAccessToken = (token: string): void => localStorage.setItem(TOKEN_KEY, token);

export const removeAccessToken = (): void => localStorage.removeItem(TOKEN_KEY);

/** Susun URL dengan query string; nilai kosong (null, undefined, "") dilewati. */
export const buildUrl = (path: string, query: QueryParams = {}): string => {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") params.append(key, String(value));
  });
  const queryString = params.toString();
  return `${BENGKELKU_API_URL}${path}${queryString ? `?${queryString}` : ""}`;
};

/** Pembungkus fetch ke REST API: menambahkan token Bearer dan menyeragamkan error. */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  const { method = "GET", body, query, auth = true } = options;

  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const token = getAccessToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(buildUrl(path, query), {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError("Tidak dapat terhubung ke server. Periksa koneksi Anda.", 0);
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401 && auth) removeAccessToken();
    throw new ApiError(
      payload?.message ?? "Terjadi kesalahan pada server",
      response.status,
      payload?.errors ?? []
    );
  }

  return payload as ApiResponse<T>;
}

/** Jalankan request dan ubah ApiError menjadi hasil terstruktur agar store tidak perlu try/catch. */
export async function runApi<T>(request: () => Promise<ApiResponse<T>>): Promise<ActionResult<T>> {
  try {
    const response = await request();
    return { ok: true, data: response.data, meta: response.meta, message: response.message };
  } catch (error) {
    if (error instanceof ApiError) {
      return { ok: false, message: error.message, errors: error.errors, status: error.status };
    }
    throw error;
  }
}
