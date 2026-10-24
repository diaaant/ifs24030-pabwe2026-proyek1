import type { BookingStatus } from "~/features/bookings/types";

export interface MonthlyPoint {
  month: string;
  total: number;
}

export type StatusCounts = Record<BookingStatus, number>;

export interface AdminDashboard {
  role: "admin";
  totals: {
    customers: number;
    vehicles: number;
    bookings: number;
    revenue: number;
    today_bookings: number;
    pending_bookings: number;
  };
  status_counts: StatusCounts;
  bookings_per_month: MonthlyPoint[];
  revenue_per_month: MonthlyPoint[];
  popular_services: { id: number; name: string; total: number }[];
}

export interface CustomerDashboard {
  role: "customer";
  totals: {
    vehicles: number;
    active_bookings: number;
    services_done: number;
    total_spent: number;
    reminders_due: number;
  };
  status_counts: StatusCounts;
  today: string;
}

export type Dashboard = AdminDashboard | CustomerDashboard;
