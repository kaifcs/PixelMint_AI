import type { Request, Response } from "express";
import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";
import { ensureUserCanProcessImage, getTodayUsageCount, getDailyLimitForPlan } from "../services/usage.service.js";
import { destroyCloudinaryAsset, uploadBufferToCloudinary } from "../services/cloudinary.service.js";
import { removeBackgroundFromImageUrl } from "../services/removeBg.service.js";
import { createHistoryRecord } from "../services/history.service.js";

export const removeBackground = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  if (!req.file) {
    throw new AppError("Please upload an image file.", 400);
  }

  await ensureUserCanProcessImage(req.user.id, req.user.profile.plan);

  const limit = getDailyLimitForPlan(req.user.profile.plan);
  const safeFilename = `${Date.now()}-${req.file.originalname.replace(/\s+/g, "-").toLowerCase()}`;
  let originalUpload: Awaited<ReturnType<typeof uploadBufferToCloudinary>> | null = null;
  let processedUpload: Awaited<ReturnType<typeof uploadBufferToCloudinary>> | null = null;

  try {
    originalUpload = await uploadBufferToCloudinary(req.file.buffer, "originals", safeFilename, req.file.mimetype);
    const processedBuffer = await removeBackgroundFromImageUrl(originalUpload.secureUrl);
    processedUpload = await uploadBufferToCloudinary(processedBuffer, "processed", `${safeFilename}.png`, "image/png");

    await createHistoryRecord({
      userId: req.user.id,
      originalImageUrl: originalUpload.secureUrl,
      originalPublicId: originalUpload.publicId,
      processedImageUrl: processedUpload.secureUrl,
      processedPublicId: processedUpload.publicId,
      sourceFilename: req.file.originalname,
      plan: req.user.profile.plan,
      limit,
    });
  } catch (error) {
    await Promise.allSettled([
      originalUpload ? destroyCloudinaryAsset(originalUpload.publicId) : Promise.resolve(),
      processedUpload ? destroyCloudinaryAsset(processedUpload.publicId) : Promise.resolve(),
    ]);
    throw error;
  }

  const todayUsage = await getTodayUsageCount(req.user.id);

  res.status(200).json({
    success: true,
    data: {
      originalImageUrl: originalUpload.secureUrl,
      processedImageUrl: processedUpload.secureUrl,
      remainingFreeQuota: Math.max(0, limit - todayUsage),
    },
  });
};
