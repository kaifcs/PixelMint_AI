import { supabaseAdmin } from "../config/supabase.js";
import { AppError } from "../utils/AppError.js";
import { env } from "../config/env.js";

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
    throw new AppError("Daily limit reached. Upgrade or try again tomorrow.", 429);
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
  const plan = params.plan ?? "FREE";
  await createHistoryRecordAtomic({
    ...params,
    plan,
    limit: params.limit ?? (plan === "PRO" ? env.PRO_DAILY_LIMIT : env.FREE_DAILY_LIMIT),
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
