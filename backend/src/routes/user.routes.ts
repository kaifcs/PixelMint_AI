import { Router } from "express";
import { getHistory, getProfile, getUsage } from "../controllers/user.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/profile", requireAuth, asyncHandler(getProfile));
router.get("/usage", requireAuth, asyncHandler(getUsage));
router.get("/history", requireAuth, asyncHandler(getHistory));

export default router;
