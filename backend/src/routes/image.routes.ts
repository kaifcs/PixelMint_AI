import { Router } from "express";
import { removeBackground } from "../controllers/image.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { removeBgLimiter } from "../middlewares/rateLimit.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { imageUpload } from "../utils/upload.js";

const router = Router();

router.post("/remove-bg", requireAuth, removeBgLimiter, imageUpload.single("image"), asyncHandler(removeBackground));

export default router;
