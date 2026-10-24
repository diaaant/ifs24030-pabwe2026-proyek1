import { mount, type VueWrapper } from "@vue/test-utils";
import { createPinia, setActivePinia, type Pinia } from "pinia";
import { createMemoryHistory, createRouter, type RouteRecordRaw } from "vue-router";
import type { Component } from "vue";
import { ApiError, type ApiResponse, type FieldError, type PageMeta } from "~/helpers/apiHelper";

export const okResponse = <T>(data: T, meta?: PageMeta, message = "OK"): ApiResponse<T> => ({
  success: true,
  message,
  data,
  meta,
});

export const rejectWith = (status: number, message: string, errors: FieldError[] = []) =>
  Promise.reject(new ApiError(message, status, errors));

export const createMockPinia = (initialState: Record<string, unknown> = {}): Pinia => {
  const pinia = createPinia();
  setActivePinia(pinia);
  pinia.state.value = initialState;
  return pinia;
};

interface RenderOptions {
  props?: Record<string, unknown>;
  slots?: Record<string, string>;
  route?: string;
  routes?: RouteRecordRaw[];
  state?: Record<string, unknown>;
}

const Blank = { template: "<div />" };

/** Render komponen bersama Pinia dan Vue Router (memory history). */
export async function renderWithProviders(component: Component, options: RenderOptions = {}) {
  const { props, slots, route = "/", routes, state } = options;
  const pinia = createMockPinia(state);
  const router = createRouter({
    history: createMemoryHistory(),
    routes: routes ?? [{ path: "/:pathMatch(.*)*", component: Blank }],
  });
  await router.push(route);
  await router.isReady();

  const wrapper: VueWrapper = mount(component, { props, slots, global: { plugins: [pinia, router] } });
  return { wrapper, pinia, router };
}
