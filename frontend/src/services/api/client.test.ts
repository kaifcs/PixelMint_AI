import { describe, it, expect } from "vitest";
import { ApiClientError } from "./client";

describe("ApiClientError", () => {
  it("creates error with message and status", () => {
    const err = new ApiClientError("Not Found", 404);
    expect(err.message).toBe("Not Found");
    expect(err.status).toBe(404);
    expect(err.name).toBe("ApiClientError");
  });
});
