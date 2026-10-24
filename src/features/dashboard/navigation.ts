import type { Role } from "~/features/auth/types";

export interface NavItem {
  label: string;
  to: string;
  icon: string;
  roles?: Role[];
}

const NAV_ITEMS: NavItem[] = [
  { label: "Ringkasan", to: "/", icon: "LayoutDashboard" },
  { label: "Booking servis", to: "/bookings", icon: "CalendarClock" },
  { label: "Kendaraan", to: "/vehicles", icon: "Car" },
  { label: "Layanan", to: "/services", icon: "Wrench" },
  { label: "Riwayat servis", to: "/history", icon: "History" },
  { label: "Pengingat", to: "/reminders", icon: "BellRing" },
  { label: "Pelanggan", to: "/users", icon: "Users", roles: ["admin"] },
  { label: "Profil", to: "/profile", icon: "UserRound" },
];

export const getNavItems = (role: Role | null): NavItem[] =>
  NAV_ITEMS.filter((item) => !item.roles || (role !== null && item.roles.includes(role)));

/** Menu "Ringkasan" hanya aktif pada "/", menu lain aktif pada seluruh sub-rutenya. */
export const isNavActive = (itemPath: string, currentPath: string): boolean =>
  itemPath === "/" ? currentPath === "/" : currentPath === itemPath || currentPath.startsWith(`${itemPath}/`);
