import { describe, it, expect, vi, beforeEach } from "vitest";

const rpcMock = vi.fn();
const fromMock = vi.fn();

vi.mock("../config/supabase.js", () => ({
  supabaseAdmin: {
    rpc: (...args: unknown[]) => rpcMock(...args),
    from: (...args: unknown[]) => fromMock(...args),
  },
}));

const { createHistoryRecordAtomic, createHistoryRecord, getOwnedHistoryRecord, deleteHistoryRow } = await import(
  "./history.service.js"
);

interface ChainResult {
  data?: unknown;
  error: unknown;
}

const buildSupabaseChain = (result: ChainResult) => {
  const eqMock = vi.fn();
  const chain: {
    delete: () => typeof chain;
    select: () => typeof chain;
    eq: (...args: unknown[]) => typeof chain;
    maybeSingle: () => Promise<ChainResult>;
    then: (resolve: (value: ChainResult) => void) => void;
  } = {
    delete: () => chain,
    select: () => chain,
    eq: (...args: unknown[]) => {
      eqMock(...args);
      return chain;
    },
    maybeSingle: async () => result,
    then: (resolve) => resolve(result),
  };
  return { chain, eqMock };
};

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
    fromMock.mockReset();
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

describe("getOwnedHistoryRecord", () => {
  beforeEach(() => {
    fromMock.mockReset();
  });

  it("scopes the lookup to both the image id and the requesting user (ownership check)", async () => {
    const { chain, eqMock } = buildSupabaseChain({
      data: { id: "image-1", original_public_id: "originals/a", processed_public_id: "processed/a" },
      error: null,
    });
    fromMock.mockReturnValue(chain);

    await getOwnedHistoryRecord("user-1", "image-1");

    expect(fromMock).toHaveBeenCalledWith("processed_images");
    expect(eqMock).toHaveBeenCalledWith("id", "image-1");
    expect(eqMock).toHaveBeenCalledWith("user_id", "user-1");
  });

  it("returns both public ids when both exist", async () => {
    const { chain } = buildSupabaseChain({
      data: { id: "image-1", original_public_id: "originals/a", processed_public_id: "processed/a" },
      error: null,
    });
    fromMock.mockReturnValue(chain);

    const record = await getOwnedHistoryRecord("user-1", "image-1");

    expect(record.original_public_id).toBe("originals/a");
    expect(record.processed_public_id).toBe("processed/a");
  });

  it("returns null for a public id that was never recorded", async () => {
    const { chain } = buildSupabaseChain({
      data: { id: "image-1", original_public_id: "originals/a", processed_public_id: null },
      error: null,
    });
    fromMock.mockReturnValue(chain);

    const record = await getOwnedHistoryRecord("user-1", "image-1");

    expect(record.original_public_id).toBe("originals/a");
    expect(record.processed_public_id).toBeNull();
  });

  it("throws a 404 AppError when the image does not belong to the requesting user (unauthorized deletion attempt)", async () => {
    const { chain } = buildSupabaseChain({ data: null, error: null });
    fromMock.mockReturnValue(chain);

    await expect(getOwnedHistoryRecord("user-1", "someone-elses-image")).rejects.toMatchObject({
      statusCode: 404,
    });
  });

  it("throws a 500 AppError when Supabase reports an error", async () => {
    const { chain } = buildSupabaseChain({ data: null, error: { message: "db unavailable" } });
    fromMock.mockReturnValue(chain);

    await expect(getOwnedHistoryRecord("user-1", "image-1")).rejects.toMatchObject({
      statusCode: 500,
    });
  });
});

describe("deleteHistoryRow", () => {
  beforeEach(() => {
    fromMock.mockReset();
  });

  it("scopes the delete to both the image id and the requesting user", async () => {
    const { chain, eqMock } = buildSupabaseChain({ error: null });
    fromMock.mockReturnValue(chain);

    await deleteHistoryRow("user-1", "image-1");

    expect(fromMock).toHaveBeenCalledWith("processed_images");
    expect(eqMock).toHaveBeenCalledWith("id", "image-1");
    expect(eqMock).toHaveBeenCalledWith("user_id", "user-1");
  });

  it("succeeds without throwing when Supabase reports no error", async () => {
    const { chain } = buildSupabaseChain({ error: null });
    fromMock.mockReturnValue(chain);

    await expect(deleteHistoryRow("user-1", "image-1")).resolves.toBeUndefined();
  });

  it("throws a 500 AppError when Supabase reports an error", async () => {
    const { chain } = buildSupabaseChain({ error: { message: "db unavailable" } });
    fromMock.mockReturnValue(chain);

    await expect(deleteHistoryRow("user-1", "image-1")).rejects.toMatchObject({
      statusCode: 500,
    });
  });
});
