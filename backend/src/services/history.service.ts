import { supabaseAdmin } from "../config/supabase.js";
import { AppError } from "../utils/AppError.js";

export const createHistoryRecordAtomic = async (params: {
  userId: string;
  plan: string;
  limit: number;
  originalImageUrl: string;
  originalPublicId: string;
  processedImageUrl: string;
  processedPublicId: string;
  sourceFilename: string;
}) => {
  const { data, error } = await supabaseAdmin.rpc("check_and_record_image_processing_atomic", {
    p_user_id: params.userId,
    p_plan: params.plan,
    p_limit: params.limit,
    p_original_url: params.originalImageUrl,
    p_original_public_id: params.originalPublicId,
    p_processed_url: params.processedImageUrl,
    p_processed_public_id: params.processedPublicId,
    p_filename: params.sourceFilename,
  });

  if (error) {
    throw new AppError("Failed to record image processing atomically.", 500, error.message);
  }

  if (data === "QUOTA_EXCEEDED") {
    throw new AppError("Daily background removal limit exceeded.", 429);
  }
};

export const createHistoryRecord = async (params: {
  userId: string;
  originalImageUrl: string;
  originalPublicId: string;
  processedImageUrl: string;
  processedPublicId: string;
  sourceFilename: string;
  plan?: string;
  limit?: number;
}) => {
  await createHistoryRecordAtomic({
    ...params,
    plan: params.plan ?? "FREE",
    limit: params.limit ?? 2,
  });
};

export const getUserHistory = async (userId: string) => {
  const { data, error } = await supabaseAdmin
    .from("processed_images")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    throw new AppError("Failed to fetch image history.", 500, error.message);
  }

  return data ?? [];
};
