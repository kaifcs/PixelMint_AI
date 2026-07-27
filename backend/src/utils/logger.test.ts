import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { logger } from "./logger.js";

describe("logger", () => {
  let logSpy: ReturnType<typeof vi.spyOn>;
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("logs info messages with timestamp", () => {
    logger.info("Test message", { userId: "123" });
    expect(logSpy).toHaveBeenCalledTimes(1);
    const loggedString = logSpy.mock.calls[0][0] as string;
    const parsed = JSON.parse(loggedString);
    expect(parsed.level).toBe("info");
    expect(parsed.message).toBe("Test message");
    expect(parsed.userId).toBe("123");
    expect(parsed.timestamp).toBeDefined();
  });

  it("logs error messages using console.error", () => {
    logger.error("Error occurred", { code: 500 });
    expect(errorSpy).toHaveBeenCalledTimes(1);
    const loggedString = errorSpy.mock.calls[0][0] as string;
    const parsed = JSON.parse(loggedString);
    expect(parsed.level).toBe("error");
    expect(parsed.message).toBe("Error occurred");
    expect(parsed.code).toBe(500);
  });

  it("automatically redacts sensitive keys from metadata", () => {
    logger.info("User login", {
      username: "kaif",
      password: "SuperSecretPassword123!",
      token: "jwt.token.here",
      apiKey: "secret-api-key",
      nested: {
        authorization: "Bearer 12345",
        safeData: "public",
      },
    });

    expect(logSpy).toHaveBeenCalledTimes(1);
    const loggedString = logSpy.mock.calls[0][0] as string;
    const parsed = JSON.parse(loggedString);

    expect(parsed.username).toBe("kaif");
    expect(parsed.password).toBe("[REDACTED]");
    expect(parsed.token).toBe("[REDACTED]");
    expect(parsed.apiKey).toBe("[REDACTED]");
    expect(parsed.nested.authorization).toBe("[REDACTED]");
    expect(parsed.nested.safeData).toBe("public");
  });
});
