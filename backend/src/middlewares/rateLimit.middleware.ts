import rateLimit, { RateLimitRequestHandler } from "express-rate-limit";
import { logger } from "../utils/logger.js";

const createLimiter = (
  windowMs: number,
  limit: number,
  errorMessage: string
): RateLimitRequestHandler =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: true,
    legacyHeaders: false,

    handler: (req, res) => {
      logger.warn("rate_limit.exceeded", {
        ip: req.ip,
        method: req.method,
        path: req.originalUrl,
      });

      res.status(429).json({
        success: false,
        error: errorMessage,
      });
    },
  });

export const apiLimiter = createLimiter(
  15 * 60 * 1000,
  200,
  "Too many requests. Please try again later."
);

export const removeBgLimiter = createLimiter(
  60 * 1000,
  10,
  "Too many background removal requests. Please slow down."
);

export const contactLimiter = createLimiter(
  60 * 60 * 1000,
  5,
  "Too many contact requests from this IP. Please try again after an hour."
);