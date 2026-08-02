import { describe, it, expect } from "vitest";
import { getDailyLimitForPlan } from "./usage.service.js";

describe("getDailyLimitForPlan", () => {
  it("resolves the FREE plan to the free daily limit", () => {
    expect(getDailyLimitForPlan("FREE")).toBe(2);
  });

  it("resolves an unspecified plan to the free daily limit", () => {
    expect(getDailyLimitForPlan(undefined)).toBe(2);
  });

  it("resolves the PRO plan to the pro daily limit", () => {
    expect(getDailyLimitForPlan("PRO")).toBe(3);
  });
});
