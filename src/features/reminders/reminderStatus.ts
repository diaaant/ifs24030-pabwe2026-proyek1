import type { Tone } from "~/features/bookings/bookingStatus";
import type { ReminderStatus } from "./types";

export const REMINDER_STATUS_META: Record<ReminderStatus, { label: string; tone: Tone }> = {
  overdue: { label: "Terlambat servis", tone: "danger" },
  soon: { label: "Segera servis", tone: "warning" },
  ok: { label: "Aman", tone: "success" },
  no_history: { label: "Belum ada riwayat", tone: "neutral" },
};

/** Ringkas sisa waktu dan kilometer menjadi kalimat yang mudah dibaca. */
export const describeRemaining = (daysLeft: number | null, kmLeft: number | null): string[] => {
  const parts: string[] = [];
  if (daysLeft !== null) parts.push(daysLeft < 0 ? `terlambat ${-daysLeft} hari` : `${daysLeft} hari lagi`);
  if (kmLeft !== null) parts.push(kmLeft < 0 ? `lewat ${-kmLeft} km` : `${kmLeft} km lagi`);
  return parts;
};
