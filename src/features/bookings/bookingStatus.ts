import type { BookingStatus, StatusChange } from "./types";

export type Tone = "neutral" | "info" | "success" | "warning" | "danger" | "accent";

export const BOOKING_STATUS_META: Record<BookingStatus, { label: string; tone: Tone }> = {
  pending: { label: "Menunggu konfirmasi", tone: "warning" },
  confirmed: { label: "Dikonfirmasi", tone: "info" },
  in_progress: { label: "Sedang dikerjakan", tone: "accent" },
  completed: { label: "Selesai", tone: "success" },
  cancelled: { label: "Dibatalkan", tone: "danger" },
};

export const STATUS_FILTERS: { value: BookingStatus | ""; label: string }[] = [
  { value: "", label: "Semua" },
  { value: "pending", label: "Menunggu" },
  { value: "confirmed", label: "Dikonfirmasi" },
  { value: "in_progress", label: "Dikerjakan" },
  { value: "completed", label: "Selesai" },
  { value: "cancelled", label: "Dibatalkan" },
];

export interface AvailableActions {
  /** Perubahan status yang dapat dipilih (selain menyelesaikan servis). */
  transitions: StatusChange[];
  canComplete: boolean;
  canCancel: boolean;
}

/** Aksi yang tersedia untuk sebuah booking, sesuai role dan status saat ini. */
export const getAvailableActions = (status: BookingStatus, isAdmin: boolean): AvailableActions => {
  const cancellable = status === "pending" || status === "confirmed" || (isAdmin && status === "in_progress");
  if (!isAdmin) return { transitions: [], canComplete: false, canCancel: cancellable };

  const transitions: StatusChange[] =
    status === "pending" ? ["confirmed"] : status === "confirmed" ? ["in_progress"] : [];
  return { transitions, canComplete: status === "confirmed" || status === "in_progress", canCancel: cancellable };
};

export const STATUS_CHANGE_LABEL: Record<StatusChange, string> = {
  confirmed: "Konfirmasi",
  in_progress: "Mulai kerjakan",
  cancelled: "Batalkan",
};
