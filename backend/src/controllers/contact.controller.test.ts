import { describe, it, expect, vi } from "vitest";
import type { Request, Response } from "express";

vi.mock("../utils/mailSender.js", () => ({
  mailSender: vi.fn().mockResolvedValue(undefined),
}));

const { contactUs } = await import("./contact.controller.js");

const buildReq = (body: Record<string, unknown>): Request => ({ body }) as unknown as Request;

const buildRes = (): Response => {
  const res = {} as Response;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe("contactUs validation messages", () => {
  it("returns meaningful, non-duplicated messages for a completely empty payload", async () => {
    await expect(contactUs(buildReq({}), buildRes())).rejects.toMatchObject({
      message: "Email is required. Message is required.",
      statusCode: 400,
    });
  });

  it("reports only the email as required when just the email is missing", async () => {
    const req = buildReq({ name: "Test", message: "Hello there, this is a message." });

    await expect(contactUs(req, buildRes())).rejects.toMatchObject({
      message: "Email is required.",
      statusCode: 400,
    });
  });

  it("reports only the message as required when just the message is missing", async () => {
    const req = buildReq({ name: "Test", email: "test@example.com" });

    await expect(contactUs(req, buildRes())).rejects.toMatchObject({
      message: "Message is required.",
      statusCode: 400,
    });
  });

  it("still reports the email format error for a present but invalid email", async () => {
    const req = buildReq({ name: "Test", email: "not-an-email", message: "Hello there, this is a message." });

    await expect(contactUs(req, buildRes())).rejects.toMatchObject({
      message: "Please provide a valid email address.",
      statusCode: 400,
    });
  });

  it("still reports the message-required error for an empty (present) message string", async () => {
    const req = buildReq({ name: "Test", email: "test@example.com", message: "" });

    await expect(contactUs(req, buildRes())).rejects.toMatchObject({
      message: "Message is required.",
      statusCode: 400,
    });
  });
});
