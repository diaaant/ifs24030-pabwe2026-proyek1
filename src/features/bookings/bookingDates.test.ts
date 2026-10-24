import { describe, expect, it } from "vitest";
import { isClosedDay, nextOpenDate } from "./bookingDates";

describe("bookingDates", () => {
  it("melewati hari Minggu", () => {
    expect(nextOpenDate(new Date(2026, 9, 25))).toBe("2026-10-26");
    expect(nextOpenDate(new Date(2026, 9, 24))).toBe("2026-10-24");
  });

  it("memakai hari ini secara bawaan", () => {
    expect(nextOpenDate()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("mengenali hari libur", () => {
    expect(isClosedDay("2026-10-25")).toBe(true);
    expect(isClosedDay("2026-10-26")).toBe(false);
  });
});
