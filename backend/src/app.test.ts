import { describe, it, expect } from "vitest";
import request from "supertest";
import { createApp } from "./app.js";

describe("createApp — Helmet security headers", () => {
  it("applies baseline security headers and removes the X-Powered-By fingerprint, without breaking CORS", async () => {
    const app = createApp();

    const response = await request(app).get("/api/health").set("Origin", "http://127.0.0.1:5173");

    expect(response.status).toBe(200);
    expect(response.headers["x-powered-by"]).toBeUndefined();
    expect(response.headers["x-content-type-options"]).toBe("nosniff");
    expect(response.headers["access-control-allow-origin"]).toBe("http://127.0.0.1:5173");
  });
});
