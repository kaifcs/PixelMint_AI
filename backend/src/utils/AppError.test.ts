import { describe, it, expect } from "vitest";
import { AppError } from "./AppError.js";

describe("AppError", () => {
  it("creates error with default status code 500", () => {
    const error = new AppError("Something went wrong");
    expect(error.message).toBe("Something went wrong");
    expect(error.statusCode).toBe(500);
    expect(error.name).toBe("AppError");
    expect(error.exposeDetails).toBe(false);
    expect(error.details).toBeUndefined();
  });

  it("creates error with custom status code and details", () => {
    const details = { field: "email", issue: "invalid format" };
    const error = new AppError("Validation Failed", 400, details, true);
    expect(error.message).toBe("Validation Failed");
    expect(error.statusCode).toBe(400);
    expect(error.details).toEqual(details);
    expect(error.exposeDetails).toBe(true);
  });
});
