import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response } from "express";

const getOwnedHistoryRecordMock = vi.fn();
const deleteHistoryRowMock = vi.fn();
const destroyCloudinaryAssetMock = vi.fn();
const loggerWarnMock = vi.fn();
const loggerInfoMock = vi.fn();

vi.mock("../services/history.service.js", () => ({
  getOwnedHistoryRecord: (...args: unknown[]) => getOwnedHistoryRecordMock(...args),
  deleteHistoryRow: (...args: unknown[]) => deleteHistoryRowMock(...args),
  getUserHistory: vi.fn(),
}));

vi.mock("../services/cloudinary.service.js", () => ({
  destroyCloudinaryAsset: (...args: unknown[]) => destroyCloudinaryAssetMock(...args),
}));

vi.mock("../utils/logger.js", () => ({
  logger: {
    warn: (...args: unknown[]) => loggerWarnMock(...args),
    info: (...args: unknown[]) => loggerInfoMock(...args),
    error: vi.fn(),
  },
}));

const { deleteHistoryItem } = await import("./user.controller.js");

const buildReq = (imageId = "image-1", userId = "user-1"): Request =>
  ({
    user: { id: userId, email: "user@example.com", accessToken: "token", profile: { id: userId, email: "user@example.com", full_name: null, plan: "FREE" } },
    params: { id: imageId },
  }) as unknown as Request;

const buildRes = (): Response => {
  const res = {} as Response;
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe("deleteHistoryItem", () => {
  beforeEach(() => {
    getOwnedHistoryRecordMock.mockReset();
    deleteHistoryRowMock.mockReset();
    destroyCloudinaryAssetMock.mockReset();
    loggerWarnMock.mockReset();
    loggerInfoMock.mockReset();
  });

  it("deletes both Cloudinary assets when both public ids exist", async () => {
    getOwnedHistoryRecordMock.mockResolvedValue({
      id: "image-1",
      original_public_id: "originals/a",
      processed_public_id: "processed/a",
    });
    destroyCloudinaryAssetMock.mockResolvedValue({ result: "ok" });
    deleteHistoryRowMock.mockResolvedValue(undefined);

    const req = buildReq();
    const res = buildRes();

    await deleteHistoryItem(req, res);

    expect(destroyCloudinaryAssetMock).toHaveBeenCalledTimes(2);
    expect(destroyCloudinaryAssetMock).toHaveBeenCalledWith("originals/a");
    expect(destroyCloudinaryAssetMock).toHaveBeenCalledWith("processed/a");
    expect(deleteHistoryRowMock).toHaveBeenCalledWith("user-1", "image-1");
    expect(res.json).toHaveBeenCalledWith({ success: true, message: "Image deleted successfully." });
  });

  it("only attempts deletion for the public id that actually exists", async () => {
    getOwnedHistoryRecordMock.mockResolvedValue({
      id: "image-1",
      original_public_id: "originals/a",
      processed_public_id: null,
    });
    destroyCloudinaryAssetMock.mockResolvedValue({ result: "ok" });
    deleteHistoryRowMock.mockResolvedValue(undefined);

    await deleteHistoryItem(buildReq(), buildRes());

    expect(destroyCloudinaryAssetMock).toHaveBeenCalledTimes(1);
    expect(destroyCloudinaryAssetMock).toHaveBeenCalledWith("originals/a");
  });

  it("treats a Cloudinary 'not found' response as success and does not log a warning", async () => {
    getOwnedHistoryRecordMock.mockResolvedValue({
      id: "image-1",
      original_public_id: "originals/a",
      processed_public_id: "processed/a",
    });
    // The Cloudinary SDK resolves (does not throw) for "not found" — destroyCloudinaryAsset
    // never inspects the result, so this must not be treated as a failure.
    destroyCloudinaryAssetMock.mockResolvedValue({ result: "not found" });
    deleteHistoryRowMock.mockResolvedValue(undefined);

    const res = buildRes();
    await deleteHistoryItem(buildReq(), res);

    expect(loggerWarnMock).not.toHaveBeenCalled();
    expect(deleteHistoryRowMock).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ success: true, message: "Image deleted successfully." });
  });

  it("logs a warning identifying the image id and which asset failed when Cloudinary throws, but still deletes the database row and returns success", async () => {
    getOwnedHistoryRecordMock.mockResolvedValue({
      id: "image-1",
      original_public_id: "originals/a",
      processed_public_id: "processed/a",
    });
    destroyCloudinaryAssetMock.mockRejectedValueOnce(new Error("Cloudinary API error"));
    destroyCloudinaryAssetMock.mockResolvedValueOnce({ result: "ok" });
    deleteHistoryRowMock.mockResolvedValue(undefined);

    const res = buildRes();
    await deleteHistoryItem(buildReq(), res);

    expect(loggerWarnMock).toHaveBeenCalledTimes(1);
    const [message, meta] = loggerWarnMock.mock.calls[0];
    expect(message).toBe("history_deletion.cloudinary_failed");
    expect(meta).toMatchObject({ imageId: "image-1", asset: "original" });
    expect(meta.error).not.toContain("secret");

    expect(deleteHistoryRowMock).toHaveBeenCalledWith("user-1", "image-1");
    expect(res.json).toHaveBeenCalledWith({ success: true, message: "Image deleted successfully." });
  });

  it("still deletes the database row and returns success even when both Cloudinary deletions fail", async () => {
    getOwnedHistoryRecordMock.mockResolvedValue({
      id: "image-1",
      original_public_id: "originals/a",
      processed_public_id: "processed/a",
    });
    destroyCloudinaryAssetMock.mockRejectedValue(new Error("Cloudinary unavailable"));
    deleteHistoryRowMock.mockResolvedValue(undefined);

    const res = buildRes();
    await deleteHistoryItem(buildReq(), res);

    expect(loggerWarnMock).toHaveBeenCalledTimes(2);
    expect(deleteHistoryRowMock).toHaveBeenCalledWith("user-1", "image-1");
    expect(res.json).toHaveBeenCalledWith({ success: true, message: "Image deleted successfully." });
  });

  it("rejects (unauthorized) when the image does not belong to the requesting user, without touching Cloudinary or the database", async () => {
    const notFoundError = Object.assign(new Error("Image not found."), { statusCode: 404 });
    getOwnedHistoryRecordMock.mockRejectedValue(notFoundError);

    await expect(deleteHistoryItem(buildReq("someone-elses-image"), buildRes())).rejects.toMatchObject({
      statusCode: 404,
    });

    expect(destroyCloudinaryAssetMock).not.toHaveBeenCalled();
    expect(deleteHistoryRowMock).not.toHaveBeenCalled();
  });
});
