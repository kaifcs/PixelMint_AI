import cron from "node-cron";
import { supabaseAdmin } from "../config/supabase.js";
import { destroyCloudinaryAsset } from "../services/cloudinary.service.js";
import { logger } from "../utils/logger.js";

export const startCleanupJob = () => {
  cron.schedule("0 0 * * *", async () => {
    logger.info("cleanup.job.started");

    const { data: expiredImages, error } = await supabaseAdmin
      .from("processed_images")
      .select("id, original_public_id, processed_public_id")
      .lt(
        "created_at",
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      );

    if (error) {
      logger.error("cleanup.query.failed", {
        error: error.message,
      });
      return;
    }

    if (!expiredImages?.length) {
      logger.info("cleanup.no_expired_images");
      return;
    }

    for (const image of expiredImages) {
      try {
        if (image.original_public_id) {
          await destroyCloudinaryAsset(image.original_public_id);
        }

        if (image.processed_public_id) {
          await destroyCloudinaryAsset(image.processed_public_id);
        }

        await supabaseAdmin
          .from("processed_images")
          .delete()
          .eq("id", image.id);

        logger.info("cleanup.image.deleted", {
          imageId: image.id,
        });
      } catch (error) {
        logger.error("cleanup.image.delete_failed", {
          imageId: image.id,
          error,
        });
      }
    }

    logger.info("cleanup.job.completed", {
      deletedCount: expiredImages.length,
    });
  });

  logger.info("cleanup.scheduler.started", {
    schedule: "0 0 * * *",
    retentionDays: 30,
  });
};