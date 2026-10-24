import Swal from "sweetalert2";

const BRAND_COLOR = "#0C2F3B";
const DANGER_COLOR = "#B42318";

export const showSuccessDialog = (message: string, title = "Berhasil") =>
  Swal.fire({ icon: "success", title, text: message, confirmButtonColor: BRAND_COLOR });

export const showErrorDialog = (message: string, title = "Terjadi kendala") =>
  Swal.fire({ icon: "error", title, text: message, confirmButtonColor: BRAND_COLOR });

export const showToast = (message: string, icon: "success" | "error" | "info" = "success") =>
  Swal.fire({
    toast: true,
    position: "top-end",
    icon,
    title: message,
    showConfirmButton: false,
    timer: 2800,
    timerProgressBar: true,
  });

export interface ConfirmOptions {
  title?: string;
  confirmText?: string;
  danger?: boolean;
}

/** Dialog konfirmasi; mengembalikan true jika pengguna menekan tombol konfirmasi. */
export const showConfirmDialog = async (message: string, options: ConfirmOptions = {}): Promise<boolean> => {
  const { title = "Konfirmasi", confirmText = "Ya, lanjutkan", danger = false } = options;
  const result = await Swal.fire({
    icon: danger ? "warning" : "question",
    title,
    text: message,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: "Batal",
    confirmButtonColor: danger ? DANGER_COLOR : BRAND_COLOR,
    reverseButtons: true,
    focusCancel: danger,
  });
  return result.isConfirmed;
};

export const formatRupiah = (value: number): string =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 })
    .format(value)
    .replace(/\s/g, " ");

/** Rupiah ringkas untuk label grafik: 1.250.000 menjadi "1,3 jt". */
export const formatCompactRupiah = (value: number): string => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1).replace(".", ",")} jt`;
  if (value >= 1_000) return `${Math.round(value / 1_000)} rb`;
  return String(value);
};

export const formatNumber = (value: number): string => new Intl.NumberFormat("id-ID").format(value);

export const formatKm = (value: number): string => `${formatNumber(value)} km`;

/** Format tanggal "YYYY-MM-DD" (atau timestamp SQLite) menjadi "21 Okt 2026". */
export const formatDate = (isoDate: string): string =>
  new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${isoDate.slice(0, 10)}T00:00:00Z`)
  );

/** Format timestamp SQLite (UTC, "YYYY-MM-DD HH:mm:ss") ke waktu lokal pengguna. */
export const formatDateTime = (timestamp: string): string =>
  new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(
    new Date(`${timestamp.replace(" ", "T")}Z`)
  );

/** "2026-05" menjadi "Mei". */
export const formatMonthShort = (yearMonth: string): string =>
  new Intl.DateTimeFormat("id-ID", { month: "short", timeZone: "UTC" }).format(new Date(`${yearMonth}-01T00:00:00Z`));

export const toISODate = (date: Date): string => {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

export const getInitials = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");

/** Singkirkan field kosong agar tidak terkirim sebagai string kosong ke API. */
export const emptyToNull = <T extends Record<string, unknown>>(values: T): T =>
  Object.fromEntries(Object.entries(values).map(([key, value]) => [key, value === "" ? null : value])) as T;
