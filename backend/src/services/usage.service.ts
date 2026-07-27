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

export const getDailyLimitForPlan = (plan?: string): number => {
  return plan === "PRO" ? env.PRO_DAILY_LIMIT : env.FREE_DAILY_LIMIT;
};

export const ensureUserCanProcessImage = async (userId: string, plan: "FREE" | "PRO" | string) => {
  const limit = getDailyLimitForPlan(plan);
  const todayUsageCount = await getTodayUsageCount(userId);

  if (todayUsageCount >= limit) {
    throw new AppError("Daily limit reached. Upgrade or try again tomorrow.", 429);
  }
};
