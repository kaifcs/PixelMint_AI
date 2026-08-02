import type { Request, Response } from "express";
import { AppError } from "../utils/AppError.js";
import { getTodayUsageCount, getDailyLimitForPlan } from "../services/usage.service.js";
import { getUserHistory, getOwnedHistoryRecord, deleteHistoryRow } from "../services/history.service.js";
import { env } from "../config/env.js";
import { supabaseAdmin } from "../config/supabase.js";
import { destroyCloudinaryAsset } from "../services/cloudinary.service.js";
import { logger } from "../utils/logger.js";

export const getProfile = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  res.json({
    success: true,
    data: req.user.profile,
  });
};

export const getUsage = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const todayUsage = await getTodayUsageCount(req.user.id);
  const limit = getDailyLimitForPlan(req.user.profile.plan);

  res.json({
    success: true,
    data: {
      plan: req.user.profile.plan,
      dailyUsed: todayUsage,
      dailyLimit: limit,
      remaining: Math.max(0, limit - todayUsage),
    },
  });
};

export const getHistory = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const history = await getUserHistory(req.user.id);

  res.json({
    success: true,
    data: history,
  });
};

export const deleteHistoryItem = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const { id } = req.params;

  if (!id || typeof id !== "string") {
    throw new AppError("Image id is required.", 400);
  }

  const record = await getOwnedHistoryRecord(req.user.id, id);

  if (record.original_public_id) {
    try {
      await destroyCloudinaryAsset(record.original_public_id);
    } catch (err) {
      logger.warn("history_deletion.cloudinary_failed", {
        userId: req.user.id,
        imageId: id,
        asset: "original",
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  if (record.processed_public_id) {
    try {
      await destroyCloudinaryAsset(record.processed_public_id);
    } catch (err) {
      logger.warn("history_deletion.cloudinary_failed", {
        userId: req.user.id,
        imageId: id,
        asset: "processed",
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  await deleteHistoryRow(req.user.id, id);

  logger.info("history_deletion.success", { userId: req.user.id, imageId: id });

  res.json({
    success: true,
    message: "Image deleted successfully.",
  });
};

const extractPublicId = (url?: string): string | null => {
  if (!url) return null;
  try {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
};

export const deleteAccount = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const userId = req.user.id;

  const { data: images, error: rpcError } = await supabaseAdmin.rpc("delete_user_account_atomic", {
    p_user_id: userId,
  });

  if (rpcError) {
    logger.error("account_deletion.db_failed", { userId, error: rpcError.message });
    throw new AppError("Failed to delete account database records.", 500, rpcError.message);
  }

  if (Array.isArray(images) && images.length > 0) {
    for (const img of images) {
      const origId = img.original_pub_id || extractPublicId(img.original_url);
      const procId = img.processed_pub_id || extractPublicId(img.processed_url);

      if (origId) {
        try {
          await destroyCloudinaryAsset(origId);
        } catch (err) {
          logger.warn("account_deletion.cloudinary_orig_failed", { userId, origId, err });
        }
      }
      if (procId) {
        try {
          await destroyCloudinaryAsset(procId);
        } catch (err) {
          logger.warn("account_deletion.cloudinary_proc_failed", { userId, procId, err });
        }
      }
    }
  }

  const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (authError) {
    logger.error("account_deletion.auth_failed", { userId, error: authError.message });
  }

  logger.info("account_deletion.success", { userId });

  res.json({
    success: true,
    message: "Account and all associated data deleted successfully.",
  });
};
