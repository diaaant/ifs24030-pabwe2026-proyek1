import { toISODate } from "~/helpers/toolsHelper";

const SUNDAY = 0;

/** Tanggal terdekat (mulai dari `from`) yang bengkelnya buka; hari Minggu dilewati. */
export const nextOpenDate = (from: Date = new Date()): string => {
  const date = new Date(from);
  while (date.getDay() === SUNDAY) date.setDate(date.getDate() + 1);
  return toISODate(date);
};

export const isClosedDay = (isoDate: string): boolean => new Date(`${isoDate}T00:00:00`).getDay() === SUNDAY;
