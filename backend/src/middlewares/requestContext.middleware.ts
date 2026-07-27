import type { NextFunction, Request, Response } from "express";
import crypto from "node:crypto";
import { logger } from "../utils/logger.js";

export const attachRequestContext = (req: Request, res: Response, next: NextFunction) => {
  const requestId = crypto.randomUUID();
  res.locals.requestId = requestId;
  res.setHeader("X-Request-Id", requestId);

  const startedAt = Date.now();

  res.on("finish", () => {
    logger.info("request.completed", {
      requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Date.now() - startedAt,
    });
  });

  next();
};
