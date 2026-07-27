import express from "express";
import cors from "cors";
import paymentWebhookRoutes from "./routes/paymentWebhook.routes.js";
import healthRoutes from "./routes/health.routes.js";
import imageRoutes from "./routes/image.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import userRoutes from "./routes/user.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";
import { apiLimiter } from "./middlewares/rateLimit.middleware.js";
import { env } from "./config/env.js";
import { attachRequestContext } from "./middlewares/requestContext.middleware.js";


export const createApp = () => {
  const app = express();

  app.use(
    cors({
      origin: env.FRONTEND_URL,
      credentials: true,
    }),
  );

  app.use(attachRequestContext);
  app.use("/api", paymentWebhookRoutes);
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use("/api", apiLimiter);

  app.use("/api", healthRoutes);
  app.use("/api", imageRoutes);
  app.use("/api", userRoutes);
  app.use("/api", paymentRoutes);
  app.use("/api", contactRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
