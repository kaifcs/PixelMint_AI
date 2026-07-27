import type { NextFunction, Request, Response } from "express";
import multer from "multer";
import { AppError } from "../utils/AppError.js";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";

export const notFoundHandler = (_req: Request, _res: Response, next: NextFunction) => {
  next(new AppError("Route not found.", 404));
};

export const errorHandler = (error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof multer.MulterError) {
    const message = error.code === "LIMIT_FILE_SIZE" ? "Image size must be 10MB or less." : error.message;
    return res.status(400).json({ error: message });
  }

  if (error instanceof AppError) {
    logger.warn("request.failed", {
      requestId: res.locals.requestId,
      statusCode: error.statusCode,
      message: error.message,
      details: error.details,
    });

    return res.status(error.statusCode).json({
      error: error.message,
      ...(env.NODE_ENV !== "production" && error.exposeDetails ? { details: error.details } : {}),
    });
  }

  logger.error("request.failed.unhandled", {
    requestId: res.locals.requestId,
    error: error instanceof Error ? error.message : "Unknown error",
  });

  return res.status(500).json({
    error: "Internal server error.",
  });
};
