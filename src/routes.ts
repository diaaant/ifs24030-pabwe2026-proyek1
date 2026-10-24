import type { RouteRecordRaw } from "vue-router";

/**
 * Daftar rute aplikasi. Rute di bawah layout dashboard membutuhkan login;
 * `meta.roles` membatasi halaman tertentu hanya untuk role yang disebutkan.
 */
export const routes: RouteRecordRaw[] = [
  {
    path: "/auth",
    component: () => import("./features/auth/layouts/AuthLayout.vue"),
    children: [
      { path: "", redirect: "/auth/login" },
      { path: "login", name: "login", component: () => import("./features/auth/pages/LoginPage.vue") },
      { path: "register", name: "register", component: () => import("./features/auth/pages/RegisterPage.vue") },
    ],
  },
  {
    path: "/",
    component: () => import("./features/dashboard/layouts/DashboardLayout.vue"),
    children: [
      { path: "", name: "home", component: () => import("./features/dashboard/pages/HomePage.vue") },
      { path: "vehicles", name: "vehicles", component: () => import("./features/vehicles/pages/VehiclesPage.vue") },
      {
        path: "vehicles/:vehicleId",
        name: "vehicle-detail",
        component: () => import("./features/vehicles/pages/VehicleDetailPage.vue"),
      },
      { path: "bookings", name: "bookings", component: () => import("./features/bookings/pages/BookingsPage.vue") },
      {
        path: "bookings/new",
        name: "booking-new",
        component: () => import("./features/bookings/pages/NewBookingPage.vue"),
      },
      {
        path: "bookings/:bookingId",
        name: "booking-detail",
        component: () => import("./features/bookings/pages/BookingDetailPage.vue"),
      },
      { path: "services", name: "services", component: () => import("./features/services/pages/ServicesPage.vue") },
      { path: "history", name: "history", component: () => import("./features/history/pages/HistoryPage.vue") },
      {
        path: "history/:historyId",
        name: "invoice",
        component: () => import("./features/history/pages/InvoicePage.vue"),
      },
      { path: "reminders", name: "reminders", component: () => import("./features/reminders/pages/RemindersPage.vue") },
      {
        path: "users",
        name: "users",
        meta: { roles: ["admin"] },
        component: () => import("./features/users/pages/UsersPage.vue"),
      },
      { path: "profile", name: "profile", component: () => import("./features/users/pages/ProfilePage.vue") },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("./features/common/pages/NotFoundPage.vue"),
  },
];
