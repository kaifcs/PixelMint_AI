import { env } from "../config/env.js";
import { supabaseAdmin } from "../config/supabase.js";
import { AppError } from "../utils/AppError.js";

const getDayWindow = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  return start.toISOString();
};

export const getTodayUsageCount = async (userId: string) => {
  const startOfDay = getDayWindow();

  const { count, error } = await supabaseAdmin
    .from("processed_images")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", startOfDay);

  if (error) {
    throw new AppError("Failed to fetch usage data.", 500, error.message);
  }

  return count ?? 0;
};

export const ensureUserCanProcessImage = async (userId: string, plan: "FREE" | "PRO") => {
  if (plan === "PRO") {
    return;
  }

  const todayUsageCount = await getTodayUsageCount(userId);

  if (todayUsageCount >= env.FREE_DAILY_LIMIT) {
    throw new AppError(`Free plan limit reached. You can process up to ${env.FREE_DAILY_LIMIT} images per day.`, 429);
  }
};
