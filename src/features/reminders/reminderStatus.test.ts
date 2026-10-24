import { describe, expect, it } from "vitest";
import { describeRemaining } from "./reminderStatus";

describe("describeRemaining", () => {
  it("menjelaskan sisa hari dan kilometer", () => {
    expect(describeRemaining(20, 300)).toEqual(["20 hari lagi", "300 km lagi"]);
  });

  it("menjelaskan keterlambatan", () => {
    expect(describeRemaining(-40, -50)).toEqual(["terlambat 40 hari", "lewat 50 km"]);
  });

  it("melewati nilai yang tidak ada", () => {
    expect(describeRemaining(null, null)).toEqual([]);
    expect(describeRemaining(5, null)).toEqual(["5 hari lagi"]);
  });
});
