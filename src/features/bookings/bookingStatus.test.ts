import { describe, expect, it } from "vitest";
import { getAvailableActions } from "./bookingStatus";

describe("getAvailableActions", () => {
  it.each([
    ["pending", true, { transitions: ["confirmed"], canComplete: false, canCancel: true }],
    ["confirmed", true, { transitions: ["in_progress"], canComplete: true, canCancel: true }],
    ["in_progress", true, { transitions: [], canComplete: true, canCancel: true }],
    ["completed", true, { transitions: [], canComplete: false, canCancel: false }],
    ["cancelled", true, { transitions: [], canComplete: false, canCancel: false }],
    ["pending", false, { transitions: [], canComplete: false, canCancel: true }],
    ["in_progress", false, { transitions: [], canComplete: false, canCancel: false }],
  ] as const)("status %s untuk admin=%s", (status, isAdmin, expected) => {
    expect(getAvailableActions(status, isAdmin)).toEqual(expected);
  });
});
