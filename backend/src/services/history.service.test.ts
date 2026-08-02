import { describe, it, expect, vi, beforeEach } from "vitest";

const rpcMock = vi.fn();

vi.mock("../config/supabase.js", () => ({
  supabaseAdmin: {
    rpc: (...args: unknown[]) => rpcMock(...args),
  },
}));

const { createHistoryRecordAtomic, createHistoryRecord } = await import("./history.service.js");

const baseImageParams = {
  userId: "user-1",
  originalImageUrl: "https://res.cloudinary.com/demo/originals/photo.png",
  originalPublicId: "pixelmint-ai/originals/photo",
  processedImageUrl: "https://res.cloudinary.com/demo/processed/photo.png",
  processedPublicId: "pixelmint-ai/processed/photo",
  sourceFilename: "photo.png",
};

describe("history.service RPC call shape", () => {
  beforeEach(() => {
    rpcMock.mockReset();
  });

  it("calls the canonical 7-parameter RPC with no p_plan argument", async () => {
    rpcMock.mockResolvedValue({ data: "SUCCESS", error: null });

    await createHistoryRecordAtomic({ ...baseImageParams, limit: 2 });

    expect(rpcMock).toHaveBeenCalledTimes(1);
    const [fnName, args] = rpcMock.mock.calls[0];

    expect(fnName).toBe("check_and_record_image_processing_atomic");
    expect(args).not.toHaveProperty("p_plan");
    expect(args).toEqual({
      p_user_id: "user-1",
      p_limit: 2,
      p_original_url: baseImageParams.originalImageUrl,
      p_original_public_id: baseImageParams.originalPublicId,
      p_processed_url: baseImageParams.processedImageUrl,
      p_processed_public_id: baseImageParams.processedPublicId,
      p_filename: baseImageParams.sourceFilename,
    });
  });

  it("throws a 429 AppError when the RPC reports QUOTA_EXCEEDED", async () => {
    rpcMock.mockResolvedValue({ data: "QUOTA_EXCEEDED", error: null });

    await expect(createHistoryRecordAtomic({ ...baseImageParams, limit: 2 })).rejects.toMatchObject({
      statusCode: 429,
    });
  });

  it("does not throw when the RPC reports SUCCESS", async () => {
    rpcMock.mockResolvedValue({ data: "SUCCESS", error: null });

    await expect(createHistoryRecordAtomic({ ...baseImageParams, limit: 2 })).resolves.toBeUndefined();
  });

  it("resolves the FREE plan to the free daily limit and still sends no p_plan", async () => {
    rpcMock.mockResolvedValue({ data: "SUCCESS", error: null });

    await createHistoryRecord({ ...baseImageParams, plan: "FREE" });

    const [, args] = rpcMock.mock.calls[0];
    expect(args.p_limit).toBe(2);
    expect(args).not.toHaveProperty("p_plan");
  });

  it("resolves the PRO plan to the pro daily limit and still sends no p_plan", async () => {
    rpcMock.mockResolvedValue({ data: "SUCCESS", error: null });

    await createHistoryRecord({ ...baseImageParams, plan: "PRO" });

    const [, args] = rpcMock.mock.calls[0];
    expect(args.p_limit).toBe(3);
    expect(args).not.toHaveProperty("p_plan");
  });
});
