import axios from "axios";
import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";
import { logger } from "../utils/logger.js";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const MAX_RETRIES = 2;

export const removeBackgroundFromImageUrl = async (imageUrl: string): Promise<Buffer> => {
  const formData = new FormData();
  formData.append("image_url", imageUrl);
  formData.append("size", env.REMOVE_BG_SIZE);

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      const response = await axios.post<ArrayBuffer>("https://api.remove.bg/v1.0/removebg", formData, {
        responseType: "arraybuffer",
        headers: {
          "X-Api-Key": env.REMOVE_BG_API_KEY,
        },
        timeout: 60_000,
      });

      return Buffer.from(response.data);
    } catch (error) {
      if (!axios.isAxiosError(error)) {
        throw error;
      }

      const statusCode = error.response?.status ?? 502;
      const shouldRetry = attempt < MAX_RETRIES && (statusCode >= 500 || statusCode === 429 || error.code === "ECONNABORTED");

      logger.warn("removebg.failed", {
        statusCode,
        attempt: attempt + 1,
        shouldRetry,
      });

      if (shouldRetry) {
        await delay(500 * (attempt + 1));
        continue;
      }

      throw new AppError("Background removal provider failed.", statusCode);
    }
  }

  throw new AppError("Background removal provider failed.", 502);
};
